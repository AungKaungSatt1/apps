import { useContext, useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getUser, uploadProfilePhoto, updateProfileInfo } from "../libs/fetcher";
import "../style/Profile.css";
import Products from "../components/Products";
import { AppContext } from "../Template/ThemedApp";

export default function Profile() {
    const { id } = useParams();
    const { auth, setToast } = useContext(AppContext);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [user, setUser] = useState({});
    const [photo, setPhoto] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState({});
    const [edit, setEdit] = useState(false);

    const photoRef = useRef();

    useEffect(() => {
        (async () => {
            const data = await getUser(id);

            const profile_images_URL = import.meta.env.VITE_PROFILE_IMAGES_URL;
            const images_URL = import.meta.env.VITE_PRODUCTS_IMAGES_URL;
            let count = 1;
            data.products.map((data) => {
                if (data.photo) {
                    setImage((image[`image${count}`] = `${images_URL}/${data.photo}`));
                    count++;
                }
            });
            setProducts(data.products);
            setUser(data.user);
            setUsername(data.user.username);
            setName(data.user.name);

            setPhoto(`${profile_images_URL}/${data.user.photo}`);
            setIsLoading(false);
        })();
    }, [id, auth]);

    const changePhoto = async () => {
        if (auth._id !== id) return false;
        photoRef.current.file = photoRef.current.files[0];
        const file = photoRef.current.file;
        const fileName = file.type === "image/png" ? `${id}-photo.png` : `${id}-photo.jpg`;
        const formData = new FormData();
        formData.append("photo", file, fileName);
        await uploadProfilePhoto(auth._id, formData);
        setToast("Photo Updated");
    };

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {auth._id === id && (
                        <div
                            style={{
                                position: "absolute",
                                left: "71%",
                                top: "15%",
                                fontSize: "1.2em",
                            }}
                        >
                            <FaPen
                                onClick={() => (edit ? setEdit(false) : setEdit(true))}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    )}

                    <div className="profile">
                        <span
                            className="photo"
                            style={user.photo ? { background: `url("${photo}") center/cover` } : {}}
                        >
                            {user.photo ? " " : user.name[0] || user.username[0].toUpperCase()}
                            <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
                                <FaPen className="photo-edit" />
                            </label>
                            <input
                                type="file"
                                ref={photoRef}
                                id="profile-upload"
                                onChange={() => changePhoto()}
                                style={{ display: "none" }}
                            />
                            <div className="wrapper"></div>
                        </span>
                        <form
                            className="content"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await updateProfileInfo(auth._id, {
                                    name,
                                    username: username.toLowerCase(),
                                });
                                setToast("Profile Updated");
                                setEdit(false);
                            }}
                        >
                            <div
                                className="name"
                                style={edit ? { width: "110%" } : { width: "200%" }}
                            >
                                {edit ? (
                                    <span>
                                        <strong>Name: </strong>
                                        <input
                                            type="text"
                                            defaultValue={name || ""}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                            }}
                                            className="input-form"
                                        />
                                    </span>
                                ) : (
                                    <span>
                                        <strong>Name: </strong>
                                        {user.name}
                                    </span>
                                )}
                            </div>
                            <div
                                className="username"
                                style={edit ? { width: "110%" } : { width: "200%" }}
                            >
                                {edit ? (
                                    <span>
                                        <strong>Username: </strong>
                                        <input
                                            type="text"
                                            defaultValue={username || ""}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="input-form"
                                        />
                                    </span>
                                ) : (
                                    <span>
                                        <strong>Username: </strong>
                                        {user.username}
                                    </span>
                                )}
                            </div>
                            <strong style={{ fontSize: "1.1em" }}>Social Media</strong>
                            <div
                                className="social-media"
                                style={edit ? { width: "110%" } : { width: "200%" }}
                            >
                                <span style={{ lineHeight: "25px" }}>No Media Links</span>
                            </div>
                            {edit && <button className="submit-btn">Submit</button>}
                        </form>
                    </div>
                    <ul className="products">
                        {products.map((product) => {
                            return <Products key={product._id} product={product} image={image} />;
                        })}
                    </ul>
                </div>
            )}
        </>
    );
}
