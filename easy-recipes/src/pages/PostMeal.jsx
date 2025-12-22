import { Crop, Folder, X } from "phosphor-react";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactCrop, { convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { RecipeContext } from "../Templates/DynamicPage";
import { uploadMeal } from "../libs/fetcher";

export default function PostMeal() {
    const { auth } = useContext(RecipeContext);
    const nameRef = useRef();
    const typeRef = useRef();
    const imgRef = useRef();
    const cropImgRef = useRef();
    const stepsRef = useRef();
    const servingsRef = useRef();
    const timeRef = useRef();
    const cuisineRef = useRef();
    const [src, setSrc] = useState("");
    const [cropSrc, setCropSrc] = useState("");
    const [crop, setCrop] = useState("");
    const types = ["Lunch", "Breakfast", "Dinner", "Snacks", "Desserts"];
    const navigate = useNavigate();
    const cuisines = ["American", "Japanese", "Italian"];

    console.log(auth);

    const selectImage = () => {
        setSrc(URL.createObjectURL(imgRef.current.files[0]));
        imgRef.current.file = imgRef.current.files[0];
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

            imgRef.current.file = file;
        });
        const base64Img = canvas.toDataURL("image/jpeg");
        setSrc(base64Img);
        setCropSrc("");
    };

    const onImageLoad = () => {
        const crop = {
            unit: "%",
            width: 25,
            height: 25,
            x: 0,
            y: 0,
        };
        setCrop(crop);
    };

    return (
        <>
            {cropSrc && (
                <div className="fixed -top-20 w-full h-[118%] bg-[rgb(0,0,0,25%)] z-1">
                    <div className="block mx-auto w-fit rounded-[10px] border border-(--border-color) mt-[10%] bg-(--white)">
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: "1.2em",
                                padding: 10,
                                borderBottom: "1px solid #dbdbdb",
                                textAlignLast: "end",
                            }}
                        >
                            <X style={{ cursor: "pointer" }} onClick={() => setCropSrc(null)} />
                        </div>
                        <div className="h-auto">
                            <div className="mx-auto">
                                <ReactCrop
                                    crop={crop}
                                    ruleOfThirds
                                    onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
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
            <form
                className="mt-[120px] w-[70%] mx-auto p-[40px] bg-(--white) border border-(--border-color) rounded-[20px]"
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append("name", nameRef.current.value);
                    formData.append("type", typeRef.current.value);
                    formData.append("steps", stepsRef.current.value);
                    formData.append("cuisine", cuisineRef.current.value);
                    formData.append("servings", servingsRef.current.value);
                    formData.append("time", timeRef.current.value);
                    if (imgRef.current.file) {
                        const file = imgRef.current.file;
                        const fileName =
                            file.type === "image/png"
                                ? `${auth._id}_Meal(${auth.mealsCount + 1}).png`
                                : `${auth._id}_Meal(${auth.mealsCount + 1}).jpg`;
                        formData.append("photo", file, fileName);
                    }
                    if (!auth) {
                        navigate("/login");
                    } else {
                        await uploadMeal(auth._id, formData);
                        navigate("/");
                    }
                }}
            >
                <p className="text-[30px] text-center font-bold text-(--black)">Post Meal</p>
                <p className="opacity-50 text-center text-(--black)">
                    You don’t have to write a lot of things if you prepare a video
                </p>
                <div className="flex-col mt-[15px]">
                    <label className="font-bold text-[20px] text-(--black)" htmlFor="name">
                        Name and Photo
                    </label>
                    <div className="flex py-[10px] px-[15px] bg-(--white) border border-(--border-color) text-(--black) rounded-[8px] mt-[10px]">
                        <input
                            className="w-full"
                            type="text"
                            name="mealname"
                            placeholder="Name"
                            id="name"
                            ref={nameRef}
                        />
                        <label htmlFor="file" className="cursor-pointer">
                            <Folder size="2em" />
                        </label>
                        <input
                            type="file"
                            className="hidden"
                            id="file"
                            name="img"
                            ref={imgRef}
                            onChange={() => selectImage()}
                        />
                    </div>
                </div>
                {src && (
                    <div className="mt-[20px]">
                        <div className="flex justify-between border-b border-b-(--border-color) pb-[5px]">
                            <span className="text-[20px] text-(--black) font-bold">Photo</span>
                            <div className="flex justify-around w-[10%] [&>*]:cursor-pointer">
                                <span onClick={() => setCropSrc(src)}>
                                    <Crop size="1.5em" className="text-(--black)" />
                                </span>
                                <span style={{ fontWeight: 700 }} onClick={() => setSrc(null)}>
                                    <X size="1.5em" className="text-(--black)" />
                                </span>
                            </div>
                        </div>
                        <div>
                            <img src={src} alt="image" className="h-[300px] mx-auto p-[20px]" />
                        </div>
                    </div>
                )}
                <div className="flex-col my-[25px]">
                    <label className="font-bold text-[20px] text-(--black)" htmlFor="type">
                        Recipes and Meals type tags
                    </label>
                    <select
                        className="w-full py-[10px] px-[15px] border border-(--border-color) rounded-[8px] mt-[10px] bg-(--white) text-(--black)"
                        name="type"
                        id="type"
                        ref={typeRef}
                    >
                        {types.map((type) => {
                            return (
                                <option
                                    className="bg-(--white) text-(--black)"
                                    value={type.toLocaleLowerCase()}
                                    key={type}
                                >
                                    {type}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="mb-[25px]">
                    <label className="font-bold text-[20px] text-(--black)" htmlFor="type">
                        Cuisine
                    </label>
                    <select
                        className="w-full py-[10px] px-[15px] border border-(--border-color) rounded-[8px] mt-[10px] bg-(--white) text-(--black)"
                        name="type"
                        id="type"
                        ref={cuisineRef}
                    >
                        {cuisines.map((cuisine) => {
                            return (
                                <option
                                    className="bg-(--white) text-(--black)"
                                    value={cuisine.toLocaleLowerCase()}
                                    key={cuisine}
                                >
                                    {cuisine}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label className="font-bold text-[20px] text-(--black)" htmlFor="steps">
                        Cooking Steps
                    </label>
                    <textarea
                        className="w-full py-[10px] px-[15px] border border-(--border-color) rounded-[8px] mt-[10px] bg-(--white) text-(--black)"
                        type="text"
                        name="mealname"
                        placeholder="Write Your Steps..."
                        id="steps"
                        rows="7"
                        ref={stepsRef}
                    ></textarea>
                </div>
                <div className="my-[25px] flex gap-10">
                    <div>
                        <label htmlFor="time" className="text-[18px] me-[10px] text-(--black)">
                            Cooking Time:
                        </label>
                        <input
                            className="w-[50px] border border-(--border-color) px-[5px] text-[22px] rounded-[5px] bg-(--white) text-(--black)"
                            type="number"
                            name="mins"
                            id=""
                            defaultValue="000"
                            maxLength="999"
                            onKeyPress={(e) => {
                                if (e.target.value.length >= 3) e.preventDefault();
                            }}
                            ref={timeRef}
                        />{" "}
                        mins
                    </div>
                    <div>
                        <label htmlFor="time" className="text-[18px] text-(--black) me-[10px]">
                            Serving:
                        </label>
                        <input
                            className="w-[40px] border border-(--border-color) px-[5px] text-[22px] rounded-[5px] bg-(--white) text-(--black)"
                            type="number"
                            name="mins"
                            id=""
                            defaultValue="00"
                            maxLength="99"
                            onKeyPress={(e) => {
                                if (e.target.value.length >= 2) e.preventDefault();
                            }}
                            ref={servingsRef}
                        />
                    </div>
                </div>
                <button className="w-full bg-(--secondary-color) text-white hover:bg-[#3DC000] cursor-pointer transition duration-500 ease-in-out text-[20px] py-[10px] rounded-[10px]">
                    Post
                </button>
            </form>
        </>
    );
}
