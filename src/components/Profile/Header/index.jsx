import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import EditModal from "../EditModal";

import styles from "./header.module.scss";

const Header = () => {
	const { userId } = useParams();
	const { user, isAuthenticated } = useAuth();

	const [userProfile, setUserProfile] = useState({});
	const [isOpenedEditModal, setIsOpenedEditModal] = useState(false);

	const toggleModal = () => {
		setIsOpenedEditModal(!isOpenedEditModal);
	};

	const transformDate = str => {
		const months = [
			"Января",
			"Февраля",
			"Марта",
			"Апреля",
			"Мая",
			"Июня",
			"Июля",
			"Августа",
			"Сентября",
			"Октября",
			"Ноября",
			"Декабря",
		];
		const date = new Date(str);
		return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
	};

	useEffect(() => {
		const LoadProfile = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/users/${userId}`
				);
				setUserProfile(response.data);
			} catch (error) {
				console.error("Ошибка при загрузке данных пользователя:", error);
			}
		};

		LoadProfile();
	}, [userId, user]);

	return (
		<div className={styles.profile_header}>
			{isOpenedEditModal && (
				<EditModal user={userProfile} closeModal={toggleModal} />
			)}
			<img
				src={userProfile.avatarUrl || "/avatar_placeholder.jpg"}
				alt="Аватар"
				className={styles.avatar}
			/>
			<div className={styles.profile_info}>
				<h1>{userProfile.username}</h1>
				<p>Зарегистрирован: {transformDate(userProfile.createdAt)}</p>
				<p>{userProfile.description}</p>
			</div>
			{userProfile?._id === user?._id && isAuthenticated && (
				<button className="simple-button" onClick={toggleModal}>
					Изменить профиль
				</button>
			)}
		</div>
	);
};

export default Header;
