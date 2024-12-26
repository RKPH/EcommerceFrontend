import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AxiosInstance from "../../api/axiosInstance.js";
import { GetColorName } from "hex-color-to-color-name";

const Order = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const user = useSelector((state) => state.auth.user);



    useEffect(() => {
        if (user) {
            fetchOrderItems();
        }
    }, [user]);

    const calculateTotal = () => {
        return orderItems.reduce((total, orderItem) => {
            const product = productDetails.find(
                (product) => product._id === orderItem.product._id
            );
            if (product) {
                return total + product.price * orderItem.quantity;
            }
            return total;
        }, 0);
    };

    return (
        <div className="h-screen flex items-center py-6 w-full flex-col px-[100px]">

        </div>
    );
};

export default Order;
