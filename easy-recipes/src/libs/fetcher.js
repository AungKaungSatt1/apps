const api = import.meta.env.VITE_API;

export function getCookie(cookieName) {
    let name = cookieName + "=";
    let cookie = document.cookie.split("; ");

    for (let i = 0; i < cookie.length; i++) {
        let c = cookie[i];
        if (c.startsWith(name)) {
            return c.substring(name.length);
        }
    }
}

const token = getCookie("token");

export async function verify() {
    const res = await fetch(`${api}/users/verify`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        return await res.json();
    }

    return false;
}

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

export async function PostLogin(email, password) {
    const res = await fetch(`${api}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (res.ok) {
        const data = await res.json();
        return data.token;
    }

    return false;
}

export async function PostSignUp(email, password) {
    const res = await fetch(`${api}/users/signup`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.ok;
}

export async function uploadMeal(id, body) {
    const res = await fetch(`${api}/meals/post/${id}`, {
        method: "POST",
        body,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) return res.ok;

    return false;
}

export async function getProfile(id) {
    const res = await fetch(`${api}/users/profile/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) return false;

    return await res.json();
}

export async function getUser(id) {
    const res = await fetch(`${api}/users/${id}/settings/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

export async function updateProfileInfo(id, formData) {
    const res = await fetch(`${api}/users/${id}/settings/profile/update-profile`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}
