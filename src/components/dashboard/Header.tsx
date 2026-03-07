/** @format */
"use client";

import { useState } from "react";
import { Bell, Settings, Search, X} from "lucide-react";

interface HeaderProps {
  totalFunds: number;
  targetGoal: number;
}

export default function Header({ totalFunds, targetGoal }: HeaderProps) {
  const progress = Math.min(Math.round((totalFunds / targetGoal) * 100), 100);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className='h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6'>
      {/* Search - Desktop */}
      <div className='relative w-80 hidden md:block'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        <input
          type='text'
          placeholder='Search transactions, donors, or targets...'
          className='w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition'
        />
      </div>

      {/* Search - Mobile (expandable) */}
      <div className='md:hidden flex items-center flex-1 mr-2'>
        {searchOpen ? (
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              autoFocus
              type='text'
              placeholder='Search...'
              className='w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition'
            />
            <button
              onClick={() => setSearchOpen(false)}
              className='absolute right-3 top-1/2 -translate-y-1/2'>
              <X className='w-4 h-4 text-gray-400' />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className='w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition'>
            <Search className='w-5 h-5 text-gray-500' />
          </button>
        )}
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2 md:gap-4'>
        {/* Notification */}
        <button className='relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition'>
          <Bell className='w-5 h-5 text-gray-500' />
          <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full' />
        </button>

        {/* Settings - hide on small mobile */}
        <button className='hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-gray-50 transition'>
          <Settings className='w-5 h-5 text-gray-500' />
        </button>

        {/* Project Status */}
        <div className='text-right pl-2 md:pl-4 border-l border-gray-100'>
          <p className='text-[9px] md:text-[10px] font-semibold text-emerald-600 uppercase tracking-widest'>
            Project Status
          </p>
          {/* Full text on md+, short on mobile */}
          <p className='text-xs md:text-sm font-bold text-gray-900'>
            <span className='hidden md:inline'>{progress}% of Annual Goal</span>
            <span className='md:hidden'>{progress}%</span>
          </p>
        </div>
      </div>
    </header>
  );
}
