import "./style.scss";
import SearchBar from "../utils/SearchBar";
import FavoriteButton from "../utils/FavoriteButton";
import { useGlobal } from "../Context/GlobalContext";
import { useNavigate } from "react-router-dom";

const Games = () => {
	const { gamesList, genreList } = useGlobal();

	const navigate = useNavigate();

	const getGenreByID = genreId => {
		return genreList.find(item => item._id === genreId)?.name;
	};

	const handlerOnSelect = item => {
		navigate(`/Games/${item._id}`);
	};

	return (
		<>
			<div className="standard-container">
				<div className="game-list">
					<h1>Все игры</h1>
					<div className="filters">
						<SearchBar
							items={gamesList}
							onSelect={handlerOnSelect}
							placeholder="Поиск игры..."
						/>
						{/* <select id="genre-filter">
							<option value="">Все жанры</option>
							<option value="Шутер">Шутер</option>
							<option value="RPG">RPG</option>
							<option value="Стратегия">Стратегия</option>
							<option value="Симулятор">Симулятор</option>
						</select> */}
					</div>
					<div id="games-container">
						{gamesList.map(game => (
							<div key={game._id} className="game" data-genre="Шутер">
								<img src={game.logoUrl} alt={game.title} />
								<div className="game-info">
									<h3>{game.title}</h3>
									<p>Жанр: {getGenreByID(game.genre)}</p>
									<FavoriteButton gameId={game._id} />
									<button
										onClick={() => {
											navigate(`/games/${game._id}`);
										}}
									>
										Подробнее
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Games;
