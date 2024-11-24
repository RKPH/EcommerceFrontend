import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance"; // Adjust the path to your axios setup
import { useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const DetailProduct = () => {
    const { id } = useParams(); // Get the product ID from the route
    const [product, setProduct] = useState(null); // Initialize state for a single product
    const [error, setError] = useState(null); // To handle and display errors
    const [loading, setLoading] = useState(true); // Loading state

    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/products/${id}`);
            console.log("Response Data:", response.data); // Log for debugging

            // Update the state with the fetched product
            setProduct(response.data.data); // Adjust if API structure differs
        } catch (error) {
            console.error("Error fetching product:", error.message || error);
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };

    // Fetch product details when the component mounts
    useEffect(() => {
        fetchProduct();
    }, [id]); // Dependency array includes `id` to refetch if the route changes

    // Conditional rendering
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex">
            <div className="w-4/5 h-full flex justify-center items-center">
                <ImageList variant="masonry" cols={3} gap={4}>
                    {product?.productImage.map((item, index) => (
                        <ImageListItem key={index}>
                            {item.endsWith(".mp4") ? (
                                <video
                                    src={item}
                                    autoPlay={true}
                                    loading="lazy"
                                    style={{ width: "100%", height: "auto" }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={item} alt={`Product Image ${index}`} loading="lazy" />
                            )}
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <div className="w-1/4 h-full py-7 flex px-12">
                {product ? (
                    <div>
                        <div className="flex my-3 gap-x-1 text-base font-normal">
                            <span>{product.category}</span>
                            <span>•</span>
                            <span>{product.type}</span>
                        </div>
                        <div className="flex flex-col gap-y-3">
                            <h1 className="text-3xl font-bold uppercase">{product.name}</h1>
                            <p className="text-base font-bold">{product.price.toLocaleString()}₫</p>
                        </div>
                    </div>
                ) : (
                    <p>Product not found</p>
                )}
            </div>
        </div>
    );
};

export default DetailProduct;
