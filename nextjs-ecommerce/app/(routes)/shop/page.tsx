import ProductCard from "@/components/ui/product-card";
import PopularByCountry from "@/components/popular-by-country";
import { getAllProducts } from "@/lib/apiCalls";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        Không tìm thấy sản phẩm nào phù hợp với{" "}
        <span className="font-bold">{`"${searchParams.q}"`}</span>
      </p>
    );
  }

  if (searchParams.q && filtered && filtered.length > 0) {
    searchMsg = (
      <p className="font-serif text-lg mb-3">
        Hiển thị {filtered.length} kết quả cho{" "}
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
      {searchMsg && (
        <div className="mb-6 px-4">
          {searchMsg}
        </div>
      )}
      
      {/* All Products Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Tất cả sản phẩm eSIM/SIM
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {(filtered || data)?.map((product: any) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
