﻿import React, { useState, useEffect } from "react";
import AxiosInstance from "../../api/axiosInstance";
import { useParams, Link } from "react-router-dom";
import Pagination from "../../Components/Pagination.jsx";
import Rating from "@mui/material/Rating";

const ProductCategoryPage = () => {
    let { type } = useParams();
    type = type.toLowerCase();

    const defaultFilters = {
        brand: "",
        price: [0, 1000],
        rating: null,
    };

    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
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
                        brand: appliedFilters.brand,
                        price_min: appliedFilters.price[0],
                        price_max: appliedFilters.price[1],
                        rating: appliedFilters.rating,
                    },
                });
                setProducts(response.data.data);
                setTotalProducts(response.data.pagination.totalProducts);
                setTotalPages(response.data.pagination.totalPages);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                console.error("Error fetching products:", error.message || error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [type, appliedFilters, currentPage, productsPerPage]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row px-4 md:px-6 lg:px-[100px] 2xl:px-[200px] gap-x-2 py-6 bg-gray-100">
            {/* Filters Section */}
            <div className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-5">Filters</h3>

                {/* Brand Filter */}
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Brand</label>
                    <input
                        type="text"
                        placeholder="Enter brand"
                        value={filters.brand}
                        onChange={(e) => handleFilterChange("brand", e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Price Filter */}
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Price Range</label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.price[0]}
                            onChange={(e) => handleFilterChange("price", [Number(e.target.value), filters.price[1]])}
                            className="w-1/2 p-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.price[1]}
                            onChange={(e) => handleFilterChange("price", [filters.price[0], Number(e.target.value)])}
                            className="w-1/2 p-1 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Rating</label>
                    <div className="flex flex-col gap-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={rating}
                                    checked={filters.rating === rating}
                                    onChange={() => handleFilterChange("rating", rating)}
                                    className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <Rating name="read-only" value={rating} readOnly size="small" />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-2">
                    <button
                        onClick={applyFilters}
                        className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={clearFilters}
                        className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Products Section */}
            <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col gap-y-2 rounded-md shadow">
                <div className="w-full p-4 flex items-center gap-x-2 text-center bg-white">
                    <h3 className="text-lg font-bold uppercase">{type}</h3>
                    <span className="text-base font-normal">{totalProducts}</span>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : products.length > 0 ? (
                    <div className="w-full bg-white p-4">
                        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <Link to={`/product/${product.productID || product.product_id}`} key={product.productID || product.product_id} className="border w-full flex flex-col border-gray-300 hover:shadow-lg rounded-lg">
                                    <div className="w-full h-[200px] bg-gray-200">
                                        <img src={product.MainImage} alt={product.name} className="w-full h-full object-contain rounded-t-lg" />
                                    </div>
                                    <div className="flex flex-col p-2">
                                        <span className="font-normal text-base hover:underline">{product.name}</span>
                                        <Rating name="half-rating-read" size="small" value={product.rating} readOnly />
                                        <span className="font-bold text-lg">${product.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-600">No products found matching the filters.</p>
                )}

                <div className="w-full flex justify-center py-5 my-5">
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} type={type} />
                </div>
            </div>
        </div>
    );
};

export default ProductCategoryPage;
