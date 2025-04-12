import { List, Sun, MagnifyingGlass, User } from "phosphor-react";
import { Outlet, useNavigate } from "react-router-dom";
import Drawer from "../components/Drawer";
import { useContext } from "react";
import { AppContext } from "./DynamicPage";

export default function Template() {
	const { drawer, openDrawer } = useContext(AppContext);
	const navigate = useNavigate();

	return (
		<>
			<nav className='fixed top-0 z-1 w-full border-b-1 flex h-50px py-[10px] px-[15px] bg-white border-[#fff] shadow-lg justify-between align-middle'>
				<div className='flex items-center'>
					<img src='/logo.png' height='30px' alt='' />
					<List
						className='ms-[30px] cursor-pointer hover:scale-120 active:scale-90 transition duration-500 ease-out'
						size='1.8em'
						onClick={() => (!drawer ? openDrawer(true) : openDrawer(false))}
					/>
					<Sun
						className='ms-[25px] cursor-pointer hover:scale-120 active:scale-100 transition duration-500 ease-in-out'
						size='1.8em'
					/>
				</div>
				<div className='flex w-[300px] justify-between border border-(--secondary-color) px-[25px] py-[7px] rounded-[25px]'>
					<input
						type='text'
						placeholder='Search Meals'
						className='text-[14px] outline-none w-[85%]'
					/>
					<MagnifyingGlass
						className='text-(--additional-color) cursor-pointer hover:scale-110 active:scale-100 transition duration-300 ease-in-out'
						size='1.8em'
					/>
				</div>
				<div className='flex items-center'>
					<ul className='flex me-[25px] text-[20px] pe-[25px] py-[8px] border-e border-e-(--border-color)'>
						<li
							onClick={() => navigate("/")}
							className='list-item hover:scale-120 cursor-pointer transition duration-500 ease-in-out'>
							Home
						</li>
						<li
							onClick={() => navigate("/meals")}
							className='list-item hover:scale-120 mx-[25px] cursor-pointer transition duration-500 ease-in-out'>
							Meals
						</li>
						<li
							onClick={() => navigate("/cuisines")}
							className='list-item hover:scale-120 cursor-pointer transition duration-500 ease-in-out'>
							Cuisines
						</li>
					</ul>
					<strong
						className='text-[25px] text-(--additional-color) cursor-pointer'
						onClick={() => navigate("/login")}>
						Log In
					</strong>
					<span className='w-[50px] flex justify-center items-center h-[50px] bg-(--primary-color) rounded-[50%] ms-[25px] cursor-pointer'>
						<User size='2em' />
					</span>
				</div>
			</nav>

			{drawer && <Drawer />}

			<Outlet />
		</>
	);
}
