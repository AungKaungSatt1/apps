import { Eye } from "phosphor-react";
import Footer from "../components/Footer";
import { useRef } from "react";
import { PostSignUp } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const passwordRef = useRef();
    const emailRef = useRef();
    const navigate = useNavigate();

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
                className="mt-[130px] mb-[100px] mx-auto rounded-[15px] bg-[rgb(237,242,244,0.6)] p-[25px] w-[400px] border border-white backdrop-blur-[5px] h-[425px]"
                onSubmit={(e) => {
                    e.preventDefault();

                    const email = emailRef.current.value;
                    const password = passwordRef.current.value;
                    if (!email || !password) return false;
                    (async () => {
                        const res = await PostSignUp(email, password);

                        if (res) {
                            navigate("/login");
                        }
                    })();
                }}
            >
                <strong className="text-center block text-[2em]">Sign Up</strong>

                <label className="block mt-[5px] mb-[10px] text-[1.3em]">Email</label>
                <input
                    className="bg-(--white) py-[7px] px-[15px] rounded-[5px] w-full"
                    type="text"
                    placeholder="example@gmail.com..."
                    name="email"
                    ref={emailRef}
                />

                <label className="block mt-[20px] mb-[10px] text-[1.3em]">
                    Password{" "}
                    <span className="text-[0.8em] text-(--additional-color)">
                        (has to be 8 characters at least)
                    </span>
                </label>
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
                    <b>Sign Up</b>
                </button>
                <strong className="block text-center mt-[25px] text-[1.2em]">
                    Already have an account?{" "}
                    <a href="/login" className="underline font-medium text-blue-700">
                        Login
                    </a>
                    !
                </strong>
            </form>
            <Footer />
        </>
    );
}
