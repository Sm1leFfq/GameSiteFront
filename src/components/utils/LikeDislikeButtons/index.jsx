import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";

const LikeDislikeButtons = ({ review, setReviewsArray }) => {
	const { user, token, isAuthenticated } = useAuth();
	const [userReactions, setUserReactions] = useState({});

	useEffect(() => {
		if (isAuthenticated) {
			setUserReactions(prev => {
				const newState = { ...prev };
				if (review.reactions.likedBy?.includes(user._id))
					newState[review._id] = "like";
				if (review.reactions.dislikedBy?.includes(user._id))
					newState[review._id] = "dislike";
				return newState;
			});
		}
	}, []);

	// Проверяем, поставил ли пользователь уже реакцию на отзыв
	// const hasUserReacted = (reviewId, reactionType) => {
	// 	return userReactions[reviewId] === reactionType;
	// };

	const handlerOnLikeClick = async reviewId => {
		if (!isAuthenticated) {
			alert("Необходимо авторизоваться");
			return;
		}

		try {
			setReviewsArray(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;

					const currentReaction = userReactions[reviewId];
					let newLikes = review.reactions.likes;
					let newDislikes = review.reactions.dislikes;

					if (currentReaction === "like") {
						newLikes -= 1;
					} else {
						if (currentReaction === "dislike") {
							newDislikes -= 1;
						}
						newLikes += 1;
					}

					return {
						...review,
						reactions: {
							likes: newLikes,
							dislikes: newDislikes,
						},
					};
				})
			);

			setUserReactions(prev => {
				const newState = { ...prev };
				if (newState[reviewId] === "like") {
					delete newState[reviewId];
				} else {
					newState[reviewId] = "like";
				}
				return newState;
			});

			await axios.post(
				`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/react`,
				{
					reactionType: "like",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error) {
			console.error("Like error:", error);
			setReviewsArray(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;
					return {
						...review,
						reactions: {
							likes: review.reactions.likes,
							dislikes: review.reactions.dislikes,
						},
					};
				})
			);
		}
	};

	const handlerOnDislikeClick = async reviewId => {
		if (!isAuthenticated) {
			alert("Необходимо авторизоваться");
			return;
		}

		try {
			setReviewsArray(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;

					const currentReaction = userReactions[reviewId];
					let newLikes = review.reactions.likes;
					let newDislikes = review.reactions.dislikes;

					if (currentReaction === "dislike") {
						newDislikes -= 1;
					} else {
						if (currentReaction === "like") {
							newLikes -= 1;
						}
						newDislikes += 1;
					}

					return {
						...review,
						reactions: {
							likes: newLikes,
							dislikes: newDislikes,
						},
					};
				})
			);

			setUserReactions(prev => {
				const newState = { ...prev };
				if (newState[reviewId] === "dislike") {
					delete newState[reviewId];
				} else {
					newState[reviewId] = "dislike";
				}
				return newState;
			});

			await axios.post(
				`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/react`,
				{
					reactionType: "dislike",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error) {
			console.error("Dislike error:", error);
			setReviewsArray(prevReviews =>
				prevReviews.map(review => {
					if (review._id !== reviewId) return review;
					return {
						...review,
						reactions: {
							likes: review.reactions.likes,
							dislikes: review.reactions.dislikes,
						},
					};
				})
			);
		}
	};

	return (
		<>
			<button onClick={() => handlerOnLikeClick(review._id)}>
				👍 {review.reactions.likes}
			</button>
			<button onClick={() => handlerOnDislikeClick(review._id)}>
				👎 {review.reactions.dislikes}
			</button>
		</>
	);
};

export default LikeDislikeButtons;
