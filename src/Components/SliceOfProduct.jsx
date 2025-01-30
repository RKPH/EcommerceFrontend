import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Skeleton from "@mui/material/Skeleton";

const SliceOfProduct = ({ products, TrackViewBehavior, isLoading }) => {
    const [hovered, setHovered] = useState(false); // Hover state for showing/hiding buttons and scrollbar
    const productListRef = useRef(null); // Ref for scrolling

    const handleNext = () => {
        if (productListRef.current) {
            const itemWidth = productListRef.current.firstChild?.offsetWidth || 0; // Width of a single item
            const visibleItems = Math.floor(productListRef.current.offsetWidth / itemWidth); // Number of visible items
            const scrollDistance = itemWidth * visibleItems; // Total scroll distance
            productListRef.current.scrollBy({
                left: scrollDistance,
                behavior: "smooth",
            });
        }
    };

    const handlePrevious = () => {
        if (productListRef.current) {
            const itemWidth = productListRef.current.firstChild?.offsetWidth || 0; // Width of a single item
            const visibleItems = Math.floor(productListRef.current.offsetWidth / itemWidth); // Number of visible items
            const scrollDistance = itemWidth * visibleItems; // Total scroll distance
            productListRef.current.scrollBy({
                left: -scrollDistance,
                behavior: "smooth",
            });
        }
    };

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setHovered(true)} // Show buttons and scrollbar on hover
            onMouseLeave={() => setHovered(false)} // Hide buttons and scrollbar when not hovered
        >
            <ul
                ref={productListRef} // Attach the ref here
                className={`w-full flex gap-x-1 overflow-x-auto pb-5 ${
                    hovered ? "custom-scrollbar" : "custom-scrollbar-hidden"
                }`}
            >
                {isLoading
                    ? // Render skeleton loaders if data is loading
                    Array.from({ length: 10 }).map((_, index) => (
                        <div
                            className="w-52 flex-shrink-0 border border-gray-300 rounded-lg p-2"
                            key={index}
                        >
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={230}
                                className="rounded-[20px]"
                            />
                            <div className="flex flex-col mt-4">
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                            </div>
                        </div>
                    ))
                    : // Render products when data is available
                    products.map((product) => (
                        <Link
                            onClick={() => {
                                TrackViewBehavior(
                                    product?.productID || product?.product_id,
                                    product?.name || product?.productDetails?.name,
                                    "view"
                                );
                            }}
                            to={`/product/${product?.productID || product?.product_id}`} // Use top-level product_id
                            className="w-52 flex-shrink-0 border border-gray-300  hover:shadow-lg"
                            key={product?.productID || product.product_id} // Ensure unique key
                        >
                            <div className="w-full h-[200px] bg-gray-200 ">
                                <img
                                    src={product?.productImage?.[0] || product?.productDetails?.productImage?.[0]} // Safe access for both image arrays
                                    alt={product?.name || product?.productDetails?.name} // Product name with fallback
                                    className="w-full h-full object-fit "
                                />
                            </div>
                            <div className="flex flex-col  p-2">
                                  <span className="font-normal text-base hover:underline">
                                      {product?.name || product?.productDetails?.name}
                                  </span>
                                <Rating
                                    name="half-rating-read"
                                    size={"small"}
                                    defaultValue={product?.rating || product?.productDetails?.rating} // Placeholder rating
                                    precision={0.5}
                                    readOnly
                                />
                                <span className="font-bold text-lg">
                                      ${product?.price || product?.productDetails?.price}
                                  </span>
                            </div>
                        </Link>
                    ))}
            </ul>

            {/* Previous Button */}
            {hovered && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-lg"
                >
                    <ArrowBackIcon />
                </button>
            )}

            {/* Next Button */}
            {hovered && (
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-lg"
                >
                    <ArrowForwardIcon />
                </button>
            )}
        </div>
    );
};

// Define PropTypes for validation
SliceOfProduct.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            productID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.arrayOf(PropTypes.string).isRequired,
            rating: PropTypes.number,
        })
    ).isRequired, // Array of product objects
    TrackViewBehavior: PropTypes.func.isRequired, // Function to track user behavior
    isLoading: PropTypes.bool, // Loading state
};

SliceOfProduct.defaultProps = {
    isLoading: false, // Default loading state is false
};

export default SliceOfProduct;
