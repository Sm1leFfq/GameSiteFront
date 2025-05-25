import axios from "axios";
import { useState } from "react";

import styles from "./register.module.scss";

const Register = ({ setOpenedModal, loginFunc }) => {
	function isValidEmail(email) {
		// Регулярное выражение для проверки email
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleOnChangeUsername = e => {
		setUsername(e.target.value);
	};

	const handleOnChangeEmail = e => {
		setEmail(e.target.value);
	};

	const handleOnChangePassword = e => {
		setPassword(e.target.value);
	};

	const handleOnChangeConfirmPassword = e => {
		setConfirmPassword(e.target.value);
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

		if (!username || !email || !password || !confirmPassword) {
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

		if (password !== confirmPassword) {
			alert("Пароль должен совпадать");
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
		<div id="register-modal" className={styles.register}>
			<form onSubmit={handleSubmit} className={styles.modal_content}>
				<span onClick={closeModal} className={styles.close}>
					&times;
				</span>
				<h2>Регистрация</h2>
				<div className={styles.form_group}>
					<label htmlFor="username">Имя пользователя</label>
					<input
						onChange={handleOnChangeUsername}
						name="username"
						type="text"
						placeholder="Введите имя"
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor="email">Email</label>
					<input
						onChange={handleOnChangeEmail}
						name="email"
						type="email"
						placeholder="Введите email"
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor="password">Пароль</label>
					<input
						onChange={handleOnChangePassword}
						name="password"
						type="password"
						placeholder="Введите пароль"
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor="confirmPassword">Повторите пароль</label>
					<input
						onChange={handleOnChangeConfirmPassword}
						name="confirmPassword"
						type="password"
						placeholder="Введите пароль"
					/>
				</div>
				<button type="submit">Зарегистрироваться</button>
				<div className={styles.switch}>
					Уже есть аккаунт?
					<a onClick={openRegisterModal}>Войти</a>
				</div>
			</form>
		</div>
	);
};

export default Register;
