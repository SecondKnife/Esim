import { Suspense } from "react";
import FeaturedClientPage from "./featured-client";

// Static export friendly wrapper (useSearchParams must be under Suspense)
export default function FeaturedPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
      <FeaturedClientPage />
    </Suspense>
  );
}


