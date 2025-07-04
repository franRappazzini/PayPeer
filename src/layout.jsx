import LanguageSelector from "./components/language-selector";
import { Outlet } from "react-router";
import { Suspense } from "react";
import { ThemeProvider } from "./components/theme-provider";

const Layout = () => {
  return (
    <Suspense fallback="loading">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <header>
          <LanguageSelector />
        </header>
        <Outlet />
      </ThemeProvider>
    </Suspense>
  );
};

export default Layout;
