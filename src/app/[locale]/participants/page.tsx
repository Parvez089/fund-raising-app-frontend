/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface Participant {
  _id: string;
  name: string;
  amount: number;
  campaign: string;
  badge: string;
  initials: string;
  isAnonymous: boolean;
  isTop: boolean;
  joinedAt: string;
}

// ── Badge config ───────────────────────────────────────
const BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  "PLATINUM DONOR":     { bg: "bg-purple-50",  text: "text-purple-500",  dot: "bg-purple-400"  },
  "GOLD DONOR":         { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400"   },
  "TOP CONTRIBUTOR":    { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  "ACTIVE MEMBER":      { bg: "bg-sky-50",     text: "text-sky-500",     dot: "bg-sky-400"     },
  "RECENT CONTRIBUTOR": { bg: "bg-gray-50",    text: "text-gray-400",    dot: "bg-gray-300"    },
};

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-500",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
  "bg-teal-100 text-teal-600",
  "bg-orange-100 text-orange-600",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function joinedLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", year: "numeric",
  });
}

// ── Skeleton ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-gray-100 rounded w-24" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
      <div className="h-px bg-gray-50 mb-3" />
      <div className="h-5 bg-gray-100 rounded w-20 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-24" />
    </div>
  );
}

// ── Card ───────────────────────────────────────────────
function ParticipantCard({ p, idx }: { p: Participant; idx: number }) {
  const badge   = BADGE[p.badge] ?? BADGE["RECENT CONTRIBUTOR"];
  const avColor = avatarColor(p.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 relative">

      {p.isTop && (
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
          TOP
        </span>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avColor}`}>
          {p.isAnonymous ? <User className="w-4 h-4 opacity-40" /> : p.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate leading-tight">
            {p.isAnonymous ? "Anonymous" : p.name}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{joinedLabel(p.joinedAt)}</p>
        </div>
      </div>

      <div className="h-px bg-gray-50 mb-3" />

      <p className="text-lg font-black text-gray-900 mb-2">
        ৳{p.amount.toLocaleString("en-US")}
      </p>

      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
        {p.badge}
      </span>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function ParticipantsPage() {
  const t          = useTranslations("Participants");
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  // ── Read state FROM URL ────────────────────────────
  const urlSearch = searchParams.get("search") || "";
  const urlFilter = searchParams.get("filter") || "all";
  const urlPage   = Math.max(1, Number(searchParams.get("page")) || 1);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);

  // ── Update URL helper ──────────────────────────────
  const updateURL = useCallback((
    newSearch: string,
    newFilter: string,
    newPage: number
  ) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newFilter !== "all") params.set("filter", newFilter);
    if (newPage > 1) params.set("page", String(newPage));
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [router, pathname]);

  // ── Handlers ──────────────────────────────────────
  const handleSearch = (val: string) => updateURL(val, urlFilter, 1);
  const handleFilter = (val: string) => updateURL(urlSearch, val, 1);
  const handlePage   = (val: number) => updateURL(urlSearch, urlFilter, val);

  // ── Fetch from URL state ───────────────────────────
  const LIMIT = 10;

  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:   String(urlPage),
        limit:  String(LIMIT),
        filter: urlFilter,
        ...(urlSearch && { search: urlSearch }),
      });
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/participants?${params}`);
      const data = await res.json();
      setParticipants(data.participants ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [urlPage, urlFilter, urlSearch]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // ── Pagination range ───────────────────────────────
  const paginationPages = (): (number | string)[] => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (urlPage > 3) pages.push("...");
    for (let i = Math.max(2, urlPage - 1); i <= Math.min(totalPages - 1, urlPage + 1); i++) pages.push(i);
    if (urlPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const FILTERS = [
    { key: "all",    label: t("filterAll") },
    { key: "top",    label: t("filterTop") },
    { key: "recent", label: t("filterRecent") },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
            {t("headline")}{" "}
            <span className="text-emerald-600">{t("headlineAccent")}</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
            {t("subheadline")}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              defaultValue={urlSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm transition"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilter(f.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  urlFilter === f.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200 shadow-sm"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-5 font-medium tracking-wide">
            {t("showing", { count: total })}
          </p>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : participants.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-24 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">{t("noResults")}</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${urlPage}-${urlFilter}-${urlSearch}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {participants.map((p, i) => (
                <ParticipantCard key={p._id} p={p} idx={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10">
            <button
              onClick={() => handlePage(Math.max(1, urlPage - 1))}
              disabled={urlPage === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition shadow-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationPages().map((p, i) =>
              p === "..." ? (
                <span key={`d-${i}`} className="px-1 text-gray-300 text-sm">...</span>
              ) : (
                <button key={p} onClick={() => handlePage(Number(p))}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition shadow-sm ${
                    urlPage === p
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}>
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => handlePage(Math.min(totalPages, urlPage + 1))}
              disabled={urlPage === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}