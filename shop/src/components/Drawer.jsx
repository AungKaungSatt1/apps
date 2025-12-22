import { FaSignInAlt, FaPlus, FaUser, FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../Template/ThemedApp";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Drawer() {
	const { auth, setAuth, setDrawer } = useContext(AppContext);
	const navigate = useNavigate();

	const DrawerList = (
		<div className='drawer-list'>
			{auth ? (
				<div>
					<div className='drawer-top-item' onClick={() => navigate(`/users/${auth._id}`)}>
						<FaRegUserCircle size='1.3em' style={{ marginRight: 10 }} />
						Profile
					</div>
					<div
						className='drawer-item'
						style={{ color: "red" }}
						onClick={() => {
							setAuth(false);
							localStorage.removeItem("token");
						}}>
						<FaSignOutAlt size='1.3em' style={{ marginRight: 10 }} />
						Logout
					</div>
				</div>
			) : (
				<div>
					<div className='drawer-top-item' onClick={() => navigate("/signup")}>
						<FaPlus style={{ marginRight: 10 }} /> Sign up
					</div>
					<div className='drawer-item' onClick={() => navigate("/login")}>
						<FaSignInAlt style={{ marginRight: 10 }} /> Log in
					</div>
				</div>
			)}
		</div>
	);
	return (
		<>
			<div className='drawer'>
				<div className='drawer-head'>
					<div className='avatar' onClick={() => navigate(`/users/${auth._id}`)}>
						{auth ? auth.name[0] || auth.username[0].toUpperCase() : <FaUser />}
					</div>
				</div>
				{DrawerList}
			</div>
			<div className='drawer-overlay' onClick={() => setDrawer(false)}></div>
		</>
	);
}
