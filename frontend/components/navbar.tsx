"use client";

import Container from "./ui/container";
import Logo from "./Logo";
import NavbarActions from "./navbar-actions";
import dynamic from 'next/dynamic';
import { Button } from "./ui/button";
import NavbarSearch from "./navbar-search";
import MobileSidebar from "@/app/(admin)/_components/mobile-sidebar";
import NavItem from "./nav-item";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Suspense } from "react";

// Theme toggle is client-only
const ThemeToggle = dynamic(() => import('./theme-toggle'), { 
  ssr: false,
  loading: () => <div className="w-9 h-9" />
});

const NavBar = () => {
  // Get current user using React Query hook
  const { user, isLoading } = useCurrentUser();

  return (
    <div className="border-b border-border bg-background shadow-sm sticky top-0 z-50">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Suspense fallback={<div className="w-40 h-10 bg-muted rounded" />}>
            <MobileSidebar>
              <Suspense fallback={<div className="w-40 h-10 bg-muted rounded" />}>
                <NavbarSearch />
              </Suspense>
              <NavItem />
            </MobileSidebar>
          </Suspense>
          <div className="flex items-center max-md:hidden">
            <Logo />
            <NavItem />
          </div>
          <div className="max-md:hidden">
            <Suspense fallback={<div className="w-64 h-10 bg-muted rounded" />}>
              <NavbarSearch />
            </Suspense>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark/Light toggle */}
            <ThemeToggle />
            <NavbarActions />
            {isLoading ? (
              <div className="animate-pulse w-20 h-8 bg-muted rounded"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                    <Link href="/admin/">
                      <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/logout/">
                    <Button className="rounded-full border-2 border-orange-500 bg-transparent text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-300 hover:border-orange-600 dark:hover:border-orange-500 transition-colors" size="sm">
                      Đăng xuất
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signup/">
                  <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold" size="sm">
                    Đăng ký
                  </Button>
                </Link>
                <Link href="/login/">
                  <Button className="rounded-full border-2 border-orange-500 bg-transparent text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-300 hover:border-orange-600 dark:hover:border-orange-500 transition-colors font-semibold" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
