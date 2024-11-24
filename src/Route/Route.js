import NoheaderLayout from "../Layout/NoheaderLayout";
import NotFound from "../Pages/404";
import Homepage from "../Pages/Homepage";
import KidsPage from "../Pages/KidsPage";
import LoginPage from "../Pages/Login";
import MenPage from "../Pages/MenPage";
import WomenPage from "../Pages/WomenPage";
import DetailProduct from "../Pages/DetailProduct.jsx";

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
    path: "/product/:id",
    component: DetailProduct,
  },
  {
    path: "*",
    component: NotFound,
    layout: NoheaderLayout,
  },
];
