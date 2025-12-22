import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Template/ThemedApp";

export default function DetailCard({ product, setCart }) {
	const { auth } = useContext(AppContext);
	const navigate = useNavigate();
	let photo;
	let profile;
	if (product.photo) {
		const Image_URL = import.meta.env.VITE_PRODUCTS_IMAGES_URL;
		photo = `${Image_URL}/${product.photo}`;
	}
	if (product.owner.photo) {
		const Image_URL = import.meta.env.VITE_PROFILE_IMAGES_URL;
		profile = `${Image_URL}/${product.owner.photo}`;
	}

	return (
		<div key={product._id} className='product-card'>
			{product.photo && <img src={product.photo && photo} alt='Photo' />}

			<div className='product-content'>
				<div className='owner'>
					<div
						className='owner-profile'
						style={
							product.owner.photo
								? { background: `url("${profile}") center/cover` }
								: {}
						}>
						{!product.owner.photo && product.owner.username[0].toUpperCase()}
					</div>
					<div className='owner-name'>
						{product.owner.name}
						<div
							className='owner-username'
							onClick={() => {
								navigate(`/users/${product.owner._id}`);
							}}>
							@{product.owner.username}
						</div>
					</div>
				</div>
				<h1 className='product-name'>
					{product.name} <span className='price-tag'>{product.price}</span>
				</h1>
				<p className='product-description'>{product.description}</p>
				<div className='btn-group'>
					<button className='buy'>Buy</button>
					<button
						className='cart-2'
						onClick={() => {
							auth ? setCart(product._id) : navigate("/login");
						}}>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}
