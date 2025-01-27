import { useNavigate } from "react-router-dom";

export default function OrderHistoryProduct({ profile, product }) {
	const navigate = useNavigate();

	return (
		<div className='list-item' onClick={() => navigate(`/shop/${product._id}`)}>
			<div className='product-info'>
				<span
					className='content-owner'
					onClick={e => {
						navigate(`/users/${product.owner._id}`);
						e.stopPropagation();
					}}>
					<span
						className='profile-owner'
						style={
							product.owner.photo
								? { background: `url(${profile})` }
								: { background: "#dedede" }
						}>
						{product.owner.photo || product.owner.name[0].toUpperCase()}
					</span>
					<span>
						<div className='owner-name' style={{ marginBottom: 10 }}>
							{product.owner.name}
						</div>
						<div className='owner-username'>@{product.owner.username}</div>
					</span>
				</span>

				<strong
					style={{
						marginInline: 20,
						fontSize: "1.2em",
					}}>
					{product.name}
				</strong>
				<span style={{ color: "grey" }}>$300</span>
			</div>
			<button onClick={e => e.stopPropagation()} style={{ color: "#fff" }}>
				Report
			</button>
		</div>
	);
}
