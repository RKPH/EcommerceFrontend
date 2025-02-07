import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AxiosInstance from "../api/axiosInstance.js";
import { Carousel } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import SliceOfProduct from "../Components/SliceOfProduct.jsx";
import "./Homepage.css";
import Skeleton from "@mui/material/Skeleton";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {Link} from "react-router-dom";

const Homepage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const [TrendingProducts, setTrendingProducts] = useState([]);
    const [hovered, setHovered] = useState(false);
    const productListRef = useRef(null);
    const [products, setProducts] = useState([]);
    const { user, sessionID } = useSelector((state) => state.auth);
    const [visibleCount, setVisibleCount] = useState(25); // Start with 5 products

    const handleViewMore = () => {
        setVisibleCount((prevCount) => prevCount + 5); // Show 5 more products
    };
    const fetchTypes = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/v1/types/get"
            );
            setTypes(response.data.data);
            console.log("Fetched Types:", response.data.data);
        } catch (error) {
            console.error("Error fetching types:", error.message || error);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/v1/products/all"
            );
            setProducts(response.data.data);
            setIsLoading(false);
            console.log("Fetched Products:", response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error.message || error);
        }
    };

    const fetchTrendingProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/v1/products/trending"
            );
            setTrendingProducts(response.data.data);
            console.log("Fetched Trending Products:", response.data.data);
        } catch (error) {
            console.error("Error fetching trending products:", error.message || error);
        }
    };

    const trackViewBehavior = async (id, product_name, event_type) => {
        try {
            const sessionId = sessionID;
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

    const handleNext = () => {
        if (productListRef.current) {
            const itemWidth = productListRef.current.firstChild?.offsetWidth || 0; // Width of a single item
            const visibleItems = Math.floor(productListRef.current.offsetWidth / itemWidth); // Number of visible items
            const scrollDistance = itemWidth * visibleItems; // Total scroll distance
            productListRef.current.scrollBy({
                left: scrollDistance,
                behavior: "smooth",
            });
        }
    };

    const handlePrevious = () => {
        if (productListRef.current) {
            const itemWidth = productListRef.current.firstChild?.offsetWidth || 0; // Width of a single item
            const visibleItems = Math.floor(productListRef.current.offsetWidth / itemWidth); // Number of visible items
            const scrollDistance = itemWidth * visibleItems; // Total scroll distance
            productListRef.current.scrollBy({
                left: -scrollDistance,
                behavior: "smooth",
            });
        }
    };


    useEffect(() => {
        fetchAllProducts();
        fetchTypes();
        fetchTrendingProducts();
    }, []);

    return (
        <main className="w-full h-full 3xl:px-[200px] md:px-[100px]">
            {/* Top Section */}
            <div className="w-full flex mt-5 gap-x-2">
                {/* Categories Menu */}
                <div className="w-1/4 bg-white flex flex-col gap-y-2">
                    <div className="w-full">
                        <img src="https://c8.alamy.com/comp/2J5EH7W/online-retailers-e-commerce-web-banner-on-red-background-various-shopping-icons-online-shopping-concept-2J5EH7W.jpg"  className="w-full h-full bg-comtain" alt=""/>
                    </div>
                    <div className="w-full">
                        <img src="https://img.freepik.com/free-vector/final-sale-modern-banner-design-template_87202-1262.jpg?t=st=1738330117~exp=1738333717~hmac=4bd3256a2a616ecba75b961538a2d2bbd43e0421f439a07d87619641211454ca&w=1380"  className="w-full h-full bg-comtain" alt=""/>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="w-3/4 flex items-center justify-center">
                    <div className="w-full h-full bg-white">
                        <Carousel
                            indicators={true}
                            slideInterval={3000}
                            onSlideChange={(index) => console.log("onSlideChange()", index)}
                        >
                            <div
                                className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 carousel-inners dark:text-white">
                                <img
                                    src="https://img.freepik.com/free-vector/gradient-11-11-singles-day-shopping-day-landing-page-template_23-2149681763.jpg?t=st=1738330055~exp=1738333655~hmac=362ac4bdaacc737a64c6269ab1f78af5c75caae75183518e2a87426c75d82865&w=1380"
                                    className="bg-contain h-full w-full"
                                />
                            </div>
                            <div
                                className="flex h-full items-center justify-center bg-gray-400 carousel-inners dark:bg-gray-700 dark:text-white">
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/001/937/856/non_2x/paper-art-shopping-online-on-smartphone-sale-promotion-backgroud-banner-for-market-ecommerce-free-vector.jpg"
                                    className="bg-contain h-full w-full"
                                />
                            </div>
                            <div
                                className="flex h-full items-center justify-center bg-gray-400 carousel-inners dark:bg-gray-700 dark:text-white">
                                <img
                                    src="https://redseer.com/wp-content/uploads/2024/09/Blog-Banner-for-Website-Content-23-scaled.jpg"
                                    className="bg-cover h-full w-full"
                                />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>

            <div className="w-full flex gap-x-5  mt-10">
                {/* Voucher Section */}
                <div className="w-1/3 min-h-fit bg-white p-2 rounded-xl flex flex-col">
                    {/* Content Below the Header */}
                    <div className="flex flex-row ">
                        {/* Left Section: Text and Button */}
                        <div className="w-2/3 flex flex-col  gap-4 p-2">
                            <span className="text-lg font-medium hover:text-orange-400 cursor-pointer">
                              Get your voucher now
                            </span>
                            <p className="text-base text-gray-600">
                                Save up to 50% on your next purchase! Limited-time offer.
                            </p>
                        </div>

                        {/* Right Section: Smaller Voucher Icon */}
                        <div className="w-1/3 flex items-center justify-center">
                            <img
                                src="https://img.lazcdn.com/us/domino/52eea06f-896c-4e21-a3b8-9b681e4485a5_VN-276-260.png_300x300q80.png_.avif"
                                alt="Voucher Icon"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Flash Deals Section */}
                <div className="w-1/3 min-h-fit bg-white p-2 rounded-xl flex flex-col">
                    {/* Content Below the Header */}
                    <div className="flex flex-row ">
                        {/* Left Section: Text and Button */}
                        <div className="w-2/3 flex flex-col  gap-4 p-2">
                            <span className="text-lg font-medium hover:text-orange-400 cursor-pointer">
                             Top up
                            </span>
                            <p className="text-base text-gray-600">
                                Cheap Mobile & 4G TopUp!
                            </p>
                        </div>

                        {/* Right Section: Smaller Voucher Icon */}
                        <div className="w-1/3 flex items-center justify-center">
                            <img
                                src="https://img.lazcdn.com/us/domino/81ab3f69-2391-4129-88d7-d285aa0ffd93_VN-276-260.png_300x300q80.png_.avif"
                                alt="Voucher Icon"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Loyalty Program Section */}
                <div className="w-1/3 min-h-fit bg-white p-2 rounded-xl flex flex-col">
                    {/* Content Below the Header */}
                    <div className="flex flex-row ">
                        {/* Left Section: Text and Button */}
                        <div className="w-2/3 flex flex-col  gap-4 p-2">
                            <span className="text-lg font-medium hover:text-orange-400 cursor-pointer">
                             D2F mall
                            </span>
                            <p className="text-base text-gray-600">
                                100% Authentic Products
                            </p>
                        </div>

                        {/* Right Section: Smaller Voucher Icon */}
                        <div className="w-1/3 flex items-center justify-center">
                            <img
                                src="https://img.lazcdn.com/us/domino/901aecdc-e8dc-4bf2-9464-476f799a8200_VN-276-260.png_300x300q80.png_.avif"
                                alt="Voucher Icon"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>

            </div>


            {/* Browse By Types Section */}
            <div className="w-full min-h-fit flex gap-y-5 flex-col bg-white mt-10 p-4 rounded-xl">
                <div className="w-full flex items-center gap-x-2">
                    <div className="w-[20px] h-[40px] bg-red-500 rounded-md"></div>
                    <span className="text-sm text-red-600 font-semibold">Types</span>
                </div>

                <span className="text-xl font-normal">Browse By Types</span>
                <div
                    className="relative w-full"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <ul
                        ref={productListRef}
                        className={`grid grid-rows-2 grid-flow-col auto-cols-max gap-x-0 overflow-x-auto pb-5 ${
                            hovered ? "custom-scrollbar" : "custom-scrollbar-hidden"
                        }`}
                    >
                        {types.map((type) => (
                            <Link
                                to={`/products/type/${type.raw_type}`}
                                key={type._id || type.id}
                                className="flex-shrink-0 w-44 h-48 flex flex-col items-center justify-center border border-gray-300 p-2 cursor-pointer hover:bg-gray-100"
                            >
                                <img
                                    src={type.image || "/placeholder-image.jpg"}
                                    alt={type.name}
                                    className="w-32 h-32 object-contain rounded-lg"
                                />
                                <span className="mt-2 text-base font-semibold text-center">
                        {type.name}
                    </span>
                            </Link>
                        ))}
                    </ul>
                    {hovered && (
                        <button
                            onClick={handlePrevious}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-lg border border-white/50 rounded-full p-2 shadow-lg text-gray-800 hover:bg-white/40 transition-all duration-300"
                        >
                            <ArrowBackIcon />
                        </button>
                    )}
                    {hovered && (
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-lg border border-white/50 rounded-full p-2 shadow-lg text-gray-800 hover:bg-white/40 transition-all duration-300"
                        >
                            <ArrowForwardIcon />
                        </button>
                    )}
                </div>
            </div>


            {/* Trending Products Section */}
            <div className="w-full mt-10">
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                    <div className="w-full flex items-center gap-x-2">
                        <div className="w-[20px] h-[40px] bg-red-500 rounded-md"></div>
                        <span className="text-sm text-red-600 font-semibold">This month</span>
                    </div>
                    <div className="flex items-center gap-x-2 text-black">
                        <span className="text-xl text-black font-normal w-full text-start">
                           Best Selling Products
                        </span>
                    </div>
                    <SliceOfProduct
                        products={TrendingProducts}
                        TrackViewBehavior={trackViewBehavior}
                        isLoading={TrendingProducts.length === 0}
                    />
                </div>
            </div>

            <div className="w-full my-20 bg-white  flex flex-col  justify-center gap-y-5 rounded-xl">
                <span className="text-xl font-normal p-4">Today suggestion</span>
                <ul className="grid grid-cols-7 gap-x-1 gap-y-5  px-4">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <div
                                className="w-full border border-gray-300 rounded-lg p-2"
                                key={index}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={230}
                                    className="rounded-[20px]"
                                />
                                <div className="flex flex-col mt-4">
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="40%" />
                                </div>
                            </div>
                        ))
                        : products.slice(0, visibleCount).map((product) => (
                            <Link
                                onClick={() => {
                                    trackViewBehavior(
                                        product?.productID || product?.product_id,
                                        product?.name || product?.productDetails?.name,
                                        "view"
                                    );
                                }}
                                to={`/product/${product?.productID || product?.product_id}`}
                                className="border w-52 flex-shrink-0 border-gray-300 hover:shadow-lg  "
                                key={product?.productID || product.product_id}
                            >
                                <div className="w-full h-[200px] bg-gray-200">
                                    <img
                                        src={product?.productImage?.[0] || product?.productDetails?.image?.[0]}
                                        alt={product?.name || product?.productDetails?.name}
                                        className="w-full h-full object-fit rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col p-2">
                                <span className="font-normal text-base hover:underline">
                                    {product?.name || product?.productDetails?.name}
                                </span>
                                    <Rating
                                        name="half-rating-read"
                                        size="small"
                                        defaultValue={product?.rating || product?.productDetails?.rating}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <span className="font-bold text-lg">
                                    ${product?.price || product?.productDetails?.price}
                                </span>
                                </div>
                            </Link>
                        ))}
                </ul>

                {/* View More Button */}
                {visibleCount < 50 ? (
                    <div className="flex justify-center my-5">
                        <button
                            onClick={handleViewMore}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            View More
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center my-5 text-gray-500 text-sm font-medium">
                        You have reached the end. Do a search to keep exploring!
                    </div>
                )}

            </div>
        </main>
    );
};

export default Homepage;
