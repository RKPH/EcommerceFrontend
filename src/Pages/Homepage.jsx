import React, { useState, useEffect, useRef } from "react";
import AxiosInstance from "../api/axiosInstance.js";
import ProductCard from "../Components/ProductCard";
import "./Homepage.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const bannerUrl =
    "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/4894144_CAM_Onsite_FW_24_Lo_Profile_Incubation_Hoyeon_1_Oct_SEA_CLP_GLP_Masthead_Banner_DT_2880x1280px_456b1f8c70.jpg";

// Sample product data with multiple categories
const categories = [
  "DropSet",
  "Adizero",
  "New Arrivals",
  "Taekwondo" /* other categories */,
];


const getRandomCategories = (categories, count) => {
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Homepage = () => {
  const [currentCategories, setCurrentCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const listRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await AxiosInstance.publicAxios.get("http://localhost:3000/api/v1/products/all");
      console.log("Response Data:", response.data); // Log the response for debugging
      console.log("Request Headers:", response.config.headers);
      // Update the state with the fetched products
      setProducts(response.data.data); // Assuming the API returns the data directly in `response.data`
    } catch (error) {
      console.error("Error fetching products:", error.message || error);
      throw new Error(`Failed to fetch products: ${error.response?.status || error.message}`);
    }
  };


  useEffect(() => {
    const initialCategories = getRandomCategories(categories, 4);
    setCurrentCategories(initialCategories);
    setSelectedCategory(initialCategories[0]);

    // Fetch products on component mount
    fetchProducts();
  }, []);

  useEffect(() => {
    // Log products after the state has been updated
    console.log("Fetched Products:", products);
  }, [products]); // Dependency on products ensures this runs after state update

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
          <ul className="flex gap-x-4 w-full bg-white px-5 font-[AdihausDIN] text-base font-bold">
            {currentCategories.map((category) => (
                <li
                    key={category}
                    className={`p-3 border border-black cursor-pointer ${
                        selectedCategory === category
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
            ))}
          </ul>

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
              {products
                  .map((product, index) => (
                      <ProductCard key={index}
                      product={product}
                      />
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
