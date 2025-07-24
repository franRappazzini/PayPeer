import { Outlet } from "react-router";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const HomeLayout = () => {
  return (
    <Suspense fallback="loading">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
    </Suspense>
  );
};

export default HomeLayout;
