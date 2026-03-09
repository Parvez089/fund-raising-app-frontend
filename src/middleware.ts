/** @format */

import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "bn"],
  defaultLocale: "bn",
  localePrefix: "always",
});

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAdminPanel = /\/(en|bn)\/admin(?!\/login)/.test(pathname);
  const isLoginPage  = /\/(en|bn)\/admin\/login/.test(pathname);
  const token        = req.cookies.get("token")?.value;
  const locale       = pathname.startsWith("/en") ? "en" : "bn";

  // ── No token → redirect to login (only for panel pages, NOT login itself) ──
  if (isAdminPanel && !token) {
    const loginUrl = new URL(`/${locale}/admin/login`, req.url);
    // Prevent redirect loop — if already going to login, skip
    if (pathname !== loginUrl.pathname) {
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Has token on login page → redirect to dashboard ──
  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL(`/${locale}/admin/dashboard`, req.url)
    );
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(bn|en)/:path*"],
};