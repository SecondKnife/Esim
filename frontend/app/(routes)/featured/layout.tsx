import Footer from "@/components/footer";
import SortItems from "../shop/_components/sort-items";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-full w-full py-5 sm:px-6 lg:px-10 flex max-sm:flex-col mx-auto max-w-7xl">
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
