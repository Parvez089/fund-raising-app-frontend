/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  PlusCircle,
  Target,
  BarChart2,
  Database,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface AdminData {
  email: string;
  role:  string;
}

const NAV = [
  { label: "Dashboard",            icon: LayoutDashboard, href: "dashboard"            },
  { label: "Add Fund",             icon: PlusCircle,      href: "add-fund"             },
  { label: "Update Target",        icon: Target,          href: "update-target"        },
  { label: "Manage Contributions", icon: Database,        href: "manage-contributions" },
  { label: "Analytics",            icon: BarChart2,       href: "analytics"            },
];

const PAGE_TITLES: Record<string, string> = {
  "dashboard":            "Dashboard",
  "add-fund":             "Add New Fund",
  "update-target":        "Update Target",
  "manage-contributions": "Manage Contributions",
  "analytics":            "Analytics",
};

// ─── Sub-components defined OUTSIDE to prevent remount loop ───────────────────

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">স</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 leading-tight">সংস্কার ফান্ড</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
      </div>
    </div>
  );
}

function NavItems({
  activeHref,
  onNavigate,
}: {
  activeHref: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <>
      {NAV.map(({ label, icon: Icon, href }) => {
        const active = activeHref === href;
        return (
          <button
            key={href}
            onClick={() => onNavigate(href)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-emerald-600 text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        );
      })}
    </>
  );
}

function LogoutBtn({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      onClick={onLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
    >
      <LogOut className="w-4 h-4 flex-shrink-0" />
      Logout
    </button>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const locale   = useLocale();

  const [admin,      setAdmin]      = useState<AdminData | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking,   setChecking]   = useState(true);

  // ✅ Ref guard — auth check fires exactly once, never re-runs
  const hasFetched = useRef(false);

  const activeHref = NAV.find((n) => pathname.includes(n.href))?.href ?? "dashboard";
  const pageTitle  = PAGE_TITLES[activeHref] ?? "Dashboard";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    axiosClient
      .get("/api/auth/me")
      .then((res) => {
        setAdmin(res.data);
        setChecking(false);
      })
      .catch((err) => {
        setChecking(false);
        const status = err?.response?.status;
        // ✅ Only redirect on real auth failures — not network timeouts
        if (status === 401 || status === 403) {
          window.location.href = `/${locale}/admin/login`;
        }
        // Network error on mobile → stay on page, don't loop
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/api/auth/logout");
    } catch {
      // ignore — redirect regardless
    } finally {
      // ✅ Hard redirect clears all React state cleanly
      window.location.href = `/${locale}/admin/login`;
    }
  };

  const handleNavigate = (href: string) => {
    router.push(`/${locale}/admin/${href}`);
  };

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated (redirect already fired above) ──────────────────────
  if (!admin) return null;

  // ── Authenticated layout ───────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-20">
        <div className="px-5 py-5 border-b border-gray-100">
          <BrandLogo />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItems activeHref={activeHref} onNavigate={handleNavigate} />
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <LogoutBtn onLogout={handleLogout} />
        </div>
      </aside>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 z-40 flex flex-col lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <BrandLogo />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItems activeHref={activeHref} onNavigate={handleNavigate} />
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <LogoutBtn onLogout={handleLogout} />
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
            <h1 className="text-base font-bold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* Admin info */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {admin.email.split("@")[0]}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {admin.role.replace("_", " ")}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm uppercase">
                {admin.email[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}