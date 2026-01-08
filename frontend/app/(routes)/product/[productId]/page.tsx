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
// This function runs at BUILD time to generate all product pages
export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/product`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch products for generateStaticParams');
      return [];
    }
    
    const products = await response.json();
    console.log(`Generating ${products.length} product pages...`);
    
    return products.map((product: any) => ({
      productId: product.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Allow params not in generateStaticParams (for dev mode)
export const dynamicParams = true;
