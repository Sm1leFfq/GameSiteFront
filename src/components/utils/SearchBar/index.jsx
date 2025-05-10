import { useState, useEffect, useRef } from "react";
import "./style.scss";

const SearchBar = ({
	items,
	searchKey = "title",
	onSelect,
	placeholder = "Поиск...",
}) => {
	const [query, setQuery] = useState(""); // Текущий запрос поиска
	const [filteredItems, setFilteredItems] = useState([]); // Отфильтрованные результаты
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние выпадающего списка
	const inputRef = useRef(null); // Ref для поля ввода
	const dropdownRef = useRef(null); // Ref для выпадающего списка

	// Фильтрация элементов при изменении запроса
	useEffect(() => {
		if (query.trim() === "") {
			setFilteredItems([]);
			setIsDropdownOpen(false);
			return;
		}

		const filtered = items.filter(item =>
			item[searchKey]?.toLowerCase().includes(query.toLowerCase())
		);
		setFilteredItems(filtered.slice(0, 10)); // Ограничиваем 10 результатами
		setIsDropdownOpen(filtered.length > 0);
	}, [query, items, searchKey]);

	// Обработка клика вне компонента для закрытия списка
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				!inputRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Обработка ввода в поле поиска
	const handleInputChange = e => {
		setQuery(e.target.value);
	};

	// Обработка выбора элемента
	const handleSelect = item => {
		setQuery(item[searchKey]); // Устанавливаем выбранный элемент в поле
		setIsDropdownOpen(false); // Закрываем список
		if (onSelect) {
			onSelect(item); // Вызываем callback
		}
	};

	// Обработка нажатия Enter
	const handleKeyDown = e => {
		if (e.key === "Enter" && filteredItems.length > 0) {
			handleSelect(filteredItems[0]); // Выбираем первый элемент
		}
	};

	return (
		<div className="search-bar">
			<input
				type="text"
				value={query}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="search-input"
				ref={inputRef}
			/>
			{isDropdownOpen && (
				<ul className="search-dropdown" ref={dropdownRef}>
					{filteredItems.length > 0 ? (
						filteredItems.map(item => (
							<li
								key={item._id || item.id} // Предполагается, что у элементов есть уникальный _id или id
								onClick={() => handleSelect(item)}
								className="search-item"
							>
								{item[searchKey]}
							</li>
						))
					) : (
						<li className="search-item search-item-empty">Ничего не найдено</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
