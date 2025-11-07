import Container from "./ui/container";
import Logo from "./Logo";
import NavbarActions from "./navbar-actions";
import dynamicImport from 'next/dynamic';
import { Button } from "./ui/button";
import NavbarSearch from "./navbar-search";
import MobileSidebar from "@/app/(admin)/_components/mobile-sidebar";
import NavItem from "./nav-item";
import Link from "next/link";
import { getCurrentUser } from "@/lib/get-current-user";

const NavBar = async () => {
  // Get current user
  const user = await getCurrentUser();

  // Theme toggle is client-only
  const ThemeToggle = dynamicImport(() => import('./theme-toggle'), { ssr: false });

  return (
    <div className="border-b bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <MobileSidebar>
            <NavbarSearch />
            <NavItem />
          </MobileSidebar>
          <div className="flex items-center max-md:hidden">
            <Logo />
            <NavItem />
          </div>
          <div className="max-md:hidden">
            <NavbarSearch />
          </div>
          <div className="flex items-center gap-3">
            {/* Dark/Light toggle */}
            {/* @ts-expect-error Async server component boundary for client import */}
            <ThemeToggle />
            <NavbarActions />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                    <Link href="/admin">
                      <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/logout">
                    <Button className="rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50" variant="outline" size="sm">
                      Đăng xuất
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signup">
                  <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold" size="sm">
                    Đăng ký
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold" variant="outline" size="sm">
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
