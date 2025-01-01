import React, { useState, useEffect } from "react";
import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import Rating from "@mui/material/Rating";
import { GetColorName } from 'hex-color-to-color-name';
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
    const {  sessionID, isLoggedid } = useSelector((state) => state.auth);

    const [selectedColor, setSelectedColor] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [recommendedProducts2, setRecommendedProducts2] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    useEffect(() => {
        user && fetchSessinBaseRecommendedProducts();
    },[user])

    console.log("User ", user)
    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const response = await AxiosInstance.publicAxios.get(`/products/${id}`);
            console.log("Response Data:", response?.data); // Log for debugging
            const fetchedProduct = response?.data?.data;

            setProduct(fetchedProduct); // Set product state
            setMainImage(fetchedProduct?.productImage[0]); // Set the default main image

            console.error("Error fetching product:", error.message || error);
            setError(error?.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };
    const fetchSessinBaseRecommendedProducts = async () => {
        setLoading2(true); // Start loading before the request

        try {
            const request = {
                user_id: user?.user_id, // Assuming user_id is available in your component
                product_id: id, // Assuming product_id is available in your component
            };

            console.log("Request:", request); // Log for debugging

            // Pass request directly as the request body
            const response = await AxiosInstance.publicAxios.post(`/products/recommendations`, request);

            console.log("Recommended Products 2:", response?.data?.data); // Log for debugging
            setError2(null); // Clear any previous errors
            setRecommendedProducts2(response?.data?.data); // Set recommended products
        } catch (error) {
            console.error("Error fetching recommended products:", error.message || error);
            setError2(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading2(false); // Stop loading in both success and error cases
        }
    };



    const fetchRecommendedProducts = async () => {
        setLoading3(true); // Start loading before the request
        try {
            const response = await AxiosInstance.publicAxios.post(`/products/predict/${id}`);
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
    // useEffect(() => {
    //     window.scroll(0, 0); // Scroll to the top of the page
    //     fetchProduct();
    //     fetchSessinBaseRecommendedProducts();
    //     fetchRecommendedProducts()
    //
    // }, [id]); // Dependency array includes `id` to refetch if the route changes

    useEffect(() => {
        const initialize = async () => {
            try {
                // Clear previous data before fetching new data
                setProduct(null);
                setRecommendedProducts([]);
                setRecommendedProducts2([]);
                setError(null);
                setError2(null);
                setError3(null);
                setMainImage("");
                setLoading(true);
                setLoading2(true);
                setLoading3(true);

                window.scroll(0, 0); // Scroll to the top of the page

                // Fetch recommendations concurrently
                const [sessionBasedRecommendations, generalRecommendations] = await Promise.all([
                    fetchSessinBaseRecommendedProducts(), // Fetch session-based recommendations
                    fetchRecommendedProducts() // Fetch general recommendations
                ]);

                // Fetch the product details after both recommendations finish
                await fetchProduct();
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };

        initialize(); // Call the async initialization function
    }, [user, id]); // Dependency array includes `user` and `id`


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
    if (loading) return <div className="w-full h-full flex  items-center mt-40 justify-center px-[100px] 3xl:pr[100px] ">
        <div className="w-full h-full flex items-center justify-center ">
            <img src={gif} alt="loading" className="w-20 h-20"/>
        </div>
    </div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex flex-col px-[100px] 3xl:pr[100px] ">
            <div className="w-full  py-10 ">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        Home
                    </Link>
                    <Link
                        to={`/product/${product.category}`}
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        {product.category}
                    </Link>
                    <Typography color="text.primary">{product.type}</Typography>
                </Breadcrumbs>
            </div>
            <div className="w-full flex mb-10 bg-white p-3 py-4 rounded-xl">
                <div className="w-1/2 flex justify-start ">
                    <div className="w-full h-auto flex justify-between">
                        <div className="w-1/3  h-full ">
                            <ul className="h-full w-full flex flex-col  space-y-3">
                                {product?.productImage?.map((image, index) => (
                                    <li key={index} className="w-[250px] h-[167px] border border-gray-200 rounded-xl">
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

                        <div className="w-2/3  h-full ">
                            <img
                                src={mainImage}
                                alt={product?.name}
                                className="w-full h-[530px] object-contain rounded-xl border border-black"
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
                                            className={`w-auto h-10 cursor-pointer mb-3 relative flex items-center gap-x-2 
  border ${selectedColor === color ? "border-black border-2" : "border-gray-100"} 
  px-1 hover:border-black hover:border-2`}
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
                                    <div
                                        className="w-1/3 h-full flex items-center justify-center text-center">{value}</div>
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
                                    Add to wishlist <FavoriteBorderTwoToneIcon fontSize={"small"}
                                                                               className="text-base"/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Product not found</p>
                    )}
                </div>
            </div>

            <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                <h1 className="text-xl font-bold">You may also like</h1>
                {
                    error2 && <div>{error2}</div>
                }
                {loading2 ? (
                    <div className="flex items-center justify-center h-80">
                        <div className="loader"></div>
                        {/* Replace with your custom loader */}
                        <span>Loading recommended products...</span>
                    </div>
                ) : (
                    <ul className="w-full flex gap-x-2 overflow-x-auto custom-scrollbar pb-5">
                        {recommendedProducts2.map((product) => (
                            <Link
                                onClick={() => {
                                    trackViewBehavior(product.product_id); // Use top-level product_id
                                }}
                                to={`/product/${product.product_id}`} // Use top-level product_id
                                className="w-52 flex-shrink-0 border border-gray-300 rounded-lg"
                                key={product.product_id} // Ensure unique key
                            >
                                <div className="w-full h-[140px] bg-gray-200 rounded-[20px] ">
                                    <img
                                        src={product?.productDetails.image[0]} // Primary image
                                        alt={product?.productDetails.name}
                                        className="w-full h-full object-fit rounded-t-[20px]"
                                    />
                                </div>
                                <div className="flex flex-col mt-4 p-2">
                                    <span
                                        className="font-semibold text-base hover:underline">{product.productDetails.name}</span>
                                    <Rating
                                        name="half-rating-read"
                                        defaultValue={2.5} // Placeholder rating
                                        precision={0.5}
                                        readOnly
                                    />
                                    <span className="font-bold text-xl">${product.productDetails.price}</span>
                                </div>
                            </Link>
                        ))}
                    </ul>
                )}
            </div>

            <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                <h1 className="text-xl font-bold">Simalarity products</h1>
                {
                    error3 && <div>{error3}</div>
                }
                {loading3 ? (
                    <div className="flex items-center justify-center h-80">
                        <div className="loader"></div>
                        {/* Replace with your custom loader */}
                        <span>Loading recommended products...</span>
                    </div>
                ) : (
                    <ul className="w-full flex gap-x-2 overflow-x-auto custom-scrollbar pb-5">
                        {recommendedProducts.map((product) => (
                            <Link
                                onClick={() => {
                                    trackViewBehavior(product.product_id); // Use top-level product_id
                                }}
                                to={`/product/${product.product_id}`} // Use top-level product_id
                                className="w-52 flex-shrink-0 border border-gray-300 rounded-lg"
                                key={product.product_id} // Ensure unique key
                            >
                                <div className="w-full h-[140px] bg-gray-200 rounded-[20px] ">
                                    <img
                                        src={product?.productDetails.image[0]} // Primary image
                                        alt={product?.productDetails.name}
                                        className="w-full h-full object-fit rounded-t-[20px]"
                                    />
                                </div>
                                <div className="flex flex-col mt-4 p-2">
                                    <span
                                        className="font-semibold text-base hover:underline">{product.productDetails.name}</span>
                                    <Rating
                                        name="half-rating-read"
                                        defaultValue={2.5} // Placeholder rating
                                        precision={0.5}
                                        readOnly
                                    />
                                    <span className="font-bold text-xl">${product.productDetails.price}</span>
                                </div>
                            </Link>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DetailProduct;
