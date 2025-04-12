import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import "../css/app.css";
import { getRecipes } from "../libs/fetcher";
import Cuisine from "../components/Cuisine";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Home() {
	const [meals, setMeals] = useState([]);

	const cuisine = ["American", "Japanese", "Italian"];

	useEffect(() => {
		(async () => {
			const data = await getRecipes();

			setMeals(data);
		})();
	}, []);

	return (
		<>
			<main className='text-2xl text-center'>
				<div className='relative h-[100vh]'>
					<div className='bg-[url(/banner.jpg)] h-[100vh] bg-center bg-cover w-full'></div>
					<div className='w-full h-[100vh] bg-[#03071E90] absolute top-0'></div>
					<div className='absolute top-50 left-[50%] translate-x-[-50%] text-white'>
						<h1 className='text-[2em]'>A DAY WITHOUT</h1>
						<strong className='text-[3em]'>
							A <span className='text-(--secondary-color)'>SPECIAL</span>{" "}
							<span className='text-(--additional-color)'>DISH</span>
						</strong>
						<h1 className='text-[2em]'>IS NOT A DAY</h1>
						<button
							className='bg-(--additional-color) py-4 px-20 text-white rounded-[10px]
						font-bold mt-5 cursor-pointer text-[0.8em]'>
							Start Explore
						</button>
					</div>
				</div>
			</main>
			<div className='flex justify-center flex-col items-center'>
				<h1 className='text-[60px] font-bold my-[50px]'>Trending Cuisines</h1>
				<div className='mx-auto w-[1200px] flex justify-center gap-15'>
					{cuisine.map(cuisine => {
						return <Cuisine cuisine={cuisine} key={nanoid()} />;
					})}
				</div>
				<Link className='text-[1.1em] underline text-(--secondary-color) my-[50px]'>
					Explore other cuisine
				</Link>
			</div>
			<div className='w-full h-full relative'>
				<img src='/Kitchen.jpg' alt='Kitchen Banner' />
				<div className='w-full h-full bg-[#00000030] absolute top-0'></div>
				<div className='text-white w-full absolute top-[50%] left-[50%] translate-[-50%] flex flex-col items-center'>
					<h1 className='text-[4em] font-bold'>Feeling to Share your own Taste?</h1>
					<strong className='mt-[50px] mb-[100px] text-[1.3em]'>
						Share your recipes to let others know what your taste is!
					</strong>
					<button className='py-[15px] px-[60px] bg-(--additional-color-2) text-white text-[1.5em] font-bold rounded-[10px] cursor-pointer'>
						<h1>Post Your Recipe</h1>
					</button>
				</div>
			</div>
			<h1 className='text-center mt-[50px] text-[70px] font-bold'>Stay Healthy!</h1>
			<Carousel />
			<nav className='w-[88%] flex justify-between border-t border-t-(--border-color) pt-[50px] mx-auto pb-[50px]'>
				<strong className='text-[2em]'>Suggested For You</strong>
				<button className='bg-none border border-(--secondary-color) py-[7.5px] px-[30px] text-(--secondary-color) rounded-[5px] cursor-pointer hover:bg-(--secondary-color) hover:text-(--white) duration-500 transition-all ease-in-out text-[1.1em]'>
					Explore Meals
				</button>
			</nav>
			<div className='w-full mx-auto px-[3%] flex flex-row flex-wrap gap-5 justify-center'>
				{meals.map(meal => {
					return <Card meal={meal} key={meal._id} />;
				})}
			</div>
			<Footer />
		</>
	);
}
