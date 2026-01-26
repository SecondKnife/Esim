// Static category page (static export friendly)
// Uses query param: /shop/category?category=...
import CategoryPageClient from "../_components/category-page-client";
import { Suspense } from "react";

export default function ShopCategoryPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
      <CategoryPageClient />
    </Suspense>
  );
}


