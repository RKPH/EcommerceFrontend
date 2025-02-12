import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";

import {logoutUserApi} from "../Redux/AuthSlice.js";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LoginIcon from '@mui/icons-material/Login';
import {useNavigate} from "react-router-dom";
import Tippy from "@tippyjs/react/headless"; // Use headless for custom rendering
import {useSelector,useDispatch} from "react-redux";
import {getUserProfile} from "../Redux/AuthSlice.js";

const Header = () => {

  const dispatch = useDispatch();

 const {isAuthenticated,user} = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (isAuthenticated && !user) {
          await dispatch(getUserProfile());
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user, dispatch]);

  const navigate = useNavigate();
  return (
    <header className="w-full h-[132px] bg-black">
      <div className="w-full h-10 bg-black  flex items-center justify-center">
        <span className="text-base text-gray-200">
          {isAuthenticated ? (
              `Welcome, ${user?.name || user?.user?.name}`
          ) : (
              <>
                Sign up and get 10% off on your first order.{" "}
                <Link to="/Login" className="underline text-base text-white">
                  Sign up now
                </Link>
              </>
          )}
        </span>
      </div>
      <div className="w-full h-[92px] bg-white 3xl:px-[200px] md:px-[100px] flex items-center justify-between">
        {/*logo*/}
        <div>
          <Link to="/">
            <img src="https://micro-front-end-sport-ecommerce-homepage.vercel.app//logo.png" alt="logo"
                 className="h-14"/>
          </Link>
        </div>
        {/*nav links*/}
        <div className="px-4">
          <nav>
            <ul className="flex items-center gap-x-8">
              <li>
                <Link to="/" className="text-base text-gray-800 hover:text-black">Shop</Link>
              </li>
              <li>
                <Link to="/products" className="text-base text-gray-800 hover:text-black">On sale</Link>
              </li>
              <li>
                <Link to="/about" className="text-base text-gray-800 hover:text-black">New Arrivals</Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-800 hover:text-black">Brands</Link>
              </li>
            </ul>
          </nav>
        </div>
        {/*search bar*/}
        <div className="w-1/3 h-12 flex items-center relative">
          {/* Input Field */}
          <input
              type="text"
              placeholder="Search for products"
              className="border w-full bg-[#F0F0F0] h-full border-gray-300 p-2 pl-12 rounded-xl"
          />
          {/* Search Icon */}
          <div className="absolute left-4 text-gray-500 cursor-pointer">
            <SearchIcon />
          </div>
        </div>
        {/*user profile*/}
        <div className="flex items-center gap-x-4">
          <FavoriteBorderIcon className="text-gray-800" />
          <Link to="/cart" className="relative text-gray-800 hover:text-black">
            <ShoppingCartIcon />
            {user?.Cart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {user?.Cart}
                </span>
            )}
          </Link>
          {isAuthenticated ? (
              <Tippy
                  render={(attrs) => (
                      <div
                          className="bg-white w-[200px] border rounded-md shadow-md py-3 text-sm"
                          tabIndex="-1"
                          {...attrs}
                      >
                        <Link to="/me" className="block hover:bg-gray-200 w-full p-2 mb-2">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block hover:bg-gray-200 w-full p-2 mb-2">
                          My wishlist
                        </Link>
                        <button
                            className="block w-full text-left hover:bg-gray-200 p-2"
                            onClick={() => {
                              // Add logout logic here
                              dispatch(logoutUserApi());
                              navigate("/");
                            }}
                        >
                          Logout
                        </button>
                      </div>
                  )}
                  interactive
                  placement="bottom-end"
                  popperOptions={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, 0], // No space between the trigger and the dropdown
                        },
                      },
                    ],
                  }}
              >
                <div className="flex items-center gap-x-2 cursor-pointer p-3 rounded-md hover:bg-gray-200">
                  <SentimentSatisfiedAltIcon />
                  {user?.name || user?.user?.name || "Unknown User"}
                </div>
              </Tippy>
          ) : (
              <Link
                  to="/login"
                  className="flex gap-x-2 items-center hover:bg-gray-200 p-3 rounded-md"
              >
                <LoginIcon />
                <span>Login</span>
              </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
