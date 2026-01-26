"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api-client";

export default function LogoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const logout = async () => {
      try {
        await authAPI.logout();
        // Invalidate và clear currentUser query để update UI
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.setQueryData(["currentUser"], null);
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        router.push("/");
        router.refresh();
      }
    };

    logout();
  }, [router, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
}
