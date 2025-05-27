import { useState } from "react";
import styles from "./style.module.scss";

const ImageWithModal = ({
	src,
	alt,
	description,
	isDeletable = false,
	onDeleteClick = null,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			{/* Маленькое изображение */}
			<img
				src={src}
				alt={alt}
				onClick={openModal}
				className={styles.thumbnail_image}
				style={{ cursor: "pointer", maxWidth: "200px" }}
			/>

			{/* Модальное окно */}
			{isOpen && (
				<div className={styles.modal_overlay} onClick={closeModal}>
					<div className={styles.modal_content}>
						{/* Кнопка удаления */}
						{isDeletable && (
							<button className={styles.close_button} onClick={onDeleteClick}>
								Удалить
							</button>
						)}

						{/* Контейнер для изображения и описания */}
						<div>
							<img src={src} alt={alt} className={styles.enlarged_image} />

							{/* Текстовая плашка */}
							{description && (
								<div className={styles.image_description}>{description}</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ImageWithModal;
