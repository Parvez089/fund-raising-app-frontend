/** @format */

export interface HistoryEntry {
  _id: string;
  targetAmount: number;
  previousAmount: number;
  changedBy: string;
  changedByInitials: string;
  reason: string;
  effectiveDate: string;
  createdAt: string;
}
