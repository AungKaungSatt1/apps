import { useContext, useRef, useState } from "react";
import { fetchVerify, postLogin } from "../libs/fetcher";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Template/ThemedApp";
import "../style/Form.css";

export default function Login() {
	const { setAuth } = useContext(AppContext);
	const [eyeOpen, setEyeOpen] = useState(false);
	const navigate = useNavigate();
	const usernameRef = useRef();
	const passwordRef = useRef();

	return (
		<div className='background'>
			<form
				className='form'
				onSubmit={e => {
					e.preventDefault();
					const username = usernameRef.current.value;
					const password = passwordRef.current.value;

					if (!username || !password) {
						console.log("username and password required");
						return false;
					}
					(async () => {
						const token = await postLogin(username, password);
						if (token) {
							localStorage.setItem("token", token);
							setAuth(await fetchVerify());
							navigate("/");
						}
					})();
				}}>
				<span className='form-name'>Login</span>
				<label>Username</label>
				<input type='text' placeholder='Username' ref={usernameRef} className='input' />
				<label>Password</label>
				<div className='password'>
					<input
						type={eyeOpen ? "text" : "password"}
						placeholder='Password'
						ref={passwordRef}
						className='input'
					/>
					<span
						className='eye'
						onClick={() => (!eyeOpen ? setEyeOpen(true) : setEyeOpen(false))}>
						{eyeOpen ? <FaEyeSlash size='1.3em' /> : <FaEye size='1.3em' />}
					</span>
				</div>
				<button className='form-button'>Log In</button>
				<span className='form-change'>
					Create an account <a href='/signup'>Signup</a>
				</span>
			</form>
		</div>
	);
}
