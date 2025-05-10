import React from "react";
import { Routes, Route } from "react-router-dom";
import Games from "./components/Games";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Header from "./components/Header";

import "./assets/styles/global.scss";
import GamePage from "./components/GamePage";

// Компонент страницы с ошибкой
const NotFound = () => <h1>404 - Not Found</h1>;

function App() {
	return (
		<>
			<Header />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/games" element={<Games />} />
				<Route path="/games/:gameId" element={<GamePage />} />
				<Route path="/profile/:userId" element={<Profile />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="*" element={<NotFound />} /> {/* 404 */}
			</Routes>
		</>
	);
}

export default App;
