import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Drawer from "../components/Drawer";
import { AppContext } from "./ThemedApp";
import { useContext } from "react";

export default function Template() {
	const { drawer } = useContext(AppContext);

	return (
		<div className='light'>
			<Nav />
			{drawer && <Drawer />}
			<Outlet />
		</div>
	);
}
