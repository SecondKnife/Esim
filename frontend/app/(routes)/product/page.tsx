// Static product page (static export friendly)
// Uses query param: /product?productId=...
import ProductDetailPage from "./_components/product-detail";
import Footer from "@/components/footer";
import { Suspense } from "react";

export default function ProductPage() {
  return (
    <div>
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading...</div>}>
        <ProductDetailPage />
      </Suspense>
      <Footer />
    </div>
  );
}


