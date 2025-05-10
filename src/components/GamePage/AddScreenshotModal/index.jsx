import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./style.scss";
import axios from "axios";
import ImageUpload from "./ImageUpload";

const AddScreenshotModal = ({ gameId, closeModal }) => {
	const { token } = useAuth();
	const [isLoading, setIsLoading] = useState();

	const [description, setDescription] = useState("");

	const uploadScreenshot = async formData => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/screenshots`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setIsLoading(false);
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.error || "Не удалось загрузить скриншот."
			);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);
		const formData = new FormData();
		formData.append("gameId", gameId);
		formData.append("description", description);

		const screenshotInput = e.target.querySelector('input[name="screenshot"]');
		if (screenshotInput.files[0]) {
			formData.append("image", screenshotInput.files[0]);
		}

		try {
			await uploadScreenshot(formData);
			alert("Скриншот успешно загружен!");
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div id="add-screenshot-modal" className="add-screenshot-modal">
			<form onSubmit={handleSubmit} className="modal-content">
				<span onClick={closeModal} className="close">
					&times;
				</span>
				<h2>Загрузить скриншот</h2>
				<p>Позже вы сможете удалить его в профиле</p>
				<ImageUpload />
				<div className="form-group">
					<label htmlFor="description">Описание</label>
					<input
						name="description"
						type="text"
						value={description}
						onChange={e => {
							setDescription(e.target.value);
						}}
						placeholder="Описание (Не обязательно)"
					/>
				</div>
				{isLoading && <p>Загрузка...</p>}
				<button type="submit">Загрузить</button>
			</form>
		</div>
	);
};

export default AddScreenshotModal;
