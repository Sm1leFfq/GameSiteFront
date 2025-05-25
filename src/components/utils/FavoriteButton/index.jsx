import { useAuth } from "../../Context/AuthContext";
import axios from "axios";

const FavoriteButton = ({ gameId }) => {
	const { user, token, isAuthenticated, updateUserInfo } = useAuth();

	const addToFavorite = async gameId => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/users/${user._id}/favorites`,
				{
					gameId: gameId,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error(error?.response.error);
		}
	};

	const deleteFromFavorite = async gameId => {
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/users/${user._id}/favorites/${gameId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error(error?.response.error);
		}
	};

	const handlerOnClickToFavorite = async gameId => {
		try {
			await addToFavorite(gameId);
			await updateUserInfo();
			alert("Добавлено в избранное");
		} catch (error) {
			console.error(error?.response.error);
		}
	};

	const handlerOnClickRemoveFromFavorite = async gameId => {
		try {
			await deleteFromFavorite(gameId);
			await updateUserInfo();
			alert("Удалено из избранного");
		} catch (error) {
			console.error(error?.response.error);
		}
	};

	return (
		<>
			{isAuthenticated && !user.favorites.includes(gameId) && (
				<button
					className="simple-button"
					onClick={() => {
						handlerOnClickToFavorite(gameId);
					}}
				>
					В избранное
				</button>
			)}
			{isAuthenticated && user.favorites.includes(gameId) && (
				<button
					className="simple-button"
					onClick={() => {
						handlerOnClickRemoveFromFavorite(gameId);
					}}
				>
					Убрать из избранного
				</button>
			)}
		</>
	);
};

export default FavoriteButton;
