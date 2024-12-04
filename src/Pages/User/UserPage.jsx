import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  logoutUserApi } from "../../Redux/AuthSlice.js";
import AxiosInstance from "../../api/axiosInstance.js";

const UserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const user = useSelector((state) => state.auth.user);

    // Fetch cart items
    const fetchCart = async () => {
        try {
            const response = await AxiosInstance.authAxios.get("/cart/get");
            const items = response.data.data || []; // Assuming this is an array of cart items
            setCartItems(items);
            console.log("Cart items:", items);
            // Extract product IDs from the cart items
            const productIds = items.map(item => item.product._id); // Assuming each cart item has a 'productId'
            fetchProductDetails(productIds); // Fetch product details using the productIds
        } catch (error) {
            console.error("Error fetching cart items:", error.message);
        }
    };

    // Fetch product details for each product ID
    const fetchProductDetails = async (productIds) => {
        try {
            const productRequests = productIds.map(id =>
                AxiosInstance.authAxios.get(`/products/${id}`)
            );
            // Wait for all product details to be fetched
            const productResponses = await Promise.all(productRequests);
            setProductDetails(productResponses.map(res => res.data.data));
        } catch (error) {
            console.error("Error fetching product details:", error.message);
        }
    };

    // Fetch cart and product details when the user data changes
    useEffect(() => {
        if (user) {
            fetchCart(); // Fetch the cart details if the user exists
        }
    }, [user]);

    // Calculate total cost
    const calculateTotal = () => {
        return cartItems.reduce((total, cartItem) => {
            const product = productDetails.find(
                (product) => product._id === cartItem.product._id
            );
            if (product) {
                return total + product.price * cartItem.quantity;
            }
            return total;
        }, 0);
    };

    const handleLogout = () => {
        dispatch(logoutUserApi());
        navigate("/"); // Navigate to the homepage after logout
    };

    return (
        <div className="h-screen flex items-center py-6 w-full flex-col">
            <div className="w-3/4">
                <div className="bg-gray-100 p-8 max-w-md w-full">
                    <h3 className="text-3xl text-blue-gray-800 mb-4 text-center">
                        Welcome, {user?.user?.name || user?.name || "Guest"}
                    </h3>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                    >
                        Log Out
                    </button>
                </div>
                <div className="w-full h-80 my-4 flex flex-col space-y-2">
                    <h1 className="font-bold text-3xl uppercase">Your Bag</h1>
                    <div className="flex">
                        <span className="font-normal text-base">
                            Total items: {cartItems.length}
                        </span>
                    </div>
                    <div className="w-full flex">
                        <div className="mt-4 w-2/3">
                            {cartItems.length > 0 ? (
                                cartItems.map((cartItem, index) => {
                                    const product = productDetails.find(
                                        (product) => product._id === cartItem.product._id
                                    );

                                    return product ? (
                                        <div key={index} className="flex w-4/5 h-auto border my-2">
                                            <div className="w-1/3">
                                                <img
                                                    className="w-60 h-60 object-cover"
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className="flex flex-col p-7 justify-between w-2/3">
                                                <div className="flex justify-between">
                                                    <p className="font-normal text-xl">{product.name}</p>
                                                    <p className="font-normal text-xl text-gray-400">{product.price.toLocaleString()}₫</p>
                                                </div>
                                                <p>Quantity: {cartItem.quantity}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p key={index} className="text-gray-500">Loading product details...</p>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500">Your cart is empty</p>
                            )}
                        </div>
                        <div className="mt-4 w-1/3 px-10 space-y-3">
                            <div className="flex justify-between items-center">
                                <h1 className="font-bold text-2xl">Order Summary</h1>
                                <p className="font-normal text-xl text-black">
                                    Total: {calculateTotal().toLocaleString()}₫
                                </p>
                            </div>
                            <div className="flex justify-between text-black">
                                <p className="font-normal text-xl">Subtotal</p>
                                <p className="font-normal text-xl text-black">
                                    {calculateTotal().toLocaleString()}₫
                                </p>
                            </div>
                            <div className="flex justify-between text-black">
                                <p className="font-normal text-xl">Shipping</p>
                                <p className="font-normal text-xl text-black">0₫</p>
                            </div>
                            <div className="flex justify-between text-black">
                                <p className="font-normal text-xl">Tax</p>
                                <p className="font-normal text-xl text-black">0₫</p>
                            </div>
                            <div className="flex justify-between text-black">
                                <p className="font-normal text-xl">Total</p>
                                <p className="font-normal text-xl text-black">
                                    {calculateTotal().toLocaleString()}₫
                                </p>
                            </div>
                            <button className="w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition mt-4">
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
