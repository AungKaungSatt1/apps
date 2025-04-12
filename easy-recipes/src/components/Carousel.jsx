import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipes } from "../libs/fetcher";

export default function Carousel() {
	const { id } = useParams();
	const { pathname } = useLocation();
	const [meals, setMeals] = useState([]);
	const search_types = ["Protein", "Diet", "10_mins_meal", "Protein", "Diet", "10_mins_meal"];

	let arr = [];
	meals.filter(meal => {
		if (meal.rating === null) return null;
		let maxValue = meal;
		if (meal.rating > maxValue) maxValue = meal;

		if (maxValue.rating >= 10) arr.push(maxValue);
	});

	useEffect(() => {
		(async () => {
			const data = await getRecipes();

			setMeals(data);
		})();
	}, []);

	return (
		<div
			id='carousel'
			className='flex gap-5 w-full flex-row overflow-x-scroll px-10 -ms-overflow-style-0 my-[50px] scrollbar-hide'>
			{pathname === `/meals/${id}` || pathname == `/meals`
				? arr.map(meal => {
						return (
							<div
								className='cursor-pointer'
								key={search_types + Math.random() * 100000}>
								<div className={`w-[370px] h-[300px] mb-[10px]`}>
									<img
										src={"/Chicken_Tender.jpg"}
										alt={`${meal.name}`}
										className='rounded-[15px]'
									/>
								</div>
								<Link className='text-[1.1em] underline text-(--secondary-color)'>
									{meal.name}
								</Link>
							</div>
						);
				  })
				: search_types.map(type => {
						return (
							<div
								className='p-5 cursor-pointer'
								key={search_types + Math.random() * 100000}>
								<div className={`w-[370px] h-[300px] mb-[10px]`}>
									<img
										src={
											pathname === `/meals/${id}`
												? "/Chicken_Tender.jpg"
												: `/${type}.jpg`
										}
										alt={`${type}`}
									/>
								</div>
								<Link className='text-[1.1em] underline text-(--secondary-color)'>
									{type === "10_mins_meal" ? "10 mins Meals" : type}
								</Link>
							</div>
						);
				  })}
		</div>
	);
}
