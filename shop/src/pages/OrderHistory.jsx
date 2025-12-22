import { useEffect, useState } from "react";
import "../style/OrderHistory.css";
import { getOrderHistory } from "../libs/fetcher";
import { useParams } from "react-router-dom";
import OrderHistoryProduct from "../components/OrderHistoryProducts";

export default function OrderHistory() {
	const { id } = useParams();
	const [products, setProducts] = useState([]);
	const [profile, setProfile] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const data = await getOrderHistory(id);
			if (!data) return false;

			const profile_images_URL = import.meta.env.VITE_PROFILE_IMAGES_URL;
			let profile_count = 1;
			data.map(data => {
				if (data.owner.photo) {
					setProfile(
						(profile[
							`profile${profile_count}`
						] = `${profile_images_URL}/${data.owner.photo}`)
					);
					profile_count++;
				}
			});

			setProducts(data);
			setLoading(false);
		})();
	}, []);

	return (
		<div className='container'>
			<h1>Order History</h1>
			<div className='history-list'>
				{loading ? (
					<div>Loading...</div>
				) : (
					products.map(product => {
						return (
							<OrderHistoryProduct
								key={product._id}
								product={product}
								profile={profile}
							/>
						);
					})
				)}
			</div>
		</div>
	);
}
