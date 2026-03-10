/** @format */

export interface Contribution {
  _id:       string;
  donorName: string;
  campaign:  string;
  amount:    number;
  status:    "success" | "pending" | "flagged";
  note:      string;
  createdAt: string;
  initials:  string;
}

export const STATUS_STYLES = {
  success: { pill: "bg-emerald-50 text-emerald-600 border border-emerald-100", dot: "bg-emerald-500", label: "SUCCESS" },
  pending: { pill: "bg-amber-50  text-amber-600  border border-amber-100",     dot: "bg-amber-400",   label: "PENDING" },
  flagged: { pill: "bg-red-50    text-red-500    border border-red-100",        dot: "bg-red-500",     label: "FLAGGED" },
};

export const AVATAR_COLORS = [
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
  "bg-teal-100 text-teal-600",
];

export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day:   "2-digit",
    year:  "numeric",
  });
}