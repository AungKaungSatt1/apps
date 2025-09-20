import { Crop, PencilSimple, X } from "phosphor-react";
import { useContext, useEffect, useRef, useState } from "react";
import { RecipeContext } from "../Templates/DynamicPage";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ReactCrop, { convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getUser, updateProfileInfo } from "../libs/fetcher";
import { AnimatePresence, motion } from "motion/react";

export default function ProfileSettings() {
    const { id } = useParams();
    const { auth } = useContext(RecipeContext);
    const nameRef = useRef();
    const usernameRef = useRef();
    const bioRef = useRef();
    const photoRef = useRef();
    const cropImgRef = useRef();
    const [btnToast, setBtnToast] = useState(false);
    const [src, setSrc] = useState("");
    const [cropSrc, setCropSrc] = useState("");
    const [crop, setCrop] = useState("");
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        (async () => {
            const data = await getUser(id);

            const profile_images_URL = import.meta.env.VITE_PROFILES_IMAGES_URL;

            setUser(data);
            setUsername(data.username);
            setName(data.name);
            setBio(data.bio);

            if (!data.photo == "") setPhoto(`${profile_images_URL}/${data.photo}`);
            setIsLoading(false);
        })();
    }, [id, auth]);

    const selectImage = () => {
        setSrc(URL.createObjectURL(photoRef.current.files[0]));
        photoRef.current.file = photoRef.current.files[0];
    };

    const cropImageNow = (image, crop) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No 2d Context");

        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = Math.floor(crop.width * pixelRatio * scaleX);
        canvas.height = Math.floor(crop.height * pixelRatio * scaleY);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = "high";
        ctx.save();

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        ctx.translate(-cropX, -cropY);
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight
        );

        canvas.toBlob((blob) => {
            blob.name = `${auth._id}_Product(${auth.mealsCount + 1}).png`;
            const file = new File([blob], blob.name, {
                type: blob.type,
            });

            photoRef.current.file = file;
        });
        const base64Img = canvas.toDataURL("image/jpeg");
        setSrc(base64Img);
        setCropSrc("");
    };

    const onImageLoad = () => {
        const crop = {
            unit: "%",
            width: 100,
            height: 100,
            x: 0,
            y: 0,
        };
        setCrop(crop);
    };

    const updateProfile = async () => {
        const formData = new FormData();
        if (auth._id !== id) return false;
        formData.append("name", nameRef.current.value);
        formData.append("username", usernameRef.current.value);
        formData.append("bio", bioRef.current.value);
        if (photoRef.current.file) {
            const file = photoRef.current.file;
            const fileName = file.type === "image/png" ? `${id}-photo.png` : `${id}-photo.jpg`;
            formData.append("photo", file, fileName);
        } else {
            formData.append("photo", auth.photo);
        }
        await updateProfileInfo(auth._id, formData);
        setBtnToast(false);
    };

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {btnToast && (
                        <AnimatePresence>
                            <motion.div
                                className="fixed flex justify-between items-center top-130 left-80 w-[50%] bg-white shadow border border-(--border-color) ps-[10px] h-[50px] rounded-[10px]"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ y: -5, opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <p>Update Your Profile?</p>
                                <span className="flex gap-5 [&>*]:cursor-pointer h-full items-center">
                                    <a
                                        className="underline text-blue-800"
                                        onClick={() => {
                                            setBtnToast(false);
                                            setSrc("");
                                            nameRef.current.value = auth.name;
                                            usernameRef.current.value = auth.username;
                                            bioRef.current.value = auth.bio;
                                        }}
                                    >
                                        Reset
                                    </a>
                                    <button
                                        className="bg-(--secondary-color) text-white w-full h-full rounded-br-[10px] rounded-tr-[10px] px-[10px]"
                                        onClick={() => updateProfile()}
                                    >
                                        Update
                                    </button>
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    )}
                    {cropSrc && (
                        <div className="fixed -top-20 w-full h-[118%] bg-[rgb(0,0,0,25%)] z-1">
                            <div className="block mx-auto w-fit rounded-[10px] border border-(--border-color) mt-[10%] bg-white">
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "1.2em",
                                        padding: 10,
                                        borderBottom: "1px solid #dbdbdb",
                                        textAlignLast: "end",
                                    }}
                                >
                                    <X
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setCropSrc(null)}
                                    />
                                </div>
                                <div className="h-auto">
                                    <div className="mx-auto">
                                        <ReactCrop
                                            crop={crop}
                                            ruleOfThirds
                                            onChange={(pixelCrop, percentCrop) =>
                                                setCrop(pixelCrop)
                                            }
                                        >
                                            <img
                                                ref={cropImgRef}
                                                src={cropSrc}
                                                alt="Crop"
                                                style={{ maxHeight: "600px" }}
                                                onLoad={() => onImageLoad()}
                                            />
                                        </ReactCrop>
                                    </div>
                                </div>
                                <button
                                    className="w-full text-center bg-(--secondary-color) text-white text-[18px] py-[5px] rounded-b-[5px]"
                                    onClick={() =>
                                        cropImageNow(
                                            cropImgRef.current,
                                            convertToPixelCrop(
                                                crop,
                                                cropImgRef.current.width,
                                                cropImgRef.current.height
                                            )
                                        )
                                    }
                                >
                                    Crop
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex mt-[40px] w-[175vh] ms-[240px] h-full mb-[50px]">
                        <div className="w-[65%] ps-[10%]">
                            <div>
                                <div className="flex items-center justify-between border-b border-b-(--border-color)">
                                    <span className="flex items-center">
                                        <div
                                            className="flex justify-center items-center rounded-[50%] text-center border bg-white border-white py-[1.5em] px-[1.5em] cursor-pointer mb-3 w-[90px] text-[1.6em] h-[90px]"
                                            style={
                                                src || user.photo
                                                    ? {
                                                          background: `url("${
                                                              src ? src : photo
                                                          }") center/cover`,
                                                      }
                                                    : {}
                                            }
                                        >
                                            {src || user.photo ? "" : user.name[0].toUpperCase()}
                                        </div>
                                        <p className="text-[18px] ms-[20px] text-(--black)">
                                            Change Profile Picture
                                        </p>
                                    </span>
                                    <span className="flex gap-3 [&>*]:cursor-pointer">
                                        {src && (
                                            <span
                                                className="text-(--black)"
                                                onClick={() => setCropSrc(src)}
                                            >
                                                <Crop size="2em" />
                                            </span>
                                        )}

                                        <label htmlFor="profile-pic" className="text-(--black)">
                                            <PencilSimple size="2em" />
                                        </label>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="profile-pic"
                                            name="profile-pic"
                                            ref={photoRef}
                                            onChange={() => {
                                                selectImage();
                                                setBtnToast(true);
                                            }}
                                        />
                                    </span>
                                </div>
                                <div className="mt-[20px] mb-[20px]">
                                    <label
                                        htmlFor="name"
                                        className="text-[20px] text-(--black) font-bold"
                                    >
                                        Name
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full bg-white px-[15px] text-[18px] py-[7px] rounded-[5px] mt-[10px]"
                                            name="name"
                                            placeholder="Name"
                                            defaultValue={name || ""}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                setBtnToast(true);
                                            }}
                                            ref={nameRef}
                                        />
                                    </div>
                                </div>
                                <div className="mb-[20px]">
                                    <label
                                        htmlFor="username"
                                        className="text-(--black) text-[20px] font-bold"
                                    >
                                        Username
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full bg-white px-[15px] text-[18px] py-[7px] rounded-[5px] mt-[10px]"
                                            name="username"
                                            placeholder="Username"
                                            defaultValue={username || ""}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                setBtnToast(true);
                                            }}
                                            ref={usernameRef}
                                        />
                                    </div>
                                </div>
                                <div className="mb-[20px]">
                                    <label
                                        htmlFor="bio"
                                        className="text-[20px] text-(--black) font-bold"
                                    >
                                        Bio
                                    </label>
                                    <textarea
                                        className="w-full bg-white px-[15px] text-[18px] py-[7px] rounded-[5px] mt-[10px]"
                                        name="bio"
                                        placeholder="Bio"
                                        rows={3}
                                        defaultValue={bio || ""}
                                        onChange={(e) => {
                                            setBio(e.target.value);
                                            setBtnToast(true);
                                        }}
                                        ref={bioRef}
                                    ></textarea>
                                </div>
                            </div>
                            <div>
                                <p className="mb-[10px] text-[18px] text-(--black)">
                                    Add Other Social Media Platforms
                                </p>
                                <div className="flex gap-5">
                                    <img
                                        src="/Vector.svg"
                                        alt="Facebook"
                                        width="50px"
                                        height="50px"
                                    />
                                    <img
                                        src="/Instagram.svg"
                                        alt="Instagram"
                                        width="50px"
                                        height="50px"
                                    />
                                    <img
                                        src="/BlueSky.svg"
                                        alt="BlueSky"
                                        width="50px"
                                        height="50px"
                                    />
                                    <img
                                        src="/Twitter.svg"
                                        alt="Twitter"
                                        width="50px"
                                        height="50px"
                                    />
                                    <img
                                        src="/Tiktok.svg"
                                        alt="Tiktok"
                                        width="50px"
                                        height="50px"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-[25%] mx-auto bg-white py-[30px] px-[15px] h-[350px] rounded-[10px]">
                            <div className="flex border-b border-b-(--border-color)">
                                <div
                                    className="flex justify-center items-center rounded-[50%] text-center bg-(--primary-color) p-[15px] cursor-pointer mb-3 w-[70px] me-[10px]"
                                    style={
                                        src || user.photo
                                            ? {
                                                  background: `url("${
                                                      src ? src : photo
                                                  }") center/cover`,
                                              }
                                            : {}
                                    }
                                >
                                    {user.photo ? "" : user.name[0].toUpperCase()}
                                </div>
                                <div className="w-full">
                                    <div className="flex gap-5">
                                        <p>{auth.name}</p>
                                        <p className="opacity-70">@{auth.username}</p>
                                    </div>
                                    <p className="overflow-auto h-[50px] text-[14px]">{auth.bio}</p>
                                </div>
                            </div>
                            <div className="flex gap-10 mt-[10px] flex-wrap">
                                <div className="h-[80px] w-[40%] bg-(--primary-color)"></div>
                                <div className="h-[80px] w-[40%] bg-(--primary-color)"></div>
                                <div className="h-[80px] w-[40%] bg-(--primary-color)"></div>
                                <div className="h-[80px] w-[40%] bg-(--primary-color)"></div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
