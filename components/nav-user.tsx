"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { signOut } from "@/features/auth/actions"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { PlanTier } from "@/features/billing/plans"
import { ChevronsUpDownIcon, SparklesIcon, Loader ,BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
export function NavUser({
  user,
  planTier
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  planTier:PlanTier
}) {
 const [isPending, startTransition] = useTransition()
  const router=useRouter()

  const UpgradeSuggestion=()=>{
   switch(planTier){
    case "free":
      return "Upgrade to Starter";
    case "starter":
      return "Upgrade to Pro"
    default: 
    return "Check Usage"
   }
  }
  const { isMobile } = useSidebar()
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
              <AvatarFallback>{user.name ? user.name.slice(0, 2).toUpperCase() : "US"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name ? user.name.slice(0, 2).toUpperCase() : "US"}</AvatarFallback>
                  </Avatar>
                  <div className="grid text-foreground flex-1 font-sans text-start text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                    <span className=" text-xs font-semibold mt-1">{planTier} Plan</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className={"cursor-pointer"} onClick={()=>{router.push("/dashboard/billing")}}>
                <SparklesIcon
                className="text-yellow-500"
                />
                {UpgradeSuggestion()}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon
             
                />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{router.push("/dashboard/billing")}}>
                <CreditCardIcon
               
                />
                Billing
              </DropdownMenuItem>
            
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            onClick={()=>{
              startTransition(async ()=>{
                await signOut()
              })
            }} 
            className={"cursor-pointer"}>
              <LogOutIcon
               className="text-red-500"
              />
            {isPending?(
              <span className="flex flex-row items-center gap-2">
              Logging out... <Loader size={3} className="animate-spin"/>
              </span>
            
             ):"Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
