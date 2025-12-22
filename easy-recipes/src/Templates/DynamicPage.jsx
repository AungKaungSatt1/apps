import "../css/app.css";

import { createContext, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Template from "./Template";
import Detail from "../pages/Detail";
import Meals from "../pages/Meals";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import { getCookie, verify } from "../libs/fetcher";
import { useEffect } from "react";
import PostMeal from "../pages/PostMeal";
import CuisinePage from "../pages/CuisinePage";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import ProfileSettings from "../pages/ProfileSettings";
import AppearanceSetting from "../pages/AppearanceSetting";

export const RecipeContext = createContext();

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
            {
                path: "/meals/post/:id",
                element: <PostMeal />,
            },
            {
                path: "/cuisines",
                element: <CuisinePage />,
            },
            {
                path: "/users/profile/:id",
                element: <Profile />,
            },
            {
                path: "/users/:id/settings",
                element: <Settings />,
                children: [
                    {
                        path: "/users/:id/settings/profile",
                        element: <ProfileSettings />,
                    },
                    {
                        path: "/users/:id/settings/appearance",
                        element: <AppearanceSetting />,
                    },
                ],
            },
        ],
    },
]);

export default function DynamicPage() {
    const [drawer, openDrawer] = useState(false);
    const [auth, setAuth] = useState(false);
    const [mode, setMode] = useState(getCookie("mode"));
    const [theme, setTheme] = useState(getCookie("theme"));

    useEffect(() => {
        (async () => {
            await verify().then((user) => setAuth(user));
        })();
    }, []);

    return (
        <RecipeContext.Provider
            value={{ drawer, openDrawer, auth, setAuth, mode, setMode, theme, setTheme }}
        >
            <RouterProvider router={router} />
        </RecipeContext.Provider>
    );
}
