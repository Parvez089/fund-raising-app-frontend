/** @format */

// src/lib/getErrorMessage.ts
import { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong.",
): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};
