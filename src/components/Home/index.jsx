import ImageWithModal from "../utils/ImageWithModal";
import "./style.scss";

const Home = () => {
	return (
		<>
			<div className="standard-container">
				<h1>Страница в работе. Сюда не смотрите. Не надо</h1>
				<div className="section block popular-games">
					<h2>Популярные игры</h2>
					<div className="game">
						<img src="./Kopatich.jpg" alt="DOOM Eternal" />
						<div className="game-info">
							<h3>DOOM Eternal</h3>
							<p>Жанр: Шутер</p>
						</div>
					</div>
					<div className="game">
						<img src="./Kopatich.jpg" alt="DOOM Eternal" />
						<div className="game-info">
							<h3>DOOM Eternal</h3>
							<p>Жанр: Шутер</p>
						</div>
					</div>
					<div className="game">
						<img src="./Kopatich.jpg" alt="DOOM Eternal" />
						<div className="game-info">
							<h3>DOOM Eternal</h3>
							<p>Жанр: Шутер</p>
						</div>
					</div>
					<div className="game">
						<img src="./Kopatich.jpg" alt="Elden Ring" />
						<div className="game-info">
							<h3>Elden Ring</h3>
							<p>Жанр: RPG</p>
						</div>
					</div>
				</div>

				<div className="section block game-list" id="games">
					<h2>Случайные игры</h2>
					<button className="simple-button">Полный список</button>
					<div className="game">
						<img src="./Kopatich.jpg" alt="DOOM Eternal" />
						<div className="game-info">
							<h3>DOOM Eternal</h3>
							<p>Жанр: Шутер</p>
							<button>В избранное</button>
							<a href="#details">Подробнее</a>
						</div>
					</div>
				</div>

				<div className="section block latest-reviews">
					<h2>Последние отзывы</h2>
					<div className="review">
						<p>
							<strong>User1:</strong> DOOM Eternal — огонь!
							<button className="like-button">👍 5</button>
						</p>
					</div>
					<div className="review">
						<p>
							<strong>User2:</strong> Elden Ring — шедевр.{" "}
							<button className="like-button">👍 8</button>
						</p>
					</div>
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
					<h2>Все скриншоты</h2>
					<div className="screenshots">
						<ImageWithModal src="./Kopatich.jpg" alt="Скриншот" />
						<ImageWithModal src="./Kopatich.jpg" alt="Скриншот" />
						<ImageWithModal src="./Kopatich.jpg" alt="Скриншот" />
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
