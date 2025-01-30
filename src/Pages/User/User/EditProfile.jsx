import PropTypes from "prop-types";

const EditProfile = ({
                         userDetail,
                         message,
                         loading,
                         handleChange,
                         handleUpdateDetails,
                     }) => {
    return (
        <div className="flex flex-col md:flex-row gap-8  rounded-md">
            {/* Left Section: Form */}
            <div className="w-full md:w-2/3 px-4 border-r">
                <h2 className="text-xl text-gray-800 font-semibold mb-4">
                    Edit Your Profile
                </h2>
                {message && (
                    <div
                        className={`my-4 p-3 rounded-md ${
                            message.includes("success") ? "bg-green-500" : "bg-red-500"
                        } text-white text-sm`}
                    >
                        {message}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={userDetail.name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={userDetail.email}
                            disabled
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm cursor-not-allowed"
                            placeholder="Enter your email"
                        />
                    </div>
                    {/* Address Inputs */}
                    <div>
                        <label
                            htmlFor="address.street"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Street
                        </label>
                        <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={userDetail.address.street}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your street"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="address.city"
                                className="block text-sm font-medium text-gray-700"
                            >
                                City
                            </label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={userDetail.address.city}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="City"
                            />
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="address.state"
                                className="block text-sm font-medium text-gray-700"
                            >
                                State
                            </label>
                            <input
                                type="text"
                                id="address.state"
                                name="address.state"
                                value={userDetail.address.state}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="State"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="address.postalCode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="address.postalCode"
                                name="address.postalCode"
                                value={userDetail.address.postalCode}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Postal Code"
                            />
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="address.country"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Country
                            </label>
                            <input
                                type="text"
                                id="address.country"
                                name="address.country"
                                value={userDetail.address.country}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                        onClick={() => alert("Cancelled")}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateDetails}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </div>

            {/* Right Section: Linked Social */}
            <div className="w-full md:w-1/3 bg-white  rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Linked Social Accounts
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Connect or disconnect your social accounts for a seamless experience:
                </p>
                <div className="space-y-4">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Connect to Facebook
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500">
                        Connect to Twitter
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                        Connect to GitHub
                    </button>
                    <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Connect to Google
                    </button>
                </div>
            </div>
        </div>
    );
};

EditProfile.propTypes = {
    userDetail: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        address: PropTypes.shape({
            street: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            postalCode: PropTypes.string,
            country: PropTypes.string,
        }),
    }).isRequired,
    message: PropTypes.string,
    loading: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    handleUpdateDetails: PropTypes.func.isRequired,
};

EditProfile.defaultProps = {
    message: "",
    loading: false,
};

export default EditProfile;
