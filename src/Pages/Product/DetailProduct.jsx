import React, { useState, useEffect } from "react";
import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import Rating from "@mui/material/Rating";
import { GetColorName } from 'hex-color-to-color-name';

const DetailProduct = () => {
    const { id } = useParams(); // Get the product ID from the route
    const [product, setProduct] = useState(null); // Initialize state for a single product
    const [error, setError] = useState(null); // To handle and display errors
    const [loading, setLoading] = useState(true); // Loading state
    const [value, setValue] = useState(1); // Quantity state
    const [mainImage, setMainImage] = useState(""); // State to handle main image
    const { user, sessionID, isLoggedid } = useSelector((state) => state.auth);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const response = await AxiosInstance.publicAxios.get(`/products/${id}`);
            console.log("Response Data:", response.data); // Log for debugging
            const fetchedProduct = response?.data?.data;

            setProduct(fetchedProduct); // Set product state
            setMainImage(fetchedProduct?.productImage[0]); // Set the default main image
        } catch (error) {
            console.error("Error fetching product:", error.message || error);
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };

    // Track user behavior
    const trackViewBehavior = async () => {
        try {
            const sessionId = sessionID;
            const userId = user?.id || user?.user?.id;

            if (!sessionId || !userId) {
                console.error("Session ID or User ID is missing!");
                return;
            }

            await AxiosInstance.authAxios.post("/tracking", {
                isLoggedid,
                sessionId,
                user: userId,
                productId: id,
                behavior: "cart",
            });
        } catch (error) {
            console.error("Error tracking view behavior:", error);
        }
    };

    // Fetch product details when the component mounts
    useEffect(() => {
        fetchProduct();
    }, [id]); // Dependency array includes `id` to refetch if the route changes

    // Handle Add to Cart
    const HandleAddToCart = async () => {
        if (!user) {
            toast.error("You must be logged in to add items to the cart.");
            return;
        }
        if(!selectedColor){
            toast.error("Please select a color");
            return;
        }
        if(product?.size[0]!="string") {
            if(!selectedSize) {
                toast.error("Please select a size");
                return;
            }
        }

        try {
            const data = {
                productId: id,
                quantity: value,
                color: selectedColor,
                size: selectedSize,
            };

            const response = await AxiosInstance.authAxios.post(`/cart/add`, data);
            console.log("Add to Cart Response:", response.data);

            toast.success("Product added to your cart successfully!", {
                className: "toast-success",
                style: { backgroundColor: "green", color: "white" },
            });
            trackViewBehavior();
        } catch (error) {
            console.error("Error adding product to cart:", error.response || error);
            toast.error(error.response?.data?.message || "Failed to add product to the cart.");
        }
    };

    // Handle quantity changes
    const incrementQuantity = () => {
        if (value < (product?.stock || 100)) {
            setValue(value + 1);
        }
    };

    const decrementQuantity = () => {
        if (value > 1) {
            setValue(value - 1);
        }
    };

    // Handle color hover to change main image
    const handleColorHover = (index) => {
        setMainImage(product?.image[index]); // Update the main image based on hovered color index
    };

    // Conditional rendering
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex px-[100px] 3xl:pr[100px] 3xl:pl-[50px]">
            {/* Product Images */}
            <div className="w-1/2 flex justify-start items-center">
                <div className="w-full h-auto flex justify-between">
                    <div className="w-1/3 h-full ">
                        <ul className="h-full w-full flex flex-col items-center space-y-3">
                            {product?.productImage?.map((image, index) => (
                                <li key={index} className="w-fit h-[167px]">
                                    <img
                                        src={image}
                                        alt={`Product Thumbnail ${index + 1}`}
                                        className="w-full h-full object-contain rounded-xl cursor-pointer hover:border-2 hover:border-black  transition duration-300 ease-in-out"
                                        onMouseEnter={() => setMainImage(image)} // Update mainImage on hover
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="w-2/3 h-full ">
                        <img
                            src={mainImage}
                            alt={product?.name}
                            className="w-full h-[530px]  rounded-xl border border-black"
                        />
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="w-1/2 h-full flex px-12">
                {product ? (
                    <div className="w-full">
                        {/* Product Name and Price */}
                        <div className="flex w-full flex-col gap-y-3">
                            <h1 className="text-3xl font-bold uppercase">{product.name}</h1>
                            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly/>
                            <p className="text-2xl font-semibold">{product.price.toLocaleString()}₫</p>
                            <p className="text-base mb-3 wrap whitespace-normal">{product.description}</p>
                        </div>
                        <div className="w-full h-[1px] bg-gray-200 my-3"></div>
                        {/* Colors */}
                        <div className="flex w-full flex-col gap-y-3 my-3">
                            <h1 className="text-lg font-normal">Selected color</h1>
                            <ul className="flex gap-x-3 flex-wrap whitespace-normal ">
                                {product?.color?.map((color, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => handleColorHover(index)} // Change image on hover
                                        onClick={() => setSelectedColor(color)} // Update selected color
                                        className={`w-auto h-10 cursor-pointer mb-3 relative flex items-center gap-x-2 border border-gray-100 px-1
                                          hover:border-2 hover:border-black 
                                          ${selectedColor === color ? "border-2 border-black" : ""}`}
                                    >
                                        <img
                                            src={product?.image[index]}
                                            alt={color}
                                            className="w-1/3 h-full object-cover " // Prevent shrinking of the image
                                        />
                                        <span
                                            className="w-full text-sm whitespace-nowrap">{GetColorName(color)} {product.name}</span> {/* Allow the text to take up remaining space */}
                                    </div>

                                ))}
                            </ul>
                        </div>
                        <div className="w-full h-[1px] bg-gray-200 my-3"></div>
                        {/* Sizes */}
                        {
                            product?.size[0] != "string" && (
                                <>
                                    <div className="flex w-full flex-col gap-y-3 my-3">
                                        <h1 className="text-lg font-normal">Choose size</h1>
                                        <ul className="flex gap-x-2">
                                            {product?.size?.map((sizeItem, index) => (
                                            <li
                                                onClick={() => setSelectedSize(sizeItem)} // Update selected size
                                                key={index}
                                                className={`w-12 h-6 rounded-xs border text-base lowercase bg-gray-200 text-center flex items-center justify-center cursor-pointer ${
                                                    selectedSize === sizeItem ? 'border-black border-2' : ''
                                                } hover:border-2 hover:border-black mb-3`}
                                            >
                                                {sizeItem}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                              <div className="w-full h-[1px] bg-gray-200 my-3"></div>
                            </>
                            )
                        }

                        {/* Add to Cart */}
                        <div className="flex items-center justify-between gap-x-4 my-3 py-3">
                            <div
                                className="flex h-10 w-1/4 items-center justify-center bg-gray-200 border rounded-3xl">
                                <button onClick={decrementQuantity}
                                        className="w-1/3 text-xl font-bold rounded-tl-3xl rounded-b-3xl">
                                    -
                                </button>
                                <div className="w-1/3 h-full flex items-center justify-center text-center">{value}</div>
                                <button onClick={incrementQuantity}
                                        className="w-1/3 h-full text-xl font-bold bg-red-200 rounded-tr-3xl rounded-br-3xl">
                                    +
                                </button>
                            </div>
                            <button
                                onClick={HandleAddToCart}
                                className="bg-black h-10 w-1/3 text-white px-4 py-2 rounded-3xl"
                            >
                                Add to Cart
                            </button>
                            <button
                                className="bg-black h-10 w-1/3 text-white px-4 py-2 rounded-3xl gap-x-3 flex items-center justify-center"
                            >
                                Add to wishlist <FavoriteBorderTwoToneIcon fontSize={"small"} className="text-base"/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Product not found</p>
                )}
            </div>
        </div>
    );
};

export default DetailProduct;
