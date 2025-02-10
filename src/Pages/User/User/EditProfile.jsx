import { useState } from "react";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PropTypes from "prop-types";

const EditProfile = ({ userDetail, message, loading, handleChange, handleUpdateDetails }) => {
    const [editingFields, setEditingFields] = useState({
        name: false,
        email: false,
        street: false,
        city: false,
        state: false,
        postalCode: false,
        country: false,
    });

    const toggleEdit = (field) => {
        setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 rounded-md">
            {/* Left Section: Form */}
            <div className="w-full md:w-2/3 px-4 border-r">
                <h2 className="text-lg text-gray-800 font-semibold mb-4">Edit Your Profile</h2>
                {message && (
                    <div className={`my-4 p-3 rounded-md ${message.includes("success") ? "bg-green-500" : "bg-red-500"} text-white text-sm`}>
                        {message}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    {/* Personal Information */}
                    <div className="flex flex-col gap-y-5 h-40 border border-gray-300 rounded-md p-4">
                        <div className="w-full flex justify-between">
                            <h1 className="font-medium text-base">Personal Information</h1>
                            <button
                                className="text-black border border-gray-400 px-4 py-1 rounded-lg flex items-center gap-1"
                                onClick={() => toggleEdit("name")}
                            >
                                {editingFields.name ? "Save" : (
                                    <>
                                        Edit <ModeEditIcon className="text-sm" fontSize="tiny" />
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label className="block text-sm font-normal text-gray-700">Full Name</label>
                            <span
                                contentEditable={editingFields.name}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                    handleChange({ target: { name: "name", value: e.target.innerText } });
                                    toggleEdit("name");
                                }}
                                className={`text-base ${editingFields.name ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                            >
                                {userDetail.name}
                            </span>
                        </div>
                    </div>

                    {/* Email Information */}
                    <div className="flex flex-col gap-y-5 h-40 border border-gray-300 rounded-md p-4">
                        <div className="w-full flex justify-between">
                            <h1 className="font-medium text-base">Email Information</h1>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label className="block text-sm font-normal text-gray-700">Email Address</label>
                            <span
                                contentEditable={editingFields.email}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                    handleChange({ target: { name: "email", value: e.target.innerText } });
                                    toggleEdit("email");
                                }}
                                className={`text-base ${editingFields.email ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                            >
                                {userDetail.email}
                            </span>
                        </div>
                    </div>

                    {/* Address Inputs */}
                    <div className="flex flex-col gap-y-5 border border-gray-300 rounded-md p-4">
                        <div className="w-full flex justify-between">
                            <h1 className="font-medium text-base">Address Information</h1>
                        </div>

                        {/* Street - Full Width */}
                        <div className="w-full">
                            <label className="block text-sm font-normal text-gray-700">Street</label>
                            <div className="flex items-center">
                            <span
                                contentEditable={editingFields["street"]}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                    handleChange({ target: { name: "address.street", value: e.target.innerText } });
                                    toggleEdit("street");
                                }}
                                className={`text-base ${editingFields["street"] ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                            >
                                {userDetail.address.street}
                            </span>
                                                <button className="text-black ml-2" onClick={() => toggleEdit("street")}>
                                                    {editingFields.street ? "Save" : (
                                                        <span className="flex items-center gap-1">
                                        <ModeEditIcon fontSize="tiny" />

                                    </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* City & State in One Row */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-normal text-gray-700">City</label>
                                <div className="flex items-center">
                                <span
                                    contentEditable={editingFields["city"]}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        handleChange({ target: { name: "address.city", value: e.target.innerText } });
                                        toggleEdit("city");
                                    }}
                                    className={`text-base ${editingFields["city"] ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                                >
                                    {userDetail.address.city}
                                </span>
                                                    <button className="text-black ml-2" onClick={() => toggleEdit("city")}>
                                                        {editingFields.city ? "Save" : (
                                                            <span className="flex items-center gap-1">
                                            <ModeEditIcon fontSize="tiny" />

                                        </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-normal text-gray-700">State</label>
                                <div className="flex items-center">
                                <span
                                    contentEditable={editingFields["state"]}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        handleChange({ target: { name: "address.state", value: e.target.innerText } });
                                        toggleEdit("state");
                                    }}
                                    className={`text-base ${editingFields["state"] ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                                >
                                    {userDetail.address.state}
                                </span>
                                    <button className="text-black ml-2" onClick={() => toggleEdit("state")}>
                                        {editingFields.state ? "Save" : (
                                            <span className="flex items-center gap-1">
                                            <ModeEditIcon fontSize="tiny" />

                                        </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Country & Postal Code in One Row */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-normal text-gray-700">Country</label>
                                <div className="flex items-center">
                                    <span
                                        contentEditable={editingFields["country"]}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => {
                                            handleChange({ target: { name: "address.country", value: e.target.innerText } });
                                            toggleEdit("country");
                                        }}
                                        className={`text-base ${editingFields["country"] ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                                    >
                                        {userDetail.address.country}
                                    </span>
                                    <button className="text-black ml-2" onClick={() => toggleEdit("country")}>
                                        {editingFields.country ? "Save" : (
                                            <span className="flex items-center gap-1">
                                            <ModeEditIcon fontSize="tiny" />

                                        </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-normal text-gray-700">Postal Code</label>
                                <div className="flex items-center">
                                <span
                                    contentEditable={editingFields["postalCode"]}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        handleChange({ target: { name: "address.postalCode", value: e.target.innerText } });
                                        toggleEdit("postalCode");
                                    }}
                                    className={`text-base ${editingFields["postalCode"] ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                                >
                                    {userDetail.address.postalCode}
                                </span>
                                    <button className="text-black ml-2" onClick={() => toggleEdit("postalCode")}>
                                        {editingFields.postalCode ? "Save" : (
                                            <span className="flex items-center gap-1">
                                            <ModeEditIcon fontSize="tiny" />

                                        </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200" onClick={() => alert("Cancelled")}>
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
            <div className="w-full md:w-1/3 bg-white rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Linked Social Accounts</h3>
                <p className="text-sm text-gray-600 mb-4">Connect or disconnect your social accounts for a seamless experience:</p>
                <div className="space-y-4">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Connect to Facebook</button>
                    <button className="w-full px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500">Connect to Twitter</button>
                    <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">Connect to GitHub</button>
                    <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Connect to Google</button>
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
    loading: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleUpdateDetails: PropTypes.func.isRequired,
};

export default EditProfile;
