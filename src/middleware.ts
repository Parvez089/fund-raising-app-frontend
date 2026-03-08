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

  const isAdminRoute =
    pathname.includes("/admin") && !pathname.includes("/admin/login");
  const isLoginPage = pathname.includes("/admin/login");
  const token = req.cookies.get("token")?.value;
  const locale = pathname.startsWith("/en") ? "en" : "bn";

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL(`/${locale}/admin/dashboard`, req.url),
    );
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(bn|en)/:path*"],
};
