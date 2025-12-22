import { useLocation, useNavigate } from "react-router-dom";
import "../style/Profile.css";
import { buyItem } from "../libs/fetcher";
import { useContext } from "react";
import { AppContext } from "../Template/ThemedApp";

export default function Products({ product, setCart, image, profile }) {
	const { auth, setToast } = useContext(AppContext);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<div
			className='productCard'
			key={product._id}
			onClick={() => {
				navigate(`/shop/${product._id}`);
			}}>
			{product.photo && (
				<div
					className='productPhoto'
					style={{
						background: `url("${image}") center/cover`,
					}}
					onClick={() => {
						navigate(`/shop/${product._id}`);
					}}></div>
			)}

			<div className='productContent'>
				{pathname !== `/users/${product.owner._id}` && (
					<div
						className='owner-content'
						onClick={e => {
							navigate(`/users/${product.owner._id}`);
							e.stopPropagation();
						}}>
						<span
							className='seller-photo'
							style={
								product.owner.photo
									? { background: `url("${profile}") center/cover` }
									: {}
							}>
							{!product.owner.photo && product.owner.name[0]}
						</span>
						<span>
							<div className='owner-name'>{product.owner.name}</div>
							<div className='owner-username'>@{product.owner.username}</div>
						</span>
					</div>
				)}

				<div className='productName'>{product.name}</div>
				<div className='productPrice'>{product.price}</div>
				<div
					style={{ paddingBottom: 10, borderBottom: "1px solid #ddd", marginBottom: 10 }}>
					<div
						className='productDescription'
						style={pathname !== `/users/${product.owner._id}` ? {} : { height: 170 }}>
						{product.description}
					</div>
				</div>
				<button
					className='buy-btn'
					onClick={e => {
						auth ? buyItem(product._id) : navigate("/login");
						auth && setToast("Item Purchased");
						e.stopPropagation();
					}}>
					Buy
				</button>
				<button
					className='cart-btn'
					onClick={event => {
						auth ? setCart(product._id) : navigate("/login");
						event.stopPropagation();
					}}>
					Add to Cart
				</button>
			</div>
		</div>
	);
}
