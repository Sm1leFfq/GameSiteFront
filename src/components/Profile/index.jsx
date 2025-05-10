//TODO: Добавить обработку отсутствия отзывов и скриншотов
//TODO: Раскидать на более маленькие компоненты
//TODO: Добавить возможность увеличивать изображения

import { useEffect, useState } from "react";
import "./style.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../Context/GlobalContext";
import EditModal from "./EditModal";
import { useAuth } from "../Context/AuthContext";
import FavoriteButton from "../utils/FavoriteButton";

const Profile = () => {
	const { userId } = useParams();
	const { gamesList, genreList } = useGlobal();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [userProfile, setUserProfile] = useState({});
	const [reviews, setReviews] = useState({});
	const [screenshots, setScreenshots] = useState({});

	const [activeTab, setActiveTab] = useState("favorite");
	const [isOpenedEditModal, setIsOpenedEditModal] = useState(false);

	const toggleModal = () => {
		setIsOpenedEditModal(!isOpenedEditModal);
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

		const LoadReviews = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/reviews/user/${userId}`
				);
				setReviews(response.data);
			} catch (error) {
				console.error("Ошибка при загрузке отзывов:", error);
			}
		};

		const LoadScreenshots = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/screenshots/user/${userId}`
				);
				setScreenshots(response.data);
			} catch (error) {
				console.error("Ошибка при загрузке скриншотов:", error);
			}
		};

		LoadProfile();
		LoadReviews();
		LoadScreenshots();
	}, [userId, user]);

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

	return (
		<>
			{isOpenedEditModal && (
				<EditModal user={userProfile} closeModal={toggleModal} />
			)}
			<div className="standard-container profile-container">
				<div className="profile-header">
					<img
						src={userProfile.avatarUrl || "/avatar_placeholder.jpg"}
						alt="Аватар"
						className="avatar"
					/>
					<div className="profile-info">
						<h1>{userProfile.username}</h1>
						<p>Зарегистрирован: {transformDate(userProfile.createdAt)}</p>
						<p>Статус: {userProfile.status}</p>
					</div>
					{userProfile?._id === user?._id && (
						<button onClick={toggleModal}>Изменить профиль</button>
					)}
				</div>

				<div className="tabs">
					<div
						onClick={() => {
							setActiveTab("favorite");
						}}
						className={`tab ${activeTab === "favorite" ? "active" : ""}`}
					>
						Избранное
					</div>
					<div
						onClick={() => {
							setActiveTab("reviews");
						}}
						className={`tab ${activeTab === "reviews" ? "active" : ""}`}
					>
						Отзывы
					</div>
					<div
						onClick={() => {
							setActiveTab("screenshots");
						}}
						className={`tab ${activeTab === "screenshots" ? "active" : ""}`}
					>
						Скриншоты
					</div>
				</div>

				<div className="tab-content">
					{activeTab === "favorite" &&
						userProfile.favorites?.map((gameId, idx) => {
							const game = gamesList.find(item => item._id === gameId);
							return (
								<div key={`fav-${idx}`} className="game-item">
									<img
										onClick={() => {
											navigate(`/games/${game?._id}`);
										}}
										src={game?.logoUrl}
										alt=""
									/>
									<div>
										<h3
											onClick={() => {
												navigate(`/games/${game?._id}`);
											}}
										>
											{game?.title}
										</h3>
										<p>
											Жанр:{" "}
											{genreList?.find(item => item._id === game?.genre)?.name}
										</p>
										<FavoriteButton gameId={game?._id} />
									</div>
								</div>
							);
						})}

					{activeTab === "reviews" &&
						reviews.map((rev, idx) => {
							const game = gamesList.find(game => game._id === rev.gameId);

							return (
								<div key={`rev-${idx}`} className="review-item">
									<img
										onClick={() => {
											navigate(`/games/${game?._id}`);
										}}
										src={game?.logoUrl}
										alt={game?.title}
									/>
									<p>
										<strong
											onClick={() => {
												navigate(`/games/${game?._id}`);
											}}
										>
											{game?.title}:
										</strong>{" "}
										{rev.text}
										<button>👍 {rev?.reactions.likes}</button>
										<button>👎 {rev?.reactions.dislikes}</button>
									</p>
								</div>
							);
						})}

					{activeTab === "screenshots" && (
						<div className="screenshot-item">
							<h3>Мои скриншоты</h3>
							{screenshots.map((scrn, idx) => (
								<img key={`scrn-${idx}`} src={scrn.url} alt="Скриншот" />
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Profile;
