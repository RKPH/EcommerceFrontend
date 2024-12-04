import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import "./Homepage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const bannerUrl =
    "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/4894144_CAM_Onsite_FW_24_Lo_Profile_Incubation_Hoyeon_1_Oct_SEA_CLP_GLP_Masthead_Banner_DT_2880x1280px_456b1f8c70.jpg";

const Homepage = () => {
    const [categories, setCategories] = useState([]); // Store fetched categories
    const [products, setProducts] = useState([]); // Store fetched products
    const [randomCategories, setRandomCategories] = useState([]); // Store 2 random categories
    const [selectedCategory, setSelectedCategory] = useState(""); // Selected category for product fetch
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(true);
    const listRef = useRef(null);

    // Fetch all product categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/products/types");
            const fetchedCategories = response.data.data; // Assuming the response contains an array of categories
            if (fetchedCategories.length > 0) {
                const randomSelected = getRandomItems(fetchedCategories, 2);
                setRandomCategories(randomSelected);
                setCategories(fetchedCategories); // Store all categories
                setSelectedCategory(randomSelected[0]); // Default to the first random category
            }
        } catch (error) {
            console.error("Error fetching categories:", error.message || error);
        }
    };

    // Utility function to get n random items from an array
    const getRandomItems = (array, n) => {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    };

    // Fetch products for the selected category
    const fetchProductsByCategory = async (category) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/products/types/${category}`);
            setProducts(response.data.data); // Assuming the response contains an array of products
        } catch (error) {
            console.error("Error fetching products:", error.message || error);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when the selected category changes
    useEffect(() => {
        if (selectedCategory) {
            fetchProductsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    const handleScroll = () => {
        const list = listRef.current;
        setShowPrev(list.scrollLeft > 0);
        setShowNext(list.scrollWidth > list.scrollLeft + list.clientWidth);
    };

    const scrollLeft = () => {
        listRef.current.scrollBy({ left: -600, behavior: "smooth" });
    };

    const scrollRight = () => {
        listRef.current.scrollBy({ left: 600, behavior: "smooth" });
    };

    return (
        <main className="w-full h-full">
            <div className="w-full my-2">
                {/* Display Random Categories */}
                <div className="flex gap-x-4 px-5 font-[AdihausDIN] text-lg font-bold mb-4">
                    {randomCategories.map((category) => (
                        <span
                            key={category}
                            className={`px-4 py-2 cursor-pointer ${
                                selectedCategory === category
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-black hover:bg-black hover:text-white"
                            }`}
                            onClick={() => setSelectedCategory(category)}
                        >
              {category}
            </span>
                    ))}
                </div>

                {/* Product List with Navigation */}
                <div className="flex w-full items-center justify-center mt-2 relative">
                    {showPrev && (
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 z-10 p-4 px-5 bg-white text-black border border-black"
                        >
                            <ArrowBackIcon />
                        </button>
                    )}

                    <ul
                        ref={listRef}
                        onScroll={handleScroll}
                        className="flex gap-x-4 overflow-x-auto w-[98%] py-2 min-h-fit flex-nowrap custom-scrollbar"
                    >
                        {products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </ul>

                    {showNext && (
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 z-10 p-4 px-5 bg-white text-black border border-black"
                        >
                            <ArrowForwardIcon />
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full h-auto bg-cover bg-center my-2">
                <img src={bannerUrl} className="w-full h-auto" alt="Banner" />
            </div>
        </main>
    );
};

export default Homepage;
