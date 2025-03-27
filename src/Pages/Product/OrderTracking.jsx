import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Stepper, Step, StepLabel, StepContent } from "@mui/material";
import AxiosInstance from "../../api/axiosInstance";

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const formatDateWithTime = (dateString) => {
        const date = new Date(dateString);

        // Vietnam time offset (UTC+7)
        const offset = 7 * 60 * 60 * 1000;
        const localDate = new Date(date.getTime() + offset);

        const hours = String(localDate.getUTCHours()).padStart(2, '0');
        const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(localDate.getUTCSeconds()).padStart(2, '0');
        const day = String(localDate.getUTCDate()).padStart(2, '0');
        const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
        const year = String(localDate.getUTCFullYear()).slice(-2);

        return `${hours}:${minutes}:${seconds}, ${month}/${day}/${year}`;
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await AxiosInstance.authAxios.get(`/orders/getUserDetailById/${orderId}`);
                setOrder(response.data.data);
            } catch (error) {
                console.error("Failed to fetch order details", error);
            }
        };

        window.scrollTo(0, 0);
        if (orderId) fetchOrder();
    }, [orderId]);

    return (
        <div className="min-h-screen flex flex-col items-center py-8 w-full md:px-6 lg:px-[100px] 2xl:px-[200px] bg-gray-50">
            {/* Breadcrumbs */}
            <div className="w-full  mb-6">
                <Breadcrumbs aria-label="breadcrumb" className="text-sm">
                    <Link to="/" className="text-gray-500 hover:underline">Home</Link>
                    <Link to="/orders" className="text-gray-500 hover:underline">Orders</Link>
                    <span className="text-gray-800 font-medium">Order ID: {orderId}</span>
                </Breadcrumbs>
            </div>

            {/* Order Header */}
            <div className="w-full bg-white shadow-sm rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Tracking Order: #{orderId}</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm">Order Date</p>
                        <p className="text-lg font-medium">{formatDateWithTime(order?.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">
                            {order?.status === "Delivered" ? "Delivered At" : "Estimated Delivery"}
                        </p>
                        <p className={`text-lg font-medium ${order?.status === "Delivered" ? "text-green-600" : ""}`}>
                            {formatDateWithTime(order?.DeliveredAt)}
                        </p>
                    </div>
                </div>
            </div>


            {/* Recipient & Payment Details */}
            <div className="w-full  bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recipient Details</h2>
                <div className="mt-4 space-y-3 text-gray-700">
                    <p><span className="font-medium">Shipping Address:</span> {order?.shippingAddress}</p>
                    <p><span className="font-medium">Payment Method:</span> {order?.PaymentMethod}</p>
                    <p><span className="font-medium">Payment Status:</span> {order?.payingStatus}</p>
                </div>
            </div>

            {/* Order Status */}
            <div className="w-full  bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
                <p className="mt-4 text-gray-700"><span className="font-medium">Status:</span> {order?.status}</p>

                {/* Cancellation details */}
                {(order?.status === "Cancelled" || order?.status === "CancelledByAdmin") && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg space-y-2">
                        <p className="text-red-600 font-medium">
                            {order?.status === "CancelledByAdmin" ? "This order was cancelled by an admin." : "This order was cancelled."}
                        </p>
                        <p><span className="font-medium">Reason:</span> {order?.cancellationReason}</p>
                        <p><span className="font-medium">Refund Status:</span> {order?.refundStatus}</p>

                        {order?.refundInfo && (
                            <div className="mt-4 p-4 bg-white border rounded-lg">
                                <p className="font-semibold mb-2">Refund Bank Details</p>
                                <p><span className="font-medium">Account Name:</span> {order.refundInfo.accountName}</p>
                                <p><span className="font-medium">Bank Name:</span> {order.refundInfo.bankName}</p>
                                <p><span className="font-medium">Account Number:</span> {order.refundInfo.accountNumber}</p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Order History - Stepper */}
            {order?.history && order.history.length > 0 && (
                <div className="w-full  bg-white shadow-sm rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
                    <div className="mt-4">
                        <Stepper orientation="vertical">
                            {order.history.map((step) => (
                                <Step key={step._id} active={true} completed={true}>
                                    <StepLabel>
                                        <div className="text-gray-800 font-medium">{step.action}</div>
                                        <div className="text-gray-500 text-sm">{step.date}</div>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="w-full  bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800">Ordered Products</h2>
                <ul className="mt-4 space-y-4">
                    {order?.products?.map((product, index) => (
                        <li key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50">
                            <img src={product.product.MainImage} alt={product.product.name} className="w-24 h-24 object-cover rounded-md"/>
                            <div className="flex-1">
                                <p className="font-medium text-lg text-gray-800">{product.product.name}</p>
                                <p className="text-gray-500">Price: ${product.product.price}</p>
                                <p className="text-gray-500">Quantity: {product.quantity}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderTracking;
