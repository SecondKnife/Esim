import { Suspense } from "react";
import CheckoutPendingClientPage from "./pending-client";

// Static export friendly wrapper (useSearchParams must be under Suspense)
export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
      <CheckoutPendingClientPage />
    </Suspense>
  );
}


