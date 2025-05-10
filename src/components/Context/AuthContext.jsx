import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "../utils/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	const isTokenExpired = token => {
		if (!token) return true;
		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const currentTime = Math.floor(Date.now() / 1000);
			return payload.exp < currentTime;
		} catch (error) {
			console.error("Ошибка при декодировании токена:", error);
			return true;
		}
	};

	const getUserById = async userId => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/users/${userId}`
			);
			return response.data;
		} catch (error) {
			console.log(error?.response.error);
		}
	};

	useEffect(() => {
		const storedToken = localStorage.getItem("jwtToken");
		const savedUser = localStorage.getItem("activeUser");

		if (storedToken && savedUser && !isTokenExpired(storedToken)) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
			setToken(storedToken);
			setUser(JSON.parse(savedUser));
			setIsAuthenticated(true);
		} else {
			logout();
		}
		setIsInitialized(true);
	}, []);

	const login = async (email, password) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/users/login`,
				{
					email,
					password,
				}
			);
			const { token } = response.data;

			if (isTokenExpired(token)) {
				throw new Error("Получен истёкший токен");
			}

			const decoded = JSON.parse(atob(token.split(".")[1]));
			localStorage.setItem("jwtToken", token);
			console.log(decoded);
			const user_temp = await getUserById(decoded.userId);
			localStorage.setItem("activeUser", JSON.stringify(user_temp));
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser(user_temp);
			setToken(token);
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("activeUser");
		delete axios.defaults.headers.common["Authorization"];
		setUser(null);
		setToken(null);
		setIsAuthenticated(false);
	};

	const updateUserInfo = async () => {
		const user_temp = await getUserById(user._id);
		localStorage.setItem("activeUser", JSON.stringify(user_temp));
		setUser(user_temp);
	};

	if (!isInitialized) {
		return <Loader />;
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isAuthenticated,
				isInitialized,
				login,
				logout,
				updateUserInfo,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
