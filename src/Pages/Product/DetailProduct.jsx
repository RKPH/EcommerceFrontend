import React, { useState, useEffect , useRef, useCallback } from "react";
import axios   from "axios";
import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {useDispatch} from "react-redux";
import {updateCart} from "../../Redux/CartSlice.js";
import SliceOfProduct from "../../Components/SliceOfProduct.jsx";

import Rating from "@mui/material/Rating";

import { Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
    import Typography from '@mui/material/Typography';
import gif from "../../../public/loading.gif";

const DetailProduct = () => {
    const { id } = useParams(); // Get the product ID from the route
    const user = useSelector((state) => state.auth.user); // Redux state for the logged-in user
    const [product, setProduct] = useState(null); // Initialize state for a single product
    const [error, setError] = useState(null); // To handle and display errors
    const [error2, setError2] = useState(null); // To handle and display errors
    const [error3, setError3] = useState(null); // To handle and display errors
    const [loading, setLoading] = useState(true); // Loading state
    const [loading2, setLoading2] = useState(true); // Loading state
    const [loading3, setLoading3] = useState(true); // Loading state
    const [value, setValue] = useState(1); // Quantity state
    const [mainImage, setMainImage] = useState(""); // State to handle main image

    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const sessionRecommendedProductsRef = useRef([]); // Store recommendations (no re-render)
    const [uiRecommendedProducts, setUiRecommendedProducts] = useState([]);

    //review and rating
    const [userRating, setUserRating] = useState(0); // State for user rating
    const [userReview, setUserReview] = useState(""); // State for user review
    const dispatch = useDispatch();

    console.log("User ", user)
    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const response = await AxiosInstance.normalAxios.get(`/products/${id}`);
            console.log("Response Data:", response?.data); // Log for debugging
            const fetchedProduct = response?.data?.data;

            setProduct(fetchedProduct); // Set product state
            setMainImage(fetchedProduct?.MainImage); // Set the default main image

            console.error("Error fetching product:", error.message || error);
            setError(error?.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };
    const fetchSessinBaseRecommendedProducts = async (type) => {
        setLoading2(true); // Start loading before the request

        try {
            const request = {
                user_id: user?.user_id || "314124", // Assuming user_id is available in your component
                product_id: id, // Assuming product_id is available in your component
                event_type: type
            };

            console.log("Request:", request); // Log for debugging

            // Pass request directly as the request body
            const response = await AxiosInstance.normalAxios.post(`/products/recommendations`, request);

            console.log("Recommended Products 2:", response?.data?.data); // Log for debugging
            setError2(null); // Clear any previous errors
            sessionRecommendedProductsRef.current = response.data;
            setUiRecommendedProducts(response?.data?.data); // Set recommended products
        } catch (error) {
            console.error("Error fetching recommended products:", error?.message || error);
            setError2(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading2(false); // Stop loading in both success and error cases
        }
    };
    // Dummy reviews data


    // Initialize reviews with dummy data
    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await AxiosInstance.normalAxios.get(`/reviews/${id}/reviews`);

                if (data.reviews.length > 0) {
                    const formattedReviews = data.reviews.map(review => ({
                        id: review._id,
                        name: review.name,
                        rating: review.rating,
                        comment: review.comment,
                        date: new Date(review.date).toISOString().split("T")[0] // Format date
                    }));

                    setReviews(formattedReviews);
                }
            } catch (error) {
                console.error("Error fetching reviews, using dummy data:", error);
            }
        };

        fetchReviews();
    }, [id]);
    // Handle review submission
    const handleSubmitReview = async () => {
        if (!user) {
            toast.error("You must be logged in to submit a review.");
            return;
        }
        if (userRating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        if (!userReview) {
            toast.error("Please enter a review.");
            return;
        }

        const newReview = {
            id: reviews.length + 1, // Temporary ID for dummy
            name: user.name || "Anonymous",
            rating: userRating,
            comment: userReview,
            date: new Date().toISOString().split("T")[0]
        };

        setReviews([...reviews, newReview]); // Add to UI immediately

        // Send to backend
        try {
            await AxiosInstance.authAxios.post(`/reviews/${id}/add`, newReview);
            toast.success("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Error submitting review, but added locally.");
        }

        setUserRating(0);
        setUserReview("");
    };

    const fetchRecommendedProducts = async () => {
        setLoading3(true); // Start loading before the request
        try {
            const response = await AxiosInstance.normalAxios.post(`/products/predict/${id}`);
            console.log("Recommended Products:", response.data.data); // Log for debugging
            setError3(null); // Clear any previous errors
            setRecommendedProducts(response?.data?.data); // Set recommended products
        } catch (error) {
            console.error("Error fetching recommended products:", error.message || error);
            setError3(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading3(false); // Stop loading in both success and error cases
        }
    };


    // Track user behavior
    const trackBehavior = async (id,product_name, event_type) => {
        try {
            const sessionId = user.sessionID;
            const userId = user?.id || user?.user?.id;

            if (!sessionId || !userId) {
                console.error("Session ID or User ID is missing!");
                return;
            }

            await AxiosInstance.authAxios.post("/tracking", {
                sessionId,
                user: userId,
                productId: id,
                product_name: product_name,
                behavior: event_type,
            });
            console.log("View behavior tracked successfully");
        } catch (error) {
            console.error("Error tracking view behavior:", error);
        }
    };


    useEffect(() => {
        const initialize = async () => {
            try {
                // Clear previous data before fetching new data
                setProduct(null);
                setRecommendedProducts([]);
                setUiRecommendedProducts([]);
                setError(null);
                setError2(null);
                setError3(null);
                setMainImage("");
                setLoading(true);
                setLoading2(true);
                setLoading3(true);

                window.scroll(0, 0); // Scroll to the top of the page

                // Fetch product details first
                fetchProduct();
                fetchSessinBaseRecommendedProducts("view")
                fetchRecommendedProducts()

            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };

        initialize(); // Call the async initialization function
    }, [user, id]); // Dependency array includes `user` and `id`


    const HandleAddToCart = useCallback(
        async (product_name) => {
            if (!user) {
                toast.error("You must be logged in to add items to the cart.");
                return;
            }

            try {
                const data = {
                    productId: id,
                    quantity: value,
                };

                const request = {
                    user_id: user?.user_id, // Assuming user_id is available in your component
                    product_id: id, // Assuming product_id is available in your component
                    event_type: "cart",
                };

                console.log("Request:", request); // Log for debugging

                const response = await AxiosInstance.authAxios.post(`/cart/add`, data);
                console.log("Add to Cart Response:", response.data);
                dispatch(updateCart(response.data.Length));
                toast.success("Product added to your cart successfully!", {
                    className: "toast-success",
                    style: { backgroundColor: "green", color: "white" },
                });

                trackBehavior(id, product_name, "cart");
            } catch (error) {
                console.error("Error adding product to cart:", error.response || error);
                toast.error(
                    error.response?.data?.message || "Failed to add product to the cart."
                );
            }
        },
        [
            user,
            product,
            id,
            value,
            dispatch,
            trackBehavior,
        ]
    );

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


    // Conditional rendering
    if (loading) return <div className="w-full min-h-screen flex bg-white mt-40 justify-center  md:px-6 lg:px-[100px] 2xl:px-[200px]">
        <div className="w-full flex  justify-center ">
            <img src={gif} alt="loading" className="w-20 h-20"/>
        </div>
    </div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex flex-col  md:px-6 lg:px-[100px] 2xl:px-[200px]">
            <div className="w-full mb-5 px-4 py-4 md:px-0">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        Home
                    </Link>
                    <Link
                        to={`/products/type/${product.type}`}
                        style={{textDecoration: 'none', color: 'inherit'}}>{product.type}</Link>
                    <Typography color={"text.primary"}>{product.name}</Typography>
                </Breadcrumbs>
            </div>

            <div className="w-full flex flex-col gap-y-4 md:flex-row mb-10 bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                {/* Main Image Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="w-full h-[300px] md:h-[430px] overflow-hidden rounded-xl">
                        <img
                            src={mainImage}
                            alt={product?.name}
                            className="h-full w-full object-contain rounded-xl border-2 border-gray-200 shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
                        />
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="w-full md:w-1/2 h-full flex flex-col px-5 md:px-12">
                    {product ? (
                        <div className="w-full">
                            {/* Product Name and Price */}
                            <div className="flex w-full flex-col gap-y-4 mb-4">
                                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight">{product.name}</h1>
                                <div className="flex items-center gap-x-3 text-gray-500">
                                    <Rating name="half-rating-read" size="small" defaultValue={product.rating} precision={0.5} readOnly />
                                    <span>({reviews.length})</span>
                                </div>
                                <p className="text-3xl font-semibold text-red-600">${product.price.toLocaleString()}</p>
                                <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-[1px] bg-gray-200 my-4"></div>

                            {/* Quantity and Add to Cart */}
                            <div className="flex items-center justify-between gap-x-6 my-4 py-3">
                                <div className="flex items-center justify-between w-full lg:w-1/3 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={decrementQuantity}
                                        className="w-1/3 h-12 flex justify-center items-center text-2xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        -
                                    </button>
                                    <div className="w-1/3 h-12 flex justify-center items-center border-l border-r border-gray-300 text-xl text-gray-800">
                                        {value}
                                    </div>
                                    <button
                                        onClick={incrementQuantity}
                                        className="w-1/3 h-12 flex justify-center items-center text-2xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => HandleAddToCart(product.name)}
                                    className="w-full lg:w-1/2 h-12 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-500 transition-colors duration-200"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Product not found</p>
                    )}
                </div>
            </div>


            <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                <h1 className="text-xl font-bold">You may also like</h1>
                {
                    error2 && <div>{error2}</div>
                }
                <SliceOfProduct products={uiRecommendedProducts} TrackViewBehavior={trackBehavior} isLoading={loading2}/>
            </div>

            <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                <h1 className="text-xl font-bold">Simalarity products</h1>
                {
                    error3 && <div>{error3}</div>
                }

                <SliceOfProduct products={recommendedProducts} TrackViewBehavior={trackBehavior} isLoading={loading3}/>

            </div>


                {/* Reviews & Ratings Section */}
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                    <h1 className="text-xl font-bold mb-4">Customer Reviews</h1>

                    {/* Review Form */}
                    <div className="mb-8 border-b pb-6">
                        <h2 className="text-lg font-semibold mb-4">Write a Review</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Your Rating:</span>
                                <Rating
                                    name="user-rating"
                                    value={userRating}
                                    onChange={(event, newValue) => setUserRating(newValue)}
                                    precision={0.5}
                                />
                            </div>
                            <textarea
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Write your review here..."
                                rows="4"
                            />
                            <button
                                onClick={handleSubmitReview}
                                className="bg-red-500 text-white px-6 py-2 rounded-md self-end hover:bg-red-600"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center text-gray-500">
                                <p>No reviews available.</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="border-b pb-4 hover:bg-gray-50 transition-all duration-200 ease-in-out">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {/* User Avatar */}
                                            <img
                                                src={user?.avatar || "default-avatar.png"}
                                                alt={review.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            <span className="font-semibold text-gray-800">{review.name}</span>
                                            <Rating
                                                name="read-only"
                                                value={review.rating}
                                                readOnly
                                                precision={0.5}
                                                size="small"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                </div>

        </div>
    );
};

export default DetailProduct;
