import React from "react";
import { createRoot } from "react-dom/client"; // Новый импорт
import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "./components/Context/GlobalContext";
import App from "./App";
import { AuthProvider } from "./components/Context/AuthContext";

const root = createRoot(document.getElementById("root")); // Создаём root
root.render(
	<AuthProvider>
		<GlobalProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</GlobalProvider>
	</AuthProvider>
);
