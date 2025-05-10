//TODO: Добавить обработку отсутствия отзывов и скриншотов
//TODO: Раскидать на более маленькие компоненты
//TODO: Добавить возможность увеличивать изображения

import { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useGlobal } from "../Context/GlobalContext";
import axios from "axios";
import FavoriteButton from "../utils/FavoriteButton";
import AddScreenshotModal from "./AddScreenshotModal";

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
	const [userReactions, setUserReactions] = useState({});

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

	// Проверяем, поставил ли пользователь уже реакцию на отзыв
	// const hasUserReacted = (reviewId, reactionType) => {
	// 	return userReactions[reviewId] === reactionType;
	// };

	const handlerOnLikeClick = async reviewId => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		try {
			setReviews(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;

					const currentReaction = userReactions[reviewId];
					let newLikes = review.reactions.likes;
					let newDislikes = review.reactions.dislikes;

					if (currentReaction === "like") {
						newLikes -= 1;
					} else {
						if (currentReaction === "dislike") {
							newDislikes -= 1;
						}
						newLikes += 1;
					}

					return {
						...review,
						reactions: {
							likes: newLikes,
							dislikes: newDislikes,
						},
					};
				})
			);

			setUserReactions(prev => {
				const newState = { ...prev };
				if (newState[reviewId] === "like") {
					delete newState[reviewId];
				} else {
					newState[reviewId] = "like";
				}
				return newState;
			});

			await axios.post(
				`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/react`,
				{
					reactionType: "like",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error) {
			console.error("Like error:", error);
			setReviews(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;
					return {
						...review,
						reactions: {
							likes: review.reactions.likes,
							dislikes: review.reactions.dislikes,
						},
					};
				})
			);
		}
	};

	const handlerOnDislikeClick = async reviewId => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		try {
			setReviews(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;

					const currentReaction = userReactions[reviewId];
					let newLikes = review.reactions.likes;
					let newDislikes = review.reactions.dislikes;

					if (currentReaction === "dislike") {
						newDislikes -= 1;
					} else {
						if (currentReaction === "like") {
							newLikes -= 1;
						}
						newDislikes += 1;
					}

					return {
						...review,
						reactions: {
							likes: newLikes,
							dislikes: newDislikes,
						},
					};
				})
			);

			setUserReactions(prev => {
				const newState = { ...prev };
				if (newState[reviewId] === "dislike") {
					delete newState[reviewId];
				} else {
					newState[reviewId] = "dislike";
				}
				return newState;
			});

			await axios.post(
				`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/react`,
				{
					reactionType: "dislike",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error) {
			console.error("Dislike error:", error);
			setReviews(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;
					return {
						...review,
						reactions: {
							likes: review.reactions.likes,
							dislikes: review.reactions.dislikes,
						},
					};
				})
			);
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
			<div className="game-header">
				<img
					src={gameInfo.logoUrl}
					alt={gameInfo.title}
					className="game-logo"
				/>
				<div className="game-info">
					<h1>{gameInfo.title}</h1>
					<p>Жанр: {getGenreByID(gameInfo.genre)}</p>
					<p>Дата выхода: {normalizeDate(gameInfo.release_date)}</p>
					<p>Описание: {gameInfo.description}</p>
					<FavoriteButton gameId={gameInfo._id} />
				</div>
			</div>

			<div className="tabs">
				<div
					onClick={() => setActiveTab("info")}
					id="info"
					className={`tab ${activeTab === "info" ? "active" : ""}`}
				>
					Информация
				</div>
				<div
					onClick={() => setActiveTab("screenshots")}
					id="screenshots"
					className={`tab ${activeTab === "screenshots" ? "active" : ""}`}
				>
					Скриншоты
				</div>
				<div
					onClick={() => setActiveTab("reviews")}
					id="reviews"
					className={`tab ${activeTab === "reviews" ? "active" : ""}`}
				>
					Отзывы
				</div>
			</div>

			{activeTab === "screenshots" ? (
				<div className="screenshots">
					{gameInfo.descriptionImages.map((link, idx) => (
						<img key={`desc-${idx}`} src={link} alt={`Постер ${idx + 1}`} />
					))}
					{isAuthenticated ? (
						<button onClick={toggleModalState}>Загрузить свой скриншот</button>
					) : null}
					<h2>Скриншоты пользователей:</h2>
					{screenshots?.map((link, idx) => (
						<img
							key={`user-${idx}`}
							src={link.url}
							alt={`Скриншот ${idx + 1}`}
						/>
					))}
				</div>
			) : activeTab === "reviews" ? (
				<div className="reviews">
					{reviews.map((item, idx) => (
						<div key={`rev-${idx}`} className="review">
							<p>
								<strong
									onClick={() => {
										navigate(`/profile/${item.userId}`);
									}}
								>
									{usersData[item.userId].username}:
								</strong>{" "}
								{item.text}
								<button onClick={() => handlerOnLikeClick(item._id)}>
									👍 {item.reactions.likes}
								</button>
								<button onClick={() => handlerOnDislikeClick(item._id)}>
									👎 {item.reactions.dislikes}
								</button>
							</p>
						</div>
					))}
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
