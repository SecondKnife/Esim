import Container from "@/components/ui/container";
import BestDeals from "@/components/best-deals";
import { getFeaturedProducts } from "@/lib/apiCalls";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Featured | eSIM Store",
  description: `Featured eSIM and SIM cards with best deals and discounts`,
};

const FeaturedPage = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const data = await getFeaturedProducts();

  let filtered: Product[] | undefined;

  if (searchParams.sort) {
    filtered = filteredData(searchParams, data);
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-8 mt-2">
        {/* Best Deals Section */}
        <div className="mb-12">
          <BestDeals />
        </div>

        {/* Featured Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            ⭐ Sản phẩm nổi bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(filtered || data)?.map((product: Product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FeaturedPage;
