/** @format */
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Facebook, Mail, Share2, Heart } from "lucide-react";

function PaymentBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide border ${color}`}>
      {label}
    </span>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: t("aboutUs"),          href: `/${locale}/about` },
    { label: t("howItWorks"),       href: `/${locale}/how-it-works` },
    { label: t("activeCampaigns"),  href: `/${locale}/campaigns` },
    { label: t("successStories"),   href: `/${locale}/success` },
  ];

  const legalLinks = [
    { label: t("privacyPolicy"),       href: `/${locale}/privacy` },
    { label: t("termsOfService"),      href: `/${locale}/terms` },
    { label: t("donationPolicy"),      href: `/${locale}/donation-policy` },
    { label: t("transparencyReport"),  href: `/${locale}/transparency` },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">

      {/* ── Main grid: brand LEFT | quick links + legal RIGHT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">

          {/* LEFT — Brand (max ~35% width) */}
          <div className="flex flex-col gap-4 md:max-w-xs">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-extrabold text-gray-900 tracking-tight">
                সংস্কার ফান্ড
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("tagline")}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              <a href="#" aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Email"
                className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Share"
                className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* RIGHT — Quick Links + Legal side by side */}
          <div className="flex gap-16 md:gap-24">

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-widest mb-4">
                {t("quickLinks")}
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-gray-400 hover:text-emerald-600 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-widest mb-4">
                {t("legal")}
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-gray-400 hover:text-emerald-600 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── Accepted Payments ── */}
      <div className="border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center mb-3">
            {t("acceptedPayments")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <PaymentBadge label="VISA"       color="border-blue-100 text-blue-400" />
            <PaymentBadge label="Mastercard" color="border-red-100 text-red-400" />
            <PaymentBadge label="bKash"      color="border-pink-100 text-pink-500" />
            <PaymentBadge label="Nagad"      color="border-orange-100 text-orange-400" />
            <PaymentBadge label="Rocket"     color="border-purple-100 text-purple-400" />
            <PaymentBadge label="Upay"       color="border-emerald-100 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* ── Copyright — dynamic year ── */}
      <div className="border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-300">
            {t("copyright", { year: currentYear })}
          </p>
        </div>
      </div>

    </footer>
  );
}