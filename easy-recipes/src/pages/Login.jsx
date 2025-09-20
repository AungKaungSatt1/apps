import { Eye } from "phosphor-react";
import Footer from "../components/Footer";
import { useRef } from "react";
import { PostLogin, verify } from "../libs/fetcher";
import { useContext } from "react";
import { RecipeContext } from "../Templates/DynamicPage";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { setAuth } = useContext(RecipeContext);
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();

    return (
        <>
            <img
                className="absolute -z-1 end-[105px] bottom-0"
                src="/Meal_1.png"
                alt="Meal 1 photo"
            />
            <img
                className="absolute -z-1 end-[165px] top-30"
                src="/Meal_2.png"
                alt="Meal 2 photo"
            />
            <img
                className="absolute -z-1 top-40 start-[100px]"
                src="/Meal_3.png"
                alt="Meal 3 photo"
            />
            <form
                className="mt-[130px] mb-[100px] mx-auto rounded-[15px] bg-[rgb(237,242,244,0.6)] p-[25px] w-[400px] border border-white backdrop-blur-[5px] h-[435px]"
                onSubmit={(e) => {
                    e.preventDefault();
                    const email = emailRef.current.value;
                    const password = passwordRef.current.value;

                    if (!email || !password) {
                        console.log("username and password required");
                        return false;
                    }
                    (async () => {
                        const token = await PostLogin(email, password);
                        if (token) {
                            document.cookie = `token=${token};Secure=HTTPOnly;expires=Fri, 31 Dec 2123 23:59:59 GMT;path=/`;
                            setAuth(await verify());
                            navigate("/");
                        }
                    })();
                }}
            >
                <strong className="text-center block text-[2em]">Log In</strong>

                <label className="block mt-[5px] mb-[10px] text-[1.3em]">Email</label>
                <input
                    className="bg-(--white) py-[7px] px-[15px] rounded-[5px] w-full"
                    type="text"
                    placeholder="example@gmail.com..."
                    name="email"
                    ref={emailRef}
                />

                <label className="block mt-[20px] mb-[10px] text-[1.3em]">Password</label>
                <div className="flex relative mb-[20px]">
                    <input
                        className="bg-(--white) py-[7px] px-[15px] rounded-[5px] w-full"
                        type="password"
                        placeholder="Password..."
                        name="password"
                        ref={passwordRef}
                    />
                    <Eye className="absolute end-3 top-[25%] cursor-pointer" size="1.2em" />
                </div>
                <button className="w-full bg-(--secondary-color) text-(--white) py-[10px] rounded-[10px] cursor-pointer mb-[5px]">
                    <b>Login</b>
                </button>
                <a href="/meals" className="block text-end underline text-blue-700">
                    Forgot Password?
                </a>
                <strong className="block text-center mt-[20px] text-[1.2em]">
                    Don't have an account?{" "}
                    <a href="/signup" className="underline font-medium text-blue-700">
                        Sign Up
                    </a>
                    !
                </strong>
            </form>
            <Footer />
        </>
    );
}
