import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../../Context/GlobalContext";
import { useAuth } from "../../Context/AuthContext";
import FavoriteButton from "../../utils/FavoriteButton";
import ImageWithModal from "../../utils/ImageWithModal";
import LikeDislikeButtons from "../../utils/LikeDislikeButtons";

const Tabs = () => {
	const { userId } = useParams();
	const { gamesList, genreList } = useGlobal();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [userProfile, setUserProfile] = useState({});
	const [reviews, setReviews] = useState({});
	const [screenshots, setScreenshots] = useState({});

	const [activeTab, setActiveTab] = useState("favorite");

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

	const deleteReview = async revId => {
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/reviews/${revId}`
			);
			return response;
		} catch (error) {
			console.error("Ошибка при удалении отзыва:", error);
		}
	};

	const deleteReviewHandler = async revId => {
		try {
			await deleteReview(revId);
			alert("Отзыв удалён");
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const deleteScreenshot = async scrnId => {
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/screenshots/${scrnId}`
			);
			return response;
		} catch (error) {
			console.error("Ошибка при удалении скриншота:", error);
		}
	};

	const deleteScreenshotHandler = async scrnId => {
		console.log(scrnId);

		try {
			await deleteScreenshot(scrnId);
			alert("Скриншот удалён");
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
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
				{activeTab === "favorite" && userProfile.favorites.length === 0 && (
					<h2>Пока тут пусто :(</h2>
				)}
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

				{activeTab === "reviews" && reviews.length === 0 && (
					<h2>Отзывов нет</h2>
				)}
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
									<LikeDislikeButtons
										review={rev}
										setReviewsArray={setReviews}
									/>
								</p>
								{userProfile._id === user?._id && (
									<button
										onClick={() => {
											deleteReviewHandler(rev._id);
										}}
									>
										Удалить
									</button>
								)}
							</div>
						);
					})}

				{activeTab === "screenshots" && screenshots.length === 0 && (
					<h2>Скриншотов нет</h2>
				)}
				{activeTab === "screenshots" && screenshots.length !== 0 && (
					<div className="screenshot-item">
						<h3>Мои скриншоты</h3>
						{screenshots.map((scrn, idx) => (
							<ImageWithModal
								key={`scrn-${idx}`}
								src={scrn.url}
								description={scrn.description}
								isDeletable={true}
								onDeleteClick={() => {
									deleteScreenshotHandler(scrn._id);
								}}
								alt={`Скриншот ${idx + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default Tabs;
