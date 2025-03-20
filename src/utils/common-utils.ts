import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDateForInput = (date: Date | null | undefined): string => {
  if (!date) return "";
  const dateObj = new Date(date);
  return dateObj.toISOString().split("T")[0];
};