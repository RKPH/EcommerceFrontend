import NoheaderLayout from "../Layout/NoheaderLayout";
import NotFound from "../Pages/404";
import Homepage from "../Pages/Homepage";
import KidsPage from "../Pages/Product/KidsPage.jsx";
import LoginPage from "../Pages/User/Login.jsx";
import MenPage from "../Pages/Product/MenPage.jsx";
import WomenPage from "../Pages/Product/WomenPage.jsx";
import DetailProduct from "../Pages/Product/DetailProduct.jsx";
import UserPage from "../Pages/User/UserPage.jsx";

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
    path: "/Me",
    component: UserPage,
  },
  {
    path: "/product/:id",
    component: DetailProduct,
  },
  {
    path: "*",
    component: NotFound,
    layout: NoheaderLayout,
  },
];
