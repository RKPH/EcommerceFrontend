import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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


  return (
    <header className="w-full h-[132px] bg-black">
      <div className="w-full h-10 bg-black  flex items-center justify-center">
        <span className="text-base text-gray-200">
          Sign up and get 10% off on your first order. <span className="underline text-base text-white"> Sign up now</span>
        </span>
      </div>
      <div className="w-full h-[92px] bg-white px-[100px] flex items-center justify-between">
        {/*logo*/}
        <div>
          <Link to="/">
            <img src="https://micro-front-end-sport-ecommerce-homepage.vercel.app//logo.png" alt="logo" className="h-14"/>
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
        <div className="w-[577px] h-14 flex items-center relative">
          {/* Input Field */}
          <input
              type="text"
              placeholder="Search for products"
              className="border w-full bg-[#F0F0F0] h-full border-gray-300 p-2 pl-12 rounded-3xl"
          />
          {/* Search Icon */}
          <div className="absolute left-4 text-gray-500 cursor-pointer">
            <SearchIcon />
          </div>
        </div>
        {/*user profile*/}
        <div className="flex items-center gap-x-4">
          <Link to="/cart" className="text-gray-800 hover:text-black">
            <ShoppingCartIcon />
          </Link>
          <Link to={isAuthenticated ? "/me" : "/login"} className="text-gray-800 hover:text-black">
            {isAuthenticated ? user?.name || user?.user.name : <AccountCircleIcon/>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
