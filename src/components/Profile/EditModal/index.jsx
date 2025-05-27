import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import styles from "./edit.module.scss";
import axios from "axios";

const EditModal = ({ user, closeModal }) => {
	const { token } = useAuth();

	const [username, setUsername] = useState(user.username);
	const [description, setDescription] = useState(user.description);
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
		formData.append("description", description);

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
		<div id="edit-profile-modal" className={styles.modal}>
			<form onSubmit={handleSubmit} className={styles.modal_content}>
				<span onClick={closeModal} className={styles.close}>
					&times;
				</span>
				<h2>Изменить пользователя</h2>
				<div className={styles.form_group}>
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
				<div className={styles.form_group}>
					<label htmlFor="description">Описание</label>
					<input
						name="description"
						type="text"
						value={description}
						onChange={e => {
							setDescription(e.target.value);
						}}
						placeholder="Введите описание"
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor="avatar">Новое фото</label>
					<input name="avatar" type="file" />
				</div>
				{isLoading && <p>Загрузка...</p>}
				<button className="simple-button" type="submit">
					Изменить
				</button>
			</form>
		</div>
	);
};

export default EditModal;
