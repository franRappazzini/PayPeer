import "./index.css";
import "./i18n";

import { RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import router from "./routes.jsx";

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
