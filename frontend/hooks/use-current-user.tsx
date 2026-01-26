"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SessionInfo {
  expiresAt: string;
  remainingDays: number;
  remainingHours: number;
}

interface UseCurrentUserResponse {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  sessionInfo?: SessionInfo | null;
}

/**
 * React Query hook to fetch current user with session expiry handling
 * Implements auto-logout after 7 days (session expiry)
 * Best practices:
 * - Checks session expiry on mount and periodically
 * - Auto-logout when session expires
 * - Clears cache on logout
 */
export const useCurrentUser = (): UseCurrentUserResponse => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await authAPI.getCurrentUser() as { 
          user: User | null;
          expiresAt?: string;
          remainingDays?: number;
          remainingHours?: number;
        };
        
        // If user is null, session expired or not logged in
        if (!response.user) {
          return { user: null, sessionInfo: null };
        }

        return {
          user: response.user,
          sessionInfo: response.expiresAt ? {
            expiresAt: response.expiresAt,
            remainingDays: response.remainingDays || 0,
            remainingHours: response.remainingHours || 0,
          } : null,
        };
      } catch (error) {
        console.error("Error fetching current user:", error);
        return { user: null, sessionInfo: null };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch on window focus to check session expiry
    refetchOnMount: true, // Refetch on mount to check session expiry
    refetchInterval: 60 * 60 * 1000, // Refetch every hour to check session expiry
  });

  // Auto-logout when session expires
  useEffect(() => {
    if (!data?.sessionInfo?.expiresAt) return;

    const expiresAt = new Date(data.sessionInfo.expiresAt);
    const now = new Date();
    const remainingMs = expiresAt.getTime() - now.getTime();

    // If session already expired, logout immediately
    if (remainingMs <= 0) {
      console.log("⏰ Session expired, logging out...");
      handleAutoLogout();
      return;
    }

    // Set timeout to logout when session expires
    const timeoutId = setTimeout(() => {
      console.log("⏰ Session expired (7 days), auto-logout...");
      handleAutoLogout();
    }, remainingMs);

    return () => clearTimeout(timeoutId);
  }, [data?.sessionInfo?.expiresAt]);

  const handleAutoLogout = async () => {
    try {
      // Clear React Query cache
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser"], null);
      
      // Call logout API to clear server-side session
      try {
        await authAPI.logout();
      } catch (error) {
        console.error("Logout API error:", error);
      }
      
      // Redirect to login page
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Auto-logout error:", error);
    }
  };

  return {
    user: data?.user || null,
    isLoading,
    isError,
    sessionInfo: data?.sessionInfo || null,
  };
};

