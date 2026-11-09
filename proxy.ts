import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  const isAuthPage = pathname === "/signin" || pathname === "/signup";

   if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (user) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard")) {
      const { data: business } = await supabase
        .from("business")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!business) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }
  } 
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup","/api/:path*"],
};
