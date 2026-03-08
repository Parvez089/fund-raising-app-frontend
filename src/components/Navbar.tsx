/** @format */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdminPage = pathname?.includes("/admin");
  if (isAdminPage) return null;

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold text-emerald-700">
          সংস্কার ফান্ড
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="text-gray-600 hover:text-emerald-600">
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/participants`}
            className="text-gray-600 hover:text-emerald-600">
            {t("participants")}
          </Link>

          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleLanguageChange("bn")}
              className={`px-2 py-1 text-xs ${locale === "bn" ? "bg-white rounded-full" : ""}`}>
              BN
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-2 py-1 text-xs ${locale === "en" ? "bg-white rounded-full" : ""}`}>
              EN
            </button>
          </div>

          <Link
            href={`/${locale}/admin/login`}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm">
            <ShieldCheck size={16} /> {t("adminLogin")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link
            href={`/${locale}`}
            className="text-gray-600 hover:text-emerald-600"
            onClick={() => setIsMenuOpen(false)}>
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/participants`}
            className="text-gray-600 hover:text-emerald-600"
            onClick={() => setIsMenuOpen(false)}>
            {t("participants")}
          </Link>

          {/* Language toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 w-fit">
            <button
              onClick={() => {
                handleLanguageChange("bn");
                setIsMenuOpen(false);
              }}
              className={`px-3 py-1 text-xs font-medium ${
                locale === "bn" ? "bg-white rounded-full shadow-sm" : ""
              }`}>
              BN
            </button>
            <button
              onClick={() => {
                handleLanguageChange("en");
                setIsMenuOpen(false);
              }}
              className={`px-3 py-1 text-xs font-medium ${
                locale === "en" ? "bg-white rounded-full shadow-sm" : ""
              }`}>
              EN
            </button>
          </div>

          {/* Admin login button */}
          <Link
            href={`/${locale}/admin/login`}
            onClick={() => setIsMenuOpen(false)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm w-fit">
            <ShieldCheck size={16} /> {t("adminLogin")}
          </Link>
        </div>
      )}
    </nav>
  );
}