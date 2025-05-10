import { useState } from "react";
import "./style.scss";

const Login = ({ setOpenedModal, loginFunc }) => {
	function isValidEmail(email) {
		// Регулярное выражение для проверки email
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onEmailChange = e => {
		setEmail(e.target.value);
	};
	const onPasswordChange = e => {
		setPassword(e.target.value);
	};

	const closeModal = () => {
		setOpenedModal("none");
	};

	const openRegisterModal = () => {
		setOpenedModal("register");
	};

	const handleConfirm = () => {
		if (!isValidEmail(email)) {
			alert("Не валидный email");
			return;
		}
		if (password.length === 0) {
			alert("Пароль не должен быть пустым");
			return;
		}

		loginFunc(email, password);
	};

	return (
		<div id="login-modal" className="login-modal">
			<div className="modal-content">
				<span onClick={closeModal} className="close">
					&times;
				</span>
				<h2>Вход</h2>
				<div className="form-group">
					<label>Email</label>
					<input
						onChange={onEmailChange}
						id="loginEmail"
						type="email"
						placeholder="Введите email"
					/>
				</div>
				<div className="form-group">
					<label>Пароль</label>
					<input
						id="loginPassword"
						type="password"
						placeholder="Введите пароль"
						onChange={onPasswordChange}
					/>
				</div>
				<button onClick={handleConfirm}>Войти</button>
				<div className="switch">
					Нет аккаунта?
					<a onClick={openRegisterModal}>Зарегистрироваться</a>
				</div>
			</div>
		</div>
	);
};

export default Login;
