import React, { useState, useEffect } from "react";
import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import AxiousInstance from "../../api/axiosInstance.js";

const DetailProduct = () => {
    const { id } = useParams(); // Get the product ID from the route
    const [product, setProduct] = useState(null); // Initialize state for a single product
    const [error, setError] = useState(null); // To handle and display errors
    const [loading, setLoading] = useState(true); // Loading state
    const [value, setValue] = useState(1); // Quantity state
    const { isAuthenticated, user ,sessionID,isLoggedid} = useSelector((state) => state.auth);
    const [message, setMessage] = useState(""); // To display success or error message after adding to cart



    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const response = await AxiosInstance.publicAxios.get(`/products/${id}`);
            console.log("Response Data:", response.data); // Log for debugging
            setProduct(response?.data?.data); // Adjust if API structure differs
        } catch (error) {
            console.error("Error fetching product:", error.message || error);
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };
    const trackViewBehavior = async () => {
        try {
            const sessionId = sessionID; // Retrieve sessionId from Redux store
            const userId = user?.id || user?.user?.id; // Retrieve userId from Redux store

            if (!sessionId || !userId) {
                console.error("Session ID or User ID is missing!");
                return;
            }

            // Make the API call to track behavior
            await AxiousInstance.authAxios.post("/tracking", {
                isLoggedid,
                sessionId,
                user: userId,
                productId: id,
                behavior: "cart",
            });

            console.log("User behavior tracked successfully!");
        } catch (error) {
            console.error("Error tracking view behavior:", error);
        }
    };

    // Fetch product details when the component mounts
    useEffect(() => {
        console.log("Product ID:", id); // Log for debugging
        fetchProduct();
    }, [id]); // Dependency array includes `id` to refetch if the route changes

    // Handle Add to Cart
    const HandleAddToCart = async () => {
        if (!user) {
            setMessage("You must be logged in to add items to the cart.");
            // Optionally redirect to login page
            // navigate('/login');
            return;
        }

        try {
            // Prepare data for the cart
            const data = {
                productId: id,
                quantity: value,
            };

            // Send request to backend to add product to cart
            const response = await AxiosInstance.authAxios.post(`/cart/add`, data);
            console.log("Add to Cart Response:", response.data);
            setMessage("Product added to your cart successfully!");
            trackViewBehavior(); // Track the add to cart behavior
            // Optionally clear the message after 3 seconds
            setTimeout(() => setMessage(""), 3000);

        } catch (error) {
            console.error("Error adding product to cart:", error.response || error);
            setMessage(error.response?.data?.message || "An error occurred while adding the product to the cart.");
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

    // Conditional rendering
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex">
            {/* Product Images */}
            <div className="w-3/4 h-full flex justify-center items-center">
                <ImageList variant="masonry" cols={2} gap={4}>
                    {product?.productImage.map((item, index) => (
                        <ImageListItem key={index}>
                            {item.endsWith(".mp4") ? (
                                <video
                                    src={item}
                                    autoPlay={true}
                                    loading="lazy"
                                    style={{ width: "100%", height: "auto" }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={item} alt={`Product Image ${index}`} loading="lazy" />
                            )}
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>

            {/* Product Details */}
            <div className="w-1/4 h-full py-7 flex px-12">
                {product ? (
                    <div className="w-full">
                        {/* Category and Type */}
                        <div className="flex w-full my-3 gap-x-1 text-base font-normal">
                            <span>{product.category}</span>
                            <span>•</span>
                            <span>{product.type}</span>
                        </div>

                        {/* Product Name and Price */}
                        <div className="flex w-full flex-col gap-y-3">
                            <h1 className="text-3xl font-bold uppercase text-wrap">{product.name}</h1>
                            <p className="text-base font-bold">{product.price.toLocaleString()}₫</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="my-10 w-full flex items-center space-x-5">
                            <h1 className="text-base font-bold uppercase">Quantity</h1>
                            <div className="flex items-center gap- mt-2 bg-gray-300 border p-1">
                                <button
                                    onClick={decrementQuantity}
                                    className="w-6 h-6 text-center flex items-center justify-center bg-white p-2 text-lg hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={value}
                                    readOnly
                                    className="w-8 h-6 text-center bg-gray-300 flex items-center justify-center "
                                />
                                <button
                                    onClick={incrementQuantity}
                                    className="w-6 h-6 text-center flex items-center justify-center bg-white p-2 text-lg hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div>
                            <button
                                onClick={HandleAddToCart}
                                className="bg-black w-full text-white px-4 py-2 mt-2"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Success/Failure Message */}
                        {message && <div className="mt-4 text-center text-sm text-red-500">{message}</div>}
                    </div>
                ) : (
                    <p>Product not found</p>
                )}
            </div>
        </div>
    );
};

export default DetailProduct;
