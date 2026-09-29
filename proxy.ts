import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyAdmin } from "@/lib/supabase/admin-check";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPath = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPath) {
    if (!user) return redirectToLogin(request, pathname, "");

    const status = await verifyAdmin(supabase, user.email);
    if (status === "not_allowed") {
      return redirectToLogin(request, pathname, "not_allowed");
    }
    if (status === "setup_missing") {
      return redirectToLogin(request, pathname, "setup_missing");
    }
  }

  if (isLoginPath && user) {
    const status = await verifyAdmin(supabase, user.email);
    if (status === "ok") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

function redirectToLogin(
  request: NextRequest,
  pathname: string,
  reason: string
) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  url.searchParams.set("next", pathname);
  if (reason) url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};