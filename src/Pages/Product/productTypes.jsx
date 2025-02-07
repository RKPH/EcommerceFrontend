import React, { useState, useEffect } from "react";
import AxiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Paginition from "../../Components/Pagination.jsx";
import Rating from "@mui/material/Rating";

const ProductCategoryPage = () => {
    let { type } = useParams();
    type = type.toLowerCase();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        brand: "",
        price: [0, 1000],
        type: "",
        category: "",
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20); // You can change this number as needed
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await AxiosInstance.normalAxios.get(`/products/type/${type}`, {
                    params: {
                        page: currentPage,
                        limit: productsPerPage,
                        brand: filters.brand,
                        price_min: filters.price[0],
                        price_max: filters.price[1],
                        type: filters.type,
                        category: filters.category,
                    },
                });
                console.log("products by types ", response.dataz)
                // Update products and pagination state
                setProducts(response.data.data);
                setTotalProducts(response.data.pagination.totalProducts); // totalProducts from API response
                setTotalPages(response.data.pagination.totalPages); // totalPages from API response
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                console.error("Error fetching products:", error.message || error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [type, filters, currentPage, productsPerPage]);

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleClearFilters = () => {
        setFilters({
            brand: "",
            price: [0, 1000],
            type: "",
            category: "",
        });
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row px-4 3xl:px-[200px] md:px-[100px] gap-x-2 py-6 bg-gray-100">
            {/* Filters Section */}
            <div className="w-full md:w-1/5 bg-white p-4 rounded-md shadow mb-6 md:mb-0">
                <h3 className="text-lg font-bold mb-4">Filters</h3>

                {/* Brand Filter */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Brand</label>
                    <input
                        type="text"
                        placeholder="Enter brand"
                        value={filters.brand}
                        onChange={(e) => handleFilterChange("brand", e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Price Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.price[0]}
                            onChange={(e) =>
                                handleFilterChange("price", [Number(e.target.value), filters.price[1]])
                            }
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.price[1]}
                            onChange={(e) =>
                                handleFilterChange("price", [filters.price[0], Number(e.target.value)])
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Type Filter */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Type</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">All Types</option>
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                        <option value="type3">Type 3</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block font-semibold mb-2">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">All Categories</option>
                        <option value="category1">Category 1</option>
                        <option value="category2">Category 2</option>
                        <option value="category3">Category 3</option>
                    </select>
                </div>
            </div>

            {/* Products Section */}
            <div className="w-full md:w-4/5 flex flex-col gap-y-2 rounded-md shadow">
                <div className="w-full p-4 flex items-center text-center bg-white">
                    <h3 className="text-lg font-bold mb-4 uppercase ">{type}</h3>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : products.length > 0 ? (
                    <div className="w-full bg-white p-4">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <Link
                                    onClick={() => {
                                        trackViewBehavior(
                                            product?.productID || product?.product_id,
                                            product?.name || product?.productDetails?.name,
                                            "view"
                                        );
                                    }}
                                    to={`/product/${product?.productID || product?.product_id}`}
                                    className="border w-52 flex-shrink-0 border-gray-300 hover:shadow-lg  "
                                    key={product?.productID || product.product_id}
                                >
                                    <div className="w-full h-[200px] bg-gray-200">
                                        <img
                                            src={product?.productImage?.[0] || product?.productDetails?.image?.[0]}
                                            alt={product?.name || product?.productDetails?.name}
                                            className="w-full h-full object-fit rounded-lg"
                                        />
                                    </div>
                                    <div className="flex flex-col p-2">
                                <span className="font-normal text-base hover:underline">
                                    {product?.name || product?.productDetails?.name}
                                </span>
                                        <Rating
                                            name="half-rating-read"
                                            size="small"
                                            defaultValue={product?.rating || product?.productDetails?.rating}
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
                    </div>

                ) : (
                    <p className="text-gray-600">No products found matching the filters.</p>
                )}

                <div className="w-full flex justify-center py-5 my-5">
                    <Paginition
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                        type={type}
                    />
                </div>
                {/* Pagination Controls */}

            </div>
        </div>
    );
};

export default ProductCategoryPage;
