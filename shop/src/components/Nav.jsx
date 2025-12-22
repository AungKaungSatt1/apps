import { useContext, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { AppContext } from "../Template/ThemedApp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function Nav() {
	const { mode, setMode, drawer, setDrawer } = useContext(AppContext);
	const { pathname } = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (mode == "dark") {
			localStorage.setItem("mode", "dark");
			document.body.classList.add("dark-mode");
		} else {
			localStorage.setItem("mode", "light");
			document.body.classList.remove("dark-mode");
		}
	}, [mode]);

	return (
		<>
			<nav className='nav' style={{ background: "var(--primary-color)" }}>
				<div className='nav-first-part'>
					{pathname === "/" ? (
						<a>
							<FaBars
								size='1.8rem'
								className='bars'
								onClick={() => {
									!drawer ? setDrawer(true) : setDrawer(false);
								}}
							/>
						</a>
					) : (
						<a>
							<IoIosArrowBack
								size='1.8rem'
								style={{ color: "var(--secondary-color)" }}
								onClick={() => {
									navigate(-1);
								}}
								className='nav-arrow'
							/>
						</a>
					)}
					<span className='logo'>Shop</span>
					{mode == "light" ? (
						<a
							className='theme'
							onClick={() => {
								setMode("dark");
							}}>
							<MdOutlineLightMode size='1.3rem' />
						</a>
					) : (
						<a
							className='theme'
							style={{ color: "white" }}
							onClick={() => {
								setMode("light");
							}}>
							<MdOutlineNightlight size='1.3rem' />
						</a>
					)}
				</div>
				<div className='nav-second-part'>
					<ul className='nav-group'>
						<Link
							className='nav-item'
							hrefLang='/'
							style={{ color: "var(--secondary-color)" }}>
							Home
						</Link>
					</ul>
				</div>
			</nav>
		</>
	);
}
