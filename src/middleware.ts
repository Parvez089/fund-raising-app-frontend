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

  // Check if accessing admin dashboard
  const isDashboard =
    pathname.includes("/admin/dashboard") ||
    pathname.includes("/admin/settings");

  const isLoginPage = pathname.includes("/admin/login");

  const token = req.cookies.get("token")?.value;

  // If trying to access dashboard without token → redirect to login
  if (isDashboard && !token) {
    const locale = pathname.startsWith("/en") ? "en" : "bn";
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
  }

  // If already logged in and visiting login page → redirect to dashboard
  if (isLoginPage && token) {
    const locale = pathname.startsWith("/en") ? "en" : "bn";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/dashboard`, req.url)
    );
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(bn|en)/:path*"],
};