// Page wrapper (server component for build compatibility)
// Actual content is in ProductDetailPage (client component)
import ProductDetailPage from "./_components/product-detail";
import Footer from "@/components/footer";

const ProductPage = () => {
  return (
    <div>
      <ProductDetailPage />
      <Footer />
    </div>
  );
};

export default ProductPage;

// Required for output: 'export' with dynamic routes
// For static export, we return empty array and let client-side handle routing
export async function generateStaticParams() {
  // In static export mode, we can't fetch from API at build time
  // Return empty array and let client-side routing handle it
  return [];
}

// Allow params not in generateStaticParams (for dev mode)
export const dynamicParams = true;
