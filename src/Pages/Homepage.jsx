import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import "./Homepage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const bannerUrl =
    "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/4894144_CAM_Onsite_FW_24_Lo_Profile_Incubation_Hoyeon_1_Oct_SEA_CLP_GLP_Masthead_Banner_DT_2880x1280px_456b1f8c70.jpg";

const Homepage = () => {
  const [categories, setCategories] = useState([]); // Store fetched types
  const [products, setProducts] = useState([]); // Store fetched products
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const listRef = useRef(null);

  // Fetch all product types
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/products/types");
      setCategories(response.data.data); // Assuming the response contains an array of types
      setSelectedCategory(response.data.data[0]); // Default to the first type
    } catch (error) {
      console.error("Error fetching categories:", error.message || error);
    }
  };

  // Fetch products for a specific type
  const fetchProductsByType = async (type) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/products/types/${type}`);
      setProducts(response.data.data); // Assuming the response contains an array of products
    } catch (error) {
      console.error("Error fetching products:", error.message || error);
    }
  };

  // Fetch categories and products on component mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
    };
    initializeData();
  }, []);

  // Fetch products when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByType(selectedCategory);
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
          <ul className="flex gap-x-4 w-full bg-white px-5 font-[AdihausDIN] text-base font-bold">
            {categories.map((category) => (
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
