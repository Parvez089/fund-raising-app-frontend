/** @format */

export interface Transaction {
  _id: string;
  donorName: string;
  campaign: string;
  amount: number;
  createdAt: string;
}

export interface AdminData {
  email: string;
  role: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  sub: string;
  type: "success" | "error";
}

export const CAMPAIGNS = ["Renovation Fund"];

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hrs > 0) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  return "Just now";
}
