import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import EditProfile from "./EditProfile.jsx";
import { updateUserInfo } from "../../../Redux/AuthSlice.js";
import { toast } from "react-toastify";
import AxiosInstance from "../../../api/axiosInstance.js";
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
const UserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        },
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState("My Profile"); // To track the active section
    const [selectedTab, setSelectedTab] = useState("all");

    useEffect(() => {
        if (user) {
            setUserDetails({
                name: user.name || user?.user?.name || "",
                email: user.email || user?.user?.email || "",
                address: user?.user?.address || user.address || {
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "",
                },
            });
        }
    }, [user]);

    // Fetch orders whenever `selectedTab` changes
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await AxiosInstance.authAxios.get("/orders/getUserOrders");
                const allOrders = response.data.data || [];

                // Filter orders based on the selected tab
                const filteredOrders = selectedTab === "all"
                    ? allOrders
                    : allOrders.filter(order => order.status === selectedTab);

                setOrders(filteredOrders);
                console.log("Fetched orders:", filteredOrders);
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to fetch orders. Please try again later.";
                console.error("Error fetching orders:", error);
                toast.error( errorMessage, {
                    className: "toast-error",
                    style: { backgroundColor: "red", color: "white" },
                });
            }
        };

        fetchOrders();
    }, [selectedTab]); // This ensures that fetchOrders runs whenever selectedTab changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address")) {
            const fieldName = name.split(".")[1];
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                address: {
                    ...prevDetails.address,
                    [fieldName]: value,
                },
            }));
        } else {
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    const handleUpdateDetails = async () => {
        setLoading(true);
        setMessage("");
        try {
            await dispatch(updateUserInfo(userDetails)).unwrap();
            toast.success("User detail updated successfully", {
                className: "toast-success",
                style: { backgroundColor: "green", color: "white" },
            });
        } catch (error) {
            setMessage(`Error updating user details: ${error.message}`);
            toast.error(`Error: ${error.message}`, {
                className: "toast-error",
                style: { backgroundColor: "red", color: "white" },
            });
        } finally {
            setLoading(false);
        }
    };


    const renderContent = () => {
        switch (activeSection) {
            case "My Profile":
                return (
                    <EditProfile
                        userDetail={userDetails}
                        handleChange={handleChange}
                        handleUpdateDetails={handleUpdateDetails}
                        loading={loading}
                        message={message}
                    />
                );
            case "My Payment Options":
                return (
                    <div>
                        <h2 className="text-lg text-black font-semibold">My Payment Options</h2>
                        <p className="mt-4 text-gray-700 min-h-[400px]">
                            This section will display your saved payment methods and options to add or update them.
                        </p>
                    </div>
                );
            case "My Orders":
                return (
                    <div className="min-h-[500px]">
                        <h2 className="text-lg text-black font-semibold">My Orders</h2>
                        <div className="bg-white w-full  py-4">
                            <div className="flex space-x-6 items-center">
                                <div
                                    className={`cursor-pointer ${selectedTab === "all" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                    onClick={() => setSelectedTab("all")}
                                >
                                    Tất cả đơn hàng
                                </div>
                                <div
                                    className={`cursor-pointer ${selectedTab === "Pending" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                    onClick={() => setSelectedTab("Pending")}
                                >
                                    Đang chờ thanh toán
                                </div>
                                <div
                                    className={`cursor-pointer ${selectedTab === "Processing" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                    onClick={() => setSelectedTab("Processing")}
                                >
                                    Đang chờ giao hàng
                                </div>
                                <div
                                    className={`cursor-pointer ${selectedTab === "canceled" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                    onClick={() => setSelectedTab("canceled")}
                                >
                                    Đã hủy
                                </div>
                            </div>
                        </div>
                        <div>
                            {orders.length === 0 ? (
                                // Render empty orders fallback
                                <div className="w-full flex flex-col items-center justify-center mt-5">
                                    <img
                                        src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                                        alt="Empty Orders"
                                        className="w-40 h-40"
                                    />
                                    <p className="text-gray-500 text-lg mt-4">Bạn chưa có đơn hàng nào</p>
                                </div>
                            ) : (
                                // Render orders list
                                orders.map((order, index) => (
                                    <div key={index} className="w-full min-h-[100px] bg-white border border-black my-4 p-4 rounded shadow">
                                        <p className="text-base text-black flex items-center">
                                            {order.status === "Pending" ? (
                                                <div className="w-full flex justify-between">
                                                    <div className="w-full py-4 border-b border-gray-200">
                                                        <PaymentsIcon className="mr-2 text-gray-400"/>
                                                        Đang chờ thanh toán
                                                    </div>
                                                    <Link to={"/checkout"} className="text-base text-blue-400 cursor-pointer hover:underline">Checkout</Link>
                                                </div>

                                            ) : order.status === "Processing" ? (
                                                <div className="w-full border-b flex items-center justify-between ">
                                                    <div className=" py-4 border-gray-200">
                                                        <LocalShippingIcon className="mr-2 text-gray-400"/>
                                                        Đang chờ giao hàng
                                                    </div>
                                                    <Link to={`/order/${order?._id}`} className="text-base text-blue-400 cursor-pointer hover:underline">Detail</Link>
                                                </div>
                                            ) : (
                                                order.status
                                            )}
                                        </p>
                                        {/* Nested map for products */}
                                        <ul className="w-full">
                                            {order?.products?.map((order, index) => (
                                                <Link
                                                    to={`/product/${order?.product?.productID || order.product?.product_id}`}
                                                    key={index} className="mt-2 w-full flex space-x-4 p-2">
                                                    <img
                                                        src={order.product.image[0]}
                                                        alt={order.product.name}
                                                        className="w-20 h-20 text-[0px] rounded-md border"
                                                    />
                                                    <div className="h-full w-full">
                                                        <p className="text-black text-base">{order.product.name}</p>
                                                        <div className="flex w-full justify-between space-x-2">
                                                            <span className="text-gray-500">SL: x{order.quantity}</span>
                                                            <span className="text-black font-semibold">
                                                                {order.product.price.toLocaleString("vi-VN")} đ
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                );
            case "My Cancellations":
                return (
                    <div>
                        <h2 className="text-lg text-black font-semibold">My Cancellations</h2>
                        <p className="mt-4 text-gray-700">
                            This section will display any cancellations you've made.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="min-h-screen flex items-center py-6 w-full flex-col 3xl:px-[300px] sm:px-[100px]">
                <div className="w-full flex flex-col">

                    <div className="flex w-full my-5">
                        <div className="w-1/5 flex flex-col px-2 ">
                            <div className="w-full flex items-center mb-4 justify-between">
                                <h2 className="text-base text-black font-normal">Hello, {userDetails.name}</h2>
                            </div>
                            <div>
                                <ul className="text-base flex flex-col ">
                                    <li
                                        className={`text-black cursor-pointer flex items-center gap-x-3  hover:bg-gray-200 p-3 ${
                                            activeSection === "My Profile" && "bg-gray-200"
                                        }`}
                                        onClick={() => setActiveSection("My Profile")}
                                    >
                                        <AccountCircleIcon/>  <span>My Profile </span>
                                    </li>
                                    <li
                                        className={`text-black cursor-pointer flex items-center gap-x-3 hover:bg-gray-200 p-3 ${
                                            activeSection === "My Payment Options" && "bg-gray-200"
                                        }`}
                                        onClick={() => setActiveSection("My Payment Options")}
                                    >
                                        <CreditCardIcon/>  <span>My payemnt option</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul className="text-base flex flex-col ">
                                    <li
                                        className={`text-black cursor-pointer flex items-center gap-x-3 hover:bg-gray-200 p-3 ${
                                            activeSection === "My Orders" && " bg-gray-200"
                                        }`}
                                        onClick={() => setActiveSection("My Orders")}
                                    >
                                        <ShoppingBagIcon/>  <span>My orders</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <div className="w-4/5 flex flex-col px-4 py-4 bg-white rounded-md shadow-md">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default UserPage;
