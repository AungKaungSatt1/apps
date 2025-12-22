import { useContext, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../style/Form.css";
import { postSignup } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Template/ThemedApp";

export default function SignUp() {
	const [eyeOpen, setEyeOpen] = useState(false);
	const { setToast } = useContext(AppContext);
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
						return false;
					}
					(async () => {
						const result = await postSignup({
							username,
							password,
						});

						if (result) {
							setToast("Signup Complete");
							navigate("/login");
						} else {
							console.log("Something went wrong");
						}
					})();
				}}>
				<span className='form-name'>Sign Up</span>
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
				<button className='form-button'>Signup</button>
				<span className='form-change'>
					Already have an account? <a href='/login'>Login</a>
				</span>
			</form>
		</div>
	);
}
