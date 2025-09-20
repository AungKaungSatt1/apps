import { FaFileImage } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineCropFree } from "react-icons/md";
import "../style/Post-Item.css";
import { useContext, useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop } from "react-image-crop";
import { AppContext } from "../Template/ThemedApp";
import "react-image-crop/dist/ReactCrop.css";
import { uploadProduct } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";

export default function PostItem() {
    const { auth } = useContext(AppContext);
    let imgRef = useRef();
    const cropImgRef = useRef();
    const productNameRef = useRef();
    const priceRef = useRef();
    const typeRef = useRef();
    const descriptionRef = useRef();
    const [src, setSrc] = useState("");
    const [cropSrc, setCropSrc] = useState("");
    const [crop, setCrop] = useState("");
    const types = ["Cloth", "Food", "Accessory"];
    const navigate = useNavigate();

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
            blob.name = `${auth._id}_Product(${auth.productCount + 1}).png`;
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
                <div className="crop-image-wrapper">
                    <div className="crop-image-container">
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: "1.2em",
                                padding: 10,
                                borderBottom: "1px solid #dbdbdb",
                                textAlignLast: "end",
                            }}
                        >
                            <RxCross2
                                style={{ cursor: "pointer" }}
                                onClick={() => setCropSrc(null)}
                            />
                        </div>
                        <div className="crop-image">
                            <ReactCrop
                                crop={crop}
                                ruleOfThirds
                                onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
                            >
                                <img
                                    ref={cropImgRef}
                                    src={cropSrc}
                                    alt="Crop"
                                    style={{ maxHeight: "1200px" }}
                                    onLoad={() => onImageLoad()}
                                />
                            </ReactCrop>
                        </div>

                        <button
                            className="crop-btn"
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
                className="post-item-form"
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append("name", productNameRef.current.value);
                    formData.append("price", priceRef.current.value);
                    formData.append("description", descriptionRef.current.value);
                    formData.append("product_type", typeRef.current.value);
                    if (imgRef.current.file) {
                        const file = imgRef.current.file;
                        const fileName =
                            file.type === "image/png"
                                ? `${auth._id}_Product(${auth.productCount + 1}).png`
                                : `${auth._id}_Product(${auth.productCount + 1}).jpg`;
                        formData.append("photo", file, fileName);
                    }
                    await uploadProduct(auth._id, formData);
                    navigate("/");
                }}
            >
                <div style={{ marginBottom: 10, fontSize: "1.2em" }}>Product Name</div>
                <div className="name-input">
                    <input type="text" placeholder="Name" ref={productNameRef} required />
                    <label htmlFor="product-photo">
                        <FaFileImage size="1.2em" style={{ color: "#1a1a1d" }} />
                    </label>
                    <input
                        ref={imgRef}
                        type="file"
                        id="product-photo"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={() => selectImage()}
                    />
                </div>
                {src && (
                    <div className="image-preview">
                        <div className="image-preview-header">
                            <span onClick={() => setCropSrc(src)}>
                                <MdOutlineCropFree />
                            </span>
                            <span style={{ fontWeight: 700 }} onClick={() => setSrc(null)}>
                                <RxCross2 />
                            </span>
                        </div>
                        <div style={{ padding: 20 }}>
                            <img src={src} alt="image" className="image" />
                        </div>
                    </div>
                )}
                <div className="price-input">
                    <div>Product Price</div>
                    <input type="text" placeholder="Price" ref={priceRef} />
                </div>
                <div className="type-input">
                    <span style={{ fontSize: "1.1em", marginBottom: 10, display: "inline-block" }}>
                        Please choose your Product Type
                    </span>
                    <select
                        className="type-select"
                        required
                        ref={typeRef}
                        onChange={(e) => (typeRef.current.value = e.target.value)}
                    >
                        <option value="" disabled>
                            Choose Your Product Type
                        </option>
                        {types.map((data) => (
                            <option key={data} value={data}>
                                {data}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="description-input">
                    <div>Product Description</div>
                    <textarea
                        rows={5}
                        cols={30}
                        placeholder="Description"
                        ref={descriptionRef}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="create-btn" style={{ color: "#fff" }}>
                    Create
                </button>
            </form>
        </>
    );
}
