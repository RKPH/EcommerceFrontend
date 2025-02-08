import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axiosInstance.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { GetColorName } from "hex-color-to-color-name";
import DeleteIcon from "@mui/icons-material/Delete";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SliceOfProduct from "../../Components/SliceOfProduct.jsx";
import axios from "axios";

const Cart = () => {
  const { sessionID } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // New state for selected items
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux state for the logged-in user
  const [TrendingProducts, setTrendingProducts] = useState([]);
  const [uiRecommendedProducts, setUiRecommendedProducts] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);

  const trackBehavior = async (id, product_name, event_type) => {
    try {
      const sessionId = sessionID;
      const userId = user?.id || user?.user?.id;

      if (!sessionId || !userId) {
        console.error("Session ID or User ID is missing!");
        return;
      }

      await AxiosInstance.authAxios.post("/tracking", {
        sessionId,
        user: userId,
        productId: id,
        product_name: product_name,
        behavior: event_type,
      });
      console.log("Behavior tracked successfully");
    } catch (error) {
      console.error("Error tracking behavior:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await AxiosInstance.authAxios.get("/cart/get");
      const items = response.data.data || [];
      console.log("Fetched cart items:", items);
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  const UpdateCart = async (cartItemID, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    try {
      await AxiosInstance.authAxios.put(`/cart/update`, {
        cartItemID,
        quantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error.message);
      toast.error("Failed to update the cart");
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId); // Deselect if already selected
      }
      return [...prevSelectedItems, itemId]; // Add to selected items
    });
  };
  useEffect(() => { fetchSessinBaseRecommendedProducts(); }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
    fetchTrendingProducts();

  }, [user]);

  useEffect(() => {
    fetchSessinBaseRecommendedProducts();
  }, [cartItems]);
  const fetchTrendingProducts = async () => {
    try {
      const response = await axios.get(
          "http://103.155.161.94:3000/api/v1/products/trending"
      );
      setTrendingProducts(response.data.data); // Assuming the response contains an array of products
      console.log("Fetched Trending Products:", response.data.data); // Log the fetched products
    } catch (error) {
      console.error("Error fetching trending products:", error.message || error);
    }
  };
  console.log("Product ID from cart:", cartItems[length-1]?.productID);

  const fetchSessinBaseRecommendedProducts = async () => {
    console.log("Fetching recommended products...");
    setLoading2(true); // Start loading before the request

    try {
      // Ensure cartItems is not empty and access the last item safely
      const lastCartItem = cartItems.length > 0 ? cartItems[cartItems.length - 1] : null;

      if (!lastCartItem) {
        console.error("No items in cart");
        return;
      }

      const request = {
        user_id: user?.user_id, // Assuming user_id is available in your component
        product_id: lastCartItem?.productID, // Access the productID of the last cart item
        event_type: "cart"
      };

      console.log("Request:", request); // Log for debugging

      // Pass request directly as the request body
      const response = await AxiosInstance.normalAxios.post(`/products/recommendations`, request);

      console.log("Recommended Products 2:", response?.data?.data); // Log for debugging
      setError2(null); // Clear any previous errors

      setUiRecommendedProducts(response?.data?.data); // Set recommended products
      setLoading2(false); // Stop loading
    } catch (error) {
      console.error("Error fetching recommended products:", error?.message || error);
      setError2(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading2(false); // Stop loading in both success and error cases
    }
  };


  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      if (cartItem.product && selectedItems.includes(cartItem._id)) {
        return total + cartItem.product.price * cartItem.quantity;
      }
      return total;
    }, 0);
  };

  const handleDeleteItem = async (cartItemID) => {
    console.log("Deleting item:", cartItemID);
    try {
      // Make the delete request
      await AxiosInstance.authAxios.delete(`/cart/delete`, {
        data: { cartItemID }, // Pass the cart item ID in the request body
      });

      // Update the cartItems state locally
      setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item._id !== cartItemID)
      );

      // Show a success message
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error deleting cart item:", error.message);
      toast.error("Failed to remove the item");
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedItems.length) {
      alert("Please select items to proceed with checkout!");
      return;
    }

    try {
      const shippingAddress = `${user?.address?.street || user?.user?.address?.street}, ${user?.address?.city || user?.user?.address?.city}`;
      const PaymentMethod = "COD";

      const products = cartItems
          .filter((item) => selectedItems.includes(item._id)) // Only selected items
          .map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          }));

      const orderData = {
        user: user._id || user?.user?._id,
        shippingAddress,
        PaymentMethod,
        products,
      };

      await AxiosInstance.authAxios.post("/orders/addOrder", orderData);
      toast.success("Order created successfully!");
      selectedItems.forEach((itemId) => {
        const item = cartItems.find((item) => item._id === itemId);
        const productId = item.productID;
        const productName = item.product.name;
        trackBehavior(productId, productName, "checkout");
      });
      navigate("/checkout", { state: { refetch: true, orders: cartItems } });
    } catch (error) {
      console.error("Error creating order:", error.message);
      toast.error("Failed to create the order");
    }
  };

  const trackViewBehavior = async (id, product_name, event_type) => {
    try {
      const sessionId = sessionID;
      const userId = user?.id || user?.user?.id;

      if (!sessionId || !userId) {
        console.error("Session ID or User ID is missing!");
        return;
      }

      await AxiosInstance.authAxios.post("/tracking", {
        sessionId,
        user: userId,
        productId: id,
        product_name: product_name,
        behavior: event_type,
      });
      console.log("View behavior tracked successfully");
    } catch (error) {
      console.error("Error tracking view behavior:", error);
    }
  };

  return (
      <div className="min-h-screen flex items-center py-6 w-full flex-col 3xl:px-[200px] md:px-[100px]">
        <div className="w-full mb-5">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
            <Typography color="text.primary">Cart</Typography>
          </Breadcrumbs>
        </div>
        {cartItems.length > 0 ? (
            <div className="flex flex-col w-full ">
              <div className="w-full flex items-start  gap-x-2">
                <div className="w-full min-h-fit max-h-[500px]  overflow-y-auto ">
                  <table className="w-full text-left border-separate border-spacing-y-4 border-spacing-x-0">
                    <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4">Select</th>
                      <th className="py-2 px-4">Product</th>
                      <th className="py-2 px-4">Price</th>
                      <th className="py-2 px-4">Quantity</th>
                      <th className="py-2 px-4">Subtotal</th>
                      <th className="py-2 px-4">
                        <DeleteIcon />
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id} className="bg-white">
                          <td className="py-2 px-4">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleSelectItem(item._id)}
                            />
                          </td>
                          <td className="flex items-center space-x-4">
                            <Link
                                className="py-2 px-2 flex items-center space-x-4"
                                to={`/product/${item.product.productID}`}
                                onClick={() =>
                                    trackBehavior(item.product.productID, item.product.name, "view")
                                }
                            >
                              <img
                                  src={item.product.image[0]}
                                  alt={item.product.name}
                                  className="w-24 h-24 object-cover rounded text-[0px]"
                              />
                              <div className="flex flex-col">
                                <span className="text-lg font-semibold">{item.product.name}</span>
                                <span className="text-xs text-gray-800">Color: {GetColorName(item.color)}</span>
                                <span className="text-xs text-gray-800">Size: {item.size}</span>
                              </div>
                            </Link>
                          </td>
                          <td className="py-2 px-4">{item.product.price} VND</td>
                          <td className="py-2 px-4">
                            <div className="flex items-center">
                              <button
                                  onClick={() =>
                                      UpdateCart(item._id, Math.max(item.quantity - 1, 1))
                                  }
                                  className="w-7 h-7 bg-gray-100 text-gray-800 hover:bg-gray-300 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-7 h-7 border flex items-center justify-center text-center">
                                              {item.quantity}
                                            </span>
                              <button
                                  onClick={() => UpdateCart(item._id, item.quantity + 1)}
                                  className="w-7 h-7 bg-gray-100 text-gray-800 hover:bg-gray-300 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            ${ (item.product.price.toFixed(2) * item.quantity).toFixed(2) }
                          </td>
                          <td className="py-2 px-4">
                            <button
                                className="text-red-500"
                                onClick={() => handleDeleteItem(item._id)}
                            >
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-full h-fit max-w-sm p-4  shadow-md bg-white ml-auto mt-4">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Items:</span>
                    <span>{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <button
                        onClick={handleCreateOrder}
                        className="w-2/3 mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full mt-10  ">
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                  <h1 className="text-xl text-black font-normal w-full text-start">You may also like</h1>
                  <SliceOfProduct products={uiRecommendedProducts} TrackViewBehavior={trackViewBehavior} isLoading={loading2}/>
                </div>
              </div>
            </div>
        ) : (
            <>
              <div className="flex bg-white w-full min-h-[100px] flex-col items-center justify-center gap-y-2 p-4">
                <img src="https://salt.tikicdn.com/ts/upload/43/fd/59/6c0f335100e0d9fab8e8736d6d2fbcad.png"
                     alt="empty cart" className="w-1/12"/>
                <h1 className="text-xl font-semibold">Your cart is empty</h1>
                <span> View our recommended products below</span>
              </div>
              <div className="w-full mt-10  ">
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                  <h1 className="text-xl text-black font-semibold w-full text-start">Best Selling Products</h1>
                  <SliceOfProduct products={TrendingProducts} TrackViewBehavior={trackViewBehavior}/>
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default Cart;
