import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { logoutUserApi, getUserProfile } from "../Redux/AuthSlice.js";
import {useNavigate} from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import Tippy from "@tippyjs/react/headless";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import axios from "axios";

// Memoized CartIcon that only re-renders when the cart count changes.
const CartIcon = React.memo(() => {
  const cartCount = useSelector(
      (state) => state.cart.totalItems,
      shallowEqual
  );
  return (
      <Link to="/cart" className="relative text-gray-800 hover:text-black">
        <ShoppingCartIcon />
        {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cartCount}
        </span>
        )}
      </Link>
  );
});

// Memoized user menu component to isolate re-renders.
const UserMenu = memo(({ user, dispatch, navigate }) => {
  return (
      <Tippy
          render={(attrs) => (
              <div
                  className="bg-white w-[200px] border rounded-md shadow-md py-3 text-sm"
                  tabIndex="-1"
                  {...attrs}
              >
                <Link
                    to="/me"
                    className="block hover:bg-gray-200 w-full p-2 mb-2"
                >
                  My Profile
                </Link>
                <button
                    className="block w-full text-left hover:bg-gray-200 p-2"
                    onClick={() => {
                      dispatch(logoutUserApi());
                      navigate("/login");
                    }}
                >
                  Logout
                </button>
              </div>
          )}
          interactive
          placement="bottom-end"
      >
        <div className="flex items-center gap-x-2 cursor-pointer p-3 rounded-md hover:bg-gray-200">
          <img src={user?.avatar} className="w-10 h-10 rounded-full" alt="" />
          <span className="hidden md:block">{user?.name || user?.user?.name || "Unknown User"}</span>
        </div>
      </Tippy>
  );
});

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
      (state) => state.auth.isAuthenticated,
      shallowEqual
  );
  const user = useSelector((state) => state.auth.user, shallowEqual);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (searchInputRef.current) {
        setInputWidth(searchInputRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
          searchInputRef.current &&
          !searchInputRef.current.contains(e.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
        document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
            `http://localhost:3000/api/v1/products/search?query=${searchTerm}`
        );
        setSearchResults(response.data.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounce = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleResultClick = useCallback(() => {
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
  }, []);

  return (
      <header className="w-full h-[132px] bg-black">
        <div className="w-full h-10 bg-black flex items-center justify-center">
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
        <div className="w-full h-[92px] bg-white flex items-center justify-between gap-x-2 px-4  md:px-6 lg:px-[100px] 2xl:px-[200px]">
          <div className="hidden md:block">
            <Link to="/">
              <img
                  src="https://micro-front-end-sport-ecommerce-homepage.vercel.app//logo.png"
                  alt="logo"
                  className="h-14"
              />
            </Link>
          </div>
          {/* Search Bar with Live Search */}
          <Tippy
              visible={showDropdown}
              interactive
              placement="bottom-start"
              render={(attrs) => (
                  <div
                      className="bg-white border rounded-md shadow-md py-2"
                      tabIndex="-1"
                      ref={dropdownRef}
                      style={{ width: `${inputWidth}px` }}
                      {...attrs}
                  >
                    {searchResults?.length > 0 ? (
                        searchResults.map((product) => (
                            <Link
                                key={product._id}
                                to={`/product/${product.productID}`}
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={handleResultClick}
                            >
                              {product.name}
                            </Link>
                        ))
                    ) : (
                        <p className="px-4 py-2 text-gray-500">No results found</p>
                    )}
                  </div>
              )}
          >
            <div className="w-3/4 md:w-1/2 h-12 flex items-center relative">
              <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products"
                  className="border w-full bg-[#F0F0F0] h-full border-gray-300 p-2 pl-12 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 text-gray-500 cursor-pointer">
                <SearchIcon />
              </div>
            </div>
          </Tippy>
          <div className="flex items-center md:gap-x-4 gap-x-1">
            <CartIcon />
            {isAuthenticated ? (
                <UserMenu user={user} dispatch={dispatch} navigate={navigate} />
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

export default memo(Header);