import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

let current_img = 1;

export default function Carousel() {
	const [product_count, setProductCount] = useState(1);

	useEffect(() => {
		document.getElementById("name").textContent = ` - ${product_count}`;
	}, [product_count]);

	const nextSilde = () => {
		document.getElementById(`img-${current_img}`).style.display = "none";
		current_img++;
		console.log(current_img);
		if (current_img > 4) current_img = 1;
		document.getElementById(`img-${current_img}`).style.display = "block";
		setProductCount(product_count + 1);
		if (product_count == 4) setProductCount(1);
	};

	const prevSilde = () => {
		document.getElementById(`img-${current_img}`).style.display = "none";
		current_img--;
		if (current_img < 1) current_img = 4;
		document.getElementById(`img-${current_img}`).style.display = "block";
		setProductCount(product_count - 1);
		if (product_count == 1) setProductCount(4);
	};

	return (
		<>
			<div className='carousel'>
				<div className='slide-container'>
					<a
						onClick={() => {
							prevSilde();
						}}
						style={{ cursor: "pointer" }}>
						<IoIosArrowBack
							size='3em'
							className='back-arrow'
							style={{ color: "var(--secondary-color)" }}
						/>
					</a>
					<a
						onClick={() => {
							nextSilde();
						}}
						style={{ cursor: "pointer" }}>
						<IoIosArrowForward
							size='3em'
							className='next-arrow'
							style={{ color: "var(--secondary-color)" }}
						/>
					</a>
					<div className='img-1' id='img-1'></div>
					<div className='img-2' id='img-2'></div>
					<div className='img-3' id='img-3'></div>
					<div className='img-4' id='img-4'></div>
				</div>
			</div>
			<span className='product-about'>
				Product Name <span id='name'></span>
			</span>
		</>
	);
}
