import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { Header } from "@/components/shared/header";
import { Outlet } from "react-router";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  return (
    <Suspense fallback="loading">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />

          <SidebarInset>
            <Header />
            <Outlet />

            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </Suspense>
  );
};

export default AppLayout;
