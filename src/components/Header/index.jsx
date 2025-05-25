import { Link } from "react-router-dom";
import Auth from "../Auth";
import { useAuth } from "../Context/AuthContext";

import styles from "./header.module.scss";

const Header = () => {
	const { user } = useAuth();

	return (
		<header className={styles.header}>
			<nav className="standard-container">
				<Link tabIndex="-1" to="/" className={styles.logo}>
					Игрофорум
				</Link>
				<div>
					<Link to="/games">Игры</Link>
					{user ? <Link to={`/profile/${user._id}`}>Профиль</Link> : null}
					{user?.role === "admin" ? <Link to="/admin">Админ</Link> : null}
					<Auth />
				</div>
			</nav>
		</header>
	);
};

export default Header;
