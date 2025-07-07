import AppLayout from "./layouts/app-layout";
import AppPage from "./pages/app";
import CreateOrderPage from "./pages/create-order";
import HomeLayout from "./layouts/home-layout";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import WalletPage from "./pages/wallet";
import { createBrowserRouter } from "react-router";

const routes = [
  {
    path: "/",
    Component: HomeLayout,
    children: [{ index: true, Component: HomePage }],
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: AppPage },
      { path: "profile", Component: ProfilePage },
      { path: "wallet", Component: WalletPage },
      { path: "orders/create", Component: CreateOrderPage },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
