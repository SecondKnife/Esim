"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";

/**
 * 404 page with client-side redirects from old dynamic URLs to new static URLs.
 * This works well on R2/static hosting because unknown paths fall back to 404.html.
 */
export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    // /product/:id -> /product?productId=:id
    const productMatch = pathname.match(/^\/product\/([^/]+)$/);
    if (productMatch) {
      const id = decodeURIComponent(productMatch[1]);
      router.replace(`/product?productId=${encodeURIComponent(id)}`);
      return;
    }

    // /shop/:category -> /shop/category?category=:category
    const shopMatch = pathname.match(/^\/shop\/([^/]+)$/);
    if (shopMatch) {
      const category = decodeURIComponent(shopMatch[1]);
      router.replace(`/shop/category?category=${encodeURIComponent(category)}`);
      return;
    }

    // /admin/billboards/edit/:id -> /admin/billboards/edit?id=:id
    const bbMatch = pathname.match(/^\/admin\/billboards\/edit\/([^/]+)$/);
    if (bbMatch) {
      const id = decodeURIComponent(bbMatch[1]);
      router.replace(`/admin/billboards/edit?id=${encodeURIComponent(id)}`);
      return;
    }

    // /admin/categories/edit/:categoryId -> /admin/categories/edit?categoryId=:categoryId
    const catMatch = pathname.match(/^\/admin\/categories\/edit\/([^/]+)$/);
    if (catMatch) {
      const categoryId = decodeURIComponent(catMatch[1]);
      router.replace(`/admin/categories/edit?categoryId=${encodeURIComponent(categoryId)}`);
      return;
    }

    // /admin/products/:productId -> /admin/products/edit?productId=:productId
    const prodAdminMatch = pathname.match(/^\/admin\/products\/([^/]+)$/);
    if (prodAdminMatch) {
      const productId = decodeURIComponent(prodAdminMatch[1]);
      router.replace(`/admin/products/edit?productId=${encodeURIComponent(productId)}`);
      return;
    }

    // /admin/users/edit/:userId -> /admin/users/edit?userId=:userId
    const userMatch = pathname.match(/^\/admin\/users\/edit\/([^/]+)$/);
    if (userMatch) {
      const userId = decodeURIComponent(userMatch[1]);
      router.replace(`/admin/users/edit?userId=${encodeURIComponent(userId)}`);
      return;
    }
  }, [pathname, router]);

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-full gap-x-1 font-bold text-lg">
        <p>404 |</p>
        <p>This page could not be found.</p>
      </div>
      <Footer />
    </>
  );
}
