import React, { useState, useEffect } from "react";
import AxiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Paginition from "../../Components/Pagination.jsx";

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
                const response = await AxiosInstance.authAxios.get(`/products/type/${type}`, {
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
        <div className="min-h-screen flex flex-col md:flex-row px-4 3xl:px-[200px] md:px-[100px] py-6 bg-gray-100">
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
            <div className="w-full md:w-4/5 bg-white p-4 rounded-md shadow">
                <h3 className="text-lg font-bold mb-4">Products</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : products.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <li
                                key={product.id}
                                className="border p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                                <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                                <p className="text-gray-600">Brand: {product.brand}</p>
                                <p className="text-gray-600">Price: ${product.price}</p>
                                <p className="text-gray-600">Category: {product.category}</p>
                                <Link
                                    to={`/product/${product.productID}`}
                                    className="text-blue-500 hover:underline mt-2 block"
                                >
                                    View Details
                                </Link>
                            </li>
                        ))}
                    </ul>
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
