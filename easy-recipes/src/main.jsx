import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DynamicPage from "./Templates/DynamicPage";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<DynamicPage />
	</StrictMode>
);
