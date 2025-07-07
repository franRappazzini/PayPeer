import "./index.css";
import "./i18n";

import { RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import { env } from "./lib/env.js";
import router from "./routes.jsx";

env.DFX_NETWORK === "local" && (window.global = window);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
