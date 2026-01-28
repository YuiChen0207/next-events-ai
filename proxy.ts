import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is not authenticated and trying to access protected routes
  if (!user && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access login/register
  if (user && (pathname === "/login" || pathname === "/register")) {
    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from("user-profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const role = userProfile?.role || "user";
    const dashboardUrl = new URL(
      role === "admin" ? "/admin/dashboard" : "/user/events",
      request.url
    );
    return NextResponse.redirect(dashboardUrl);
  }

  // If user is authenticated and accessing root, redirect to appropriate dashboard
  if (user && pathname === "/") {
    const { data: userProfile } = await supabase
      .from("user-profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const role = userProfile?.role || "user";
    const dashboardUrl = new URL(
      role === "admin" ? "/admin/dashboard" : "/user/events",
      request.url
    );
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    // Exclude API webhook paths (Stripe) from the auth proxy so external
    // services can POST without being redirected to /login.
    "/((?!_next/static|_next/image|favicon.ico|api/stripe|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
