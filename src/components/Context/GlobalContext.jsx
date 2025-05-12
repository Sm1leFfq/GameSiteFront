import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [gamesList, setGamesList] = useState([]);
	const [genreList, setGenreList] = useState([]);

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

	useEffect(() => {
		LoadGamesList();
		LoadGenreList();
	}, []);

	return (
		<GlobalContext.Provider value={{ gamesList, genreList }}>
			{children}
		</GlobalContext.Provider>
	);
};

// Хук для доступа к контексту
export const useGlobal = () => useContext(GlobalContext);
