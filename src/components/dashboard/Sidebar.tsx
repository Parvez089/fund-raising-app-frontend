/** @format */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  PlusCircle,
  Target,
  BarChart3,
  LogOut,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

interface SidebarProps {
  adminEmail?: string;
  adminRole?: string;
}

interface SidebarContentProps {
  adminEmail?: string;
  adminRole?: string;
  active: string;
  setActive: (label: string) => void;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Add Fund", icon: PlusCircle },
  { label: "Update Target", icon: Target },
  { label: "Analytics", icon: BarChart3 },
];

// ✅ Moved OUTSIDE the main component
function SidebarContent({
  adminEmail,
  adminRole,
  active,
  setActive,
  setMobileOpen,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className='flex flex-col h-full'>
      {/* Logo */}
      <div className='p-6 border-b border-gray-100'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center'>
              <Wallet className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='font-bold text-gray-900 text-sm leading-tight'>
                সংস্কার ফান্ড
              </p>
              <p className='text-[10px] font-semibold text-emerald-600 uppercase tracking-widest'>
                Premium SaaS Admin
              </p>
            </div>
          </div>
          {/* Close - mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className='lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition'>
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {
              setActive(label);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active === label
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}>
            <Icon className='w-4 h-4' />
            {label}
          </button>
        ))}
      </nav>

      {/* Admin Profile + Logout */}
      <div className='p-4 border-t border-gray-100'>
        <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3'>
          <div className='w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0'>
            {adminEmail?.[0]?.toUpperCase() || "A"}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold text-gray-800 truncate'>
              {adminEmail || "Admin User"}
            </p>
            <p className='text-[10px] text-gray-400 capitalize'>
              {adminRole?.replace("_", " ") || "Super Admin"}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition font-medium'>
          <LogOut className='w-4 h-4' />
          Logout
        </button>
      </div>
    </div>
  );
}

// ✅ Main component stays clean
export default function Sidebar({ adminEmail, adminRole }: SidebarProps) {
  const router = useRouter();
  const locale = useLocale();
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await api.post("/api/auth/logout", {});
    localStorage.removeItem("adminRole");
    router.push(`/${locale}/admin/login`);
  };

  const contentProps = {
    adminEmail,
    adminRole,
    active,
    setActive,
    setMobileOpen,
    onLogout: handleLogout,
  };

  return (
    <>
      {/* ── MOBILE TOP NAVBAR ── */}
      <div className='lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4'>
        <button
          onClick={() => setMobileOpen(true)}
          className='w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition'>
          <Menu className='w-5 h-5 text-gray-600' />
        </button>

        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center'>
            <Wallet className='w-3.5 h-3.5 text-white' />
          </div>
          <span className='font-bold text-gray-900 text-sm'>FundRaise BD</span>
        </div>

        <div className='w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm'>
          {adminEmail?.[0]?.toUpperCase() || "A"}
        </div>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div
          className='lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <SidebarContent {...contentProps} />
      </aside>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className='hidden lg:flex w-64 min-h-screen bg-white border-r border-gray-100 flex-col flex-shrink-0'>
        <SidebarContent {...contentProps} />
      </aside>
    </>
  );
}
