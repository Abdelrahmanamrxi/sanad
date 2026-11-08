"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Loader2 } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  // Canonical React pattern: adjust state during rendering when a dependency changes
  // Avoids calling setState synchronously inside useEffect which causes cascading renders
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setPendingUrl(null)
  }

  const isRouteActive = (url: string) => {
    if (!url || url === "#") return false
    if (url === "/dashboard") return pathname === "/dashboard"
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  const handleLinkClick = (url: string) => {
    if (url && url !== "#" && !isRouteActive(url)) {
      setPendingUrl(url)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 px-2 py-1.5">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const hasSubItems = Boolean(item.items && item.items.length > 0)
          const isItemActive = isRouteActive(item.url) || Boolean(item.isActive && !pathname)
          const isPending = pendingUrl === item.url && !isItemActive
          const isSubActive = Boolean(hasSubItems && item.items?.some((sub) => isRouteActive(sub.url)))
          const isAnySubPending = Boolean(hasSubItems && item.items?.some((sub) => pendingUrl === sub.url))

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                defaultOpen={item.isActive || isSubActive || isAnySubPending}
                className="group/collapsible"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isItemActive || isSubActive || isPending || isAnySubPending}
                      className={
                        isItemActive || isSubActive || isPending || isAnySubPending
                          ? "rounded-none border border-primary/60 bg-sidebar-accent text-sidebar-accent-foreground font-medium transition-colors"
                          : "rounded-none border border-transparent hover:border-sidebar-border/60 transition-colors"
                      }
                    />
                  }
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin text-primary shrink-0" />
                  ) : (
                    item.icon
                  )}
                  <span>{item.title}</span>
                  <ChevronRight className="ms-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:group-data-[state=open]/collapsible:-rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isCurrentSubActive = isRouteActive(subItem.url)
                      const isSubPending = pendingUrl === subItem.url && !isCurrentSubActive
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            render={
                              <Link
                                href={subItem.url}
                                prefetch={true}
                                onClick={() => handleLinkClick(subItem.url)}
                              />
                            }
                            isActive={isCurrentSubActive || isSubPending}
                            className={
                              isCurrentSubActive || isSubPending
                                ? "rounded-none border border-primary/60 bg-sidebar-accent text-sidebar-accent-foreground font-medium transition-colors flex items-center justify-between"
                                : "rounded-none border border-transparent hover:border-sidebar-border/60 transition-colors flex items-center justify-between"
                            }
                          >
                            <span>{subItem.title}</span>
                            {isSubPending && (
                              <Loader2 className="size-3 animate-spin text-primary shrink-0 ms-2" />
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={
                  <Link
                    href={item.url}
                    prefetch={true}
                    onClick={() => handleLinkClick(item.url)}
                  />
                }
                tooltip={item.title}
                isActive={isItemActive || isPending}
                className={
                  isItemActive || isPending
                    ? "rounded-none border border-primary/60 bg-sidebar-accent text-sidebar-accent-foreground font-medium transition-colors"
                    : "rounded-none border border-transparent hover:border-sidebar-border/60 transition-colors"
                }
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin text-primary shrink-0" />
                ) : (
                  item.icon
                )}
                <span className="truncate">{item.title}</span>
                {isPending && (
                  <span className="ms-auto text-[10px] font-mono text-primary uppercase tracking-wider animate-pulse">
                    Loading
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
