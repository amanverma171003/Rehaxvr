// Route middleware — refreshes the Supabase session and enforces route guards.
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Paths that require authentication.
const PROTECTED_PREFIXES = ["/app", "/onboarding"];
// Auth pages that authenticated users should be redirected away from.
const AUTH_ONLY_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, onboardedAt } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
  const isOnboarding = pathname.startsWith("/onboarding");
  const isApp = pathname.startsWith("/app");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("reason", "expired");
    return NextResponse.redirect(url);
  }
  

  // Onboarding gate — the DB is authoritative, not the wizard's UI state.
  if (user && isApp && !onboardedAt) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (user && isOnboarding && onboardedAt) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && user) {
    const url = request.nextUrl.clone();
    // If auth exists but they haven't finished onboarding, send them to the wizard.
    url.pathname = onboardedAt ? "/app" : "/onboarding";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match every route except:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico, sitemap.xml, robots.txt
     *   - public assets with a file extensio n 
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
