import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [gamesList, setGamesList] = useState([]);
	const [genreList, setGenreList] = useState([]);
	const [screenshotsList, setScreenshotsList] = useState([]);
	const [reviewsList, setReviewsList] = useState([]);

	const LoadGamesList = async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_URL}/games`,
			{}
		);
		setGamesList(response.data);
	};

	const LoadGenreList = async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_URL}/genres`,
			{}
		);
		setGenreList(response.data);
	};

	const LoadScreenshotsList = async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_URL}/screenshots`,
			{}
		);
		setScreenshotsList(response.data);
	};
	const LoadReviewsList = async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_URL}/reviews`,
			{}
		);
		setReviewsList(response.data);
	};

	useEffect(() => {
		LoadGamesList();
		LoadGenreList();
		LoadScreenshotsList();
		setReviewsList();
	}, []);

	return (
		<GlobalContext.Provider
			value={{ gamesList, genreList, screenshotsList, reviewsList }}
		>
			{children}
		</GlobalContext.Provider>
	);
};

// Хук для доступа к контексту
export const useGlobal = () => useContext(GlobalContext);
