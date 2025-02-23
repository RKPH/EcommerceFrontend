import { useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { Edit, Delete } from "@mui/icons-material";
import AxiosInstance from "../../../api/axiosInstance.js";

const EditProfile = ({ userDetail, message, loading, handleChange, handleUpdateDetails }) => {
    const [editingFields, setEditingFields] = useState({
        name: false,
        address: false,
    });

    const [hasChanges, setHasChanges] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [chooseAddress, setChooseAddress] = useState({
        city: selectedAddress?.data?.city || '',
        street: selectedAddress?.data?.street || '',
        district: selectedAddress?.data?.district || '',
        ward: selectedAddress?.data?.ward || '',
        cityCode: selectedAddress?.data?.cityCode || '',
        districtCode: selectedAddress?.data?.districtCode || '',
        wardCode: selectedAddress?.data?.wardCode || '',
        phoneNumber: selectedAddress?.data?.phoneNumber || '',
    });

    const [newAddress, setNewAddress] = useState({
        city: '',
        street: '',
        district:  '',
        ward:  '',
        cityCode: '',
        districtCode:  '',
        wardCode: '',
        phoneNumber: '',
    });

    const [editedAddress, setEditedAddress] = useState({
        city: '',
        street: '',
        district:  '',
        ward:  '',
        cityCode: '',
        districtCode:  '',
        wardCode: '',
        phoneNumber: ''
    });
    const [initialAddress, setInitialAddress] = useState(null);

    useEffect(() => {
        if (editModal) {
            setInitialAddress(selectedAddress);
        }
    }, [editModal]);
    useEffect(() => {
        if (selectedAddress) {
            setEditedAddress({
                city: selectedAddress?.city || '',
                street: selectedAddress?.street || '',
                district: selectedAddress?.district || '',
                ward: selectedAddress?.ward || '',
                cityCode: selectedAddress?.cityCode || '',
                districtCode: selectedAddress?.districtCode || '',
                wardCode: selectedAddress?.wardCode || '',
                phoneNumber: selectedAddress?.phoneNumber || ''
            });
        }
    }, [selectedAddress]);



    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);



    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/?depth=1");
                const data = await response.json();
                setCities(data || []);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (chooseAddress.cityCode) {
            axios.get(`https://provinces.open-api.vn/api/p/${chooseAddress.cityCode}?depth=2`)
                .then((res) => {
                    setDistricts(res.data.districts || []);
                    setWards([]); // Reset wards when changing the city
                })
                .catch((err) => console.error("Failed to fetch districts:", err));
        } else {
            setDistricts([]); // Reset districts when clearing city
            setWards([]);     // Reset wards when clearing city
        }
    }, [chooseAddress.cityCode]);

    useEffect(() => {
        if (chooseAddress.districtCode) {
            axios.get(`https://provinces.open-api.vn/api/d/${chooseAddress.districtCode}?depth=2`)
                .then((res) => setWards(res.data.wards || []))
                .catch((err) => console.error("Failed to fetch wards:", err));
        } else {
            setWards([]); // Reset wards when clearing district
        }
    }, [chooseAddress.districtCode]);
    const fetchAddresses = async () => {
        try {
            const response = await AxiosInstance.authAxios.get("/address");
            setAddresses(response.data.addresses || []);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };
    useEffect(() => {

        fetchAddresses();
    }, []);

    useEffect(() => {

        fetchAddresses();
    }, [selectedAddress]);
    const toggleEdit = (field) => {
        setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatar(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:3000/api/v1/images/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.imageUrl) {
                handleChange({ target: { name: "avatar", value: data.imageUrl } });
                setHasChanges(true);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleAddAddress = async () => {
        console.log("Adding address:", chooseAddress);
        console.log("Adding address:", newAddress);
        try {
            const response = await AxiosInstance.authAxios.post("/address/add", newAddress);
            setAddresses(response.data.shippingAddress.addresses); // Update state with new address
            setOpenModal(false); // Close modal
            setChooseAddress({}); // Reset chooseAddress state
            setNewAddress({ street: '', city: '', district: '', ward: '', phoneNumber: '' }); // Reset form fields
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };
    const CheckifHasChange = () => {
        if (
            !selectedAddress?.street?.trim() ||
            !selectedAddress?.phoneNumber?.trim() ||
            !selectedAddress?.cityCode?.trim() ||
            !selectedAddress?.districtCode?.trim() ||
            !selectedAddress?.wardCode?.trim()
        ) {
            return false; // If any required field is empty, prevent enabling the button
        }

        return JSON.stringify(selectedAddress) !== JSON.stringify(initialAddress);
    };




    const handleUpdateAddress = async () => {
        try {
            // Ensure that all necessary fields are present
            if (!selectedAddress.cityCode || !selectedAddress.districtCode || !selectedAddress.wardCode) {
                alert("Please select city, district, and ward.");
                return;
            }
            if (!selectedAddress?._id) {
                alert("Address ID is missing.");
                return;
            }

            // Ensure that all values are filled out properly
            const updatedAddress = {
                addressId: selectedAddress?._id,
                street: selectedAddress.street || '',
                city: selectedAddress.city || '',
                cityCode: selectedAddress.cityCode || '',
                district: selectedAddress.district || '',
                districtCode: selectedAddress.districtCode || '',
                ward: selectedAddress.ward || '',
                wardCode: selectedAddress.wardCode || '',
                phoneNumber: selectedAddress.phoneNumber || '',
            };

            console.log("updatedAddress:", updatedAddress);

            // Send the updated address to the backend API
            const response = await AxiosInstance.authAxios.put('/address/update', updatedAddress);

            if (response.status === 200) {
                console.log('Address updated successfully', response.data);
                fetchAddresses();
                // Optionally, update the local state (if necessary, depending on how you're handling state updates)
                // For example:
                // setSelectedAddress(updatedAddress);

                setEditModal(false); // Close the modal
            } else {
                console.error('Error updating address:', response.data.message);
                alert('Failed to update address. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the address. Please try again.');
        }
    };
    const deleteAddress = async (addressId) => {
        try {
            await AxiosInstance.authAxios.delete(`/address/delete/${addressId}`);
            setAddresses((prevAddresses) => prevAddresses.filter(address => address._id !== addressId));
            console.log(`Deleted address with ID: ${addressId}`);
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address. Please try again.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 rounded-md">
            <div className="w-full flex flex-col items-center md:w-1/3 bg-white rounded-xl p-6 max-w-xs mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Avatar</h3>

                <label className="relative w-32 h-32 mb-4 cursor-pointer">
                    <img
                        src={avatar || userDetail.avatar || "default-avatar.png"}
                        alt="Avatar"
                        className="w-full h-full rounded-full border-4 border-gray-300 object-cover transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                    />
                </label>

                <p className="text-sm text-gray-500 mt-2">Click to upload a new avatar</p>
            </div>

            <div className="w-full md:w-2/3 px-4 border-r">
                <h2 className="text-lg text-gray-800 font-semibold mb-4">Edit Your Profile</h2>
                {message && (
                    <div className={`my-4 p-3 rounded-md ${message.includes("success") ? "bg-green-500" : "bg-red-500"} text-white text-sm`}>
                        {message}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-y-5 h-40 border border-gray-300 rounded-md p-4">
                        <div className="w-full flex justify-between">
                            <h1 className="font-medium text-base">Personal Information</h1>
                            <button
                                className="text-black border border-gray-400 px-4 py-1 rounded-lg flex items-center gap-1"
                                onClick={() => toggleEdit("name")}
                            >
                                {editingFields.name ? "Save" : <><ModeEditIcon className="text-sm" fontSize="tiny" /> Edit</>}
                            </button>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label className="block text-sm font-normal text-gray-700">Full Name</label>
                            <span
                                contentEditable={editingFields.name}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                    handleChange({ target: { name: "name", value: e.target.innerText } });
                                    setHasChanges(true);
                                    toggleEdit("name");
                                }}
                                className={`text-base ${editingFields.name ? "border border-blue-500 bg-gray-100 p-1 rounded-md" : ""}`}
                            >
                                {userDetail.name}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-5 min-h-40 max-h-96 overflow-y-auto border border-gray-300 rounded-md p-2">
                        <div className="w-full flex justify-between">
                            <h1 className="font-medium text-base">Shipping Address</h1>
                            <button
                                className="text-black border border-gray-400 px-4 py-1 rounded-lg"
                                onClick={() => setOpenModal(true)}
                            >
                                Add New Address
                            </button>
                        </div>
                        <div className="container mx-auto p-2">
                            {addresses.map((address, index) => (
                                <div key={address._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-6 rounded-xl shadow-lg mb-4 w-full max-w-3xl mx-auto bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                    <div className="flex flex-col w-full">
                                        <p className="text-sm sm:text-base text-gray-800 font-medium break-words w-full sm:w-auto">
                                            {address.street}, {address.district}, {address.ward}, {address.city}
                                        </p>
                                        <p className="text-sm sm:text-base text-gray-600 mt-2">
                                            Phone: {address.phoneNumber}
                                        </p>
                                    </div>

                                    <div className="flex flex-row gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                console.log("selected ", selectedAddress);
                                                console.log("districts before modal open", districts);
                                                console.log("wards before modal open", wards);

                                                if (address.cityCode) {
                                                    axios.get(`https://provinces.open-api.vn/api/p/${address.cityCode}?depth=2`)
                                                        .then((res) => {
                                                            setDistricts(res.data.districts || []);
                                                            if (address.districtCode) {
                                                                axios.get(`https://provinces.open-api.vn/api/d/${address.districtCode}?depth=2`)
                                                                    .then((wardRes) => {
                                                                        setWards(wardRes.data.wards || []);
                                                                        setEditModal(true);
                                                                    })
                                                                    .catch((err) => console.error("Failed to fetch wards:", err));
                                                            } else {
                                                                setEditModal(true);
                                                            }
                                                        })
                                                        .catch((err) => console.error("Failed to fetch districts:", err));
                                                } else {
                                                    setDistricts([]);
                                                    setWards([]);
                                                    setEditModal(true);
                                                }
                                            }}
                                            className="p-2 bg-yellow-500 text-white flex items-center rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300 ease-in-out transform hover:scale-110"
                                        >
                                            <Edit fontSize="small" />
                                        </button>

                                        <button
                                            onClick={() => deleteAddress(address._id)}
                                            className="p-2 bg-red-600 text-white flex items-center rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-300 ease-in-out transform hover:scale-110"
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <Modal open={editModal} onClose={() => setEditModal(false)}>
                            <Box className="p-6 bg-white rounded-2xl shadow-xl w-full sm:w-96 mx-auto mt-20 transition-all duration-300 transform ease-in-out">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Address</h2>

                                <div className="flex flex-col gap-4">
                                    {/* Street Input */}
                                    <input
                                        type="text"
                                        placeholder="Street"
                                        value={selectedAddress?.street || ''}
                                        onChange={(e) => setSelectedAddress({ ...selectedAddress, street: e.target.value })}
                                        className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                                    />

                                    {/* Phone Number Input */}
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={selectedAddress?.phoneNumber || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const phoneRegex = /^[0-9]{10,15}$/; // Allow 10-15 digit numbers

                                            if (!phoneRegex.test(value)) {
                                                setPhoneError('Phone number must be 10 to 15 digits.');
                                            } else {
                                                setPhoneError('');
                                            }

                                            setSelectedAddress({ ...selectedAddress, phoneNumber: value });
                                        }}
                                        className={`border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 
                            ${phoneError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} 
                            focus:border-transparent transition duration-200 ease-in-out`}
                                    />
                                    {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

                                    {/* City Dropdown */}
                                    <select
                                        value={selectedAddress?.cityCode || ''}
                                        onChange={(e) => {
                                            const selectedCityCode = e.target.value;
                                            const selectedCity = cities.find(city => city.code.toString() === selectedCityCode);

                                            setSelectedAddress({
                                                ...selectedAddress,
                                                cityCode: selectedCityCode,
                                                city: selectedCity ? selectedCity.name : '',
                                                districtCode: '', // Reset district when changing city
                                                wardCode: ''      // Reset ward when changing city
                                            });

                                            setEditedAddress({
                                                ...selectedAddress,
                                                cityCode: selectedCityCode,
                                                districtCode: '',
                                                wardCode: ''
                                            });

                                            setDistricts([]); // Reset districts when city changes
                                            setWards([]);     // Reset wards when city changes

                                            if (selectedCityCode) {
                                                axios.get(`https://provinces.open-api.vn/api/p/${selectedCityCode}?depth=2`)
                                                    .then((res) => setDistricts(res.data.districts || []))
                                                    .catch((err) => console.error("Failed to fetch districts:", err));
                                            }
                                        }}

                                        className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.code} value={city.code}>{city.name}</option>
                                        ))}
                                    </select>

                                    {/* District Dropdown */}
                                    <select
                                        value={selectedAddress?.districtCode || ''}
                                        onChange={(e) => {
                                            const selectedDistrictCode = e.target.value;
                                            const selectedDistrict = districts.find(district => district.code.toString() === selectedDistrictCode);

                                            setSelectedAddress({
                                                ...selectedAddress,
                                                districtCode: selectedDistrictCode,
                                                district: selectedDistrict ? selectedDistrict.name : '',
                                                wardCode: '' // Reset ward when changing district
                                            });

                                            setEditedAddress({
                                                ...selectedAddress,
                                                districtCode: selectedDistrictCode,
                                                wardCode: ''
                                            });

                                            setWards([]); // Reset wards when district changes

                                            if (selectedDistrictCode) {
                                                axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`)
                                                    .then((res) => setWards(res.data.wards || []))
                                                    .catch((err) => console.error("Failed to fetch wards:", err));
                                            }
                                        }}

                                        className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                                        disabled={!selectedAddress?.cityCode} // Disable if no city is selected
                                    >
                                        <option value="">Select District</option>
                                        {districts.map((district) => (
                                            <option key={district.code} value={district.code}>{district.name}</option>
                                        ))}
                                    </select>

                                    {/* Ward Dropdown */}
                                    <select
                                        value={selectedAddress?.wardCode || ''}
                                        onChange={(e) => {
                                            const selectedWardCode = e.target.value;
                                            const selectedWard = wards.find(ward => ward.code.toString() === selectedWardCode);
                                            setSelectedAddress({ ...selectedAddress, wardCode: selectedWardCode, ward: selectedWard ? selectedWard.name : '' });
                                            setEditedAddress({ ...selectedAddress, wardCode: selectedWardCode });
                                        }}
                                        className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                                        disabled={!selectedAddress?.districtCode} // Disable if no district is selected
                                    >
                                        <option value="">Select Ward</option>
                                        {wards.map((ward) => (
                                            <option key={ward.code} value={ward.code}>{ward.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => setEditModal(false)}
                                        className="px-5 py-2 bg-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-400 transition-all duration-200 ease-in-out transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleUpdateAddress(); // Call the update function
                                            setEditModal(false); // Close the modal
                                        }}
                                        disabled={
                                            phoneError ||
                                            !editedAddress?.street ||
                                            !editedAddress?.phoneNumber ||
                                            !editedAddress?.cityCode ||
                                            !editedAddress?.districtCode || // Ensure district is selected
                                            !editedAddress?.wardCode || // Ensure ward is selected
                                            !CheckifHasChange()
                                        }
                                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105
                                        ${phoneError ||
                                        !editedAddress?.street ||
                                        !editedAddress?.phoneNumber ||
                                        !editedAddress?.cityCode ||
                                        !editedAddress?.districtCode ||
                                        !editedAddress?.wardCode ||
                                        !CheckifHasChange()
                                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-50' // Disable styling
                                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'}
`}
                                    >
                                        Save
                                    </button>
                                </div>
                            </Box>
                        </Modal>
                    </div>
                </div>
                <div className="flex justify-center md:justify-end gap-4 mt-6">
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200">Cancel</button>
                    <button
                        onClick={() => {
                            handleUpdateDetails();
                            setHasChanges(false);
                        }}
                        disabled={!hasChanges}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <Box
                        className="p-6 bg-white rounded-xl shadow-xl max-w-md mx-auto mt-20 transition-all transform ease-out duration-300"
                        style={{ animation: "fadeIn 0.3s ease-out" }}
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Address</h2>
                        <div className="flex flex-col gap-4">
                            {/* Street Input */}
                            <input
                                type="text"
                                placeholder="Street"
                                value={newAddress.street || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />

                            {/* Phone Number Input */}
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={newAddress.phoneNumber || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />

                            {/* City Dropdown */}
                            <select
                                value={chooseAddress.cityCode || ''}
                                onChange={(e) => {
                                    const selectedCityCode = e.target.value;
                                    console.log("type of selected city", typeof(selectedCityCode));
                                    const selectedCity = cities.find(city => city.code.toString() === selectedCityCode);
                                    console.log("City code", typeof(cities[0].code));
                                    setChooseAddress({
                                        cityCode: selectedCityCode,
                                        districtCode: '',  // Reset district when changing city
                                        wardCode: ''       // Reset ward when changing city
                                    });

                                    setNewAddress({
                                        ...newAddress,
                                        city: selectedCity ? selectedCity.name : '',
                                        cityCode: selectedCityCode,
                                        district: '', // Reset district
                                        districtCode: '',
                                        ward: '', // Reset ward
                                        wardCode: ''
                                    });
                                }}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.code} value={city.code}>{city.name}</option>
                                ))}
                            </select>


                            {/* District Dropdown */}
                            <select
                                value={chooseAddress.districtCode || ''}
                                onChange={(e) => {
                                    const selectedDistrictCode = e.target.value;
                                    const selectedDistrict = districts.find(district => district.code.toString() === selectedDistrictCode);

                                    setChooseAddress({
                                        ...chooseAddress,
                                        districtCode: selectedDistrictCode,
                                        wardCode: ''  // Reset ward when changing district
                                    });

                                    setNewAddress({
                                        ...newAddress,
                                        district: selectedDistrict ? selectedDistrict.name : '',
                                        districtCode: selectedDistrictCode,
                                        ward: '', // Reset ward
                                        wardCode: ''
                                    });
                                }}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                disabled={!chooseAddress.cityCode}
                            >
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>{district.name}</option>
                                ))}
                            </select>

                            {/* Ward Dropdown */}
                            <select
                                value={chooseAddress.wardCode || ''}
                                onChange={(e) => {
                                    const WardCode = e.target.value;
                                    const selectedWard = wards.find(ward => ward.code.toString() === e.target.value);
                                    setChooseAddress({ ...chooseAddress, wardCode: e.target.value });
                                    setNewAddress({ ...newAddress, ward: selectedWard ? selectedWard.name : '', wardCode: WardCode });
                                }}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                disabled={!chooseAddress.districtCode}
                            >
                                <option value="">Select Ward</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setOpenModal(false)}
                                className="px-6 py-3 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAddress}
                                disabled={
                                    !newAddress.street ||
                                    !newAddress.phoneNumber ||
                                    !chooseAddress.cityCode ||
                                    !chooseAddress.districtCode ||
                                    !chooseAddress.wardCode ||
                                    !/^\d{10}$/.test(newAddress.phoneNumber) // Ensure phone number is 10 digits
                                }
                                className={`px-6 py-3 rounded-md text-white transition-colors 
                                    ${(!newAddress.street ||
                                    !newAddress.phoneNumber ||
                                    !chooseAddress.cityCode ||
                                    !chooseAddress.districtCode ||
                                    !chooseAddress.wardCode ||
                                    !/^\d{10}$/.test(newAddress.phoneNumber))
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"}
    `}
                            >
                                Add
                            </button>
                        </div>
                    </Box>
                </Modal>


            </div>
        </div>
    );
};

EditProfile.propTypes = {
    userDetail: PropTypes.object.isRequired,
    message: PropTypes.string,
    loading: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    handleUpdateDetails: PropTypes.func.isRequired,
};

export default EditProfile;