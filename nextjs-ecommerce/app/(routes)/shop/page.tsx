import ProductCard from "@/components/ui/product-card";
import PopularByCountry from "@/components/popular-by-country";
import { getAllProducts } from "@/lib/apiCalls";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";

export const metadata = {
  title: "Shop | eSIM Store",
  description: `Shop for eSIM and SIM cards, international travel connectivity`,
};

const ShopPage = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const data = await getAllProducts();
  let searchMsg;

  let filtered: Product[] | undefined;

  if (searchParams.sort || searchParams.price) {
    filtered = filteredData(searchParams, data);
  }

  if (searchParams.q) {
    filtered = filteredData(searchParams, data);
  }

  if (searchParams.q && filtered && filtered.length <= 0) {
    return (
      <p className="font-serif text-lg">
        There are no products that match{" "}
        <span className="font-bold">{`"${searchParams.q}"`}</span>
      </p>
    );
  }

  if (searchParams.q && filtered && filtered.length > 0) {
    searchMsg = (
      <p className="font-serif text-lg mb-3">
        Showing {filtered.length} results for{" "}
        <span className="font-bold">{`"${searchParams.q}"`}</span>
      </p>
    );
  }

  return (
    <>
      {/* Popular by Country Section */}
      <div className="mb-12">
        <PopularByCountry />
      </div>

      {/* Search Results */}
      {searchMsg ? searchMsg : ""}
      
      {/* All Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Tất cả sản phẩm eSIM/SIM
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(filtered || data)?.map((product: any) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
