import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AxiosInstance from "../../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import {useSelector} from "react-redux";

const PaymentSuccessPage = () => {
    const { orderId } = useParams();
    const [orders, setOrders] = useState(null);
    const user = useSelector((state) => state.auth.user); // Redux state for the logged-in user
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await AxiosInstance.authAxios.get(`/orders/getUserDetailById/${orderId}`);
                setOrders(response.data.data);

            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to fetch orders. Please try again later.", {
                    className: "toast-error",
                    style: { backgroundColor: "red", color: "white" },
                });
            }
        };

        fetchOrders();
    }, [orderId]);

    // Track purchase when order data is loaded
    useEffect(() => {
        if (!orders || !orders.products) return;



        const trackPurchase = async () => {
            const sessionId = user?.sessionID;
            const trackingRequests = orders.products.map(async (product) => {
                try {
                    console.log(`Tracking product: ${product.product.name}`);
                    await AxiosInstance.authAxios.post("/tracking", {
                        sessionId,  // Replace with actual session ID if needed
                        user: user?.user_id,
                        productId: product.product.product_id,
                        product_name: product.product.name,
                        behavior: "purchase",
                    });

                } catch (error) {
                    console.error(`Error tracking ${product.product.name}:`, error.response?.data || error.message);
                }
            });

            await Promise.all(trackingRequests);

        };

        trackPurchase();
    }, [orders]);

    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 p-5">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center border border-black">
                <div className="text-blue-500 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
                <p className="text-gray-600 mt-2">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-700">Payment Summary</h2>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Order Number:</span>
                            <span className="text-black">{orders?._id}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>Amount Paid:</span>
                            <span>${orders?.totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>Date:</span>
                            <span>{orders?.createdAt}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
