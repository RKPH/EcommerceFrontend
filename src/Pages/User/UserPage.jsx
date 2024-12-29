import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUserApi } from "../../Redux/AuthSlice.js";
import AxiosInstance from "../../api/axiosInstance.js";
import { toast } from "react-toastify";
const UserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    const [message, setMessage] = useState(""); // For success or error messages
    const [loading, setLoading] = useState(false); // For loading state

    // Fetch user details when the component mounts or the user data changes
    useEffect(() => {
        if (user) {
            // Check user object structure and update state accordingly
            setUserDetails({
                name: user.name || user?.user?.name || "",
                email: user.email || user?.user?.email || "",
                address: user?.user?.address|| user.address || {
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "",
                },
            });
        }
    }, [user]);

    // Handle change of user details
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address")) {
            const fieldName = name.split(".")[1]; // Extract the property (e.g., 'street', 'city', etc.)

            setUserDetails((prevDetails) => ({
                ...prevDetails,
                address: {
                    ...prevDetails.address,
                    [fieldName]: value, // Update the address field
                },
            }));
        } else {
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value, // For other fields like name and email
            }));
        }
    };

    // Handle form submission to update user details
    const handleUpdateDetails = async () => {
        setLoading(true);
        setMessage(""); // Reset the message
        try {
            const response = await AxiosInstance.authAxios.put("/users/profile", userDetails);
            if (response.status === 200) {
                toast.success("User detail updated", {
                    className: "toast-success",
                    style: { backgroundColor: "green", color: "white" },
                });
            }
        } catch (error) {
            setMessage(`Error updating user details: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logoutUserApi());
        navigate("/"); // Navigate to the homepage after logout
    };

    return (
        <div className="h-screen flex items-center py-6 w-full flex-col px-[100px]">
            <div className="w-full flex flex-col">
                <div className="w-full flex items-end justify-end my-4">
                    <div className="flex gap-x-2 w-1/5">
                        <h4 className="text-base w-1/2 text-blue-gray-800 border-r">
                            Welcome, {user?.user?.name || user?.name || "Guest"}
                        </h4>
                        <span
                            onClick={handleLogout}
                            className="w-auto text-black font-semibold cursor-pointer hover:text-blue-500 transition"
                        >
                            Log Out
                        </span>
                    </div>
                </div>
                <div className="flex w-full my-10">
                    <div className="w-1/5 flex flex-col px-2 gap-y-5 ">
                        <div>
                            <h3 className="text-lg text-black font-bold">Manage My Account</h3>
                            <ul className="text-base flex flex-col gap-y-3 mt-4">
                                <li className="text-gray-500 cursor-pointer px-7">My Profile</li>
                                <li className="text-gray-500 cursor-pointer px-7">My Payment Options</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-bold">My orders</h3>
                            <ul className="text-base flex flex-col gap-y-3 mt-4">
                                <li className="text-gray-500 cursor-pointer px-7">Check my orders</li>
                                <li className="text-gray-500 cursor-pointer px-7">My canelations</li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-4/5 flex flex-col px-4 py-4 shadow-md">
                        <h2 className="text-xl text-black font-bold">Edit your profile</h2>
                        {message && (
                            <div
                                className={`my-4 p-2 text-white rounded-lg ${
                                    message.includes("success") ? "bg-green-500" : "bg-red-500"
                                }`}
                            >
                                {message}
                            </div>
                        )}
                        <div className="flex flex-col gap-y-2 mt-4">
                            <label htmlFor="name" className="text-black font-semibold">Your full name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={userDetails.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-y-2 mt-4">
                            <label htmlFor="email" className="text-black font-semibold">Your email</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                disabled={true}
                                value={userDetails.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* Address Inputs */}
                        <div className="space-y-4 mt-4">
                            {/* Street Input */}
                            <div className="flex flex-col">
                                <label htmlFor="address.street" className="text-black font-semibold">Street</label>
                                <input
                                    type="text"
                                    id="address.street"
                                    name="address.street"
                                    value={userDetails.address.street}
                                    onChange={handleChange}
                                    className="py-2 px-4 border rounded-lg"
                                    placeholder="Street"
                                />
                            </div>

                            {/* City and State Inputs */}
                            <div className="flex gap-x-2">
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="address.city" className="text-black font-semibold">City</label>
                                    <input
                                        type="text"
                                        id="address.city"
                                        name="address.city"
                                        value={userDetails.address.city}
                                        onChange={handleChange}
                                        className="py-2 px-4 border rounded-lg"
                                        placeholder="City"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="address.state" className="text-black font-semibold">State</label>
                                    <input
                                        type="text"
                                        id="address.state"
                                        name="address.state"
                                        value={userDetails.address.state}
                                        onChange={handleChange}
                                        className="py-2 px-4 border rounded-lg"
                                        placeholder="State"
                                    />
                                </div>
                            </div>

                            {/* Postal Code and Country Inputs */}
                            <div className="flex gap-x-2 my-4">
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="address.postalCode" className="text-black font-semibold">Postal Code</label>
                                    <input
                                        type="text"
                                        id="address.postalCode"
                                        name="address.postalCode"
                                        value={userDetails.address.postalCode}
                                        onChange={handleChange}
                                        className="py-2 px-4 border rounded-lg"
                                        placeholder="Postal Code"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="address.country" className="text-black font-semibold">Country</label>
                                    <input
                                        type="text"
                                        id="address.country"
                                        name="address.country"
                                        value={userDetails.address.country}
                                        onChange={handleChange}
                                        className="py-2 px-4 border rounded-lg"
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-x-2 mt-4">
                            <button className="mt-6 px-2">
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateDetails}
                                disabled={loading}
                                className="mt-6 w-[216px] py-2 px-4 bg-black text-white rounded-lg hover:bg-blue-500 disabled:bg-gray-400"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>


                        </div>
                        {/* Update Button */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
