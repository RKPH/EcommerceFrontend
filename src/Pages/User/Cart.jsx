import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosInstance from "../../api/axiosInstance.js";
import { GetColorName } from 'hex-color-to-color-name';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const fetchCart = async () => {
    try {
      const response = await AxiosInstance.authAxios.get("/cart/get");
      const items = response.data.data || [];
      setCartItems(items);

      const productIds = items.map((item) => item.product._id);
      fetchProductDetails(productIds);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const productRequests = productIds.map((id) =>
          AxiosInstance.authAxios.get(`/products/${id}`)
      );
      const productResponses = await Promise.all(productRequests);
      setProductDetails(productResponses.map((res) => res.data.data));
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      const product = productDetails.find(
          (product) => product._id === cartItem.product._id
      );
      if (product) {
        return total + product.price * cartItem.quantity;
      }
      return total;
    }, 0);
  };

  return (
      <div className="h-screen flex items-center py-6 w-full flex-col px-[100px]">
        <div className="w-full">
          <div className="w-full h-80 my-4 flex flex-col space-y-2">
            <h1 className="font-bold font-integralcf text-3xl uppercase">
              Your Cart
            </h1>
            <div className="flex">
            <span className="font-normal text-base">
              Total items: {cartItems.length}
            </span>
            </div>
            <div className="w-full grid grid-cols-12 gap-x-5 justify-between">
              <div className="mt-4 col-span-7 p-4 border border-gray-300 rounded-2xl">
                {cartItems.length > 0 ? (
                    cartItems.map((cartItem, index) => {
                      const product = productDetails.find(
                          (product) => product._id === cartItem.product._id
                      );

                      if (product) {
                        const colorIndex = product.color.findIndex(
                            (c) => c.toLowerCase() === cartItem.color.toLowerCase()
                        );
                        const imageToDisplay =
                            colorIndex !== -1 && product.image[colorIndex]
                                ? product.image[colorIndex]
                                : product.image[0];

                        return (
                            <div key={index} className="flex w-full h-32 border my-7">
                              <div className="w-fit h-32">
                                <img
                                    className="w-32 h-32 object-cover rounded-md"
                                    src={imageToDisplay}
                                    alt={product.name}
                                />
                              </div>
                              <div className="flex w-full flex-col justify-between py-2 px-4">
                                <div className="flex flex-col justify-between">
                                  <div className="flex justify-between">
                                    <p className="font-bold text-xl">
                                      {product.name}
                                    </p>
                                    <DeleteIcon
                                        className="cursor-pointer text-red-500"
                                        onClick={() => console.log("Delete item")}
                                    />
                                  </div>
                                  {cartItem.size && (
                                      <p className="text-sm font-normal text-gray-400">
                                        Size: {cartItem.size}
                                      </p>
                                  )}
                                  <p className="text-sm font-normal text-gray-400">
                                    Color: {GetColorName(cartItem.color)}
                                  </p>
                                </div>
                                <div className="flex justify-between">
                                  <p className="font-bold text-xl text-black">
                                    {product.price.toLocaleString()}₫
                                  </p>
                                  <div className="flex h-9 w-24 items-center justify-center bg-gray-200 border rounded-3xl p-1">
                                    <button className="w-1/3 text-xl font-bold">
                                      -
                                    </button>
                                    <div className="w-1/3 text-center">
                                      {cartItem.quantity}
                                    </div>
                                    <button className="w-1/3 text-xl font-bold">
                                      +
                                    </button>
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
                  <div className="w-full flex items-center justify-between">
                    <div className="w-2/3 h-12 flex items-center relative">
                      <input
                          type="text"
                          placeholder="Apply promo code"
                          className="border w-full bg-[#F0F0F0] h-full border-gray-300 p-2 pl-12 rounded-3xl"
                      />
                      <div className="absolute left-4 text-gray-500 cursor-pointer">
                        <LocalOfferIcon className="text-gray-300" />
                      </div>
                    </div>
                    <button className="w-1/4 h-12 py-2 bg-black text-white font-semibold rounded-3xl hover:bg-gray-800 transition ">
                      Apply
                    </button>
                  </div>
                  <button className="w-full h-12 py-2 bg-black text-white font-semibold rounded-3xl hover:bg-gray-800 transition mt-4">
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
