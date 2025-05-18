import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Loader } from "../utils/Loader";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [gamesList, setGamesList] = useState([]);
	const [genreList, setGenreList] = useState([]);
	const [screenshotsList, setScreenshotsList] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);

				const [gamesRes, genresRes, screenshotsRes] = await Promise.all([
					axios.get(`${import.meta.env.VITE_API_URL}/games`),
					axios.get(`${import.meta.env.VITE_API_URL}/genres`),
					axios.get(`${import.meta.env.VITE_API_URL}/screenshots`),
				]);

				setGamesList(gamesRes.data);
				setGenreList(genresRes.data);
				setScreenshotsList(screenshotsRes.data);
			} catch (error) {
				console.error("Ошибка загрузки:", error);
			} finally {
				setIsLoading(false); // Загрузка завершена (успех или ошибка)
			}
		};

		loadData();
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<GlobalContext.Provider value={{ gamesList, genreList, screenshotsList }}>
			{children}
		</GlobalContext.Provider>
	);
};

// Хук для доступа к контексту
export const useGlobal = () => useContext(GlobalContext);
