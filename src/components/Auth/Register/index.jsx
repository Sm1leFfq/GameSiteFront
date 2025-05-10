import axios from "axios";
import "./style.scss";
import { useState } from "react";

const Register = ({ setOpenedModal, loginFunc }) => {
	function isValidEmail(email) {
		// Регулярное выражение для проверки email
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleOnChangeUsername = e => {
		setUsername(e.target.value);
	};

	const handleOnChangeEmail = e => {
		setEmail(e.target.value);
	};

	const handleOnChangePassword = e => {
		setPassword(e.target.value);
	};

	const closeModal = () => {
		setOpenedModal("none");
	};

	const openRegisterModal = () => {
		setOpenedModal("login");
	};

	const createAccount = async userData => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/users/register`,
				userData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.error || "Не удалось создать аккаунт."
			);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		if (!username || !email || !password) {
			alert("Заполните все поля");
			return;
		}

		if (!isValidEmail(email)) {
			alert("Не валидный email");
			return;
		}

		if (password.length < 4) {
			alert("Пароль должен быть длинной минимум 4 символа");
			return;
		}

		try {
			await createAccount({ username, email, password });
			alert("Аккаунт успешно создан");
			loginFunc(email, password);
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<div id="register-modal" className="register-modal">
			<form onSubmit={handleSubmit} className="modal-content">
				<span onClick={closeModal} className="close">
					&times;
				</span>
				<h2>Регистрация</h2>
				<div className="form-group">
					<label htmlFor="username">Имя пользователя</label>
					<input
						onChange={handleOnChangeUsername}
						name="username"
						type="text"
						placeholder="Введите имя"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						onChange={handleOnChangeEmail}
						name="email"
						type="email"
						placeholder="Введите email"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Пароль</label>
					<input
						onChange={handleOnChangePassword}
						name="password"
						type="password"
						placeholder="Введите пароль"
					/>
				</div>
				<button type="submit">Зарегистрироваться</button>
				<div className="switch">
					Уже есть аккаунт?
					<a onClick={openRegisterModal}>Войти</a>
				</div>
			</form>
		</div>
	);
};

export default Register;
