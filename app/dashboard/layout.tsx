import { AppSidebar } from "@/components/app-sidebar";
import ModeToggle from "@/components/ui/ui-toggle";
import { Separator } from "@/components/ui/separator";
import { getAuthContext } from "@/lib/auth";
import AppError from "@/http/error";
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import TanstackProvider from "@/providers/tanstack-provider";
export const revalidate=0;

export default async function Layout({ children }: { children: React.ReactNode }) {
  let authContext;
  try{
    authContext=await getAuthContext()
  }
  catch(err){
    if(err instanceof AppError){
      if(err.status===401) redirect("/signin")
      if(err.status===404) redirect("/onboarding")
    }
   redirect('/signin')
  }
  const { user, businessId, businessName } = authContext;

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <TanstackProvider>
      <SidebarProvider>
        <AppSidebar
          businessName={businessName}
          user={{
            name: userName,
            email: user.email || "",
          }}
        />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ms-1" />
            <Separator
              orientation="vertical"
              className="data-vertical:h-4 data-vertical:self-auto"
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-semibold text-muted-foreground px-1.5 py-0.5 border border-border bg-muted/40 rounded-none tracking-wider">
                Business
              </span>
              <span className="text-sm font-semibold text-foreground tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
                {businessName || "My Business"}
              </span>
            </div>
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    </TanstackProvider>
  );
}
