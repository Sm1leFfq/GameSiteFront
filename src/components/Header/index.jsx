import { Link } from "react-router-dom";
import Auth from "../Auth";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
	const { user } = useAuth();

	return (
		<header className="main-header">
			<nav className="standard-container">
				<Link tabIndex="-1" to="/" className="logo">
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
