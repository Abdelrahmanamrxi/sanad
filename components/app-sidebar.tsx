"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
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
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  Building2,
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },

    {
      title: "Playground",
      url: "/dashboard/playground",
      icon: <TerminalSquareIcon />,
    },
    {
      title: "Widget",
      url: "/dashboard/widget",
      icon: <Columns3Cog />,
    },
    {
      title: "Knowledge Base",
      url: "/dashboard/knowledge-base",
      icon: <BookOpenIcon />,
    },
    {
      title: "Conversations",
      url: "/dashboard/conversations",
      icon: <MessagesCircle />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  businessName?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AppSidebar({ businessName, user, ...props }: AppSidebarProps) {
  const currentUser = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.avatar || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center bg-primary text-primary-foreground border border-primary/20 rounded-none shadow-xs"
            title={businessName || "Business Workspace"}
          >
            <Building2 className="size-4.5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5 leading-none mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                Business
              </span>
              <span className="text-muted-foreground/30 text-[9px] font-mono">/</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tight">
                Workspace
              </span>
            </div>
            <span
              className="font-heading font-bold text-sm text-sidebar-foreground truncate tracking-tight"
              title={businessName}
            >
              {businessName || "My Business"}
            </span>
            <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 bg-emerald-500 rounded-none shrink-0" />
              Welcome back
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
