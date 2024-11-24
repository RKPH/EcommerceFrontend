import React, { useState, useEffect, useRef } from "react";
import ProductCard from "../Components/ProductCard.jsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MenPage = () => {
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const listRef = useRef(null);


  const [products, setProducts] = useState([]);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/products/all");

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.data); // Set fetched products to the state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

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
      <div className="Men-page">
        <div className="w-full h-auto relative mb-16">
          {/* Banner */}
          <div className="_fill-image_154ez_1" data-auto-id="picture">
            <picture>
              <source
                  srcSet="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/4985239_Mini_Masthead_DT_2880x720_1_4869aa5588.jpg"
                  media="(min-width: 960px)"
                  width="2880"
                  height="720"
              />
              <source
                  srcSet="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_960,w_960/4985239_Mini_Masthead_MO_720x920_15614a9463.jpg"
                  media="(min-width: 768px)"
                  width="720"
                  height="920"
              />
              <source
                  srcSet="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_768,w_768/4985239_Mini_Masthead_MO_720x920_770a023e6d.jpg"
                  media="(max-width: 767px)"
                  width="720"
                  height="920"
              />
              <img
                  src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/4985239_Mini_Masthead_DT_2880x720_1_4869aa5588.jpg"
                  alt="Men's Fashion"
                  loading="eager"
                  fetchPriority="high"
              />
            </picture>
          </div>

          {/* Text content positioned at the bottom-left corner */}
          <div className="absolute bottom-0 left-0 p-8 space-y-4">
            <h1 className="text-white text-2xl md:text-4xl font-bold">
              Men's Fashion
            </h1>
            <p className="text-white text-lg">Latest Trends and Styles</p>
          </div>
        </div>

        {/* Product List */}
        <div className="w-full h-auto mt-8">
          <div className="flex items-center justify-between px-4" >
            <h2 className="text-xl font-bold">Featured Products</h2>
          </div>

          <div className="flex w-full items-center justify-center mt-2 relative">
            {showPrev && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 z-10 p-4 px-5 bg-white text-black border border-black"
                >
                  <ArrowBackIcon/>
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
                  <ArrowForwardIcon/>
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default MenPage;
