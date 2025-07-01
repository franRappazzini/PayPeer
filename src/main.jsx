import "./index.css";

import { RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import router from "./routes.jsx";

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
