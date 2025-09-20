import { useEffect, useState } from "react";
import { Share } from "phosphor-react";
import { getProfile } from "../libs/fetcher";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
export default function Profile() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [meals, setMeals] = useState([]);
    const [image, setImage] = useState({});

    useEffect(() => {
        (async () => {
            const data = await getProfile(id);

            const meals_files_url = import.meta.env.VITE_MEALS_FILES_URL;
            let count = 1;
            data.meals.map((data) => {
                if (data.image) {
                    setImage((image[`file${count}`] = `${meals_files_url}/${data.image}`));
                    count++;
                }
            });
            setMeals(data.meals);
            setUser(data.user);
            setLoading(false);
        })();
    }, []);

    return (
        <>
            {loading ? (
                <div>Loading..</div>
            ) : (
                <div className="absolute top-23 left-10">
                    <div className="w-[1200px] mb-[25px]">
                        <div className="flex w-full justify-center">
                            <div className="flex justify-center w-[15%] h-[175px] items-center rounded-[50%] text-center border bg-white border-white py-[1.5em] px-[1.5em] cursor-pointer mb-3 me-[30px]">
                                <p className="text-[100px]">{user.name.charAt(0)}</p>
                            </div>
                            <div className="w-[50%] ps-[30px] border-l border-l-(--border-color)">
                                <div className="flex justify-between w-[85%]">
                                    <span className="flex justify-around items-center w-[150px]">
                                        <p className="text-[30px] text-(--black)">{user.name}</p>
                                        <p className="opacity-70 font-bold text-[20px] text-(--black)">
                                            @{user.username}
                                        </p>
                                    </span>
                                    <span className="flex justify-around items-center w-[200px]">
                                        <button className="hover:bg-(--secondary-color) hover:text-white text-(--secondary-color) text-[18px] py-[5px] px-[30px] rounded-[5px] border border-(--secondary-color) duration-500 transition-all ease-in-out cursor-pointer">
                                            Follow
                                        </button>
                                        <Share
                                            className="cursor-pointer text-(--black)"
                                            size="2em"
                                        />
                                    </span>
                                </div>
                                <div className="w-full mt-[10px] overflow-auto">
                                    <p className="text-[16px] h-[100px] text-(--black) w-full">
                                        {user.bio}
                                    </p>
                                    <span className="flex gap-5 [&>*]:cursor-pointer">
                                        <img
                                            src="/Tiktok.svg"
                                            width="40px"
                                            height="40px"
                                            alt="Tiktok"
                                        />
                                        <img
                                            src="/Instagram.svg"
                                            width="40px"
                                            height="40px"
                                            alt="Instagram"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full border-t border-t-(--border-color) mt-[50px] pt-[50px]">
                            <h1 className="text-[50px] text-center mb-[25px] text-(--black)">
                                Meals By {user.name}
                            </h1>
                            <div className="w-full mx-auto flex flex-row flex-wrap gap-5 justify-center">
                                {meals.map((meal) => {
                                    return <Card meal={meal} key={meal._id} mealFiles={image} />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
