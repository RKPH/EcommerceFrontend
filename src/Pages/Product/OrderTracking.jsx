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

    const steps = [
        "Order created and is pending for processing.",
        "Order is paid.",
        "Order is being prepared",
        "Order is being shipped",
        "Order delivered",
    ];

    const completedSteps = order?.history?.map((item) => item.action) || [];
    const activeStep = completedSteps.reduce((lastIndex, completedStep) => {
        const stepIndex = steps.findIndex((step) => step === completedStep);
        return stepIndex > lastIndex ? stepIndex : lastIndex;
    }, -1);

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

    return (
        <div className="min-h-screen flex items-center py-6 w-full flex-col px-4 px-[100px] bg-gray-100">
            {/* Breadcrumbs */}
            <div className="w-full mb-5">
                <Breadcrumbs aria-label="breadcrumb" className="text-sm text-gray-600">
                    <Link to="/" className="hover:underline text-blue-500">
                        Home
                    </Link>
                    <Link to="/orders" className="hover:underline text-blue-500">
                        Orders
                    </Link>
                    <span className="text-gray-800">Order ID: {orderId}</span>
                </Breadcrumbs>
            </div>

            {/* Order Header */}
            <div className="bg-white shadow rounded-md p-4 w-full">
                <h1 className="text-2xl font-bold text-gray-800">
                    Tracking Order ID: {orderId || "No ID provided"}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                    <div>
                        <p className="text-sm text-gray-500">Order Date:</p>
                        <p className="text-lg font-medium">Feb 16, 2025</p>
                    </div>
                    <div className="w-[1px] bg-gray-300 h-6"></div>
                    <div>
                        <p className="text-sm text-gray-500">Estimated Delivery:</p>
                        <p className="text-lg font-medium text-green-600">
                            Feb 19, 2025
                        </p>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="w-full bg-white shadow flex flex-col gap-y-6 rounded-md mt-6 p-6">
                <span className="font-semibold text-lg mb-5">Order Progress</span>
                {order?.history ? (
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label} completed={index <= activeStep}>
                                <StepLabel>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        textAlign="center"
                                    >
                                        <span
                                            className={`${
                                                index <= activeStep ? "font-bold" : "text-gray-600"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                        {index <= activeStep && (
                                            <span className="text-sm text-gray-500 mt-1">
                                                {
                                                    order.history.find(
                                                        (item) => item?.action === steps[index]
                                                    )?.date || "No date available"
                                                }
                                            </span>
                                        )}
                                    </Box>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                ) : (
                    <p className="text-red-500 mt-4 text-center">
                        No order history available.
                    </p>
                )}
            </div>

            {/* Product List */}
            <div className="w-full bg-white shadow rounded-md mt-6 p-6">
                <h2 className="text-xl font-semibold mb-4">Ordered Products</h2>
                <ul className="space-y-4">
                    {order?.products?.map((product, index) => (
                        <li
                            key={index}
                            className="flex items-center p-4 rounded-lg border hover:shadow transition-shadow duration-200"
                        >
                            <img
                                src={product.product.image[0]}
                                alt={product.product.name}
                                className="w-24 h-24 object-cover rounded-md border"
                            />
                            <div className="ml-4 flex-1">
                                <p className="font-medium text-base">{product.product.name}</p>
                                <p className="text-gray-500 text-sm">
                                    Price: ${product.product.price}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Quantity: {product.quantity}
                                </p>
                            </div>
                            <Link
                                to={`/product/${
                                    product.product.productID || product.product.product_id
                                }`}
                                className="text-blue-500 hover:underline"
                            >
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
