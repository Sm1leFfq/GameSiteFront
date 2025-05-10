import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./style.scss";
import axios from "axios";

const EditModal = ({ user, closeModal }) => {
	const { token } = useAuth();

	const [username, setUsername] = useState(user.username);
	const [status, setStatus] = useState(user.status);
	const [isLoading, setIsLoading] = useState(false);

	const updateUserData = async formData => {
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/users/${user._id}`,
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
				error.response?.data?.error || "Не удалось изменить профиль."
			);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);
		const formData = new FormData();
		formData.append("username", username);
		formData.append("status", status);

		const avatarInput = e.target.querySelector('input[name="avatar"]');
		if (avatarInput.files[0]) {
			formData.append("avatar", avatarInput.files[0]);
		}

		try {
			await updateUserData(formData);
			alert("Профиль успешно изменён!");
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div id="edit-profile-modal" className="edit-profile-modal">
			<form onSubmit={handleSubmit} className="modal-content">
				<span onClick={closeModal} className="close">
					&times;
				</span>
				<h2>Изменить пользователя</h2>
				<div className="form-group">
					<label htmlFor="username">Имя пользователя</label>
					<input
						name="username"
						type="text"
						value={username}
						onChange={e => {
							setUsername(e.target.value);
						}}
						placeholder="Введите новое имя"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="status">Статус</label>
					<input
						name="status"
						type="text"
						value={status}
						onChange={e => {
							setStatus(e.target.value);
						}}
						placeholder="Введите новый статус"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="avatar">Новое фото</label>
					<input name="avatar" type="file" />
				</div>
				{isLoading && <p>Загрузка...</p>}
				<button type="submit">Изменить</button>
			</form>
		</div>
	);
};

export default EditModal;
