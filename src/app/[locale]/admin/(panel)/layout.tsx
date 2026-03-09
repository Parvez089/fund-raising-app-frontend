/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard, PlusCircle, Target, BarChart2,
  LogOut, Bell, Menu, X, Database,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface AdminData { email: string; role: string; }

const NAV = [
  { label: "Dashboard",           icon: LayoutDashboard, href: "dashboard"            },
  { label: "Add Fund",             icon: PlusCircle,      href: "add-fund"             },
  { label: "Update Target",        icon: Target,          href: "update-target"        },
  { label: "Manage Contributions", icon: Database,        href: "manage-contributions" },
  { label: "Analytics",            icon: BarChart2,       href: "analytics"            },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard:              "Dashboard",
  "add-fund":             "Add New Fund",
  "update-target":        "Update Target",
  "manage-contributions": "Manage Contributions",
  analytics:              "Analytics",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const locale   = useLocale();

  const [admin,      setAdmin]      = useState<AdminData | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking,   setChecking]   = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const hasFetched = useRef(false);

  const activeHref = NAV.find((n) => pathname.includes(n.href))?.href ?? "dashboard";
  const pageTitle  = PAGE_TITLES[activeHref] ?? "Dashboard";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    (async () => {
      try {
        const res = await axiosClient.get("/api/auth/me");
        setAdmin(res.data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 403) {
          router.replace(`/${locale}/admin/login`);
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axiosClient.post("/api/auth/logout");
    } catch { /* ignore */ } finally {
      setLoggingOut(false);
      window.location.href = `/${locale}/admin/login`;
    }
  };

  if (checking) return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );

  if (!admin) return null;

  const NavItems = () => (
    <>{NAV.map(({ label, icon: Icon, href }) => {
      const active = activeHref === href;
      return (
        <button key={href}
          onClick={() => router.push(`/${locale}/admin/${href}`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            active
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}>
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
        </button>
      );
    })}</>
  );

  const BrandLogo = () => (
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

  const LogoutBtn = () => (
    <button onClick={handleLogout} disabled={loggingOut}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
      {loggingOut
        ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        : <LogOut className="w-4 h-4 flex-shrink-0" />}
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-20">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <BrandLogo />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItems />
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <LogoutBtn />
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 z-40 flex flex-col lg:hidden transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <BrandLogo />
          <button onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItems />
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <LogoutBtn />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
            <h1 className="text-base font-bold text-gray-900">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {admin?.email?.split("@")[0] ?? "Admin"}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {admin?.role?.replace("_", " ") ?? "Super Admin"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm uppercase">
                {admin?.email?.[0] ?? "A"}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}