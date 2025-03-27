import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EditProfile from "./EditProfile.jsx";
import { updateUserInfo } from "../../../Redux/AuthSlice.js";
import { toast } from "react-toastify";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

const UserPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

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
            toast.success("User details updated successfully!");
        } catch (error) {
            setMessage(`Error updating user details: ${error.message}`);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-4 sm:px-6 lg:px-[100px] 3xl:px-[200px]">
            <div className="mb-6 py-4">

                <nav className="text-base text-gray-600">
                    <Link to="/" className="text-blue-600 hover:underline">Home</Link> &gt;{" "}
                    <span className="text-gray-800">Me</span>
                </nav>
            </div>

            <div className="min-h-fit flex w-full">
                <div className="w-full  flex flex-col px-4 py-6 bg-white rounded-md shadow-lg">
                    <EditProfile
                        userDetail={userDetails}
                        handleChange={handleChange}
                        handleUpdateDetails={handleUpdateDetails}
                        loading={loading}
                        message={message}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserPage;
