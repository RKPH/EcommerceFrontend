import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AxiosInstance from "../../api/axiosInstance";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Function to define steps based on payment method
    const getSteps = (paymentMethod) => {
        if (paymentMethod === "cod") {
            return [
                "Order placed and pending processing.",
                "Order is being prepared",
                "Order is being shipped",
                "Order delivered",
                "Order paid (COD)",
            ];
        } else {
            return [
                "Order is paid via momo and pending processing.",
                "Order is now being processed.",
                "Order is being prepared",
                "Order is being shipped",
                "Order delivered",
            ];
        }
    };

    // Function to determine active step based on order history
    const getActiveStep = (history, steps) => {
        if (!history || history.length === 0) return -1;
        return history.reduce((lastIndex, item) => {
            const stepIndex = steps.findIndex((step) => step === item.action);
            return stepIndex > lastIndex ? stepIndex : lastIndex;
        }, -1);
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await AxiosInstance.authAxios.get(
                    `/orders/getUserDetailById/${orderId}`
                );
                setOrder(response.data.data);
            } catch (error) {
                console.error("Error fetching order detail:", error.message || error);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Get steps and active step based on the order data
    const steps = getSteps(order?.PaymentMethod);
    const activeStep = getActiveStep(order?.history, steps);

    return (
        <div className="min-h-screen flex items-center py-6 w-full flex-col px-4 3xl:px-[200px] md:px-[100px] bg-gray-100">
            {/* Breadcrumbs */}
            <div className="w-full mb-5">
                <Breadcrumbs aria-label="breadcrumb" className="text-sm text-gray-600">
                    <Link to="/" className="hover:underline text-blue-500">Home</Link>
                    <Link to="/orders" className="hover:underline text-blue-500">Orders</Link>
                    <span className="text-gray-800">Order ID: {orderId}</span>
                </Breadcrumbs>
            </div>

            {/* Order Header */}
            <div className="bg-white shadow rounded-md p-4 w-full">
                <h1 className="text-lg font-bold text-gray-800">
                    Tracking Order ID: {orderId || "No ID provided"}
                </h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mt-3">
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Order Date:</p>
                        <p className="text-lg font-medium">{order?.createdAt}</p>
                    </div>
                    <div className="hidden md:block w-[1px] bg-gray-300 h-6"></div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Estimated Delivery:</p>
                        <p className="text-lg font-medium text-green-600">{order?.DeliveredAt}</p>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="w-full bg-white shadow flex flex-col gap-y-6 rounded-md mt-6 p-6">
                <span className="font-semibold text-lg mb-5">Order Progress</span>
                {order?.history ? (
                    isMobile ? (
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => (
                                <Step key={label} completed={index <= activeStep}>
                                    <StepLabel>
                                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                                            <span className={`${index <= activeStep ? "font-bold" : "text-gray-600"}`}>
                                                {label}
                                            </span>
                                            {index <= activeStep && (
                                                <span className="text-sm text-gray-500 mt-1">
                                                    {order.history.find(item => item.action === steps[index])?.date || "No date available"}
                                                </span>
                                            )}
                                        </Box>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    ) : (
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => (
                                <Step key={label} completed={index <= activeStep}>
                                    <StepLabel>
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            <span className={`${index <= activeStep ? "font-bold" : "text-gray-600"}`}>
                                                {label}
                                            </span>
                                            {index <= activeStep && (
                                                <span className="text-sm text-gray-500 mt-1">
                                                    {order.history.find(item => item.action === steps[index])?.date || "No date available"}
                                                </span>
                                            )}
                                        </Box>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )
                ) : (
                    <p className="text-red-500 mt-4 text-center">No order history available.</p>
                )}
            </div>

            {/* Product List */}
            <div className="w-full bg-white shadow rounded-md mt-6 p-6">
                <h2 className="text-xl font-semibold mb-4">Ordered Products</h2>
                <ul className="space-y-4">
                    {order?.products?.map((product, index) => (
                        <li key={index} className="flex flex-col md:flex-row items-center p-4 rounded-lg border hover:shadow transition-shadow duration-200">
                            <img src={product.product.MainImage} alt={product.product.name} className="w-24 h-24 object-cover rounded-md border"/>
                            <div className="ml-4 flex-1">
                                <p className="font-medium text-base">{product.product.name}</p>
                                <p className="text-gray-500 text-sm">Price: ${product.product.price}</p>
                                <p className="text-gray-500 text-sm">Quantity: {product.quantity}</p>
                            </div>
                            <Link to={`/product/${product.product.productID || product.product.product_id}`} className="text-blue-500 hover:underline mt-2 md:mt-0">
                                View product
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderTracking;
