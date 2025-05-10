import { useState } from "react";

const ImageUpload = () => {
	const [preview, setPreview] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);

	const handleFileChange = e => {
		const file = e.target.files[0];
		if (!file) return;

		setSelectedFile(file);

		// Создаем превью
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div>
			<input
				name="screenshot"
				type="file"
				accept="image/*"
				onChange={handleFileChange}
			/>

			{preview && (
				<div className="preview-container">
					<img
						src={preview}
						alt="Preview"
						style={{ maxWidth: "300px", maxHeight: "300px" }}
					/>
					<p>Выбранный файл: {selectedFile.name}</p>
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
