import { useState } from "react";
import "./style.scss";

const ImageWithModal = ({ src, alt, description }) => {
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
				className="thumbnail-image"
				style={{ cursor: "pointer", maxWidth: "200px" }}
			/>

			{/* Модальное окно */}
			{isOpen && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-content">
						{/* Кнопка закрытия */}
						<button className="close-button" onClick={closeModal}>
							&times;
						</button>

						{/* Контейнер для изображения и описания */}
						<div className="image-wrapper">
							<img src={src} alt={alt} className="enlarged-image" />

							{/* Текстовая плашка */}
							{description && (
								<div className="image-description">{description}</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ImageWithModal;
