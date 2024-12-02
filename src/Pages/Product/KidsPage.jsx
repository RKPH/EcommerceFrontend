import { useState, useRef } from "react";

const KidsPage = () => {
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const listRef = useRef(null);

  // Product pool
  const products = [
    {
      name: "Messi Training Jersey",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "700,000₫",
    },
    {
      name: "Brand Love Backpack",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "650,000₫",
    },
    {
      name: "Marvel Avengers Backpack",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "800,000₫",
    },
    {
      name: "Tiro Tee Kids",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "700,000₫",
    },
    {
      name: "New Sports Shoe",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "1,000,000₫",
    },
    {
      name: "Running Shoes",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "1,200,000₫",
    },
    {
      name: "Running Shoes",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "1,200,000₫",
    },
    {
      name: "Running Shoes",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "1,200,000₫",
    },
    {
      name: "Running Shoes",
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/952d4b8966944834a3a14cb29de5d7cb_9366/Messi_Training_Jersey_Kids_Purple_IZ2999_21_model.jpg",
      price: "1,200,000₫",
    },
  ];

  // State to track the current index of the products being displayed
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle the next button
  const handleNext = () => {
    if (currentIndex + 4 < products.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  // Handle the previous button
  const handlePrev = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  return (
    <div className="kids-page">
      {/* Hero  */}
      <div className="w-full h-auto relative mb-16 ">
        <img
          src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/Banner_a4bb4fcaa6.jpg"
          alt="Kids Banner"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold">
            ADIDAS Z.N.E.
          </h1>
          <button className="bg-white text-black py-2 px-6 text-lg font-semibold rounded hover:bg-gray-300 transition-all duration-300">
            SHOP SPORTSWEAR
          </button>
        </div>
      </div>

      {/* Age Range Section */}
      <div className="p-10">
        <div className="flex flex-row justify-center gap-2">
          <div className="age-group mb-4 ">
            <img
              src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_530,w_530/SS_18_YA_Infants_Q1_Ecomm_A_FC_Age_F_640x640_4b47ce365a.jpg"
              alt="0-4 Years"
              className="w-full h-full object-cover rounded-lg"
            />
            <button className="text-black underline mt-2 hover:bg-black hover:text-white hover:no-underline transition-all duration-300 text-xl">
              0-4 Years
            </button>
          </div>
          <div className="age-group mb-4 ">
            <img
              src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_530,w_530/SS_18_YA_Little_Kids_Ecomm_A_FC_Age_F_640x640_22744c9e24.jpg"
              alt="4-8 Years"
              className="w-full h-full object-cover rounded-lg"
            />
            <button className="text-black underline mt-2 hover:bg-black hover:text-white hover:no-underline transition-all duration-300 text-xl">
              4-8 Years
            </button>
          </div>
          <div className="age-group mb-4">
            <img
              src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_530,w_530/SS_18_YA_Running_Ecomm_AFC_Collection_Mobile_M_2_640x640_new_f3e0c136a9.jpg"
              alt="8-16 Years"
              className="w-full h-full object-cover rounded-lg"
            />
            <button className="text-black underline mt-2 hover:bg-black hover:text-white hover:no-underline transition-all duration-300 text-xl">
              8-16 Years
            </button>
          </div>
        </div>
      </div>

      {/* Disney Pegasus Collection  with Video */}
      <div className="relative w-full h-[500px] mb-16 mt-10">
        <video
          loop
          muted
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source
            src="https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_1920,w_1920/originals_fw24_disney_pegasus_global_launch_hp_banner_hero_d_39b502e9ef.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-white text-4xl md:text-6xl font-bold">
            Disney Pegasus Collection
          </h2>
          <p className="text-white text-lg">
            Spread your wings with the Disney Pegasus collection.
          </p>
          <button className="bg-white text-black py-2 px-6 text-lg font-semibold rounded hover:bg-gray-300 transition-all duration-300">
            Shop Now
          </button>
        </div>
      </div>

      {/* Top Sellers  */}
      <div className="p-16 relative ">
        <h2 className="text-center text-3xl font-bold mb-6">Top Sellers</h2>

        {/* Slider Wrapper */}
        <div className="relative w-full overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out">
            {products.map((product, index) => (
              <div key={index} className="min-w-[25%] text-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[200px] object-cover rounded-lg"
                />
                <p className="text-lg mt-2">{product.name}</p>
                <span className="text-gray-600">{product.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-8 relative">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-700 transition-all duration-300 ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + 4 >= products.length}
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-700 transition-all duration-300 ${
              currentIndex + 4 >= products.length
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidsPage;
