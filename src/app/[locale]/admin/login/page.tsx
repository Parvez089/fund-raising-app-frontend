/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";    

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
   const locale = useLocale();    

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // DEBUG - remove after fixing
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Full URL:", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      },
    );

    // DEBUG - see the actual response
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);

    if (res.ok) {
      localStorage.setItem("adminRole", data.role);
      router.push(`/${locale}/admin/dashboard`); // ← locale-aware redirect
      router.refresh();
    } else {
      setError(data.message || "Invalid email or password!");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md flex flex-col items-center text-center'>
        <div className='bg-emerald-100 p-4 rounded-2xl mb-6'>
          <ShieldCheck className='text-emerald-600 w-10 h-10' />
        </div>

        <h1 className='text-2xl font-bold text-gray-900'>সংস্কার ফান্ড</h1>
        <p className='text-gray-500 mb-8'>Administrative Control Panel</p>

        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

        <form
          onSubmit={handleLogin}
          className='w-full flex flex-col gap-4 text-left'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Email Address
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@fundraisebd.org'
              className='w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-3.5 text-gray-400'>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className='w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition mt-2 disabled:bg-gray-400'>
            {loading ? "Logging in..." : "Login to Dashboard →"}
          </button>
        </form>

        <Link
          href='/'
          className='mt-8 text-sm text-gray-500 flex items-center gap-2 hover:text-emerald-600'>
          🏠 Back to Homepage
        </Link>
      </div>
    </main>
  );
}
