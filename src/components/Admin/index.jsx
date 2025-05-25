import EditGameForm from "./EditGameForm";
import GameForm from "./GameForm";
import { useGlobal } from "../Context/GlobalContext";
import { useAuth } from "../Context/AuthContext";
import SearchBar from "../utils/SearchBar";
import { useState } from "react";
import axios from "axios";

import styles from "./admin.module.scss";

const Admin = () => {
	const { gamesList } = useGlobal();
	const { token } = useAuth();

	const [selectedGame, setSelectedGame] = useState({});
	const [activeForm, setActiveForm] = useState("Create");

	const openEditForm = () => {
		setActiveForm("Update");
	};
	const openCreateForm = () => {
		setActiveForm("Create");
	};

	const deleteGame = async () => {
		if (!confirm(`Удалить ${selectedGame.title}?`)) return;
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/games/${selectedGame._id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			alert("Игра удалена!");
			window.location.reload();
			return response.data;
		} catch (error) {
			console.error(
				"Ошибка при удалении игры:",
				error.response?.status,
				error.message
			);
			if (error.response?.status === 404) {
				throw new Error("Игра не найдена");
			} else if (error.response?.status === 401) {
				throw new Error("Требуется авторизация");
			} else if (error.response?.status === 403) {
				throw new Error("Требуются права администратора");
			} else {
				throw new Error(
					error.response?.data?.error || "Не удалось удалить игру"
				);
			}
		}
	};

	return (
		<>
			<div className="standard-container">
				<div className={styles.admin_panel}>
					<h1>Админ-панель</h1>

					{activeForm === "Create" ? (
						<GameForm />
					) : activeForm === "Update" ? (
						<>
							<button onClick={openCreateForm}>Добавить новую игру</button>
							<EditGameForm gameId={selectedGame._id} />
						</>
					) : null}

					<div className={styles.game_list}>
						<h2>Управление играми</h2>
						<SearchBar
							items={gamesList}
							onSelect={game => {
								setSelectedGame(game);
								setActiveForm("Create");
							}}
						/>
						{selectedGame._id ? (
							<div key={selectedGame._id} className={styles.game_item}>
								<img src={selectedGame.logoUrl} alt={selectedGame.title} />
								<span>{selectedGame.title}</span>
								<button onClick={openEditForm}>Редактировать</button>
								<button onClick={deleteGame}>Удалить</button>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
};

export default Admin;
