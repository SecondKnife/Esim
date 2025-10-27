import { type Metadata } from "next";
import ProductDetailPage from "./_components/product-detail";
import { getProduct } from "@/lib/apiCalls";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const getProducts = await getProduct(params.productId);

  if (!getProducts)
    return {
      title: "eSIM Store",
      description: "eSIM and SIM cards for international travel",
    };

  return {
    title: `${getProducts.title} | ${siteConfig.name}`,
    description: getProducts.description,
  };
}

const ProductPage = ({ params }: { params: { productId: string } }) => {
  return (
    <div>
      <ProductDetailPage />
      <Footer />
    </div>
  );
};

export default ProductPage;
