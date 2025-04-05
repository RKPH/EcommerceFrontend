import { useState, useEffect , useRef, useCallback } from "react";

import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {useDispatch} from "react-redux";
import {updateCart} from "../../Redux/CartSlice.js";
import SliceOfProduct from "../../Components/SliceOfProduct.jsx";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import Rating from "@mui/material/Rating";

import { Link } from 'react-router-dom';

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

    const dispatch = useDispatch();
    // Use useRef to store the user object reference without causing re-renders
    const userRef = useRef(user);

    const fetchAnonymousRecommendedProducts = async () => {


        setLoading2(true);
        try {
            const request = { product_id: id };
            const response = await AxiosInstance.normalAxios.post(`/products/anonymous_recommendations`, request);
            setError2(null);
            sessionRecommendedProductsRef.current = response.data;
            setUiRecommendedProducts(response?.data?.data);
        } catch (error) {
            setError2(error.response?.data?.message || "An error occurred ????");
        } finally {
            setLoading2(false);
        }
    };


    useEffect(() => {
        if (userRef.current !== user) {
            userRef.current = user;
        }
    }, [user]);
    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const response = await AxiosInstance.normalAxios.get(`/products/${id}`);

            const fetchedProduct = response?.data?.data;

            setProduct(fetchedProduct); // Set product state
            setMainImage(fetchedProduct?.MainImage); // Set the default main image


        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };
    const fetchSessinBaseRecommendedProducts = async () => {
        setLoading2(true); // Start loading before the request

        try {
            const request = {
                user_id: user?.user_id  , // Assuming user_id is available in your component
                product_id: id, // Assuming product_id is available in your component
            };


            // Pass request directly as the request body
            const response = await AxiosInstance.normalAxios.post(`/products/recommendations`, request);


            setError2(null); // Clear any previous errors
            sessionRecommendedProductsRef.current = response.data;
            setUiRecommendedProducts(response?.data?.data); // Set recommended products
        } catch (error) {

            setError2(error.response?.data?.message || "An error occurred ????");
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
                        user:review?.user,
                        rating: review.rating,
                        comment: review.comment,
                        date: new Date(review.date).toISOString().split("T")[0] // Format date
                    }));

                    setReviews(formattedReviews);
                }
            } catch (error) {

                setReviews([]); // Clear out reviews if there's an error
                return error
            }
        };

        fetchReviews();
    }, [id]);
    // Handle review submission


    const fetchRecommendedProducts = async () => {
        setLoading3(true); // Start loading before the request
        try {
            const response = await AxiosInstance.normalAxios.post(`/products/predict/${id}`);

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
            const sessionId = user?.sessionID;
            const userId = user?.user_id || user?.user?.user_id;

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
                setValue(1);
                setReviews([]);
                window.scroll(0, 0); // Scroll to the top of the page

                // Fetch product details first
                await fetchProduct();

                if (user && user?.user_id) {
                    // Logged-in user - Fetch session-based recommendations
                    await fetchSessinBaseRecommendedProducts();
                } else {
                    // Anonymous user - Fetch anonymous recommendations
                    await fetchAnonymousRecommendedProducts();
                }

                await fetchRecommendedProducts(); // Popular recommendations or other logic
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };


        initialize(); // Call the async initialization function
    }, [id]); // Dependency array includes `user` and `id`


    const HandleAddToCart = useCallback(
        async (product_name) => {
            if (!user) return toast.error("You must be logged in to add items to the cart.");
            try {
                const data = { productId: id, quantity: value };
                const response = await AxiosInstance.authAxios.post(`/cart/add`, data);
                dispatch(updateCart(response.data.Length));
                toast.success("Product added to your cart!");
                trackBehavior(id, product_name, "cart");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        },
        [user, id, value, dispatch, trackBehavior] // Ensure only relevant dependencies are included
    );


    // Handle quantity changes
    const incrementQuantity = () => {
        setValue(prevValue => Math.min(prevValue + 1, product?.stock || 100));
    };

    const decrementQuantity = () => {
        setValue(prevValue => Math.max(prevValue - 1, 1));
    };


    if (loading) return <div className="w-full min-h-screen flex bg-white mt-40 justify-center  md:px-6 lg:px-[100px] 2xl:px-[200px]">
        <div className="w-full flex  justify-center ">
            <img src={gif} alt="loading" className="w-20 h-20"/>
        </div>
    </div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex flex-col  md:px-6 lg:px-[100px] 2xl:px-[200px]">
            <div className="mb-6 p-4">

                <nav className="text-base text-gray-600">
                    <Link to="/" className="text-blue-600 hover:underline">Home</Link> &gt;{" "}
                    <Link
                        to={`/products/category/${product?.category}`}
                        style={{textDecoration: 'none', color: 'inherit'}}>{product?.category}</Link> &gt;{" "}
                    <Link
                        to={`/products/type/${product?.type}`}
                        style={{textDecoration: 'none', color: 'inherit'}}>{product?.type}</Link> &gt;{" "}
                    <span className="text-gray-800">{product?.name}</span>
                </nav>
            </div>

            <div className="w-full flex flex-col md:flex-row mb-10 bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">

                {/* Main Image Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="w-full flex items-stretch"> {/* Ensures equal height */}
                        <div className="w-full flex items-center justify-center overflow-hidden rounded-xl">
                            <img
                                src={mainImage||"https://media.istockphoto.com/id/1401333142/vector/closed-vertical-paperback-booklet-catalog-or-magazine-mockup.jpg?s=612x612&w=0&k=20&c=7FFo2ih-wr8Nt_X2c1iXgTCXe8765bDedunURQDLMNk="}
                                alt={product?.name}
                                className="h-auto max-h-[450px] w-full object-contain border-2 border-gray-200 shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="w-full md:w-1/2 flex flex-col px-5 md:px-12">
                    {product ? (
                        <div className="w-full flex flex-col h-full">
                            {/* Product Name and Price */}
                            <div className="flex w-full flex-col gap-y-4 mb-4">
                                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight dark:text-gray-100">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-x-3 text-gray-500 dark:text-gray-400">
                                    <Rating
                                        name="half-rating-read"
                                        size="small"
                                        defaultValue={product.rating}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <span>({reviews.length})</span>
                                </div>
                                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                                    ${product.price.toLocaleString()}
                                </p>
                                <div
                                    className="text-base text-gray-600 dark:text-gray-300 mb-4 prose prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2 dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>

                            {/* Divider */}
                            <div className="w-full h-[1px] bg-gray-200 my-1"></div>

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

                            {/* Delivery & Return Info */}
                            <div className="w-full h-[1px] bg-gray-200 my-1"></div>

                            <div className="w-full flex flex-col gap-y-4 border border-gray-200 rounded-lg p-4 shadow-md">
                                {/* Free Delivery */}
                                <div className="flex items-center gap-x-4">
                                    <LocalShippingOutlinedIcon className="text-gray-700" fontSize="large" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Free Delivery</h3>
                                        <p className="text-sm text-gray-600">
                                            <a href="#" className="text-blue-600 underline">
                                                Enter your postal code for Delivery Availability
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full h-[1px] bg-gray-200"></div>

                                {/* Return Delivery */}
                                <div className="flex items-center gap-x-4">
                                    <ReplayOutlinedIcon className="text-gray-700" fontSize="large" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Return Delivery</h3>
                                        <p className="text-sm text-gray-600">
                                            Free 30 Days Delivery Returns.{" "}
                                            <a href="#" className="text-blue-600 underline">Details</a>
                                        </p>
                                    </div>
                                </div>
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
                                            src={review?.user?.avatar || "default-avatar.png"}
                                            alt={review.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        <span className="font-semibold text-gray-800">{review.user.name}</span>
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
