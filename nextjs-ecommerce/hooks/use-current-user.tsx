"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UseCurrentUserResponse {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * React Query hook to fetch current user
 * Caches the result to avoid duplicate API calls
 */
export const useCurrentUser = (): UseCurrentUserResponse => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/auth/me");
        return response.data.user as User | null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
  });

  return {
    user: data || null,
    isLoading,
    isError,
  };
};

