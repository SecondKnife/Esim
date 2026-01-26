import NavBar from "@/components/navbar";
import { Suspense } from "react";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-full h-full w-full">
        <Suspense fallback={<div className="h-20 border-b border-border bg-background" />}>
          <NavBar />
        </Suspense>
        {children}
      </div>
    </>
  );
}
