import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./style.module.scss";

const LatestReviews = () => {
	const navigate = useNavigate();
	const [reviewsList, setReviewsList] = useState([]);

	const LoadReviews = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/reviews-with-details`,
				{}
			);
			setReviewsList(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		LoadReviews();
	}, []);

	return (
		<div className={styles.root}>
			<h2>Последние отзывы</h2>
			{reviewsList.slice(0, 4).map((rev, idx) => (
				<div key={"rev " + idx} className={styles.review}>
					<p>
						<strong
							onClick={() => {
								navigate(`/profile/${rev.user._id}`);
							}}
						>
							{rev.user.username}:
						</strong>{" "}
						{rev.game.title} — {rev.text}
					</p>
				</div>
			))}
		</div>
	);
};

export default LatestReviews;
