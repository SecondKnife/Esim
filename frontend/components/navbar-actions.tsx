"use client";

import { useRouter } from "next/navigation";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useCart from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  const filteredShop = cart?.items?.map((item) => item.quantity);

  const shopCount = filteredShop?.reduce((a, b) => {
    return a + b;
  }, 0);

  return (
    <div className="flex items-center">
      <button
        onClick={() => router.push("/cart")}
        className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
        aria-label="Shopping Cart"
      >
        <Badge
          badgeContent={shopCount}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#ef4444",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              minWidth: "20px",
              height: "20px",
              borderRadius: "10px",
            },
          }}
        >
          <ShoppingCartIcon style={{ fontSize: "26px", color: "#374151" }} />
        </Badge>
        {shopCount > 0 && (
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {shopCount} {shopCount === 1 ? "item" : "items"}
          </span>
        )}
      </button>
    </div>
  );
};

export default NavbarActions;
