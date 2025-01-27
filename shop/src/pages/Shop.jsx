import { useContext, useEffect, useState } from "react";
import { getFilter, getProducts, putCart } from "../libs/fetcher";
import Products from "../components/Products";
import { AppContext } from "../Template/ThemedApp";
import Bar from "../components/Bar";

export default function Shop() {
	const { setCartData, setToast } = useContext(AppContext);
	const [products, setProducts] = useState([]);
	const [cloth, setCloth] = useState(false);
	const [food, setFood] = useState(false);
	const [accessory, setAccessory] = useState(false);
	const [image, setImage] = useState({});
	const [profile, setProfile] = useState({});

	const setCart = _id => {
		products.map(data => {
			if (data._id === _id) {
				data.cart = true;
			}
		});
		setCartData(products);
		putCart(_id);
		setToast("Added to Cart");
	};

	useEffect(() => {
		(async () => {
			let data = await getProducts();
			if (!data) console.log("fetch error!");

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

			setCartData(data);

			if (food) {
				data = await getFilter("food");
				setAccessory(false);
				setCloth(false);
			}
			if (cloth) {
				data = await getFilter("cloth");
				setFood(false);
				setAccessory(false);
			}
			if (accessory) {
				data = await getFilter("accessory");
				setCloth(false);
				setFood(false);
			}

			setProducts(data);
		})();
	}, [food, cloth, accessory]);

	return (
		<>
			<Bar setCloth={setCloth} setAccessory={setAccessory} setFood={setFood} />
			<div className='products'>
				{products.map(product => {
					return (
						<Products
							key={product._id}
							product={product}
							setCart={setCart}
							image={image}
							profile={profile}
						/>
					);
				})}
			</div>
		</>
	);
}
