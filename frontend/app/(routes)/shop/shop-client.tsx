"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/product-card";
import PopularByCountry from "@/components/popular-by-country";
import { getAllProducts } from "@/lib/apiCalls";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";

export default function ShopClientPage() {
  const searchParams = useSearchParams();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  const sort = searchParams.get("sort");
  const price = searchParams.get("price");
  const q = searchParams.get("q");

  let filtered: Product[] | undefined;
  const searchParamsObj: any = {};
  if (sort) searchParamsObj.sort = sort;
  if (price) searchParamsObj.price = price;
  if (q) searchParamsObj.q = q;
  if (sort || price || q) filtered = filteredData(searchParamsObj, products);

  if (isLoading) {
    return (
      <>
        <div className="mb-12">
          <PopularByCountry products={[]} />
        </div>
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-foreground mb-8 tracking-tight">
            Tất cả sản phẩm eSIM/SIM
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="mb-12">
          <PopularByCountry products={[]} />
        </div>
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-foreground mb-8 tracking-tight">
            Tất cả sản phẩm eSIM/SIM
          </h2>
          <div className="py-12 text-center text-muted-foreground">
            <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </>
    );
  }

  if (q && filtered && filtered.length <= 0) {
    return (
      <>
        <div className="mb-12">
          <PopularByCountry products={products} />
        </div>
        <p className="font-serif text-lg text-foreground">
          Không tìm thấy sản phẩm nào phù hợp với{" "}
          <span className="font-bold">{`"${q}"`}</span>
        </p>
      </>
    );
  }

  const displayProducts = filtered || products;
  const searchMsg =
    q && filtered && filtered.length > 0 ? (
      <p className="font-serif text-lg mb-3 text-foreground">
        Hiển thị {filtered.length} kết quả cho <span className="font-bold">{`"${q}"`}</span>
      </p>
    ) : null;

  return (
    <>
      <div className="mb-12">
        <PopularByCountry products={products} />
      </div>

      {searchMsg && <div className="mb-6 px-4">{searchMsg}</div>}

      <div className="mb-12">
        <h2 className="text-3xl font-extrabold text-foreground mb-8 tracking-tight">
          Tất cả sản phẩm eSIM/SIM
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product: Product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </div>
    </>
  );
}


