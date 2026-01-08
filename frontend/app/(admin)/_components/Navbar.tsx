"use client";

import Logo from "@/components/Logo";
import React from "react";
import CreateButton from "./create-button";
import MobileSidebar from "./mobile-sidebar";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, isLoading } = useCurrentUser();

  return (
    <nav className="z-50 fixed bg-neutral-800 w-full h-14 flex items-center justify-between px-4 border-b border-b-gray-600">
      <div className="flex items-center gap-x-2">
        <Logo />
        <MobileSidebar>
          <Sidebar />
        </MobileSidebar>
        <p className="text-white max-sm:hidden">ADMIN PANEL</p>
      </div>
      <div className="flex items-center gap-x-4">
        <CreateButton />
        {isLoading ? (
          <div className="animate-pulse text-white text-sm">Loading...</div>
        ) : user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-white text-sm">
              <User size={16} />
              <span className="max-sm:hidden">{user.name}</span>
            </div>
            <Link href="/logout">
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut size={16} />
                <span className="max-sm:hidden">Logout</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
