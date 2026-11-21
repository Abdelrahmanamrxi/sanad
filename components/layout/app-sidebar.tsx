"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import type { PlanTier } from "@/features/billing/plans";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  MessagesCircle,
  Columns3Cog,
  LayoutDashboard,
  TerminalSquareIcon,
  BookOpenIcon,
  Building2,
} from "lucide-react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  businessName?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  planTier: PlanTier;
}

export function AppSidebar({
  planTier,
  businessName,
  user,
  side: sideProp,
  ...props
}: AppSidebarProps & { side?: "left" | "right" }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const side = sideProp ?? (isArabic ? "right" : "left");

  const navItems = [
    {
      title: t("dashboard.sidebar.overview"),
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: t("dashboard.sidebar.playground"),
      url: "/dashboard/playground",
      icon: <TerminalSquareIcon />,
    },
    {
      title: t("dashboard.sidebar.widget"),
      url: "/dashboard/widget",
      icon: <Columns3Cog />,
    },
    {
      title: t("dashboard.sidebar.knowledgeBase"),
      url: "/dashboard/knowledge-base",
      icon: <BookOpenIcon />,
    },
    {
      title: t("dashboard.sidebar.conversations"),
      url: "/dashboard/conversations",
      icon: <MessagesCircle />,
    },
  ];

  const currentUser = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.avatar || "",
  };

  return (
    <Sidebar side={side} collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground border border-primary/20 rounded-none shadow-xs"
            title={businessName || "Business Workspace"}
          >
            <Building2 className="size-4.5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5 leading-none mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                {t("dashboard.sidebar.business")}
              </span>
              <span className="text-muted-foreground/30 text-[9px] font-mono">
                /
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tight">
                {t("dashboard.sidebar.workspace")}
              </span>
            </div>
            <span
              className="font-heading font-bold text-sm text-sidebar-foreground truncate tracking-tight"
              title={businessName}
            >
              {businessName || "My Business"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} planTier={planTier} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
