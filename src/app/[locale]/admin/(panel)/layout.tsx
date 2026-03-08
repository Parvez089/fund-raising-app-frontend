/** @format */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  PlusCircle,
  Target,
  BarChart2,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

interface AdminData {
  email: string;
  role: string;
}

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "dashboard" },
  { label: "Add Fund", icon: PlusCircle, href: "add-fund" },
  { label: "Update Target", icon: Target, href: "update-target" },
  { label: "Analytics", icon: BarChart2, href: "analytics" },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  "add-fund": "Add New Fund",
  "update-target": "Update Target",
  analytics: "Analytics",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  const activeHref =
    NAV.find((n) => pathname.includes(n.href))?.href ?? "dashboard";
  const pageTitle = PAGE_TITLES[activeHref] ?? "Dashboard";

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setAdmin(res.data);
      } catch {
        router.push(`/${locale}/admin/login`);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [router, locale]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } finally {
      router.push(`/${locale}/admin/login`);
    }
  };

  const navigate = (href: string) => {
    router.push(`/${locale}/admin/${href}`);
  };

  if (checking) return null;

  const SidebarContent = () => (
    <>
      <div className='flex items-center gap-3 px-5 py-5 border-b border-gray-100'>
        <div className='w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0'>
          <span className='text-white font-bold text-sm'>FB</span>
        </div>
        <div>
          <p className='text-sm font-bold text-gray-900 leading-tight'>
            সংস্কার ফান্ড
          </p>
          <p className='text-[10px] text-gray-400 uppercase tracking-wider'>
            Admin Panel
          </p>
        </div>
      </div>

      <nav className='flex-1 px-3 py-4 space-y-1'>
        {NAV.map(({ label, icon: Icon, href }) => {
          const active = activeHref === href;
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}>
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${active ? "text-emerald-600" : ""}`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      <div className='px-3 py-4 border-t border-gray-100'>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors'>
          <LogOut className='w-4 h-4 flex-shrink-0' />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className='flex min-h-screen bg-[#f5f6fa]'>
      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex w-60 flex-col bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-20'>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 bg-black/30 z-30 lg:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 z-40 flex flex-col lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className='flex items-center justify-between px-5 py-5 border-b border-gray-100'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>FB</span>
            </div>
            <div>
              <p className='text-sm font-bold text-gray-900 leading-tight'>
                সংস্কার ফান্ড
              </p>
              <p className='text-[10px] text-gray-400 uppercase tracking-wider'>
                Admin Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className='p-1 rounded-lg hover:bg-gray-100'>
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = activeHref === href;
            return (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}>
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${active ? "text-emerald-600" : ""}`}
                />
                {label}
              </button>
            );
          })}
        </nav>
        <div className='px-3 py-4 border-t border-gray-100'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors'>
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className='flex-1 lg:ml-60 flex flex-col min-w-0'>
        <header className='h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setMobileOpen(true)}
              className='lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition'>
              <Menu className='w-4 h-4 text-gray-600' />
            </button>
            <h1 className='text-base font-bold text-gray-900'>{pageTitle}</h1>
          </div>

          <div className='flex items-center gap-3'>
            <button className='relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition'>
              <Bell className='w-5 h-5 text-gray-500' />
              <span className='absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full' />
            </button>
            <div className='flex items-center gap-2.5 pl-3 border-l border-gray-100'>
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-semibold text-gray-800 leading-tight'>
                  {admin?.email?.split("@")[0] ?? "Admin"}
                </p>
                <p className='text-xs text-gray-400 capitalize'>
                  {admin?.role?.replace("_", " ") ?? "Super Admin"}
                </p>
              </div>
              <div className='w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm uppercase'>
                {admin?.email?.[0] ?? "A"}
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
