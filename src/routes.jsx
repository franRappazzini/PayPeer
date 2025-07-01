import Home from "@pages/home";
import Layout from "./layout";
import { createBrowserRouter } from "react-router";

const routes = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        // again, no path, just a component for the layout
        // Component: ProjectLayout,
        // children: [
        //   { path: ":pid", Component: Project },
        //   { path: ":pid/edit", Component: EditProject },
        // ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
