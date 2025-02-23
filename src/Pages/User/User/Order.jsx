import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const OrderList = ({ orders, selectedTab, setSelectedTab }) => {
    return (
        <div className="min-h-[500px] bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
            <div className="bg-white w-full py-4 rounded-lg mt-4">
                <div className="flex space-x-6 p-4 items-center overflow-x-auto">
                    {["all", "Pending", "Confirmed", "Delivering", "canceled"].map((tab) => (
                        <div
                            key={tab}
                            className={`cursor-pointer mb-4 ${selectedTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {orders.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center mt-5">
                        <img
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                            alt="Empty Orders"
                            className="w-40 h-40"
                        />
                        <p className="text-gray-500 text-lg mt-4">You have no orders yet</p>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className="w-full min-h-[120px] bg-white border border-gray-200 my-4 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                            <div className="flex justify-between items-center">
                                <p className="text-base text-gray-800 font-semibold flex items-center">
                                    {order.status === "Draft" ? (
                                        <div className="w-full flex justify-between items-center border-b border-gray-200 py-3 gap-x-4">
                                            <div className="flex items-center">
                                                <PaymentsIcon className="mr-2 text-gray-400" />
                                                Draft
                                            </div>
                                            <Link to={"/checkout"} className="text-sm text-blue-500 hover:text-blue-600">
                                                Checkout
                                            </Link>
                                        </div>
                                    ) : order.status === "Pending" ? (
                                        <div className="w-full flex justify-between items-center border-b border-gray-200 py-3 gap-x-4">
                                            <div className="flex items-center">
                                                <LocalShippingIcon className="mr-2 text-gray-400" />
                                                {order.status}
                                            </div>
                                            <Link to={`/order/${order?._id}`} className="text-sm text-blue-500 hover:text-blue-600">
                                                View Details
                                            </Link>
                                        </div>
                                    ) : (
                                        <span className="text-gray-600">{order.status}</span>
                                    )}
                                </p>
                            </div>

                            <ul className="w-full mt-3">
                                {order?.products?.map((product, index) => (
                                    <Link
                                        to={`/product/${product?.product?.productID || product.product?.product_id}`}
                                        key={index}
                                        className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg transition duration-200"
                                    >
                                        <img
                                            src={product.product.MainImage}
                                            alt={product.product.name}
                                            className="w-20 h-20 rounded-md border object-cover"
                                        />
                                        <div className="w-full">
                                            <p className="text-base text-gray-800 font-medium">{product.product.name}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-gray-500">Qty: x{product.quantity}</span>
                                                <span className="text-gray-800 font-semibold">
                                                    {product.product.price.toLocaleString("vi-VN")} đ
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

OrderList.propTypes = {
    orders: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            products: PropTypes.arrayOf(
                PropTypes.shape({
                    product: PropTypes.shape({
                        productID: PropTypes.string,
                        product_id: PropTypes.string,
                        MainImage: PropTypes.string.isRequired,
                        name: PropTypes.string.isRequired,
                        price: PropTypes.number.isRequired,
                    }).isRequired,
                    quantity: PropTypes.number.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
    selectedTab: PropTypes.string.isRequired,
    setSelectedTab: PropTypes.func.isRequired,
};

export default OrderList;
