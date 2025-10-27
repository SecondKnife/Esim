import Container from "./ui/container";
import Logo from "./Logo";
import NavbarActions from "./navbar-actions";
import { Button } from "./ui/button";
import NavbarSearch from "./navbar-search";
import MobileSidebar from "@/app/(admin)/_components/mobile-sidebar";
import NavItem from "./nav-item";
import Link from "next/link";

const NavBar = async () => {
  // Fetch current user from API
  let user = null;
  try {
    const response = await fetch("http://localhost:3000/api/auth/me", {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      user = data.user;
    }
  } catch (error) {
    user = null;
  }

  return (
    <div className="border-b">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
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
          <div className="flex items-center">
            <NavbarActions />
            {user ? (
              <div className="ml-2 flex items-center gap-2">
                <Link href="/logout">
                  <Button className="rounded-sm" variant="outline">
                    {user.name}
                  </Button>
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button className="rounded-sm">Admin</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/signup">
                  <Button className="rounded-sm">Sign Up</Button>
                </Link>
                <Link href="/login">
                  <Button className="rounded-sm" variant="outline">Sign In</Button>
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
