import { useState, createContext, useEffect } from "react";
import "../style/Template.css";

import Home from "../pages/Home";

export const AppContext = createContext();

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from "./Template";
import Detail from "../pages/Detail";
import Profile from "../pages/Profile";
import SignUp from "../pages/Signup";
import Login from "../pages/Login";
import Shop from "../pages/Shop";
import { fetchVerify } from "../libs/fetcher";
import PostItem from "../pages/Post-Item";
import OrderHistory from "../pages/OrderHistory";

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
				path: "/shop/:id",
				element: <Detail />,
			},
			{
				path: "/users/:id",
				element: <Profile />,
			},
			{
				path: "/signup",
				element: <SignUp />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/shop",
				element: <Shop />,
			},
			{
				path: "/shop/post-item/:id",
				element: <PostItem />,
			},
			{
				path: "/users/order-history/:id",
				element: <OrderHistory />,
			},
		],
	},
]);

export default function ThemedApp() {
	const [mode, setMode] = useState(localStorage.getItem("mode"));
	const [drawer, setDrawer] = useState(false);
	const [auth, setAuth] = useState(false);
	const [cartData, setCartData] = useState([]);
	const [toast, setToast] = useState(null);
	const [counter, setCounter] = useState(3);

	useEffect(() => {
		fetchVerify().then(user => setAuth(user));
		if (toast) {
			if (counter > 0) {
				const timer = setTimeout(() => setCounter(counter - 1), 1000);
				return () => {
					clearTimeout(timer);
				};
			}

			setToast(null);
			setCounter(3);
		}
	}, [counter, toast]);

	return (
		<AppContext.Provider
			value={{
				mode,
				setMode,
				drawer,
				setDrawer,
				auth,
				setAuth,
				cartData,
				setCartData,
				toast,
				setToast,
			}}>
			<span className='toast' style={toast ? { opacity: 1 } : { opacity: 0 }}>
				{toast}
			</span>
			<RouterProvider router={router} />
		</AppContext.Provider>
	);
}
