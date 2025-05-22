import "./style.scss";
import PopularGames from "./PopularGames";
import RandomGames from "./RandomGames";
import LatestReviews from "./LatestReviews";
import Screenshots from "./Screenshots";

const Home = () => {
	return (
		<>
			<div className="standard-container">
				<PopularGames />
				<RandomGames />
				<LatestReviews />
				<Screenshots />
			</div>
		</>
	);
};

export default Home;
