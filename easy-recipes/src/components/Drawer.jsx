import { Gear, Plus, SignIn, User, SignOut } from "phosphor-react";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeContext } from "../Templates/DynamicPage";

export default function Drawer() {
    const { auth, setAuth, drawer, openDrawer } = useContext(RecipeContext);
    const navigate = useNavigate();
    const drawerRef = useRef();

    useEffect(() => {
        const clickOutside = (e) => {
            if (openDrawer && drawerRef.current && !drawerRef?.current.contains(e.target)) {
                drawer ? openDrawer(false) : openDrawer(true);
            }
            console.log(!drawerRef.current.contains(e.target));
        };

        document.addEventListener("mousedown", clickOutside);
        return () => {
            document.removeEventListener("mousedown", clickOutside);
        };
    }, [drawer]);

    const DrawerLists = (
        <>
            <div
                className="flex px-[20px] hover:bg-(--secondary-color) transition duration-500 ease-in-out hover:text-white cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--border-color) text-(--black) items-center gap-3"
                onClick={() => navigate(`/users/${auth._id}/settings/profile`)}
            >
                <Gear size="2em" /> Settings
            </div>
            <div
                className="flex px-[20px] hover:bg-(--secondary-color) hover:text-white transition duration-500 ease-in-out cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--border-color) text-(--black) items-center gap-3"
                onClick={() => (!auth ? navigate("/login") : navigate(`/meals/post/${auth._id}`))}
            >
                <Plus size="2em" /> Post
            </div>
            {!auth ? (
                <div
                    className="flex px-[20px] hover:bg-(--secondary-color) hover:text-white transition duration-500 text-(--black) ease-in-out cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--border-color) items-center gap-3"
                    onClick={() => navigate("/login")}
                >
                    <SignIn size="2em" /> Log In
                </div>
            ) : (
                <div
                    className="flex px-[20px] hover:bg-(--additional-color) hover:text-white transition duration-500 ease-in-out cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--border-color) items-center gap-3 text-(--additional-color)"
                    onClick={() => {
                        setAuth(false);
                        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }}
                >
                    <SignOut size="2em" /> Log out
                </div>
            )}
        </>
    );

    return (
        <>
            <aside
                className="fixed text-center backdrop-blur-[10px] bg-(--drawer-white) border-r border-r-(--white) border-t border-t-white w-[20%] h-[90%] top-[11%] z-1"
                ref={drawerRef}
            >
                <div className="flex flex-col items-center py-5">
                    <div
                        className="flex justify-center items-center rounded-[50%] text-center border bg-white border-white py-[1.5em] px-[1.5em] cursor-pointer mb-3"
                        onClick={() => navigate(`/users/profile/${auth._id}`)}
                    >
                        <User size="2.5em" />
                    </div>
                    {auth && (
                        <>
                            <strong className="text-[1.3em] text-(--black)">{auth.name}</strong>
                            <p className="text-[1.1em] opacity-60 me-1 text-(--black)">
                                @{auth.username}
                            </p>
                        </>
                    )}
                </div>
                {DrawerLists}
            </aside>
        </>
    );
}
