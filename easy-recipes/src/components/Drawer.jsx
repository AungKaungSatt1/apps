import { Gear, Plus, SignIn, User } from "phosphor-react";
import { useNavigate } from "react-router-dom";

export default function Drawer() {
	const navigate = useNavigate();

	const DrawerLists = (
		<>
			<div className='flex px-[20px] hover:bg-(--secondary-color) transition duration-500 ease-in-out hover:text-white cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--white) items-center gap-3'>
				<Gear size='2em' /> Settings
			</div>
			<div className='flex px-[20px] hover:bg-(--secondary-color) hover:text-white transition duration-500 ease-in-out cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--white) items-center gap-3'>
				<Plus size='2em' /> Post
			</div>
			<div
				className='flex px-[20px] hover:bg-(--secondary-color) hover:text-white transition duration-500 ease-in-out cursor-pointer text-[1.2em] py-[10px] border-y border-y-(--white) items-center gap-3'
				onClick={() => navigate("/login")}>
				<SignIn size='2em' /> Log In
			</div>
		</>
	);

	return (
		<>
			<aside className='fixed text-center backdrop-blur-[10px] bg-[rgb(255,255,255,0.7)] border-r border-r-white border-t border-t-white w-[20%] h-[90%] top-[11%] z-1'>
				<div className='flex flex-col items-center py-5'>
					<div className='flex justify-center items-center rounded-[50%] text-center border bg-(--primary-color) border-white py-[1.5em] px-[1.5em] cursor-pointer mb-3'>
						<User size='2.5em' />
					</div>
					<strong className='text-[1.3em]'>Alice</strong>
					<p className='text-[1.1em] opacity-60 me-1'>@alice</p>
				</div>
				{DrawerLists}
			</aside>
		</>
	);
}
