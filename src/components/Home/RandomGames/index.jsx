import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../../Context/GlobalContext";
import FavoriteButton from "../../utils/FavoriteButton";

import styles from "./style.module.scss";

const RandomGames = () => {
	const navigate = useNavigate();

	const { gamesList, genreList } = useGlobal();

	const [randomGamesList, setRandomGamesList] = useState([]);

	function getRandomUniqueElement(arr) {
		if (arr.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * arr.length);
		return arr.splice(randomIndex, 1)[0];
	}

	const getRandomGames = gamesList => {
		const result = [];
		const tempArray = [...gamesList];
		for (let i = 0; i < 3; i++) {
			result.push(getRandomUniqueElement(tempArray));
		}
		return result;
	};

	const getGenreByID = genreId => {
		return genreList.find(item => item._id === genreId)?.name;
	};

	useEffect(() => {
		setRandomGamesList(getRandomGames(gamesList));
	}, [gamesList]);

	return (
		<div className={styles.root} id="games">
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
				<div key={"g-" + idx} className={styles.game}>
					<img src={game?.logoUrl} alt={game?.title} />
					<div className="game-info">
						<h3>{game?.title}</h3>
						<p>Жанр: {getGenreByID(game?.genre)}</p>
						<FavoriteButton gameId={game?._id} />
						<button
							className="simple-button"
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
	);
};

export default RandomGames;
