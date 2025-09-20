import { List, Sun, MagnifyingGlass, User, Moon } from "phosphor-react";
import { Outlet, useNavigate } from "react-router-dom";
import Drawer from "../components/Drawer";
import { useContext, useEffect } from "react";
import { RecipeContext } from "./DynamicPage";

export default function Template() {
    const { mode, setMode, drawer, openDrawer, auth } = useContext(RecipeContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (mode == "light") {
            document.cookie = `mode=light;Secure=HTTPOnly;expires=Fri, 31 Dec 2123 23:59:59 GMT;path=/`;
            document.body.classList.remove("dark-mode");
        }
        if (mode == "dark") {
            document.cookie = `mode=dark;Secure=HTTPOnly;expires=Fri, 31 Dec 2123 23:59:59 GMT;path=/`;
            document.body.classList.add("dark-mode");
        }
    }, [mode]);

    return (
        <>
            <nav className="fixed flex top-0 z-1 w-full border-b-1 h-[65px] py-[10px] px-[15px] bg-(--white) border-b-(--white) shadow-lg shadow-(color:--shadow-black) justify-between align-middle">
                <div className="flex items-center">
                    <img src="/logo.png" height="30px" alt="" />
                    <List
                        className="ms-[30px] cursor-pointer hover:scale-120 active:scale-90 transition duration-500 ease-out text-(--black)"
                        size="28px"
                        onClick={() => (!drawer ? openDrawer(true) : openDrawer(false))}
                    />
                    {mode == "light" ? (
                        <Sun
                            className="ms-[25px] cursor-pointer hover:scale-120 active:scale-100 transition duration-500 ease-in-out text-(--black)"
                            size="28px"
                            onClick={() => setMode("dark")}
                        />
                    ) : (
                        <Moon
                            className="ms-[25px] cursor-pointer hover:scale-120 active:scale-100 transition duration-500 ease-in-out text-(--black)"
                            size="28px"
                            onClick={() => setMode("light")}
                        />
                    )}
                </div>
                <div className="flex w-[300px] justify-between border border-(--secondary-color) px-[25px] py-[7px] rounded-[25px] bg-white">
                    <input
                        type="text"
                        placeholder="Search Meals"
                        className="text-[14px] outline-none w-[85%]"
                    />
                    <MagnifyingGlass
                        className="text-(--additional-color) cursor-pointer hover:scale-110 active:scale-100 transition duration-300 ease-in-out"
                        size="1.8em"
                    />
                </div>
                <div className="flex items-center">
                    <ul className="flex me-[25px] text-[20px] pe-[25px] py-[8px] border-e border-e-(--border-color) [&>*]:text-(--black)">
                        <li
                            onClick={() => navigate("/")}
                            className="list-item hover:scale-120 cursor-pointer transition duration-500 ease-in-out"
                        >
                            Home
                        </li>
                        <li
                            onClick={() => navigate("/meals")}
                            className="list-item hover:scale-120 mx-[25px] cursor-pointer transition duration-500 ease-in-out"
                        >
                            Meals
                        </li>
                        <li
                            onClick={() => navigate("/cuisines")}
                            className="list-item hover:scale-120 cursor-pointer transition duration-500 ease-in-out"
                        >
                            Cuisines
                        </li>
                    </ul>
                    {!auth && (
                        <>
                            <strong
                                className="text-[25px] text-(--additional-color) cursor-pointer me-[25px]"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </strong>
                            <strong
                                className="text-[25px] text-(--additional-color) cursor-pointer me-[25px]"
                                onClick={() => navigate("/login")}
                            >
                                Log In
                            </strong>
                        </>
                    )}

                    <span className="w-[50px] flex justify-center items-center h-[50px] bg-white rounded-[50%] cursor-pointer">
                        <User size="2em" />
                    </span>
                </div>
            </nav>

            {drawer && <Drawer />}

            <Outlet />
        </>
    );
}
