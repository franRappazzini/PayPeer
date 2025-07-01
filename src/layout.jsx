import { Button } from "./components/ui/button";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { useEffect } from "react";
import { useTheme } from "./context/theme-provider";

const Layout = () => {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    console.log("theme", theme);
  }, [theme]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <header>
        <h1>Pay Peer</h1>
      </header>
      <Button
        onClick={() => {
          console.log("first");
          setTheme("dark");
        }}
      >
        dark
      </Button>
      <Button
        onClick={() => {
          console.log("second");
          setTheme("light");
        }}
      >
        light
      </Button>
      <Outlet />
    </ThemeProvider>
  );
};

export default Layout;
