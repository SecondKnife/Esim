"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

const NavItem = () => {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.user && response.data.user.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const routes = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "Featured",
      href: "/featured",
    },
    {
      label: "Admin",
      href: "/admin",
    },
  ];

  return (
    <div className="flex items-center gap-2 mx-2 max-md:flex-col max-md:items-start max-md:mt-3">
      {routes.map((route) => {
        if (route.label === "Admin" && !isAdmin) {
          return null;
        }
        return (
          <Link key={route.label} href={route.href} className="p-2 max-md:p-0">
            <p
              className={`max-md:text-yellow-50 font-serif text-gray-600 text-l max-md:text-xl hover:text-gray-300  ${
                (pathname === route.href ||
                  pathname.startsWith(`${route.href}/`)) &&
                "font-semibold max-md:underline"
              }`}
            >
              {route.label}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default NavItem;
