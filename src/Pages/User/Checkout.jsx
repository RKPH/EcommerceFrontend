import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axiosInstance.js";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [selectedTab, setSelectedTab] = useState("pending"); // Track selected tab
    const user = useSelector((state) => state.auth.user);
    const [selectedOption, setSelectedOption] = useState("economy");
    const deliveryDetails = {
        fast: { price: "$16", detail: "Delivered on Tuesday, before 7 PM, 14/01" },
        economy: { price: "$10", detail: "Delivered on Thursday, before 7 PM, 14/01" },
    };
    const [paymentMethod, setpaymentMethod] = useState("visa");
    const [discount, setDiscount] = useState(0);
    const [shipmentCost, setShipmentCost] = useState(10);
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState("");

    const applyCoupon = () => {
        if (couponCode === "DISCOUNT10") {
            setCouponMessage("Coupon applied! You saved 10%.");
            setDiscount(calculateTotalPrice() * 0.1);
            // Logic to apply discount
        } else {
            setCouponMessage("Invalid coupon code.");
        }
    };

    const calculateDiscountedTotal = () => {
        const total = calculateTotalPrice();
        return couponCode === "DISCOUNT10" ? total * 0.9 : total;
    };
    const fetchOrders = async () => {
        try {
            const response = await AxiosInstance.authAxios.get("/orders/getUserOrders");
            const data = response.data.data || [];

            // Filter orders with status "Pending" only
            const pendingOrders = data.filter(order => order.status === "Pending");

            // Set orders to only the products of pending orders
            setOrders(pendingOrders.flatMap((item) => item.products));
            setOrder(pendingOrders[0]);
            console.log("Fetched pending orders:", pendingOrders);
        } catch (error) {
            console.error("Error fetching pending orders:", error.message);
        }
    };

    const location = useLocation();

    useEffect(() => {
        if (location.state?.refetch) {
            fetchOrders();
        }
    }, [location.state]);

    useEffect(() => {
        fetchOrders();
    }, [user, selectedTab]); // Fetch when tab or user changes

    const calculateTotalPrice = () => {
        const totalProductPrice = orders.reduce((total, order) => {
            return total + order.product.price * order.quantity;
        }, 0);
        const deliveryPrice = selectedOption === "fast" ? 16 : 10;
        return totalProductPrice + deliveryPrice;
    };

    const handlePurchase = async (orderID, deliverAt, Payingmethod, totalPrice) => {
        try {
            // Construct the payload to send with the POST request
            const payload = {
                orderId:orderID,
                deliverAt:deliverAt,
                paymentMethod:Payingmethod,
                totalPrice:totalPrice,
            };

            // Send POST request to purchase the order
            const response = await AxiosInstance.authAxios.post("/orders/purchase/", payload);

            // Check if the response was successful
            if (response.status === 200) {
                alert("Order placed successfully!");
                navigate(`/checkout/success/${orderID}`);
            } else {
                alert("Failed to place order. Please try again later.");
            }
        } catch (error) {
            // Log error to the console for debugging purposes
            console.error("Failed to place order:", error.response?.data?.message || error.message);

            // Show user-friendly error message
            alert(error.response?.data?.message || "Failed to place order. Please try again later.");
        }
    };


    return (
        <div className="min-h-screen  flex items-center py-6 w-full flex-col 3xl:px-[300px] sm:px-[100px]">
            {/* Tab Navigation */}
            <div className="w-full flex gap-x-2 mt-4">
                <div className="w-2/3 min-h-[400px] bg-white rounded-xl p-5">
                    <span className="text-start text-black text-base font-bold">
                        Choose a delivery method
                    </span>
                    <div className="mt-4">
                        {/* Shipping Options */}
                        <label
                            onClick={() => setShipmentCost(16)}
                            className={`flex items-center p-4 rounded-md border ${selectedOption === "fast" ? "border-blue-500" : "border-gray-300"} hover:cursor-pointer hover:border-blue-400`}
                        >
                            <input
                                type="radio"
                                name="shippingOption"
                                value="fast"
                                className="hidden"
                                checked={selectedOption === "fast"}
                                onChange={() => setSelectedOption("fast")}
                            />
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`px-2 py-1 text-sm font-bold rounded-full ${selectedOption === "fast" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                                >
                                    NEW
                                </span>
                                <span className="text-black">Fast delivery in 2h</span>
                            </div>
                        </label>

                        {/* More shipping options */}
                        <label
                            onClick={() => setShipmentCost(10)}
                            className={`mt-2 flex items-center p-4 rounded-md border ${selectedOption === "economy" ? "border-blue-500" : "border-gray-300"} hover:cursor-pointer hover:border-blue-400`}
                        >
                            <input
                                type="radio"
                                name="shippingOption"
                                value="economy"
                                className="hidden"
                                checked={selectedOption === "economy"}
                                onChange={() => setSelectedOption("economy")}
                            />
                            <div className="text-black">Economy delivery</div>
                        </label>
                    </div>

                    {/* Delivery Details */}
                    <div className="mt-4 w-full border-t pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 bg-gray-300 p-4 rounded-lg">
                                <span className="text-green-600 text-base font-semibold">Package:</span>
                                <span className="text-gray-600">{deliveryDetails[selectedOption].detail}</span>
                            </div>
                            <span className="text-black font-bold">{deliveryDetails[selectedOption].price}</span>
                            {/*<div className="mt-2 text-gray-500">*/}
                            {/*    Delivered by TikiNOW Smart Logistics (shipped from Ho Chi Minh)*/}
                            {/*</div>*/}
                        </div>

                        <div
                            className="w-full flex justify-between border border-gray-300 min-h-fit max-h-[500px] overflow-y-auto mt-4">
                            <ul className="w-full">
                                {orders.map((order, index) => (
                                    <Link to={`/product/${order?.product?.productID || order.product?.product_id}`}
                                          key={index} className="mt-2 w-full flex space-x-4 p-2">
                                        <img
                                            src={order.product.image[0]}
                                            alt={order.product.name}
                                            className="w-20 text-[0px] h-20 rounded-md border"
                                        />
                                        <div className="h-full w-full">
                                            <p className="text-black text-base">{order.product.name}</p>
                                            <div className="flex w-full justify-between space-x-2">
                                                <span className="text-gray-500">Qty: x{order.quantity}</span>
                                                <span className="text-black font-semibold">
                                                    ${order.product.price.toLocaleString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-1/3 h-fit bg-gray-100 p-3 flex flex-col rounded-xl">
                    {/* Delivery Section */}
                    <div className="w-full flex flex-col p-4">
                        <div className="w-full flex justify-between">
                            <span className="text-start text-black text-base font-bold">Deliver to</span>
                            <Link
                                to="/me"
                                className="text-end text-black text-sm font-normal cursor-pointer hover:underline"
                            >
                                Change
                            </Link>
                        </div>

                        <div className="my-2">
                            <p className="text-gray-500 font-semibold">
                                {user?.name || user?.user?.name} -<span className="font-normal"> 0123456789</span>
                            </p>
                            <p className="text-gray-500">
                                <span className="text-red-500">Address: </span>
                                {user?.address?.street}, {user?.address?.city}
                            </p>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="p-4 border-t">
                        <span className="text-gray-700 text-base font-semibold mb-2 block">Choose payment method</span>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    onClick={() => setpaymentMethod("visa")}
                                    type="radio"
                                    id="visa"
                                    name="paymentMethod"
                                    value="visa"
                                    className="w-4 h-4 border-gray-300 rounded-full"
                                />
                                <label htmlFor="visa" className="flex items-center text-base text-gray-700 font-medium">
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGxsoe7iPccCnGraliGFCLCvbg3bO3PDtELQ&s"
                                        alt="Visa Logo"
                                        className="w-6 h-6 mr-2"
                                    />
                                    Visa
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    onClick={() => setpaymentMethod("cod")}
                                    type="radio"
                                    id="cod"
                                    name="paymentMethod"
                                    value="cod"
                                    className="w-4 h-4 border-gray-300 rounded-full"
                                />
                                <label htmlFor="cod" className="ml-2 text-base text-gray-700 font-medium">
                                    Cash on delivery (COD)
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    onClick={() => setpaymentMethod("momo")}
                                    type="radio"
                                    id="momo"
                                    name="paymentMethod"
                                    value="momo"
                                    className="w-4 h-4 border-gray-300 rounded-full"
                                />
                                <label htmlFor="momo" className="flex items-center text-base text-gray-700 font-medium">
                                    <img
                                        src="https://i.pinimg.com/736x/56/3f/f3/563ff3678a3f880cbf06cd4fde819440.jpg"
                                        alt="MoMo Logo"
                                        className="w-6 h-6 mr-2"
                                    />
                                    MoMo
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Apply Coupon Section */}
                    <div className="p-4 border-t">
                        <span className="text-gray-700 text-base font-semibold mb-2 block">Apply Coupon</span>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                id="couponCode"
                                placeholder="Enter coupon code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600"
                                onClick={applyCoupon}
                            >
                                Apply
                            </button>
                        </div>
                        {couponMessage && (
                            <p className="text-sm text-green-500 mt-2">{couponMessage}</p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 border-t text-base">
                        <div className="flex justify-between">
                            <span className="font-semibold text-black">Total Products</span>
                            <span className="text-gray-600">${calculateTotalPrice()}</span>
                        </div>

                        {/* Discount Display */}
                        <div className="flex justify-between mt-2">
                            <span className="font-semibold text-black">Discount</span>
                            <span className="text-green-600">  {discount > 0 ? `- ${discount}` : 0}</span>
                        </div>


                        {/* Shipment Cost */}
                        <div className="flex justify-between mt-2">
                            <span className="font-semibold text-black">Shipment Cost</span>
                            <span className="text-gray-600 text-base">${shipmentCost}</span>
                        </div>

                        {/* Total Payment */}
                        <div className="flex justify-between mt-4">
                            <span className="font-semibold text-black">Total Payment</span>
                            <span className="text-gray-600">${calculateDiscountedTotal() + shipmentCost}</span>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <div className="w-full p-4 flex justify-center mt-4">
                        <button
                            className="bg-blue-500 text-white w-full py-3 px-5 rounded-lg font-semibold"
                            onClick={()=>handlePurchase(order?._id, deliveryDetails[selectedOption].detail, paymentMethod,calculateDiscountedTotal() + shipmentCost)}
                        >
                            Place Order
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Order;
