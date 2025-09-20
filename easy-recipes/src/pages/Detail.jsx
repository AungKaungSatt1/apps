import { Share, Star, Heart } from "phosphor-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMealDetail, getReviews } from "../libs/fetcher";
import Carousel from "../components/Carousel";

export default function Detail() {
    const { id } = useParams();
    const [rating, setRating] = useState(null);
    const [meal, setMeal] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log(reviews);

    let stars_count = 5;

    const stars = [...Array(stars_count)].map((star, index) => {
        const currentRating = index + 1;
        let count = 1;
        return (
            <Star
                className="hover:scale-110 cursor-pointer active:scale-100"
                size="1.5em"
                style={{
                    color: currentRating <= rating ? "#F7E408" : "#9A9A9A",
                }}
                weight={currentRating <= rating ? "fill" : "regular"}
                onClick={(e) => {
                    count % 2 == 0 ? setRating(currentRating - 1) : setRating(currentRating);
                    count++;
                    e.stopPropagation();
                }}
                key={index}
            />
        );
    });

    useEffect(() => {
        (async () => {
            const data = await getMealDetail(id);
            setMeal(data);

            const reviews = await getReviews(id);
            setReviews(reviews);
            setLoading(true);
        })();
    }, []);

    return !loading ? (
        <div></div>
    ) : (
        <>
            <div className="mx-[75px] flex flex-col flex-wrap">
                <div className="mt-[150px] flex w-full mb-10">
                    <div className="py-[50px] w-[400px] border-r-1 border-r-(--border-color)">
                        <img
                            className="h-[250px] w-[250px] ms-10 rounded-[15px]"
                            src="/Chicken_Tender.jpg"
                            alt="Chicken Tender"
                        />
                    </div>
                    <span className="p-[30px] inline-block">
                        <div className="flex flex-row mb-[25px]">
                            <span className="inline-block h-[75px] rounded-[50px] me-[20px] text-base/[75px] w-[75px] text-center bg-white text-[1.5em] font-bold cursor-pointer">
                                {meal.postedBy.name[0]}
                            </span>
                            <div className="py-[5px]">
                                <strong className="inline-block mb-[10px] cursor-pointer hover:underline text-(--black)">
                                    {meal.postedBy.name}
                                </strong>
                                <p className="hover:underline text(--black) cursor-pointer">
                                    {meal.postedBy.username}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-[15px] w-185">
                            <strong className="text-[1.4em] text-(--black)">{meal.name}</strong>
                            <span className="inline-flex text-(--black)">
                                <Share className="me-[10px] cursor-pointer" size="1.5em" />
                                {stars}
                                <span className="ms-5">67</span>
                            </span>
                            <span
                                className="absolute top-40 bg-(--additional-color-2) p-[8px] rounded-[50px] right-[125px] inline-block hover:scale-120 active:scale-90 duration-300 ease-in-out transition-all text-white cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Heart size="1.5em" />
                            </span>
                        </div>
                        <div className="flex flex-row mb-[25px]">
                            <strong className="underline cursor-pointer border-e pe-[15px] me-[15px] text-(--black)">
                                {meal.reviews.length || 0} Reviews
                            </strong>
                            <span className="text-[#9A9A9A]">Created on 20:30pm 24/3/25</span>
                        </div>
                        <div className="w-175">
                            <p className="text-[16px] text-base/[30px] text-(--black) mb-[25px]">
                                {meal.description}
                            </p>
                            <div className="flex gap-8 items-start text-(--black)">
                                <span>
                                    <strong>Cooking Time</strong>
                                    <p>{meal.cooking_time}</p>
                                </span>
                                <span>
                                    <strong>Servings</strong>
                                    <p>{meal.serving}</p>
                                </span>
                                <span>
                                    <strong>Cuisine</strong>
                                    <p>{meal.cuisine}</p>
                                </span>
                            </div>
                        </div>
                    </span>
                </div>
                <strong className="text-[25px] ms-[15px] mt-[20px] text-(--black)">
                    Similar Dishes
                </strong>
                <Carousel />
                <strong className="text-[25px] ms-[15px] text-(--black)">Reviews</strong>
                <div className="text-(--black)">
                    {reviews.length == 0 ? (
                        <div>No reviews</div>
                    ) : (
                        reviews.map((review) => {
                            return (
                                <div key={review._id}>
                                    <div className="flex">
                                        <div className="flex flex-row mb-[25px] mt-5">
                                            <span className="inline-block h-[75px] rounded-[50px] me-[20px] text-base/[75px] w-[75px] text-center bg-(--white) text-[1.5em] font-bold cursor-pointer">
                                                {review.user.name[0]}
                                            </span>
                                            <div className="py-[5px]">
                                                <strong className="inline-block mb-[10px] cursor-pointer hover:underline">
                                                    {review.user.name}
                                                </strong>
                                                <p className="hover:underline cursor-pointer">
                                                    @{review.user.username}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="flex items-center mt-5 ms-5 border-l border-l-(--border-color) h-[75px]">
                                            <strong className="mx-5">Rated:</strong>
                                            {stars}
                                        </span>
                                    </div>
                                    <div>{review.content}</div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}
