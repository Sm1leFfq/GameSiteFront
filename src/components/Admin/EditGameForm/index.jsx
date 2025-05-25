import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { format, parse } from "date-fns";

import styles from "./form.module.scss";

registerLocale("ru", ru);

const EditGameForm = ({ gameId }) => {
	const { token, isInitialized } = useAuth();
	const navigate = useNavigate();
	const [genres, setGenres] = useState([]);
	const [game, setGame] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

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
				setError("Не удалось загрузить жанры.");
				setGenres([]);
				if (error.response?.status === 401) {
					navigate("/");
				}
			}
		};

		const loadGame = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/games/${gameId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const gameData = response.data;
				setGame(gameData);
				if (gameData.release_date) {
					setSelectedDate(
						parse(gameData.release_date, "yyyy-MM-dd", new Date())
					);
				}
			} catch (error) {
				setError("Не удалось загрузить данные игры.");
				if (error.response?.status === 404) {
					setError("Игра не найдена.");
				} else if (error.response?.status === 401) {
					navigate("/");
				}
			} finally {
				setIsLoading(false);
			}
		};

		loadGenres();
		loadGame();
	}, [token, isInitialized, gameId, navigate]);

	// Функция для обновления игры
	const updateGameData = async formData => {
		try {
			const response = await axios.put(
				`http://localhost:3000/games/${gameId}`,
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
				error.response?.data?.error || "Не удалось обновить игру."
			);
		}
	};

	// Обработчик отправки формы
	const handleSubmit = async e => {
		e.preventDefault();
		setError(null);
		const formData = new FormData(e.target);

		// Добавляем дату в formData, если она выбрана
		if (selectedDate) {
			formData.set("release_date", format(selectedDate, "yyyy-MM-dd"));
		} else {
			formData.delete("release_date");
		}

		try {
			await updateGameData(formData);
			alert("Успешно обновлено!");
			window.location.reload();
		} catch (error) {
			setError(error.message);
		}
	};

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	if (!game) {
		return <div>{error || "Игра не найдена"}</div>;
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form_section}>
			<h2>Редактировать игру</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<div className={styles.form_group}>
				<label htmlFor="title">Название игры</label>
				<input
					name="title"
					type="text"
					defaultValue={game.title}
					placeholder="Введите название"
					required
				/>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="platform">Платформы</label>
				<input
					name="platform"
					type="text"
					defaultValue={game.platform}
					placeholder="Введите название платформы"
					required
				/>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="developer">Разработчик</label>
				<input
					name="developer"
					type="text"
					defaultValue={game.developer}
					placeholder="Введите разработчика"
					required
				/>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="publisher">Издатель</label>
				<input
					name="publisher"
					type="text"
					defaultValue={game.publisher}
					placeholder="Введите издателя"
					required
				/>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="genre">Жанр</label>
				<select name="genre" id="gameGenre" defaultValue={game.genre} required>
					{genres.length > 0 ? (
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
			<div className={styles.form_group}>
				<label htmlFor="release_date">Дата выхода</label>
				<DatePicker
					selected={selectedDate}
					onChange={date => setSelectedDate(date)}
					dateFormat="yyyy-MM-dd"
					placeholderText="Выберите дату"
					name="release_date"
					className="react-datepicker-input"
					locale="ru"
				/>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="requirements">Системные требования</label>
				<textarea
					defaultValue={game.requirements}
					name="requirements"
					rows="7"
					cols="50"
				></textarea>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="description">Описание</label>
				<textarea
					defaultValue={game.description}
					name="description"
					placeholder="Введите описание"
				></textarea>
			</div>
			<div className={styles.form_group}>
				<label htmlFor="logo">Логотип</label>
				<input type="file" name="logo" accept="image/*" />
				{game.logoUrl && (
					<div>
						<p>Текущий логотип:</p>
						<img
							src={game.logoUrl}
							alt="Current logo"
							style={{ maxWidth: "100px" }}
						/>
					</div>
				)}
			</div>
			<div className={styles.form_group}>
				<label htmlFor="descriptionImages">Постеры</label>
				<input type="file" name="descriptionImages" accept="image/*" multiple />
				{game.descriptionImages?.length > 0 && (
					<div>
						<p>Текущие постеры:</p>
						<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
							{game.descriptionImages.map((url, index) => (
								<img
									key={index}
									src={url}
									alt={`Poster ${index + 1}`}
									style={{ maxWidth: "100px" }}
								/>
							))}
						</div>
					</div>
				)}
			</div>
			<button className="simple-button" type="submit">
				Сохранить изменения
			</button>
		</form>
	);
};

export default EditGameForm;
