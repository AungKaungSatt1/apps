import { useContext, useEffect, useState } from "react";
import Products from "../components/Products";
import Carousel from "../components/Carousel";
import Bar from "../components/Bar";
import { getHomeProducts, putCart } from "../libs/fetcher";
import { AppContext } from "../Template/ThemedApp";
import useWebSocket from "../libs/webSocketClient";

export default function Home() {
	const { setCartData, setToast } = useContext(AppContext);
	const [data, setData] = useState([]);
	const [image, setImage] = useState({});
	const [profile, setProfile] = useState({});

	const setCart = _id => {
		data.map(data => {
			if (data._id === _id) {
				data.cart = true;
			}
		});
		setCartData(data);
		putCart(_id);
		setToast("Added to Cart");
	};

	useEffect(() => {
		(async () => {
			const data = await getHomeProducts();
			if (!data) console.log("fetch error...");

			const profile_images_URL = import.meta.env.VITE_PROFILE_IMAGES_URL;
			const products_images_URL = import.meta.env.VITE_PRODUCTS_IMAGES_URL;
			let count = 1;
			let profile_count = 1;

			data.map(data => {
				if (data.photo) {
					setImage((image[`image${count}`] = `${products_images_URL}/${data.photo}`));
					count++;
				}
				if (data.owner.photo) {
					setProfile(
						(profile[
							`profile${profile_count}`
						] = `${profile_images_URL}/${data.owner.photo}`)
					);
					profile_count++;
				}
			});

			const ws = useWebSocket();
			ws.addEventListener("message", e => {
				const msg = JSON.parse(e.data);
				if (msg.type == "product") {
					setData([msg.product, ...data]);
				}
			});

			setData(data);
			setCartData(data);
		})();
	}, []);

	return (
		<div>
			<Carousel />
			<Bar />
			<ul className='products'>
				{data.map(product => {
					return (
						<Products
							key={product._id}
							product={product}
							image={image}
							setCart={setCart}
							profile={profile}
						/>
					);
				})}
			</ul>
		</div>
	);
}
