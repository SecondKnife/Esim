import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseImageURLs(imageURLs: string | string[]): string[] {
  if (typeof imageURLs === 'string') {
    try {
      return JSON.parse(imageURLs);
    } catch {
      return [];
    }
  }
  return imageURLs;
}

/**
 * Format number to Vietnamese currency (VND)
 * @param amount - The amount to format
 * @returns Formatted string with VND symbol (e.g., "180.000đ")
 */
export function formatVND(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0đ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num) + 'đ';
}