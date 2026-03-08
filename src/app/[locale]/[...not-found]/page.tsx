/** @format */
"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Home, HeadphonesIcon } from "lucide-react";

const QUICK_LINKS = [
  { label: "Ongoing Campaigns", key: "campaigns" },
  { label: "Success Stories",   key: "success" },
  { label: "Our Mission",       key: "about" },
  { label: "Latest News",       key: "news" },
];

export default function NotFoundPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">

      {/* ── Navbar ── */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">F</span>
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">
            FundRaise <span className="text-emerald-600">BD</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href={`/${locale}`} className="hover:text-gray-900 transition">Home</Link>
          <Link href={`/${locale}/campaigns`} className="hover:text-gray-900 transition">Projects</Link>
          <Link href={`/${locale}/about`} className="hover:text-gray-900 transition">About Us</Link>
          <Link href={`/${locale}/impact`} className="hover:text-gray-900 transition">Impact</Link>
        </nav>
        <Link href={`/${locale}/donate`}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-700 transition">
          Donate Now
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">

        {/* 404 graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-10">
          <p className="text-[140px] md:text-[180px] font-black text-emerald-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Oops! Page not found
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
            The link might be broken or the page has been moved. We
            couldn&apos;t find what you were looking for, but we can help you
            get back on track.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href={`/${locale}`}
            className="flex items-center gap-2 bg-emerald-600 text-white px-7 py-3.5 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button className="flex items-center gap-2 bg-white text-gray-700 px-7 py-3.5 rounded-full font-bold hover:bg-gray-50 transition border border-gray-200 shadow-sm">
            <HeadphonesIcon className="w-4 h-4" />
            Contact Support
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {QUICK_LINKS.map((link) => (
            <Link key={link.key} href={`/${locale}/${link.key}`}
              className="text-sm text-gray-400 hover:text-emerald-600 font-medium transition">
              {link.label}
            </Link>
          ))}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">স</span>
            </div>
            <span className="font-black text-gray-900 text-sm">সংস্কার ফান্ড</span>
          </div>
          <p className="text-xs text-gray-400">Empowering change through community giving.</p>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "bK", "NK"].map((p, i) => (
              <div key={i} className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-[9px] font-bold text-gray-400">
                {p}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href={`/${locale}/privacy`} className="hover:text-gray-600 transition">Privacy Policy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-gray-600 transition">Terms of Service</Link>
          </div>
        </div>
        <div className="border-t border-gray-50 py-3 text-center">
          <p className="text-[11px] text-gray-300">
            © {new Date().getFullYear()} সংস্কার ফান্ড. All rights reserved. Registered non-profit organization.
          </p>
        </div>
      </footer>
    </div>
  );
}