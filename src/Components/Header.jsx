import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../assets/logo.png";
import {useSelector,useDispatch} from "react-redux";
import {getUserProfile} from "../Redux/AuthSlice.js";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const dispatch = useDispatch();
  let hideTimeout;
 const {isAuthenticated,user} = useSelector((state) => state.auth);

  const handleMouseEnter = (menu) => {
    clearTimeout(hideTimeout);
    setActiveMenu(menu);
  };
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());  // Fetch user profile after authentication
    }
  }, [isAuthenticated, user, dispatch]);
  console.log("auth state:", useSelector((state) => state.auth));
  console.log("at header", isAuthenticated, "user", user);
  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  // Updated menuItems with subitems
  const menuItems = [
    {
      label: "MEN",
      url: "/men",
      classNames: "font-bold",
      items: [
        {
          items: [
            {
              label: "Features",
              icon: "pi pi-shirt",
              subitems: [
                { label: "New Arrivals", icon: "pi pi-shirt" },
                {
                  label: "11.11 Sales",
                  icon: "pi pi-jacket",
                  classNames: "uppercase text-red-500",
                },
                { label: "Release dates", icon: "pi pi-shirt" },
                { label: "Member exclusives", icon: "pi pi-jacket" },
                { label: "This week top sellers", icon: "pi pi-shirt" },
                { label: "Z.N.E", icon: "pi pi-jacket" },
                { label: "Samba", icon: "pi pi-shirt" },
                { label: "Gazelle", icon: "pi pi-jacket" },
                { label: "Special", icon: "pi pi-shirt" },
                { label: "SL 72", icon: "pi pi-jacket" },
                { label: "Superstar", icon: "pi pi-shirt" },
                { label: "Stan Smith", icon: "pi pi-jacket" },
                { label: "Campus", icon: "pi pi-jacket" },
                { label: "Forum", icon: "pi pi-shirt" },
                { label: "addidas Essentials", icon: "pi pi-jacket" },
              ],
            },
            {
              label: "Shoes",
              icon: "pi pi-shoe",
              subitems: [
                { label: "New Arrivals", icon: "pi pi-shoe" },
                { label: "Originals", icon: "pi pi-boot" },
                { label: "Football", icon: "pi pi-shoe" },
                { label: "Training", icon: "pi pi-boot" },
                { label: "Running", icon: "pi pi-shoe" },
                { label: "Outdoor", icon: "pi pi-boot" },
                { label: "Basketball", icon: "pi pi-shoe" },
                { label: "Slides", icon: "pi pi-boot" },
                { label: "Tennis", icon: "pi pi-boot" },
                { label: "Sportwear", icon: "pi pi-shoe" },
                { label: "Golf", icon: "pi pi-boot" },
                { label: "Black sneakers", icon: "pi pi-shoe" },
                { label: "Must have shoes", icon: "pi pi-boot" },
              ],
            },
            {
              label: "Clothing",
              icon: "pi pi-shirt",
              subitems: [
                { label: "T-shirts", icon: "pi pi-tshirt" },
                { label: "Jeans", icon: "pi pi-jeans" },
              ],
            },
            {
              label: "Accessories",
              icon: "pi pi-wallet",
              subitems: [
                { label: "Bags", icon: "pi pi-bag" },
                { label: "Hats", icon: "pi pi-hat" },
              ],
            },
            {
              label: "Sports",
              icon: "pi pi-wallet",
              subitems: [
                { label: "Bags", icon: "pi pi-bag" },
                { label: "Hats", icon: "pi pi-hat" },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "WOMEN",
      url: "/women",
      classNames: "font-bold",
      items: [
        {
          items: [
            {
              label: "Features",
              icon: "pi pi-shirt",
              subitems: [
                { label: "Shirts", icon: "pi pi-shirt" },
                { label: "Jackets", icon: "pi pi-jacket" },
              ],
            },
            {
              label: "Shoes",
              icon: "pi pi-shoe",
              subitems: [
                { label: "Running Shoes", icon: "pi pi-shoe" },
                { label: "Boots", icon: "pi pi-boot" },
              ],
            },
            {
              label: "Clothing",
              icon: "pi pi-shirt",
              subitems: [
                { label: "T-shirts", icon: "pi pi-tshirt" },
                { label: "Jeans", icon: "pi pi-jeans" },
              ],
            },
            {
              label: "Accessories",
              icon: "pi pi-wallet",
              subitems: [
                { label: "Bags", icon: "pi pi-bag" },
                { label: "Hats", icon: "pi pi-hat" },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "KIDS",
      url: "/Kid",
      classNames: "font-bold",
      items: [
        {
          items: [
            {
              label: "Toys",
              icon: "pi pi-toy",
              subitems: [
                { label: "Action Figures", icon: "pi pi-toy" },
                { label: "Dolls", icon: "pi pi-toy" },
              ],
            },
            {
              label: "Clothing",
              icon: "pi pi-shirt",
              subitems: [
                { label: "T-shirts", icon: "pi pi-tshirt" },
                { label: "Jeans", icon: "pi pi-jeans" },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Sports",
      url: "/sports",
      classNames: "font-normal",
      items: [
        {
          items: [
            {
              label: "Clothing",
              icon: "pi pi-shirt",
              subitems: [
                { label: "T-shirts", icon: "pi pi-tshirt" },
                { label: "Jeans", icon: "pi pi-jeans" },
              ],
            },
            {
              label: "Shoes",
              icon: "pi pi-shoe",
              subitems: [
                { label: "T-shirts", icon: "pi pi-tshirt" },
                { label: "Jeans", icon: "pi pi-jeans" },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Brands",
      url: "/brands",
      classNames: "font-normal",
      items: [
        {
          items: [
            { label: "Clothing", icon: "pi pi-shirt" },
            { label: "Shoes", icon: "pi pi-shoe" },
          ],
        },
      ],
    },
    {
      label: "New Arrivals",
      url: "/brands",
      classNames: "font-normal",
      items: [
        {
          items: [
            { label: "Clothing", icon: "pi pi-shirt" },
            { label: "Shoes", icon: "pi pi-shoe" },
          ],
        },
      ],
    },
    {
      label: "Outlets",
      url: "",
      classNames: "font-normal text-red-500",
      items: [
        {
          items: [
            { label: "Clothing", icon: "pi pi-shirt" },
            { label: "Shoes", icon: "pi pi-shoe" },
          ],
        },
      ],
    },
  ];

  return (
    <header className="w-full h-[121px] bg-black relative">
      <div className="w-full h-10 bg-black flex items-center justify-center tracking-[1.2px]">
        <button className="h-full text-[11px] font-[AdihausDIN] uppercase font-bold text-white px-10 hover:opacity-50 hover:bg-gray-800">
          Easy return{" "}
          <span>
            <ExpandMoreIcon />{" "}
          </span>
        </button>
      </div>
      <div className="w-full h-[81px] px-10 bg-white">
        <div className="flex w-full items-center justify-end h-1/3 py-2">
          <ul className="flex space-x-4">
            <a href="#" className="text-xs hover:underline">
              help
            </a>
            <a href="#" className="text-xs hover:underline">
              order tracker
            </a>
            <Link to="/Login" className="text-xs hover:underline">
              {isAuthenticated ? `Hi,${user?.name}` : "Become a member"}
            </Link>
            <img
              src="https://flagcdn.com/w40/vn.png"
              alt="Vietnam flag"
              width={30}
            />
          </ul>
        </div>

        <nav className="grid grid-cols-4 items-center w-full px-4">
          <Link to="/" className="justify-self-start col-span-1">
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "auto",
                height: "auto",
                display: "block",
                margin: 0,
                padding: 0,
              }}
            />
          </Link>

          <ul
            className="flex justify-center text-sm font-semibold col-span-2"
            onMouseLeave={handleMouseLeave}
          >
            {menuItems.map((menu) => (
              <Link
                key={menu.label}
                to={menu.url}
                onClick={() => setActiveMenu(null)}
                className={` ${menu.classNames} px-3 hover:underline  uppercase`}
                onMouseEnter={() => handleMouseEnter(menu.label)}
              >
                {menu.label}
              </Link>
            ))}
          </ul>

          <div className="flex items-center justify-end space-x-4 col-span-1">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 px-3 py-2 rounded-md text-sm outline-none"
            />
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
                d="M21 21l-4.35-4.35m1.085-5.365a6.375 6.375 0 11-12.75 0 6.375 6.375 0 0112.75 0z"
              />
            </svg>
            <div className="relative">
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
                  d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 18a7.5 7.5 0 00-15 0"
                />
              </svg>
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-yellow-400 text-xs flex items-center justify-center">
                0
              </span>
            </div>
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
                d="M21 11.25V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v4.5m18 0v6.75a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V11.25"
              />
            </svg>
          </div>
        </nav>
      </div>

      {/* Submenu Render Logic */}
      {activeMenu && (
        <div
          className="absolute top-[121px] left-0 w-full bg-white shadow-lg z-50"
          onMouseEnter={() => clearTimeout(hideTimeout)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-center space-x-10">
            {menuItems
              .filter((menu) => menu.label === activeMenu)
              .map((menu) =>
                menu.items.map((section) =>
                  section.items.map((item) =>
                    item.subitems ? (
                      <div
                        key={item.label}
                        className="flex flex-col px-10 py-3 "
                      >
                        <Link
                          to={item.label}
                          className="font-semibold uppercase hover:underline"
                        >
                          {item.label}
                        </Link>
                        {item.subitems.map((subitem) => (
                          <Link
                            key={subitem.label}
                            to={`/subcategory/${subitem.label.toLowerCase()}`}
                            className={`text-sm py-1  hover:underline ${subitem.classNames}`}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    ) : null
                  )
                )
              )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
