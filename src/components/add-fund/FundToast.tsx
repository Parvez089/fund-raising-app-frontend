/** @format */

import { CheckCircle2, X } from "lucide-react";
import { ToastState } from "./types";

interface FundToastProps {
  toast: ToastState;
  onClose: () => void;
}

export default function FundToast({ toast, onClose }: FundToastProps) {
  if (!toast.show) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white min-w-[300px] transition-all ${
        toast.type === "success" ? "bg-gray-900" : "bg-red-600"
      }`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          toast.type === "success" ? "bg-emerald-500" : "bg-red-400"
        }`}>
        <CheckCircle2 className='w-4 h-4 text-white' />
      </div>
      <div className='flex-1'>
        <p className='text-sm font-bold'>{toast.message}</p>
        {toast.sub && (
          <p className='text-xs text-gray-400 mt-0.5'>{toast.sub}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className='text-gray-400 hover:text-white transition ml-2'>
        <X className='w-4 h-4' />
      </button>
    </div>
  );
}
