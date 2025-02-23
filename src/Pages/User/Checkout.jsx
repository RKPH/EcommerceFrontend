import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axiosInstance.js";
import { Link, useLocation } from "react-router-dom";
import {toast} from "react-toastify";
import { Modal, Box, TextField, Button } from "@mui/material";
import axios from "axios";
const Order = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const user = useSelector((state) => state.auth.user);
    const [selectedOption, setSelectedOption] = useState("economy");
    const formatDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);

        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    const deliveryDetails = {
        fast: { price: "$16", detail: `${formatDate(2)}` },
        economy: { price: "$10", detail: `${formatDate(3)}` },
    };

    const sessionID = user?.sessionID;
    const [paymentMethod, setpaymentMethod] = useState("momo");
    const [discount, setDiscount] = useState(0);
    const [shipmentCost, setShipmentCost] = useState(10);
    const [phone, setPhone] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedAddresses, setSelectedAddresses] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [chooseAddress, setChooseAddress] = useState({
        city: selectedAddresses?.data?.city || '',
        street: selectedAddresses?.data?.street || '',
        district: selectedAddresses?.data?.district || '',
        ward: selectedAddresses?.data?.ward || '',
        cityCode: selectedAddresses?.data?.cityCode || '',
        districtCode: selectedAddresses?.data?.districtCode || '',
        wardCode: selectedAddresses?.data?.wardCode || '',
        phoneNumber: selectedAddresses?.data?.phoneNumber || '',
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

    useEffect(() => {
        if (selectedAddress) {
            setEditedAddress({
                city: selectedAddresses?.data?.city || '',
                street: selectedAddresses?.data?.street || '',
                district: selectedAddresses?.data?.district || '',
                ward: selectedAddresses?.data?.ward || '',
                cityCode: selectedAddresses?.data?.cityCode || '',
                districtCode: selectedAddresses?.data?.districtCode || '',
                wardCode: selectedAddresses?.data?.wardCode || '',
                phoneNumber: selectedAddresses?.data?.phoneNumber || '',
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


    const handleAddAddress = async () => {
        console.log("Adding address:", chooseAddress);
        console.log("Adding address:", newAddress);
        try {
            const response = await AxiosInstance.authAxios.post("/address/add", newAddress);
            setAddresses(response.data.shippingAddress.addresses); // Update state with new address

            setChooseAddress({}); // Reset chooseAddress state
            setIsAddingNew(false)
            setNewAddress({ street: '', city: '', district: '', ward: '', phoneNumber: '' }); // Reset form fields
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };


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

    const handleSelectAddress = (addr) => {
        setSelectedAddress(`${addr.street},${addr.district}, ${addr.ward}, ${addr.city}`);
        setPhone(addr.phoneNumber);
        setOpenModal(false);
    };




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
            const pendingOrders = data.filter(order => order.status === "Draft");

            // Set orders to only the products of pending orders
            setOrders(pendingOrders.flatMap((item) => item.products));
            setOrder(pendingOrders[0]);
            console.log("Fetched pending orders:", pendingOrders);
        } catch (error) {
            console.error("Error fetching pending orders:", error.message);
        }
    };

    const location = useLocation();

    useEffect(()=> {
        fetchOrders();
    }, [])


    useEffect(() => {
        if (location.state?.refetch) {
            fetchOrders();
        }
    }, [location.state]);



    const calculateTotalPrice = () => {
        const totalProductPrice = orders.reduce((total, order) => {
            return total + order.product.price * order.quantity;
        }, 0);


        return parseFloat((totalProductPrice ).toFixed(2));
    };


    const handlePurchase = async (orderID, selectedAddress ,deliverAt, Payingmethod, totalPrice) => {
        try {
            // Construct the payload to send with the POST request
            const payload = {
                orderId: orderID,
                shippingAddress:selectedAddress,
                deliverAt: deliverAt,
                paymentMethod: Payingmethod,
                totalPrice: totalPrice,
                sessionID: sessionID,
            };
            if (!selectedAddress) {
                toast.error("Please choose an address before proceeding!");
                return;
            }
            // Send POST request to purchase the order
            const response = await AxiosInstance.authAxios.post("/orders/purchase/", payload);
            console.log("Purchase response:", response);

            // Check if the response was successful
            if (response.status === 200) {
                const responseData = response.data;

                if (Payingmethod === "momo" && responseData.momoPaymentUrl) {
                    console.log("Redirecting to MoMo:", responseData.momoPaymentUrl);
                    window.location.href = responseData.momoPaymentUrl
                } else {
                    alert("Order placed successfully!");
                    window.location.href = `/checkout/success/${orderID}`;
                }
            } else {
                alert("Failed to place order. Please try again later.");
            }
        } catch (error) {
            console.error("Failed to place order:", error.response?.data?.message || error.message);

            // Show user-friendly error message
            alert(error.response?.data?.message || "Failed to place order. Please try again later.");
        }
    };


    return (
        <div className="min-h-screen flex items-center py-6 w-full flex-col px-4  md:px-6 lg:px-[100px] 2xl:px-[200px]">
            {/* Tab Navigation */}
            <div className="w-full flex flex-col lg:flex-row gap-4 mt-4">
                <div className="lg:w-2/3 w-full min-h-[400px] bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <span className="text-black text-xl font-semibold">Choose a delivery method</span>

                    <div className="mt-6 space-y-4">
                        {/* Shipping Options */}
                        <label
                            onClick={() => setShipmentCost(16)}
                            className={`flex items-center p-4 rounded-lg border transition-colors duration-300 ${selectedOption === "fast" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
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
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedOption === "fast" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"}`}
                                >
                                  NEW
                                </span>
                                <span className="text-gray-800">Fast delivery in 2h</span>
                            </div>
                        </label>

                        {/* More shipping options */}
                        <label
                            onClick={() => setShipmentCost(10)}
                            className={`flex items-center p-4 rounded-lg border transition-colors duration-300 ${selectedOption === "economy" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
                        >
                            <input
                                type="radio"
                                name="shippingOption"
                                value="economy"
                                className="hidden"
                                checked={selectedOption === "economy"}
                                onChange={() => setSelectedOption("economy")}
                            />
                            <div className="text-gray-800">Economy delivery</div>
                        </label>
                    </div>

                    {/* Delivery Details */}
                    <div className="mt-6 w-full border-t pt-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg">
                                <span className="text-green-600 text-base font-semibold">Package:</span>
                                <span className="text-gray-600"> Deliver on {deliveryDetails[selectedOption].detail}</span>
                            </div>
                            <span className="text-gray-800 font-semibold">{deliveryDetails[selectedOption].price}</span>
                        </div>

                        <div className="w-full flex justify-between border border-gray-300 min-h-fit max-h-[500px] overflow-y-auto mt-6 rounded-lg shadow-sm">
                            <ul className="w-full">
                                {orders.map((order, index) => (
                                    <Link
                                        to={`/product/${order?.product?.productID || order.product?.product_id}`}
                                        key={index}
                                        className="mt-2 flex space-x-4 p-4 hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        <img
                                            src={order.product.MainImage}
                                            alt={order.product.name}
                                            className="w-20 h-20 rounded-md border"
                                        />
                                        <div className="h-full w-full">
                                            <p className="text-gray-800 text-base">{order.product.name}</p>
                                            <div className="flex w-full justify-between space-x-2">
                                                <span className="text-gray-500">Qty: x{order.quantity}</span>
                                                <span className="text-gray-800 font-semibold">
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


                <div className="lg:w-1/3 w-full h-fit bg-gray-100 p-3 flex flex-col rounded-xl">
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

                        <div className="my-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800 font-semibold text-lg truncate max-w-[70%]">
                                    {user?.name || user?.user?.name}
                                </p>
                            </div>

                            <span className="font-normal text-blue-600">Phone: {phone || "No phone number"}</span>

                            <p className="text-gray-700 mt-3">
                                <span className="text-red-500 font-semibold">Address: </span>
                                <span className={`font-medium ${selectedAddress ? 'text-gray-900' : 'text-gray-500'}`}>
                              {selectedAddress || "No address selected"}
                            </span>
                            </p>

                            {/* Button for mobile screens */}
                            <div className="sm:hidden mt-3">
                                <button
                                    className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                                    onClick={() => setOpenModal(true)}
                                >
                                    <span className="mr-2">+</span>
                                    <span>Add new address</span>
                                </button>
                            </div>

                            {/* Button for larger screens */}
                            <div className="hidden sm:block mt-4">
                                <button
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                                    onClick={() => setOpenModal(true)}
                                >
                                    <span className="mr-2">+</span>
                                    <span>Add new address</span>
                                </button>
                            </div>
                        </div>

                        {/* Address Selection Modal */}
                        <Modal open={openModal} onClose={() => setOpenModal(false)}>
                            <Box className="p-4 sm:p-6 bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-10 sm:mt-16 max-h-[90vh] overflow-y-auto transition-all transform ease-in-out duration-300">
                                {!isAddingNew ? (
                                    <>
                                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Select an Address</h2>
                                        <ul className="border p-2 sm:p-3 rounded-lg max-h-48 sm:max-h-60 overflow-y-auto scrollbar-hide">
                                            {addresses.length > 0 ? (
                                                addresses.map((addr) => (
                                                    <li
                                                        key={addr.id}
                                                        className="p-3 sm:p-4 border-b cursor-pointer hover:bg-blue-100 transition-colors duration-300 rounded-lg"
                                                        onClick={() => handleSelectAddress(addr)}
                                                    >
                                                        <div className="flex flex-col">
                                                            <p className="text-sm sm:text-base text-gray-800 font-medium break-words">
                                                                {addr.street}, {addr.district}, {addr.ward}, {addr.city}
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Phone: {addr.phoneNumber}</p>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm sm:text-base">No addresses available</p>
                                            )}
                                        </ul>
                                        <Button
                                            onClick={() => setIsAddingNew(true)}
                                            variant="contained"
                                            color="primary"
                                            className="mt-4 sm:mt-5 w-full py-2 sm:py-3 text-base sm:text-lg rounded-lg"
                                        >
                                            Add New Address
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Add New Address</h2>
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <input
                                                type="text"
                                                placeholder="Street"
                                                value={newAddress.street || ''}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                className="border border-gray-300 p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                value={newAddress.phoneNumber || ''}
                                                onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                                                className="border border-gray-300 p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                                            />

                                            <select
                                                value={chooseAddress.cityCode || ''}
                                                onChange={(e) => {
                                                    const selectedCityCode = e.target.value;
                                                    const selectedCity = cities.find(city => city.code == selectedCityCode);
                                                    setChooseAddress({ cityCode: selectedCityCode, districtCode: '', wardCode: '' });
                                                    setNewAddress({
                                                        ...newAddress,
                                                        city: selectedCity ? selectedCity.name : '',
                                                        cityCode: selectedCityCode,
                                                        district: '',
                                                        districtCode: '',
                                                        ward: '',
                                                        wardCode: ''
                                                    });
                                                }}
                                                className="border border-gray-300 p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((city) => (
                                                    <option key={city.code} value={city.code}>{city.name}</option>
                                                ))}
                                            </select>

                                            <select
                                                value={chooseAddress.districtCode || ''}
                                                onChange={(e) => {
                                                    const selectedDistrictCode = e.target.value;
                                                    const selectedDistrict = districts.find(district => district.code == selectedDistrictCode);
                                                    setChooseAddress({ ...chooseAddress, districtCode: selectedDistrictCode, wardCode: '' });
                                                    setNewAddress({
                                                        ...newAddress,
                                                        district: selectedDistrict ? selectedDistrict.name : '',
                                                        districtCode: selectedDistrictCode,
                                                        ward: '',
                                                        wardCode: ''
                                                    });
                                                }}
                                                className="border border-gray-300 p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                                                disabled={!chooseAddress.cityCode}
                                            >
                                                <option value="">Select District</option>
                                                {districts.map((district) => (
                                                    <option key={district.code} value={district.code}>{district.name}</option>
                                                ))}
                                            </select>

                                            <select
                                                value={chooseAddress.wardCode || ''}
                                                onChange={(e) => {
                                                    const WardCode = e.target.value;
                                                    const selectedWard = wards.find(ward => ward.code == WardCode);
                                                    setChooseAddress({ ...chooseAddress, wardCode: WardCode });
                                                    setNewAddress({ ...newAddress, ward: selectedWard ? selectedWard.name : '', wardCode: WardCode });
                                                }}
                                                className="border border-gray-300 p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                                                disabled={!chooseAddress.districtCode}
                                            >
                                                <option value="">Select Ward</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex justify-end gap-3 sm:gap-4 mt-5 sm:mt-6">
                                            <button
                                                onClick={() => setIsAddingNew(false)}
                                                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 transition-all text-sm sm:text-base"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAddAddress}
                                                disabled={
                                                    !newAddress.street?.trim() ||
                                                    !newAddress.phoneNumber?.trim() ||
                                                    !newAddress.cityCode?.trim() ||
                                                    !newAddress.districtCode?.trim() ||
                                                    !newAddress.wardCode?.trim()
                                                }
                                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base transition-all ${
                                                    (!newAddress.street?.trim() ||
                                                        !newAddress.phoneNumber?.trim() ||
                                                        !newAddress.cityCode?.trim() ||
                                                        !newAddress.districtCode?.trim() ||
                                                        !newAddress.wardCode?.trim())
                                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Box>
                        </Modal>

                    </div>

                    {/* Payment Method Section */}
                    <div className="p-6 bg-white rounded-lg shadow-md border-t border-gray-200">
                        <span className="text-black text-xl font-semibold mb-4 block">Choose payment method</span>

                        <div className="space-y-4">
                            {/* Cash on Delivery (COD) */}
                            <div className="flex items-center space-x-4">
                                <input
                                    onClick={() => setpaymentMethod("cod")}
                                    type="radio"
                                    id="cod"
                                    name="paymentMethod"
                                    value="cod"
                                    className="w-5 h-5 border-gray-300 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="cod" className="text-base text-gray-800 font-medium">
                                    Cash on delivery (COD)
                                </label>
                            </div>

                            {/* MoMo Payment Option */}
                            <div className="flex items-center space-x-4">
                                <input
                                    onClick={() => setpaymentMethod("momo")}
                                    type="radio"
                                    id="momo"
                                    name="paymentMethod"
                                    value="momo"
                                    className="w-5 h-5 border-gray-300 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="momo" className="flex items-center text-base text-gray-800 font-medium">
                                    <img
                                        src="https://i.pinimg.com/736x/56/3f/f3/563ff3678a3f880cbf06cd4fde819440.jpg"
                                        alt="MoMo Logo"
                                        className="w-8 h-8 mr-2"
                                    />
                                    MoMo
                                </label>
                            </div>
                        </div>
                    </div>


                    {/* Apply Coupon Section */}
                    <div className="p-6 bg-white rounded-lg shadow-md border-t border-gray-200">
                        {/* Apply Coupon Section */}
                        <span className="text-black text-xl font-semibold mb-4 block">Apply Coupon</span>
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                id="couponCode"
                                placeholder="Enter coupon code"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                                className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                                onClick={applyCoupon}
                            >
                                Apply
                            </button>
                        </div>
                        {couponMessage && (
                            <p className="text-sm text-green-600 mt-3">{couponMessage}</p>
                        )}

                        {/* Order Summary Section */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-base font-semibold text-black">Total Products</span>
                                <span className="text-gray-600 text-lg">${calculateTotalPrice()}</span>
                            </div>

                            {/* Discount */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-base font-semibold text-black">Discount</span>
                                <span className="text-green-600 text-lg">{discount > 0 ? `- $${discount}` : "$0"}</span>
                            </div>

                            {/* Shipment Cost */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-base font-semibold text-black">Shipment Cost</span>
                                <span className="text-gray-600 text-lg">${shipmentCost}</span>
                            </div>

                            {/* Total Payment */}
                            <div className="flex justify-between items-center py-3 border-t font-semibold text-black">
                                <span className="text-lg">Total Payment</span>
                                <span className="text-lg text-gray-800">${calculateDiscountedTotal() + shipmentCost}</span>
                            </div>
                        </div>
                    </div>


                    {/* Place Order Button */}
                    <div className="w-full p-4 flex justify-center mt-4">
                        <button
                            className="bg-blue-500 text-white w-full py-3 px-5 rounded-lg font-semibold"
                            onClick={() => handlePurchase(order?._id, selectedAddress,deliveryDetails[selectedOption].detail ,paymentMethod, calculateDiscountedTotal() + shipmentCost)}
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
