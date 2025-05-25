//TODO: Убрать перезагрузку страницы

// import "./style.scss";
import Header from "./Header";
import Tabs from "./Tabs";

const Profile = () => {
	return (
		<>
			<div className="standard-container">
				<Header />
				<Tabs />
			</div>
		</>
	);
};

export default Profile;
