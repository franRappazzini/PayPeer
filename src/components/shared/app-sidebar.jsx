import { History, Home, Megaphone, Plus, TrendingUp, User, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { PayPeerIcon } from "../icons";
import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const { t } = useTranslation("app-sidebar");

  const navigation = [
    {
      title: t("navigation.firstSection.title"),
      items: [
        {
          title: t("navigation.firstSection.items.home"),
          url: "/",
          icon: Home,
        },
        {
          title: t("navigation.firstSection.items.trading"),
          url: "/app",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: t("navigation.secondSection.title"),
      items: [
        {
          title: t("navigation.secondSection.items.profile"),
          url: "/app/profile",
          icon: User,
        },
        {
          title: t("navigation.secondSection.items.orderHistory"),
          url: "/app/orders",
          icon: History,
        },
        {
          title: t("navigation.secondSection.items.createOrder"),
          url: "/app/orders/create",
          icon: Plus,
        },
      ],
    },
    {
      title: t("navigation.thirdSection.title"),
      items: [
        {
          title: t("navigation.thirdSection.items.myAds"),
          url: "/app/ads",
          icon: Megaphone,
        },
        {
          title: t("navigation.thirdSection.items.wallet"),
          url: "/app/wallet",
          icon: Wallet,
        },
      ],
    },
  ];

  const iconFill =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "white"
        : "black"
      : theme === "dark"
      ? "white"
      : "black";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton
          size="xl"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground">
              <PayPeerIcon width={32} height={32} fill={iconFill} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">PayPeer</span>
              <span className="text-xs text-muted-foreground">{t("description")}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
