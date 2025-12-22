import * as motion from "motion/react-client";
import { useContext, useEffect } from "react";
import { RecipeContext } from "../Templates/DynamicPage";

export default function AppearanceSetting() {
    const { theme, setTheme } = useContext(RecipeContext);

    useEffect(() => {
        if (theme == "green") {
            document.cookie = `theme=green;Secure=HTTPOnly;expires=Fri, 31 Dec 2123 23:59:59 GMT;path=/`;
            document.body.classList.remove("orange");
        } else {
            document.cookie = `theme=orange;Secure=HTTPOnly;expires=Fri, 31 Dec 2123 23:59:59 GMT;path=/`;
            document.body.classList.add("orange");
        }
    }, [theme]);

    return (
        <div className="absolute top-10 left-80 w-[400px]">
            <div className="w-full border-b">
                <p className="text-[20px] text-(--black) font-bold">Theme</p>
                <div className="flex gap-5 my-[20px]">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-[75px] h-[75px] bg-[#38b000] rounded-[50px]"
                        onClick={() => setTheme("green")}
                    ></motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-[75px] h-[75px] bg-[#ffae00] rounded-[50px]"
                        onClick={() => setTheme("orange")}
                    ></motion.div>
                </div>
            </div>
            <p className="text-(--black)">Copyright &copy; All rights reserved 2025</p>
        </div>
    );
}
