"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/features/auth/actions";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PlanTier } from "@/features/billing/plans";
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  Loader,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
export function NavUser({
  user,
  planTier,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  planTier: PlanTier;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const UpgradeSuggestion = () => {
    switch (planTier) {
      case "free":
        return t("dashboard.sidebar.upgradeToStarter");
      case "starter":
        return t("dashboard.sidebar.upgradeToPro");
      default:
        return t("dashboard.sidebar.checkUsage");
    }
  };
  const { isMobile } = useSidebar();
  const isArabic = i18n.language === "ar";
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : isArabic ? "left" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid text-foreground flex-1 font-sans text-start text-sm leading-tight normal-case tracking-normal">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    <span className="text-[11px] font-semibold mt-1 capitalize text-primary font-mono">
                      {planTier} Plan
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={"cursor-pointer"}
                  render={<Link href="/dashboard/billing" />}
              >
                <SparklesIcon className="text-yellow-500" />
                {UpgradeSuggestion()}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
              render={<Link href="/dashboard/account" />}
              >
                <BadgeCheckIcon />
                {t("dashboard.sidebar.account")}
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/dashboard/billing" />}
                className="cursor-pointer"
              
              >
                <CreditCardIcon />
                {t("dashboard.sidebar.billing")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                startTransition(async () => {
                  await signOut();
                });
              }}
              className={"cursor-pointer"}
            >
              <LogOutIcon className="text-red-500" />
              {isPending ? (
                <span className="flex flex-row items-center gap-2">
                  Logging out... <Loader size={3} className="animate-spin" />
                </span>
              ) : (
                t("dashboard.sidebar.signOut")
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
