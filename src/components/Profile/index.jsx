//TODO: Добавить обработку отсутствия отзывов и скриншотов
//TODO: Раскидать на более маленькие компоненты
//TODO: Убрать перезагрузку страницы

import "./style.scss";
import Header from "./Header";
import Tabs from "./Tabs";

const Profile = () => {
	return (
		<>
			<div className="standard-container profile-container">
				<Header />
				<Tabs />
			</div>
		</>
	);
};

export default Profile;
