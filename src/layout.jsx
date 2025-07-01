import { Button } from "./components/ui/button";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
("react");

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
};

export default Layout;
