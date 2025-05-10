import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { format } from "date-fns";

registerLocale("ru", ru);

const GameForm = () => {
	const { token, isInitialized } = useAuth();
	const navigate = useNavigate();
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

	const uploadGameData = async formData => {
		setIsUploading(true);
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/games/create`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.error ||
					"Не удалось добавить игру. Проверьте данные или подключение."
			);
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setError(null);
		const formData = new FormData(e.target);

		if (selectedDate) {
			formData.set("release_date", format(selectedDate, "yyyy-MM-dd"));
		} else {
			formData.delete("release_date");
		}

		try {
			await uploadGameData(formData);
			alert("Успешно добавлена игра");
			window.location.reload();
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		if (!isInitialized) return;

		const loadGenres = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/genres`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setGenres(Array.isArray(response.data) ? response.data : []);
			} catch (error) {
				setError(
					"Не удалось загрузить жанры. Проверьте подключение или авторизацию."
				);
				setGenres([]);
				if (error.response?.status === 401) {
					navigate("/");
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (token) {
			loadGenres();
		} else {
			setError("Авторизация требуется для загрузки жанров");
			navigate("/");
		}
	}, [token, isInitialized, navigate]);

	return (
		<form onSubmit={handleSubmit} className="form-section">
			<h2>Добавить игру</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<div className="form-group">
				<label htmlFor="title">Название игры</label>
				<input
					name="title"
					type="text"
					placeholder="Введите название"
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="platform">Платформы</label>
				<input
					name="platform"
					type="text"
					placeholder="Введите название платформы"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="developer">Разработчик</label>
				<input
					name="developer"
					type="text"
					placeholder="Введите разработчика"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="publisher">Издатель</label>
				<input name="publisher" type="text" placeholder="Введите издателя" />
			</div>
			<div className="form-group">
				<label htmlFor="genre">Жанр</label>
				<select name="genre" id="gameGenre" required>
					{isLoading ? (
						<option value="">Загрузка...</option>
					) : genres.length > 0 ? (
						genres.map(genre => (
							<option key={genre._id} value={genre._id}>
								{genre.name}
							</option>
						))
					) : (
						<option value="">Жанры не загружены</option>
					)}
				</select>
			</div>
			<div className="form-group">
				<label htmlFor="release_date">Дата выхода</label>
				<DatePicker
					selected={selectedDate}
					onChange={date => setSelectedDate(date)}
					dateFormat="dd-MM-yyyy"
					placeholderText="Выберите дату"
					name="release_date"
					className="react-datepicker-input"
					locale="ru"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="requirements">Системные требования</label>
				<textarea
					defaultValue="ОС: X; Процессор: X; Оперативная память: X GB; Свободное место: X GB; Видеокарта: X; DirectX(Или другой рендер): X;"
					name="requirements"
					rows="7"
					cols="50"
				></textarea>
			</div>
			<div className="form-group">
				<label htmlFor="description">Описание</label>
				<textarea name="description" placeholder="Введите описание"></textarea>
			</div>
			<div className="form-group">
				<label htmlFor="logo">Логотип</label>
				<input type="file" name="logo" accept="image/*" required />
			</div>
			<div className="form-group">
				<label htmlFor="descriptionImages">Постеры</label>
				<input type="file" name="descriptionImages" accept="image/*" multiple />
			</div>
			{isUploading ? <p>Загрузка...</p> : null}
			<button type="submit">Добавить игру</button>
		</form>
	);
};

export default GameForm;
