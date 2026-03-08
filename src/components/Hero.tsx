/** @format */
"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();

const handleScrollToProgress = () => {
  const section = document.getElementById("campaign-progress");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    // fallback — scroll by fixed pixel amount
    window.scrollTo({ top: 700, behavior: "smooth" });
  }
};
  return (
    <section  id="campaign-progress" className="pt-36 pb-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-6">
          {t("title")}
        </h1>
        <p className="text-lg text-slate-600 mb-8">{t("description")}</p>

        {/* Button section */}
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${locale}/donate`}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
            {t("donate")} ❤️
          </Link>

          {/* ✅ Scroll to progress section instead of navigating */}
          <button
            onClick={handleScrollToProgress}
            className="bg-slate-100 text-slate-800 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-all">
            {t("viewProgress")}
          </button>
        </div>
      </div>

      {/* Hero image */}
      <div className="h-64 md:h-96 rounded-3xl overflow-hidden relative">
        <Image
          src="/Images/hero.png"
          alt="FundRaise BD"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}