import { Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const Auth = () => {
	const { user, login, logout } = useAuth();

	const [openedModal, setOpenedModal] = useState("none");

	const openModal = () => {
		setOpenedModal("login");
	};

	async function handleLogin(email, password) {
		try {
			await login(email, password);
			setOpenedModal("none");
		} catch (error) {
			if (error.response?.status === 401) {
				alert("Вход не удался (Неправильный пароль)");
			} else {
				alert("Вход не удался (Ошибка сервера)");
			}
			console.error("Login error:", error);
		}
	}

	const renderModal = () => {
		if (openedModal === "login")
			return <Login setOpenedModal={setOpenedModal} loginFunc={handleLogin} />;
		else if (openedModal === "register")
			return (
				<Register setOpenedModal={setOpenedModal} loginFunc={handleLogin} />
			);
		return null;
	};

	return (
		<>
			{user ? (
				<Link onClick={logout}>Выйти</Link>
			) : (
				<Link onClick={openModal}>Войти</Link>
			)}
			{renderModal()}
		</>
	);
};

export default Auth;
