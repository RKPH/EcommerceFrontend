import { useState, useEffect, useRef, useCallback } from "react";
import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCart } from "../../Redux/CartSlice.js";
import SliceOfProduct from "../../Components/SliceOfProduct.jsx";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import gif from "../../../public/loading.gif";

// Helper function to clean HTML tags and decode HTML entities
const cleanHtml = (text) => {
    if (!text || typeof text !== "string") return text;

    // Remove HTML tags
    let cleaned = text.replace(/<\/?[^>]+(>|$)/g, "");

    // Decode common HTML entities (including &nbsp; and potentially malformed ones like &mbsp;)
    const entities = {
        "&nbsp;": " ",
        "&mbsp;": " ", // Handle malformed entity as a space
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": "\"",
        "&#39;": "'"
    };

    Object.keys(entities).forEach(entity => {
        cleaned = cleaned.replace(new RegExp(entity, "g"), entities[entity]);
    });

    // Remove any remaining HTML entities that weren't decoded (e.g., &something;)
    cleaned = cleaned.replace(/&[^;]+;/g, " ");

    return cleaned.trim();
};

const DetailProduct = () => {
    const { id } = useParams();
    const user = useSelector((state) => state.auth.user);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [error2, setError2] = useState(null);
    const [error3, setError3] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    const [value, setValue] = useState(1);
    const [mainImage, setMainImage] = useState("");
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const sessionRecommendedProductsRef = useRef([]);
    const [uiRecommendedProducts, setUiRecommendedProducts] = useState([]);
    const dispatch = useDispatch();
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

    const fetchProduct = async () => {
        try {
            const response = await AxiosInstance.normalAxios.get(`/products/${id}`);
            const fetchedProduct = response?.data?.data;
            setProduct(fetchedProduct);
            setMainImage(fetchedProduct?.MainImage);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessinBaseRecommendedProducts = async () => {
        setLoading2(true);
        try {
            const request = {
                user_id: user?.user_id,
                product_id: id,
            };
            const response = await AxiosInstance.normalAxios.post(`/products/recommendations`, request);
            setError2(null);
            sessionRecommendedProductsRef.current = response.data;
            setUiRecommendedProducts(response?.data?.data);
        } catch (error) {
            setError2(error.response?.data?.message || "An error occurred ????");
        } finally {
            setLoading2(false);
        }
    };

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await AxiosInstance.normalAxios.get(`/reviews/${id}/reviews`);
                if (data.reviews.length > 0) {
                    const formattedReviews = data.reviews.map(review => ({
                        id: review._id,
                        name: review.name,
                        user: review?.user,
                        rating: review.rating,
                        comment: review.comment,
                        date: new Date(review.date).toISOString().split("T")[0]
                    }));
                    setReviews(formattedReviews);
                } else {
                    setReviews([]); // No reviews, set to empty array
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error("Error fetching reviews:", error);
                }
                setReviews([]); // Set to empty array for 404 or other errors
            }
        };
        fetchReviews();
    }, [id]);

    const fetchRecommendedProducts = async () => {
        setLoading3(true);
        try {
            const response = await AxiosInstance.normalAxios.post(`/products/predict/${id}`);
            setError3(null);
            setRecommendedProducts(response?.data?.data);
        } catch (error) {
            console.error("Error fetching recommended products:", error.message || error);
            setError3(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading3(false);
        }
    };

    const trackBehavior = async (id, product_name, event_type) => {
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
                window.scroll(0, 0);
                await fetchProduct();
                if (user && user?.user_id) {
                    await fetchSessinBaseRecommendedProducts();
                } else {
                    await fetchAnonymousRecommendedProducts();
                }
                await fetchRecommendedProducts();
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };
        initialize();
    }, [id]);

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
        [user, id, value, dispatch]
    );

    const incrementQuantity = () => {
        setValue(prevValue => Math.min(prevValue + 1, product?.stock || 100));
    };

    const decrementQuantity = () => {
        setValue(prevValue => Math.max(prevValue - 1, 1));
    };

    // Helper function to capitalize the first letter of each word
    const capitalizeWords = (str) => {
        if (!str) return "N/A";
        return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    };

    // Parse description into key-value pairs
    const parseDescription = (description) => {
        if (!description || typeof description !== "string") return [];

        // Clean HTML tags and entities from the description
        const cleanDescription = cleanHtml(description);

        // Check if the description contains multiple commas (indicating key-value pairs)
        const commaCount = (cleanDescription.match(/,/g) || []).length;
        const hasMultipleCommas = commaCount >= 2; // At least 2 commas suggest a key-value pair format

        if (hasMultipleCommas) {
            // Comma-separated format (e.g., "Product: Wallet Muqajankz 28300691, Material: Genuine leather, ...")
            const items = cleanDescription.split(",").filter(item => item.trim() !== "");

            // Parse each item into a key-value pair
            const parsedItems = items.map(item => {
                const [key, ...valueParts] = item.split(":");
                if (!key || !valueParts.length) return null; // Skip malformed items
                return {
                    key: key.trim(),
                    value: valueParts.join(":").trim() // Rejoin in case value contains colons
                };
            }).filter(item => item !== null); // Remove invalid items

            return parsedItems.length > 0 ? parsedItems : [{ key: "", value: cleanDescription.replace(/\n/g, "<br />") }];
        } else {
            // Check for newlines (multi-line format or narrative with newlines)
            const lines = cleanDescription.split("\n").filter(line => line.trim() !== "");
            if (lines.length > 1) {
                // Multi-line format: try parsing each line as a key-value pair
                const parsedItems = lines.map((line, index) => {
                    const [key, ...valueParts] = line.split(":");
                    if (!key || !valueParts.length) {
                        // If no colon, treat as part of the previous value or a standalone line
                        if (index > 0 && parsedItems[index - 1]) {
                            parsedItems[index - 1].value += `<br />${line.trim()}`;
                            return null;
                        }
                        return { key: "", value: line.trim() };
                    }
                    return {
                        key: key.trim(),
                        value: valueParts.join(":").trim()
                    };
                }).filter(item => item !== null);

                // If parsing as key-value pairs failed, treat as a narrative with newlines
                if (parsedItems.every(item => item.key === "")) {
                    return [{ key: "", value: cleanDescription.replace(/\n/g, "<br />") }];
                }
                return parsedItems;
            }
            // Single narrative description
            return [{ key: "", value: cleanDescription }];
        }
    };

    // Combine existing details with parsed description for Details section
    const getAllDetails = () => {
        // Existing details (Brand, Category, Type)
        const baseDetails = [
            { key: "Brand", value: product?.brand },
            { key: "Category", value: product?.category },
            { key: "Type", value: product?.type }
        ];

        // Parse description details
        const descriptionDetails = parseDescription(product?.description);

        // Only include description details that have a key (i.e., exclude fallback case)
        const validDescriptionDetails = descriptionDetails.filter(item => item.key !== "");

        // For the Details section, strip HTML tags from values to ensure clean text
        const cleanedDescriptionDetails = validDescriptionDetails.map(item => ({
            key: item.key,
            value: cleanHtml(item.value).replace(/\n/g, " ")
        }));

        // Combine and return all details
        return [...baseDetails];
    };

    if (loading) return (
        <div className="w-full min-h-screen flex bg-white mt-40 justify-center md:px-6 lg:px-[100px] 2xl:px-[200px]">
            <div className="w-full flex justify-center">
                <img src={gif} alt="loading" className="w-20 h-20"/>
            </div>
        </div>
    );
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex flex-col md:px-6 lg:px-[100px] 2xl:px-[200px]">
            <div className="mb-6 p-4">
                <nav className="text-base text-gray-600">
                    <Link to="/" className="text-blue-600 hover:underline">Home</Link> >{" "}
                    <Link
                        to={`/products/category/${product?.category}`}
                        style={{textDecoration: 'none', color: 'inherit'}}>{product?.category}</Link> >{" "}
                    <Link
                        to={`/products/type/${product?.type}`}
                        style={{textDecoration: 'none', color: 'inherit'}}>{product?.type}</Link> >{" "}
                    <span className="text-gray-800">{product?.name}</span>
                </nav>
            </div>

            <div className="w-full flex flex-col md:flex-row mb-8 bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                {/* Main Image Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="w-full flex items-stretch">
                        <div className="w-full flex items-center justify-center overflow-hidden rounded-xl">
                            <img
                                src={mainImage || "https://media.istockphoto.com/id/1401333142/vector/closed-vertical-paperback-booklet-catalog-or-magazine-mockup.jpg?s=612x612&w=0&k=20&c=7FFo2ih-wr8Nt_X2c1iXgTCXe8765bDedunURQDLMNk="}
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
                            </div>

                            <div className="w-full h-[1px] bg-gray-200 my-1"></div>

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

                            <div className="w-full flex flex-col gap-y-4 border border-gray-200 rounded-lg p-4 shadow-md">
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

            <div className="w-full flex flex-col md:flex-row gap-x-3">
                <div className="w-full md:w-2/3 mb-6 bg-white rounded-xl flex flex-col py-4 px-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Description</h1>
                    {product?.description ? (
                        <div className="flex flex-col">
                            {parseDescription(product?.description).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex odd:bg-gray-50 even:bg-gray-100 py-2 hover:bg-gray-200 transition-colors duration-150"
                                >
                                    {item.key ? (
                                        <>
                                            <span className="font-medium text-gray-700 w-40">{item.key}</span>
                                            <span
                                                className="font-normal text-gray-600 break-words"
                                                dangerouslySetInnerHTML={{ __html: item.value }}
                                            />
                                        </>
                                    ) : (
                                        <span
                                            className="font-normal text-gray-600 break-words"
                                            dangerouslySetInnerHTML={{ __html: item.value }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No description available.</p>
                    )}
                </div>

                {/* Product Details (Specifications) Section */}
                <div className="w-full md:w-1/3 mb-6 bg-gray-50 rounded-xl flex flex-col py-4 px-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Details</h1>
                    <div className="flex flex-col">
                        {getAllDetails().map((detail, index) => (
                            <div
                                key={index}
                                className="flex odd:bg-gray-50 even:bg-gray-100 py-2 hover:bg-gray-200 transition-colors duration-150"
                            >
                                <span className="font-medium text-gray-700 w-40">{detail.key}</span>
                                <span className="font-normal text-gray-600 break-words">
                                    {capitalizeWords(detail.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommendation Sections */}
            <div className="w-full mb-6 bg-white rounded-xl flex-col py-4 px-6">
                <h1 className="text-xl font-bold text-gray-800 mb-4">You may also like</h1>
                {error2 && <div className="text-red-600 mb-2">{error2}</div>}
                <SliceOfProduct products={uiRecommendedProducts} TrackViewBehavior={trackBehavior} isLoading={loading2}/>
            </div>

            <div className="w-full mb-6 bg-white rounded-xl flex-col py-4 px-6">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Similarity products</h1>
                {error3 && <div className="text-red-600 mb-2">{error3}</div>}
                <SliceOfProduct products={recommendedProducts} TrackViewBehavior={trackBehavior} isLoading={loading3}/>
            </div>

            {/* Reviews & Ratings Section */}
            <div className="w-full mb-6 bg-white rounded-xl flex-col py-4 px-6">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h1>
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