import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile.jsx";
import { updateUserInfo } from "../../../Redux/AuthSlice.js";
import { toast } from "react-toastify";
import AxiosInstance from "../../../api/axiosInstance.js";
import OrderList from "./Order.jsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

const UserPage = () => {
    const dispatch = useDispatch();

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
    const [activeSection, setActiveSection] = useState("My Profile");
    const [selectedTab, setSelectedTab] = useState("all");

    useEffect(() => {
        if (user) {
            setUserDetails({
                name: user.name || user?.user?.name || "",
                email: user.email || user?.user?.email || "",
                avatar: user?.avatar || "default-avatar.png",
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await AxiosInstance.authAxios.get("/orders/getUserOrders");
                const allOrders = response.data.data || [];
                const filteredOrders = selectedTab === "all"
                    ? allOrders
                    : allOrders.filter(order => order.status === selectedTab);
                setOrders(filteredOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [selectedTab]);

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
            toast.success("User  detail updated successfully", {
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
            case "My Orders":
                return (
                    <OrderList orders={orders} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
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
        <div className="flex flex-col w-full px-4 sm:px-6 lg:px-[100px] 3xl:px-[200px]">
            <div className="w-full py-2 px-4 md:px-0">
                <Breadcrumbs aria-label="breadcrumb" className="text-sm md:text-base font-medium text-gray-700">
                    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                        Home
                    </Link>
                    <Typography color="text.primary" className="font-medium">
                        Me
                    </Typography>
                </Breadcrumbs>
            </div>

            <div className="min-h-screen flex items-center w-full flex-col">
                <div className="w-full flex flex-col">
                    <div className="flex w-full my-5 flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="w-full flex flex-col lg:w-1/4 px-2 mb-4">
                            <div className="flex w-full">
                                <ul className="text-sm md:text-base flex flex-col w-full bg-white shadow-md rounded-lg">
                                    {/* My Profile Link */}
                                    <li
                                        className={`cursor-pointer flex items-center gap-x-3 hover:bg-gray-200 p-3 transition-colors ${
                                            activeSection === "My Profile" && "bg-blue-50 text-blue-600"
                                        }`}
                                        onClick={() => setActiveSection("My Profile")}
                                    >
                                        <AccountCircleIcon className="text-gray-500" /> <span>My Profile</span>
                                    </li>

                                    {/* My Orders Link */}
                                    <li
                                        className={`cursor-pointer flex items-center gap-x-3 hover:bg-gray-200 p-3 transition-colors ${
                                            activeSection === "My Orders" && "bg-blue-50 text-blue-600"
                                        }`}
                                        onClick={() => setActiveSection("My Orders")}
                                    >
                                        <ShoppingBagIcon className="text-gray-500" /> <span>My Orders</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full lg:w-3/4 flex flex-col px-4 py-6 bg-white rounded-md shadow-lg transition-all duration-300 hover:shadow-xl">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;