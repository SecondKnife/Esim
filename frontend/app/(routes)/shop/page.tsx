import { Suspense } from "react";
import ShopClientPage from "./shop-client";

// Static export friendly wrapper (useSearchParams must be under Suspense)
export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
      <ShopClientPage />
    </Suspense>
  );
}


