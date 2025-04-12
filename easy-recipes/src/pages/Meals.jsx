import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { getMeals } from "../libs/fetcher";
import Card from "../components/Card";

export default function Meals() {
	const [meals, setMeals] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);

	let types = ["Lunch", "Desserts", "Breakfast", "Dinner", "Snacks"];

	useEffect(() => {
		(async () => {
			const data = await getMeals(currentPage, 8);

			if (data.includes(null)) {
				let filtered_data = data.filter(meal => meal !== null);

				setMeals([...meals, ...filtered_data]);
				window.removeEventListener("scroll", () => {
					console.log("End of Page");
				});
			} else {
				setMeals([...meals, ...data]);
			}

			window.addEventListener("scroll", () => {
				const { scrollY } = window;
				const { scrollHeight, clientHeight } = document.documentElement;

				if (scrollY + clientHeight > scrollHeight - 5) setCurrentPage(currentPage + 1);
			});
		})();
	}, [currentPage]);

	return (
		<div className='mt-[70px]'>
			<div className='bg-(--secondary-color) h-[225px] px-10 ps-30 flex justify-evenly flex-col'>
				<input
					type='text'
					placeholder='Search...'
					className='w-[90%] block bg-(--primary-color) px-[20px] rounded-[5px] py-[15px] focus:outline-0'
				/>
				<strong className='text-(--white) text-[24px] block'>Recommended</strong>
				<span className='gap-6 flex underline text-(--white) cursor-pointer'>
					{types.map(type => {
						return <span key={type}>{type}</span>;
					})}
				</span>
			</div>
			<div className='my-[50px] [&>*]:my-5'>
				<strong className='text-[35px] inline-block ms-10 mb-[25px]'>Trending</strong>
				<Carousel />
			</div>

			<div className='relative w-[90%] flex flex-row flex-wrap gap-5 mx-auto border-t border-t-(--border-color) pt-25'>
				<strong className='absolute top-5 text-[2em]'>Meals</strong>
				{meals.map(meal => {
					return <Card meal={meal} key={meal._id} />;
				})}
			</div>
			<Footer />
		</div>
	);
}
