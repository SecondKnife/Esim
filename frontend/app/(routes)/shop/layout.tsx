import SidebarProducts from "./_components/sidebar-products";
import SortItems from "./_components/sort-items";
import Footer from "@/components/footer";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-full w-full py-5 sm:px-6 lg:px-10 flex max-sm:flex-col mx-auto max-w-7xl">
        <Suspense fallback={<div className="w-64 h-40 bg-muted rounded" />}>
          <SidebarProducts />
        </Suspense>
        <div className="flex-1 p-4 ">
          <Suspense fallback={<div className="h-10 bg-muted rounded mb-4" />}>
            <SortItems />
          </Suspense>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
