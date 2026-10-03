import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlProxy from "next-intl/middleware";
import { verifyAdmin } from "@/lib/supabase/admin-check";
import { routing } from "@/i18n/routing";

/**
 * Resolves `/` and any unprefixed path to a locale, so `/` -> `/fr` and
 * `/portfolio` -> `/fr/portfolio`. With `localePrefix: "always"` nothing
 * public is reachable without a prefix.
 */
const intlProxy = createIntlProxy(routing);

/** Locale routing only applies to the public site, never to the admin area. */
function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isAdminPath(pathname)) {
    return handleAdmin(request, pathname);
  }

  return intlProxy(request);
}

/**
 * Admin gate. Kept byte-for-byte equivalent to the pre-i18n behaviour: the
 * Supabase session must exist, and the email must be on the `admins`
 * allowlist, otherwise we bounce to the login page with a reason code.
 */
async function handleAdmin(request: NextRequest, pathname: string) {
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

  const isLoginPath = pathname === "/admin/login";

  if (!isLoginPath) {
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
  // Runs on every page request, but skips the internals (build output, image
  // optimizer, route handlers) and the files a crawler would choke on. Without
  // this the redirect would fire for `/favicon.ico` and `/sitemap.xml`.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};