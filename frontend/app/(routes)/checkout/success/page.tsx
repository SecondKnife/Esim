import { Suspense } from "react";
import CheckoutSuccessClientPage from "./success-client";

// Static export friendly wrapper (useSearchParams must be under Suspense)
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
      <CheckoutSuccessClientPage />
    </Suspense>
  );
}


