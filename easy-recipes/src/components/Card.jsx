import { Heart, Star } from "phosphor-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Card({ meal, mealFiles }) {
    const [rating, setRating] = useState(null);
    const navigate = useNavigate();

    let stars_count = 5;

    function CutSentences(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength);
        }
        return str;
    }

    return (
        <div
            className="flex bg-white w-[600px] h-[270px] rounded-[15px] cursor-pointer"
            onClick={(e) => {
                navigate(`/meals/${meal._id}`);
                e.stopPropagation();
            }}
        >
            <div className="bg-blue-100 rounded-tl-[15px] rounded-bl-[15px] relative text-white">
                {meal.image == "" ? (
                    <img
                        className="rounded-tl-[15px] w-full rounded-bl-[15px] h-full"
                        src="/Chicken_Tender.jpg"
                        alt="Chicken Tender"
                    />
                ) : (
                    <img
                        className="rounded-tl-[15px] w-full rounded-bl-[15px] h-full"
                        src={mealFiles}
                        alt={meal.name}
                    />
                )}

                <span
                    className="absolute top-[15px] bg-(--additional-color-2) p-[8px] rounded-[50px] right-[15px] inline-block hover:scale-120 active:scale-90 duration-300 ease-in-out transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Heart size="1.5em" />
                </span>
                <span className="absolute flex flex-row bottom-[15px] left-[15px]">
                    {[...Array(stars_count)].map((star, index) => {
                        const currentRating = index + 1;
                        let count = 1;
                        return (
                            <Star
                                className="hover:scale-110 active:scale-100 star"
                                size="1.5em"
                                style={{
                                    color: currentRating <= rating ? "#F7E408" : "#e4e5e9",
                                }}
                                weight={currentRating <= rating ? "fill" : "regular"}
                                onClick={(e) => {
                                    count % 2 == 0
                                        ? setRating(currentRating - 1)
                                        : setRating(currentRating);
                                    count++;
                                    e.stopPropagation();
                                }}
                                key={index}
                            />
                        );
                    })}
                    <strong className="ms-2">0</strong>
                </span>
            </div>
            <div className="p-[15px] w-[50%]">
                <span className="inline-block text-[1.4em] font-bold h-[60px]">{meal.name}</span>
                <p className="text-[16px] py-[15px] border-b border-b-(--border-color)">
                    {CutSentences(meal.description, 50)}{" "}
                    <Link className="text-(--secondary-color) italic underline">more...</Link>
                </p>
                <div className="flex gap-5 flex-wrap pt-2">
                    <span>
                        <strong>Cooking Time</strong>
                        <div>{meal.cooking_time}</div>
                    </span>
                    <span>
                        <strong>Servings</strong>
                        <div>{meal.serving}</div>
                    </span>
                </div>
                <Link className="text-(--secondary-color) hover:underline float-end pt-[5px]">
                    See Recipe
                </Link>
            </div>
        </div>
    );
}
