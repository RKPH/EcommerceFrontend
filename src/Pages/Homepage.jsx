import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import AxiosInstance from "../api/axiosInstance.js";
import "flowbite/dist/flowbite.css";
import SliceOfProduct from "../Components/SliceOfProduct.jsx";
import BrowseByTypes from "../Components/BrowseByTypes";
import "./Homepage.css";
import Skeleton from "@mui/material/Skeleton";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";

import {Link} from "react-router-dom";


const Homepage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const [TrendingProducts, setTrendingProducts] = useState([]);

    const [products, setProducts] = useState([]);
    const { user} = useSelector((state) => state.auth);
    const [visibleCount, setVisibleCount] = useState(25); // Start with 5 products

    const handleViewMore = () => {
        setVisibleCount((prevCount) => prevCount + 5); // Show 5 more products
    };
    const fetchTypes = async () => {
        try {
            const response = await axios.get(
                "http://103.155.161.94:3000/api/v1/types/get"
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
                "http://103.155.161.94:3000/api/v1/products/all"
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
                "http://103.155.161.94:3000/api/v1/products/trending"
            );
            setTrendingProducts(response.data.data);
            console.log("Fetched Trending Products:", response.data.data);
        } catch (error) {
            console.error("Error fetching trending products:", error.message || error);
        }
    };

    const trackViewBehavior = async (id, product_name, event_type) => {
        try {
            const sessionId = user.sessionID
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
        fetchAllProducts();
        fetchTypes();
        fetchTrendingProducts();
    }, []);

    return (
        <main className="w-full h-full md:px-6 lg:px-[100px] 2xl:px-[200px]">

            <BrowseByTypes types={types}/>
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

            <div className="w-full my-20 bg-white flex flex-col justify-center gap-y-5 rounded-xl">
                <span className="text-xl font-normal p-4">View our product</span>
                <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 3xl:grid-cols-7 gap-x-1 gap-y-5 px-4">
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
                                className="border xs:w-32 md:w-42 flex-shrink-0 border-gray-300 hover:shadow-lg"
                                key={product?.productID || product.product_id}
                            >
                                <div className="w-full h-[200px] bg-gray-200">
                                    <img
                                        src={product?.MainImage || product?.MainImage}
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
