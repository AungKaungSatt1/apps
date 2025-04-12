import "../css/app.css";

import { createContext, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Template from "./Template";
import Detail from "../pages/Detail";
import Meals from "../pages/Meals";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

export const AppContext = createContext();

export default function DynamicPage() {
	const [drawer, openDrawer] = useState(false);

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Template />,
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/meals/:id",
					element: <Detail />,
				},
				{
					path: "/meals",
					element: <Meals />,
				},
				{
					path: "/login",
					element: <Login />,
				},
				{
					path: "/signup",
					element: <SignUp />,
				},
			],
		},
	]);

	return (
		<AppContext.Provider value={{ drawer, openDrawer }}>
			<RouterProvider router={router} />
		</AppContext.Provider>
	);
}
