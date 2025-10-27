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