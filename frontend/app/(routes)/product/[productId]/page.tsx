// Page wrapper (server component for build compatibility)
// Actual content is in ProductDetailPage (client component)
import ProductDetailPage from "./_components/product-detail";
import Footer from "@/components/footer";

export async function generateStaticParams(): Promise<Array<{ productId: string }>> {
  return [];
}

// Force static generation for export builds
export const dynamic = "force-static";
export const dynamicParams = false;

const ProductPage = () => {
  return (
    <div>
      <ProductDetailPage />
      <Footer />
    </div>
  );
};

export default ProductPage;
