import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useGlobal } from "../Context/GlobalContext";
import axios from "axios";
import FavoriteButton from "../utils/FavoriteButton";
import AddScreenshotModal from "./AddScreenshotModal";
import ImageWithModal from "../utils/ImageWithModal";
import LikeDislikeButtons from "../utils/LikeDislikeButtons";

import styles from "./gamePage.module.scss";

const GamePage = () => {
	const navigate = useNavigate();
	const { gameId } = useParams();
	const { token, isAuthenticated } = useAuth();
	const { genreList } = useGlobal();

	const getGenreByID = genreId => {
		return genreList.find(item => item._id === genreId)?.name;
	};

	const normalizeDate = date => {
		if (date) {
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

			const [year, month, day] = date.split("-");
			return `${day} ${months[month - 1]} ${year}`;
		}
	};

	const toggleModalState = () => {
		setIsScreenshotModalOpened(!isScreenshotModalOpened);
	};

	const [activeTab, setActiveTab] = useState("info");
	const [isScreenshotModalOpened, setIsScreenshotModalOpened] = useState(false);
	const [gameInfo, setGameInfo] = useState({});
	const [screenshots, setScreenshots] = useState({});
	const [reviews, setReviews] = useState({});
	const [usersData, setUsersData] = useState({});
	const [newReviewText, setNewReviewText] = useState("");

	const fetchUserData = async userId => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/users/${userId}`
			);
			return response.data;
		} catch (error) {
			console.error("Ошибка при загрузке данных пользователя:", error);
			return null;
		}
	};

	// Загрузка данных всех пользователей, оставивших отзывы
	const loadUsersData = async reviews => {
		const users = {};
		for (const review of reviews) {
			if (!users[review.userId]) {
				const userData = await fetchUserData(review.userId);
				if (userData) {
					users[review.userId] = userData;
				}
			}
		}
		setUsersData(users);
	};

	useEffect(() => {
		const loadGameInfo = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/games/${gameId}`
				);
				setGameInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		const loadGameScreenshots = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/screenshots/game/${gameId}`
				);
				setScreenshots(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		const loadGameReviews = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/reviews/game/${gameId}`
				);
				setReviews(response.data);
				loadUsersData(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		loadGameInfo();
		loadGameScreenshots();
		loadGameReviews();
	}, []);

	const UploadReview = async newReviewText => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/reviews`,
				{
					gameId: gameInfo._id,
					text: newReviewText,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	const handlerOnSubmitReview = async () => {
		try {
			await UploadReview(newReviewText);
			alert("Отзыв добавлен");
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="standard-container">
			{isScreenshotModalOpened && (
				<AddScreenshotModal
					gameId={gameInfo._id}
					closeModal={toggleModalState}
				/>
			)}
			<div className={styles.game_header}>
				<img
					src={gameInfo.logoUrl}
					alt={gameInfo.title}
					className={styles.game_logo}
				/>
				<div className={styles.game_info}>
					<h1>{gameInfo.title}</h1>
					<p>Жанр: {getGenreByID(gameInfo.genre)}</p>
					<p>Дата выхода: {normalizeDate(gameInfo.release_date)}</p>
					<p>Описание: {gameInfo.description}</p>
					<FavoriteButton gameId={gameInfo._id} />
				</div>
			</div>

			<div className={styles.tabs}>
				<div
					onClick={() => setActiveTab("info")}
					id="info"
					className={`${styles.tab} ${
						activeTab === "info" ? styles.active : ""
					}`}
				>
					Информация
				</div>
				<div
					onClick={() => setActiveTab("screenshots")}
					id="screenshots"
					className={`${styles.tab} ${
						activeTab === "screenshots" ? styles.active : ""
					}`}
				>
					Скриншоты
				</div>
				<div
					onClick={() => setActiveTab("reviews")}
					id="reviews"
					className={`${styles.tab} ${
						activeTab === "reviews" ? styles.active : ""
					}`}
				>
					Отзывы
				</div>
			</div>

			{activeTab === "screenshots" ? (
				<div>
					{gameInfo.descriptionImages?.map((link, idx) => (
						<ImageWithModal key={`desc-${idx}`} src={link} />
					))}
					{isAuthenticated ? (
						<button className="simple-button" onClick={toggleModalState}>
							Загрузить свой скриншот
						</button>
					) : null}
					{screenshots.length !== 0 && <h2>Скриншоты пользователей:</h2>}
					{screenshots?.map((link, idx) => (
						<ImageWithModal
							key={`user-${idx}`}
							src={link.url}
							description={link.description}
						/>
					))}
				</div>
			) : activeTab === "reviews" ? (
				<div className="reviews">
					{reviews.length !== 0 ? (
						reviews.map((item, idx) => (
							<div key={`rev-${idx}`} className={styles.review}>
								<p>
									<strong
										onClick={() => {
											navigate(`/profile/${item.userId}`);
										}}
									>
										{usersData[item.userId]?.username}:
									</strong>{" "}
									{item.text}
								</p>
								<LikeDislikeButtons
									review={item}
									setReviewsArray={setReviews}
								/>
							</div>
						))
					) : (
						<h2>Отзывов пока нет</h2>
					)}
					{isAuthenticated ? (
						<div className="form-group">
							<textarea
								value={newReviewText}
								onChange={e => setNewReviewText(e.target.value)}
								placeholder="Напишите свой отзыв..."
							></textarea>
							<button onClick={handlerOnSubmitReview}>Отправить</button>
						</div>
					) : null}
				</div>
			) : (
				<div className="tab-content">
					<div className="info">
						<p>Платформы: {gameInfo.platform}</p>
						<p>Разработчик: {gameInfo.developer}</p>
						<p>Издатель: {gameInfo.publisher}</p>
						<br />
						<h2>Системные требования:</h2>
						{gameInfo.requirements?.split("; ").map((item, idx) => (
							<p key={`req-${idx}`}>{item}</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default GamePage;
