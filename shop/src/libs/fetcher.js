const api = import.meta.env.VITE_API;
const token = localStorage.getItem("token");

export async function fetchVerify() {
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

export async function postSignup(data) {
    const res = await fetch(`${api}/users/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.ok;
}

export async function postLogin(username, password) {
    const res = await fetch(`${api}/users/login`, {
        method: "POST",
        body: JSON.stringify({ username: username, password: password }),
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

export async function getProducts() {
    const res = await fetch(`${api}/shop`);

    if (res.ok) {
        return await res.json();
    }

    return false;
}

export async function getHomeProducts() {
    const res = await fetch(`${api}/`);

    if (res.ok) {
        return await res.json();
    }

    return false;
}

export async function getProduct(id) {
    const res = await fetch(`${api}/shop/${id}`);
    return await res.json();
}

export async function getUser(id) {
    const res = await fetch(`${api}/users/${id}`);
    if (!res.ok) return false;

    return await res.json();
}

export async function putCart(id) {
    const res = await fetch(`${api}/shop/set-cart/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}

export async function removeCart(id) {
    const res = await fetch(`${api}/shop/remove-cart/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}

export async function getFilter(q) {
    const res = await fetch(`${api}/shop?filter=${q}`);
    if (!res.ok) return false;

    return await res.json();
}

export async function uploadProduct(id, body) {
    const res = await fetch(`${api}/shop/post-item/${id}`, {
        method: "POST",
        body: body,
    });

    return res.ok;
}

export async function uploadProfilePhoto(id, formData) {
    const res = await fetch(`${api}/users/photo/${id}`, {
        method: "POST",
        body: formData,
    });

    return res.ok;
}

export async function getOrderHistory(id) {
    const res = await fetch(`${api}/users/order-history/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) return false;

    return await res.json();
}

export async function updateProfileInfo(id, body) {
    const res = await fetch(`${api}/users/update-profile/${id}`, {
        method: "PUT",
        body: JSON.stringify({ body }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.ok;
}

export async function buyItem(id) {
    const res = await fetch(`${api}/shop/buy-item/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}
