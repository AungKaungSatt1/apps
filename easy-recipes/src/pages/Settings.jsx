import { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RecipeContext } from "../Templates/DynamicPage";

export default function Settings() {
    const { auth } = useContext(RecipeContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <div className="absolute top-16 flex">
            <div className="bg-(--white) min-w-60 h-131 fixed">
                <p className="text-[20px] text-(--black) font-bold mt-[25px] ms-[15px]">Settings</p>
                <ul className="mt-[35px] [&>*]:text-(--black) [&>*]:border-b [&>*]:border-b-(--border-color) [&>*]:py-[10px] [&>*]:text-[18px] [&>*]:hover:text-white [&>*]:hover:bg-(--secondary-color) [&>*]:ps-[15px] [&>*]:duration-500 [&>*]:ease-in-out [&>*]:cursor-pointer">
                    <li
                        className={
                            pathname == `/users/${auth._id}/settings/profile`
                                ? `bg-(--secondary-color) text-white`
                                : undefined
                        }
                        onClick={() => navigate(`/users/${auth._id}/settings/profile`)}
                    >
                        Profile
                    </li>
                    <li
                        className={
                            pathname == `/users/${auth._id}/settings/appearance`
                                ? `bg-(--secondary-color) text-[#fff]`
                                : undefined
                        }
                        onClick={() => navigate(`/users/${auth._id}/settings/appearance`)}
                    >
                        Appearance
                    </li>
                    <li
                        className={
                            pathname == `/users/${auth._id}/settings/security`
                                ? `bg-(--secondary-color) text-[#fff]`
                                : undefined
                        }
                    >
                        Security
                    </li>
                    <li className="border-none hover:text-(--additional-color)">Log Out</li>
                </ul>
            </div>
            <Outlet />
        </div>
    );
}
