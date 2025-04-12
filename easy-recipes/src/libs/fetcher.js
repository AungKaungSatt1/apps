const api = import.meta.env.VITE_API;

export async function getRecipes() {
	const res = await fetch(`${api}/`);

	return await res.json();
}

export async function getMeals(page, limit) {
	const res = await fetch(`${api}/meals?page=${page}&limit=${limit}`);

	return await res.json();
}

export async function getMealDetail(id) {
	const res = await fetch(`${api}/meals/${id}`);

	return await res.json();
}

export async function getReviews(id) {
	const res = await fetch(`${api}/reviews/${id}`);

	return await res.json();
}
