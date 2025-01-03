import NoheaderLayout from "../Layout/NoheaderLayout";
import NotFound from "../Pages/404";
import Homepage from "../Pages/Homepage";
import KidsPage from "../Pages/Product/KidsPage.jsx";
import LoginPage from "../Pages/User/Login.jsx";
import MenPage from "../Pages/Product/MenPage.jsx";
import WomenPage from "../Pages/Product/WomenPage.jsx";
import DetailProduct from "../Pages/Product/DetailProduct.jsx";
import UserPage from "../Pages/User/UserPage.jsx";
import Register from "../Pages/User/Register.jsx";
import Cart from "../Pages/User/Cart.jsx";
import OrderPage from "../Pages/User/Checkout.jsx";

Homepage;

export const publicRoutes = [
  {
    path: "/",
    component: Homepage,
  },
  {
    path: "/Men",
    component: MenPage,
  },
  {
    path: "/Women",
    component: WomenPage,
  },
  {
    path: "/Kid",
    component: KidsPage,
  },
  {
    path: "/Login",
    component: LoginPage,
    layout: NoheaderLayout,
  },
  {
    path: "/Register",
    component: Register,
    layout: NoheaderLayout,
  },
  {
    path: "/Me",
    component: UserPage,
  },
  {
    path: "/product/:id",
    component: DetailProduct,
  },
  {
    path: "/cart",
    component: Cart,
  },
  {
    path: "/Order",
    component: OrderPage,
  },
  {
    path: "*",
    component: NotFound,
    layout: NoheaderLayout,
  },
];
