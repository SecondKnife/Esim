"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        router.push("/");
        router.refresh();
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
}
