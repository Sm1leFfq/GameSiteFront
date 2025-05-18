import { useEffect, useState } from "react";
import { useGlobal } from "../Context/GlobalContext";
import ImageWithModal from "../utils/ImageWithModal";
import FavoriteButton from "../utils/FavoriteButton";
import "./style.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();
	const { gamesList, genreList, screenshotsList } = useGlobal();

	const [reviewsList, setReviewsList] = useState([]);
	const [randomGamesList, setRandomGamesList] = useState([]);
	const [filteredByPopularityGamesList, setFilteredByPopularityGamesList] =
		useState([]);

	const LoadReviews = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/reviews-with-details`,
				{}
			);
			setReviewsList(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const getGenreByID = genreId => {
		return genreList.find(item => item._id === genreId)?.name;
	};

	const getRandomGames = gamesList => {
		const result = [];
		const tempArray = [...gamesList];
		for (let i = 0; i < 3; i++) {
			result.push(getRandomUniqueElement(tempArray));
		}
		return result;
	};

	function getRandomUniqueElement(arr) {
		if (arr.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * arr.length);
		return arr.splice(randomIndex, 1)[0];
	}

	useEffect(() => {
		LoadReviews();
	}, []);

	useEffect(() => {
		setRandomGamesList(getRandomGames(gamesList));
		setFilteredByPopularityGamesList(
			[...gamesList]
				.sort((a, b) => {
					return b.favoritesCount - a.favoritesCount;
				})
				.slice(0, 4)
		);
	}, [gamesList]);

	return (
		<>
			<div className="standard-container">
				<div className="section block popular-games">
					<h2>Популярные игры</h2>
					{filteredByPopularityGamesList.map((game, idx) => (
						<div
							onClick={() => {
								navigate(`/games/${game?._id}`);
							}}
							key={"gp-" + idx}
							className="game"
						>
							<img src={game.logoUrl} alt={game.title} />
							<div className="game-info">
								<h3>{game.title}</h3>
								<p>Жанр: {getGenreByID(game.genre)}</p>
							</div>
						</div>
					))}
				</div>

				<div className="section block game-list" id="games">
					<h2>3 случайные игры</h2>
					<button
						onClick={() => {
							navigate(`/games`);
						}}
						className="simple-button"
					>
						Полный список
					</button>
					{randomGamesList.map((game, idx) => (
						<div key={"g-" + idx} className="game">
							<img src={game?.logoUrl} alt={game?.title} />
							<div className="game-info">
								<h3>{game?.title}</h3>
								<p>Жанр: {getGenreByID(game?.genre)}</p>
								<FavoriteButton gameId={game?._id} />
								<button
									onClick={() => {
										navigate(`/games/${game?._id}`);
									}}
								>
									Подробнее
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="section block latest-reviews">
					<h2>Последние отзывы</h2>
					{reviewsList.slice(0, 4).map((rev, idx) => (
						<div key={"rev " + idx} className="review">
							<p>
								<strong
									onClick={() => {
										navigate(`/profile/${rev.user._id}`);
									}}
								>
									{rev.user.username}:
								</strong>{" "}
								{rev.game.title} — {rev.text}
							</p>
						</div>
					))}
				</div>

				{/* <div className="section block news">
					<h2>Новости</h2>
					<div className="news-item">
						<h3>DOOM Eternal обновление</h3>
						<p>Добавлен новый режим...</p>
					</div>
					<div className="news-item">
						<h3>Elden Ring DLC</h3>
						<p>Анонсировано дополнение...</p>
					</div>
				</div> */}

				<div className="section block all-screenshots">
					<h2>Последние скриншоты</h2>
					<div className="screenshots">
						{screenshotsList
							?.sort()
							?.slice(0, 4)
							?.map((scrn, idx) => (
								<ImageWithModal
									key={"scrn" + idx}
									src={scrn.url}
									alt={"Скриншот " + idx}
								/>
							))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
