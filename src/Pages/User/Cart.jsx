import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axiosInstance.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import {toast} from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const user = useSelector((state) => state.auth.user); // Redux state for the logged-in user
  console.log("user", user);
  const fetchCart = async () => {
    try {
      const response = await AxiosInstance.authAxios.get("/cart/get");
      const items = response.data.data || [];
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      if (cartItem.product) {
        return total + cartItem.product.price * cartItem.quantity;
      }
      return total;
    }, 0);
  };

  const handleDeleteItem = (productID) => {
    // Implement delete logic here
    console.log("Delete item with ID:", productID);
  };

  const handleCreateOrder = async () => {
    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // Combine user address for shippingAddress
      const shippingAddress = `${user.user.address.street}, ${user.user.address.city}`;
      const PaymentMethod = "COD"; // Hardcoded for demonstration

      const products = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const orderData = {
        user: user._id,
        shippingAddress,
        PaymentMethod,
        products,
      };

      const response = await AxiosInstance.authAxios.post("/orders/addOrder", orderData);
      console.log("Order created successfully:", response.data);
      toast.success("Order created successfully!");

    } catch (error) {
      console.error("Error creating order:", error.message);
      alert("Error creating order. Please try again.");
    }
  };

  return (
      <div className="h-screen flex items-center py-6 w-full flex-col px-[100px]">
        <div className="w-full mb-10">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
            <Typography color="text.primary">Cart</Typography>
          </Breadcrumbs>
        </div>
        <div className="w-full">
          <div className="w-full h-80 my-4 flex flex-col space-y-2">
            <h1 className="font-bold font-integralcf text-3xl uppercase">Your Cart</h1>
            <div className="flex">
              <span className="font-normal text-base">Total items: {cartItems.length}</span>
            </div>
            <div className="w-full grid grid-cols-12 gap-x-5 justify-between">
              <div className="mt-4 col-span-7 p-4 border border-gray-300 rounded-2xl">
                {cartItems.length > 0 ? (
                    cartItems.map((cartItem, index) => {
                      const product = cartItem.product;
                      if (product) {
                        return (
                            <div key={index} className="flex w-full h-32 border my-7">
                              <div className="w-fit h-32">
                                <img
                                    className="w-32 h-32 object-contain rounded-md"
                                    src={product.image[0]} // Display the first product image
                                    alt={product.name}
                                />
                              </div>
                              <div className="flex w-full flex-col justify-between py-2 px-4">
                                <div className="flex flex-col justify-between">
                                  <div className="flex justify-between">
                                    <p className="font-bold text-xl">{product.name}</p>
                                    <DeleteIcon
                                        className="cursor-pointer text-red-500"
                                        onClick={() => handleDeleteItem(cartItem.productID)}
                                    />
                                  </div>
                                  {cartItem.size && (
                                      <p className="text-sm font-normal text-gray-400">Size: {cartItem.size}</p>
                                  )}
                                  <p className="text-sm font-normal text-gray-400">
                                    Color: {cartItem.color}
                                  </p>
                                </div>
                                <div className="flex justify-between">
                                  <p className="font-bold text-xl text-black">
                                    {product.price.toLocaleString()}₫
                                  </p>
                                  <div className="flex h-9 w-24 items-center justify-center bg-gray-200 border rounded-3xl p-1">
                                    <button className="w-1/3 text-xl font-bold">-</button>
                                    <div className="w-1/3 text-center">{cartItem.quantity}</div>
                                    <button className="w-1/3 text-xl font-bold">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                        );
                      } else {
                        return (
                            <p key={index} className="text-gray-500">
                              Loading product details...
                            </p>
                        );
                      }
                    })
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
              </div>
              <div className="mt-4 col-span-5 h-fit py-5 px-6 space-y-3 border border-gray-300 rounded-2xl">
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-2xl">Order Summary</h1>
                </div>
                <div className="w-full flex flex-col gap-y-3">
                  <div className="flex justify-between">
                    <p className="font-normal text-xl text-gray-400">Subtotal</p>
                    <p className="font-bold text-xl text-black">
                      {calculateTotal().toLocaleString()}₫
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-normal text-xl text-gray-400">Shipping</p>
                    <p className="font-normal text-xl text-black">0₫</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-normal text-xl text-gray-400">Tax</p>
                    <p className="font-normal text-xl text-black">0₫</p>
                  </div>
                  <div className="h-[1px] w-full bg-gray-200"></div>
                  <div className="flex justify-between">
                    <p className="font-normal text-xl text-gray-400">Total</p>
                    <p className="font-bold text-xl text-black">
                      {calculateTotal().toLocaleString()}₫
                    </p>
                  </div>
                  <button
                      onClick={handleCreateOrder}
                      className="w-full h-12 py-2 bg-black text-white font-semibold rounded-3xl hover:bg-gray-800 transition mt-4"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Cart;
