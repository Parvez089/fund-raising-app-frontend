/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { useTranslations } from "next-intl";

// ── Types ──────────────────────────────────────────────
interface Contributor {
  _id: string;
  name: string;
  amount: number;
  message: string;
  campaign: string;
  createdAt: string;
  isAnonymous: boolean;
  initials: string;
}

// Deterministic color from name
const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function ContributorSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-48" />
      </div>
      <div className="text-right space-y-1.5">
        <div className="h-4 bg-gray-100 rounded w-20 ml-auto" />
        <div className="h-3 bg-gray-100 rounded w-14 ml-auto" />
      </div>
    </div>
  );
}

export default function RecentContributors() {
  const t = useTranslations("RecentContributors");

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 1) return t("daysAgo", { count: days });
    if (days === 1) return t("yesterday");
    if (hrs > 1) return t("hoursAgoPlural", { count: hrs });
    if (hrs === 1) return t("hoursAgo", { count: hrs });
    if (mins > 1) return t("minutesAgoPlural", { count: mins });
    if (mins === 1) return t("minutesAgo", { count: mins });
    return t("justNow");
  }

  const fetchContributors = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contributors?limit=10&page=${pageNum}`
      );
      const data = await res.json();
      if (append) {
        setContributors((prev) => [...prev, ...(data.contributors ?? [])]);
      } else {
        setContributors(data.contributors ?? []);
      }
      setHasMore(data.hasMore ?? false);
      setPage(pageNum);
    } catch {
      setContributors([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchContributors(1);
  }, [fetchContributors]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{t("subtitle")}</p>
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition mt-1 flex-shrink-0">
          {t("viewAll")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── List ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50 px-6">
            {[1, 2, 3, 4, 5].map((i) => <ContributorSkeleton key={i} />)}
          </div>
        ) : contributors.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">{t("noContributions")}</p>
            <p className="text-gray-300 text-xs mt-1">{t("beFirst")}</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="divide-y divide-gray-50">
              {contributors.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">

                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    c.isAnonymous ? "bg-gray-100 text-gray-400" : avatarColor(c.name)
                  }`}>
                    {c.isAnonymous ? <User className="w-5 h-5" /> : c.initials}
                  </div>

                  {/* Name + message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {c.isAnonymous ? "Anonymous" : c.name}
                    </p>
                    {c.message && (
                      <p className="text-xs text-gray-400 truncate mt-0.5 italic">
                        &ldquo;{c.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Amount + time */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600">
                      +৳{c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {timeAgo(c.createdAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Load more */}
        {!loading && hasMore && (
          <div className="px-6 py-4 border-t border-gray-50">
            <button
              onClick={() => fetchContributors(page + 1, true)}
              disabled={loadingMore}
              className="w-full py-2.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl transition disabled:opacity-50">
              {loadingMore ? t("loading") : t("loadMore")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}