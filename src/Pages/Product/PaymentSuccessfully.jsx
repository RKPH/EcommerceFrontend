import React , {useState ,useEffect}from "react";
import {toast} from "react-toastify";
import AxiosInstance from "../../api/axiosInstance.js";
import axios from "axios";
import {useParams} from "react-router-dom";
import SliceOfProduct from "../../Components/SliceOfProduct.jsx";
const PaymentSuccessPage = () => {
    const {orderId} = useParams();
    console.log("order id" ,orderId)
    const [orders, setOrders] = useState(null);
    const [TrendingProducts, setTrendingProducts] = useState([]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await AxiosInstance.authAxios.get(`/orders/getUserDetailById/${orderId}`);
                setOrders(response.data.data);
                console.log("Fetched the latest processing order:", response.data.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to fetch orders. Please try again later.";
                console.error("Error fetching orders:", error);
                toast.error(errorMessage, {
                    className: "toast-error",
                    style: { backgroundColor: "red", color: "white" },
                });
            }
        };
        fetchTrendingProducts()
        fetchOrders();
    }, []);

    const fetchTrendingProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/v1/products/trending"
            );
            setTrendingProducts(response.data.data); // Assuming the response contains an array of products
            console.log("Fetched Trending Products:", response.data.data); // Log the fetched products
        } catch (error) {
            console.error("Error fetching trending products:", error.message || error);
        }
    }

    // Track user behavior
    const trackViewBehavior = async (id,product_name, event_type) => {
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center border border-black">
                {/* Success Icon */}
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

                {/* Success Message */}
                <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
                <p className="text-gray-600 mt-2">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>

                {/* Payment Details */}
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

                {/* Call-to-Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full bg-blue-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => window.location.href = "/order-history"}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        View Order History
                    </button>
                </div>
            </div>
            <div className="w-full mt-10 px-[100px] ">
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                    <h1 className="text-xl text-black font-semibold w-full text-start">View other products</h1>
                    <SliceOfProduct products={TrendingProducts} TrackViewBehavior={trackViewBehavior}/>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
