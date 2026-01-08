"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../_components/Navbar";
import Sidebar from "../_components/Sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?redirect=/admin");
        return;
      }

      // Check if user has admin or moderator role
      const allowedRoles = ["ADMIN", "MODERATOR"];
      if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const allowedRoles = ["ADMIN", "MODERATOR"];
  if (!allowedRoles.includes(user.role)) {
    return null; // Will redirect
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-14 flex h-full gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
