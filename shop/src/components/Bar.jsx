import { useContext, useState } from "react";
import { FaPlus, FaRegTrashAlt, FaShoppingCart, FaFilter } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../Template/ThemedApp";
import { removeCart } from "../libs/fetcher";

export default function Bar({ setCloth, setFood, setAccessory }) {
	const { cartData, setCartData, setToast, auth } = useContext(AppContext);
	const [cart, putCart] = useState(false);
	const [filter, putFilter] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const image_URL = import.meta.env.VITE_PRODUCTS_IMAGES_URL;

	const removeFromCart = _id => {
		const update = cartData.map(data => {
			if (data._id === _id) {
				data.cart = false;
			}

			return data;
		});

		setCartData(update);
		removeCart(_id);
		setToast("Removed from Cart");
	};

	return (
		<>
			<div className='bar'>
				<span style={{ fontSize: "1.2em" }}>
					{pathname === "/" ? "Latest Items" : "Items"}
				</span>
				<div>
					{pathname === "/" ? (
						<Link className='bar-item' onClick={() => navigate("/shop")}>
							Go To Market
						</Link>
					) : (
						<div></div>
					)}
					<Link
						style={pathname === "/" ? {} : { marginLeft: 100 }}
						className='bar-item'
						onClick={() =>
							auth ? navigate(`/users/order-history/${auth._id}`) : navigate("/login")
						}>
						Order History
					</Link>
				</div>
				<div>
					<span
						title='Post your Item'
						className='post-item'
						onClick={() => {
							auth ? navigate(`/shop/post-item/${auth._id}`) : navigate("/login");
						}}>
						<span className='tooltip-postitem'>Post Item</span>
						<FaPlus style={{ marginRight: 5 }} size='1.2em' />
					</span>
					{pathname === "/shop" && (
						<span
							title='Filter'
							className='filter'
							onClick={() => {
								!filter ? putFilter(true) : putFilter(false);
							}}>
							<span className='tooltipfilter'>Filter</span>
							<FaFilter size='1.1em' style={{ marginRight: 5 }} />
						</span>
					)}
					<span
						title='Cart'
						className='cart'
						onClick={() => {
							cart ? putCart(false) : putCart(true);
						}}>
						<span className='tooltipcart'>Cart</span>
						<FaShoppingCart style={{ marginRight: 5 }} size='1.2em' />
					</span>
				</div>
			</div>
			{cart && (
				<div
					className='cart-dropdown'
					style={
						pathname === "/"
							? { right: "1%", top: "110%" }
							: { right: "1%", top: "25%" }
					}>
					{cartData
						? cartData
								.filter(data => data.cart === true)
								.map(data => {
									return (
										<div className='cart-item' key={data._id}>
											{data.photo && (
												<div
													className='cart-item-img'
													style={{
														background: `url("${
															data.photo && image_URL
														}/${data.photo}") center/cover`,
													}}></div>
											)}
											<div className='cart-item-content'>
												<p className='cart-item-title'>{data.name}</p>
												<div className='cart-item-price'>{data.price}</div>
												<div className='btn-group'>
													<button className='cart-buy-btn'>
														<FaPlus size='1.3rem' />
														<span className='tooltiptext1'>Buy</span>
													</button>
													<button
														className='cart-del-btn'
														onClick={() =>
															auth
																? removeFromCart(data._id)
																: navigate("/login")
														}>
														<FaRegTrashAlt size='1.3rem' />
														<span className='tooltiptext2'>Remove</span>
													</button>
												</div>
											</div>
										</div>
									);
								})
						: "No Item in the Cart"}
				</div>
			)}
			{filter && (
				<div className='filter-dropdown'>
					<div
						onClick={() => {
							navigate("/shop");
							setCloth(false);
							setAccessory(false);
							setFood(false);
						}}>
						All
					</div>
					<div
						onClick={() => {
							navigate("/shop?filter=cloth");
							setCloth(true);
						}}>
						Cloth
					</div>
					<div
						onClick={() => {
							navigate("/shop?filter=food");
							setFood(true);
						}}>
						Food
					</div>
					<div
						onClick={() => {
							navigate("/shop?filter=accessory");
							setAccessory(true);
						}}>
						Accessory
					</div>
				</div>
			)}
		</>
	);
}
