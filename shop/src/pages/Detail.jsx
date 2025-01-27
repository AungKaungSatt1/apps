import { useContext, useEffect, useState } from "react";
import { getProduct, putCart } from "../libs/fetcher";
import DetailCard from "../components/Detail-card";
import { useParams } from "react-router-dom";
import "../style/Detail.css";
import { AppContext } from "../Template/ThemedApp";

export default function Detail() {
	const { setCartData, setToast } = useContext(AppContext);
	const { id } = useParams();
	const [product, setProduct] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const setCart = _id => {
		product.cart = true;
		setCartData(product);
		putCart(_id);
		setToast("Added to Cart");
	};

	useEffect(() => {
		(async () => {
			await getProduct(id).then(data => {
				setProduct(data);
				setIsLoading(false);
			});
		})();
	}, []);

	return (
		<div className='container'>
			{isLoading ? <div>Loading...</div> : <DetailCard product={product} setCart={setCart} />}
		</div>
	);
}
