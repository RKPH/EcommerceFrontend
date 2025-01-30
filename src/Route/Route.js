import NoheaderLayout from "../Layout/NoheaderLayout";
import NotFound from "../Pages/404";
import Homepage from "../Pages/Homepage";
import KidsPage from "../Pages/Product/KidsPage.jsx";
import LoginPage from "../Pages/User/Login.jsx";
import MenPage from "../Pages/Product/MenPage.jsx";
import WomenPage from "../Pages/Product/WomenPage.jsx";
import DetailProduct from "../Pages/Product/DetailProduct.jsx";
import UserPage from "../Pages/User/User/UserPage.jsx";
import Register from "../Pages/User/Register.jsx";
import Cart from "../Pages/User/Cart.jsx";
import OrderPage from "../Pages/User/Checkout.jsx";
import Checkout from "../Pages/User/Checkout.jsx";
import OrderTracking from "../Pages/Product/OrderTracking.jsx";
import paymentSuccessfully from "../Pages/Product/PaymentSuccessfully.jsx";
import productTypes from "../Pages/Product/productTypes.jsx";

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
    path: "/products/type/:type",
    component:productTypes
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
    path: "/checkout",
    component: Checkout
  },
  {
    path: "/checkout/success/:orderId",
    component: paymentSuccessfully
  },
  {
    path: "/Order/:orderId",
    component: OrderTracking,
  },
  {
    path: "*",
    component: NotFound,
    layout: NoheaderLayout,
  },
];
