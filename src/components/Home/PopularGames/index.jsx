import { useNavigate } from "react-router-dom";
import { useGlobal } from "../../Context/GlobalContext";
import { useEffect, useState } from "react";

import styles from "./style.module.scss";

const PopularGames = () => {
	const navigate = useNavigate();
	const { gamesList, genreList } = useGlobal();

	const [filteredGamesList, setFilteredGamesList] = useState([]);

	const getGenreByID = genreId => {
		return genreList.find(item => item._id === genreId)?.name;
	};

	useEffect(() => {
		setFilteredGamesList(
			[...gamesList]
				.sort((a, b) => {
					return b.favoritesCount - a.favoritesCount;
				})
				.slice(0, 4)
		);
	}, [gamesList]);

	return (
		<div className={styles.root}>
			<h2>Популярные игры</h2>
			{filteredGamesList.map((game, idx) => (
				<div
					onClick={() => {
						navigate(`/games/${game?._id}`);
					}}
					key={"gp-" + idx}
					className={styles.game}
				>
					<img src={game.logoUrl} alt={game.title} />
					<div className="game-info">
						<h3>{game.title}</h3>
						<p>Жанр: {getGenreByID(game.genre)}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default PopularGames;
