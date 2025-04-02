import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AxiosInstance from "../../api/axiosInstance.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../Redux/AuthSlice.js";
import SliceOfProduct from "../../Components/SliceOfProduct.jsx";
import { Button, IconButton, Tooltip } from "@mui/material";
import axios from "axios";

const Cart = () => {
  const { sessionID } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [error2, setError2] = useState(null);
  const [TrendingProducts, setTrendingProducts] = useState([]);
  const [uiRecommendedProducts, setUiRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();

  const trackBehavior = async (id, product_name, event_type) => {
    try {
      const sessionId = user.sessionID;
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
    } catch (error) {
      return error;
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.authAxios.get("/cart/get");
      const items = response.data.data || [];
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const UpdateCart = async (cartItemID, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    try {
      // Update the server
      await AxiosInstance.authAxios.put(`/cart/update`, {
        cartItemID,
        quantity,
      });

      // Update local state directly instead of re-fetching
      setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
              item._id === cartItemID ? { ...item, quantity } : item
          )
      );
    } catch (error) {
      toast.error(error.response.data.message);
      // Optionally, re-fetch cart if the update fails to keep state in sync
      fetchCart();
      return error;
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      }
      return [...prevSelectedItems, itemId];
    });
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
    fetchTrendingProducts();
  }, [user]);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchSessinBaseRecommendedProducts();
    }
  }, [cartItems.length]);

  const fetchTrendingProducts = async () => {
    try {
      const response = await AxiosInstance.normalAxios.get("/products/trending");
      setTrendingProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching trending products:", error.message || error);
    }
  };

  const fetchSessinBaseRecommendedProducts = async () => {
    console.log("Fetching recommended products...");
    setLoading2(true);
    try {
      const lastCartItem = cartItems.length > 0 ? cartItems[cartItems.length - 1] : null;
      if (!lastCartItem) {
        return;
      }

      const request = {
        user_id: user?.user_id,
        product_id: lastCartItem?.productID,
      };

      const response = await AxiosInstance.normalAxios.post(`/products/recommendations`, request);
      setError2(null);
      setUiRecommendedProducts(response?.data?.data);
    } catch (error) {
      setError2(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading2(false);
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
    const confirmDelete = window.confirm("Are you sure you want to remove this item from your cart?");
    if (!confirmDelete) return;

    try {
      await AxiosInstance.authAxios.delete(`/cart/delete`, {
        data: { cartItemID },
      });
      dispatch(getUserProfile());
      setCartItems((prevCartItems) => prevCartItems.filter((item) => item._id !== cartItemID));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove the item");
      return error;
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedItems.length) {
      toast.error("Please select items to proceed with checkout!");
      return;
    }

    try {
      const shippingAddress = `${user?.address?.street || user?.user?.address?.street}, ${user?.address?.city || user?.user?.address?.city}`;
      const PaymentMethod = "COD";

      const products = cartItems
          .filter((item) => selectedItems.includes(item._id))
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

      selectedItems.forEach((itemId) => {
        const item = cartItems.find((item) => item._id === itemId);
        const productId = item.productID;
        const productName = item.product.name;
        trackBehavior(productId, productName, "checkout");
      });
      navigate("/checkout", { state: { refetch: true, orders: cartItems } });
    } catch (error) {
      toast.error("Failed to create order");
      return error;
    }
  };

  const trackViewBehavior = async (id, product_name, event_type) => {
    try {
      const sessionId = sessionID;
      const userId = user?.id || user?.user?.id;

      if (!sessionId || !userId) {
        return;
      }

      await AxiosInstance.authAxios.post("/tracking", {
        sessionId,
        user: userId,
        productId: id,
        product_name: product_name,
        behavior: event_type,
      });
    } catch (error) {
      return error;
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
      toast.info("All items deselected");
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
      toast.success("All items selected");
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center py-6 w-full flex-col 3xl:px-[200px] md:px-[100px] px-4 bg-gray-100">
        {/* Breadcrumbs */}
        <div className="w-full mb-6">
          <Breadcrumbs aria-label="breadcrumb" separator="›" className="text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-red-500">
              <HomeIcon fontSize="small" />
              Home
            </Link>
            <span className="text-gray-900 font-medium flex items-center gap-1">
            <ShoppingCartIcon fontSize="small" />
            Cart
          </span>
          </Breadcrumbs>
        </div>

        {cartItems.length > 0 ? (
            <div className="flex flex-col w-full">
              {/* Table for larger screens */}
              <div className="hidden md:block w-full min-h-fit max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-separate border-spacing-y-4 border-spacing-x-0">
                  <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4">Select</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Subtotal</th>
                    <th className="py-3 px-4">
                      <DeleteIcon />
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {cartItems.map((item) => (
                      <tr key={item._id} className="bg-white hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <input
                              id={`checkbox-${item._id}`}
                              type="checkbox"
                              className="text-red-500 focus:ring-red-500"
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleSelectItem(item._id)}
                              aria-label={`Select ${item.product.name}`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Link
                              className="flex items-center space-x-4"
                              to={`/product/${item.product.product_id}`}
                              onClick={() => trackBehavior(item.product.product_id, item.product.name, "view")}
                          >
                            <img
                                src={item.product.MainImage}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex flex-col">
                              <span className="text-lg font-semibold text-gray-900">{item.product.name}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-900">${item.product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => UpdateCart(item._id, Math.max(item.quantity - 1, 1))}
                                className="w-8 h-8 bg-gray-100 text-gray-800 hover:bg-gray-300 flex items-center justify-center rounded"
                                aria-label={`Decrease quantity of ${item.product.name}`}
                            >
                              -
                            </button>
                            <span className="w-10 h-8 border flex items-center justify-center text-center text-gray-900">
                          {item.quantity}
                        </span>
                            <button
                                onClick={() => UpdateCart(item._id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-100 text-gray-800 hover:bg-gray-300 flex items-center justify-center rounded"
                                aria-label={`Increase quantity of ${item.product.name}`}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          ${(item.product.price.toFixed(2) * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Tooltip title="Remove item">
                            <IconButton
                                onClick={() => handleDeleteItem(item._id)}
                                aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <DeleteIcon className="text-red-500" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Card layout for mobile */}
              <div className="md:hidden w-full">
                {cartItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white p-4 mb-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <input
                              type="checkbox"
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleSelectItem(item._id)}
                              className="focus:ring-red-500 text-red-500"
                              aria-label={`Select ${item.product.name}`}
                          />
                          <Link
                              to={`/product/${item.product.product_id}`}
                              onClick={() => trackBehavior(item.product.product_id, item.product.name, "view")}
                          >
                            <img
                                src={item.product.MainImage}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                          </Link>
                        </div>
                        <div className="flex flex-col flex-grow ml-4">
                          <div className="flex justify-between items-center">
                            <Link
                                to={`/product/${item.product.product_id}`}
                                onClick={() => trackBehavior(item.product.product_id, item.product.name, "view")}
                            >
                              <span className="text-base font-semibold text-gray-900">{item.product.name}</span>
                            </Link>
                            <Tooltip title="Remove item">
                              <IconButton
                                  onClick={() => handleDeleteItem(item._id)}
                                  aria-label={`Remove ${item.product.name} from cart`}
                              >
                                <DeleteIcon className="text-red-500" />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                      <span className="text-base font-semibold text-gray-900">
                        ${(item.product.price.toFixed(2) * item.quantity).toFixed(2)}
                      </span>
                            <div className="flex items-center gap-2">
                              <button
                                  onClick={() => UpdateCart(item._id, Math.max(item.quantity - 1, 1))}
                                  className="w-8 h-8 bg-gray-100 text-gray-800 hover:bg-gray-300 flex items-center justify-center rounded"
                                  aria-label={`Decrease quantity of ${item.product.name}`}
                              >
                                -
                              </button>
                              <span className="w-10 h-8 border flex items-center justify-center text-center text-gray-900">
                          {item.quantity}
                        </span>
                              <button
                                  onClick={() => UpdateCart(item._id, item.quantity + 1)}
                                  className="w-8 h-8 bg-gray-100 text-gray-800 hover:bg-gray-300 flex items-center justify-center rounded"
                                  aria-label={`Increase quantity of ${item.product.name}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-full p-4 bg-gray-50 shadow-md rounded-lg mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Total Items:</span>
                  <span className="font-semibold text-gray-900">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Total Price:</span>
                  <span className="font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        className="text-red-500 focus:ring-red-500"
                        onChange={handleSelectAll}
                        aria-label="Select all items"
                    />
                    <span className="text-sm text-gray-700">Choose All</span>
                  </label>
                  <Button
                      variant="contained"
                      onClick={handleCreateOrder}
                      startIcon={<ShoppingCartCheckoutIcon />}
                      sx={{
                        backgroundColor: "#ef4444",
                        "&:hover": { backgroundColor: "#dc2626" },
                      }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="w-full mt-10">
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                  <h1 className="text-xl text-gray-900 font-semibold w-full text-start">You May Also Like</h1>
                  <SliceOfProduct
                      products={uiRecommendedProducts}
                      TrackViewBehavior={trackViewBehavior}
                      isLoading={loading2}
                  />
                </div>
              </div>
            </div>
        ) : (
            <>
              <div className="flex bg-white w-full min-h-[200px] flex-col items-center justify-center gap-y-4 p-4 rounded-xl shadow-md">
                <img
                    src="https://salt.tikicdn.com/ts/upload/43/fd/59/6c0f335100e0d9fab8e8736d6d2fbcad.png"
                    alt="empty cart"
                    className="w-32 h-32 object-contain"
                />
                <h1 className="text-xl font-semibold text-gray-900">Your Cart is Empty</h1>
                <span className="text-gray-700">View our recommended products below</span>
                <Button
                    variant="outlined"
                    color="error"
                    component={Link}
                    to="/"
                    sx={{ borderColor: "#ef4444", color: "#ef4444", "&:hover": { borderColor: "#dc2626", color: "#dc2626" } }}
                >
                  Shop Now
                </Button>
              </div>
              <div className="w-full mt-10">
                <div className="w-full mb-5 flex gap-y-5 bg-white rounded-xl flex-col py-4 px-4">
                  <h1 className="text-xl text-gray-900 font-semibold w-full text-start">Best Selling Products</h1>
                  <SliceOfProduct products={TrendingProducts} TrackViewBehavior={trackViewBehavior} />
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default Cart;