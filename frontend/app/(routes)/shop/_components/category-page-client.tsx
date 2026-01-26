"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import filteredData from "@/app/utils/filteredData";
import ProductCard from "@/components/ui/product-card";
import { getCategoryProducts } from "@/lib/apiCalls";
import { Product } from "@/types";

/**
 * Static-export friendly category page.
 * Reads category from query param: /shop/category?category=...
 */
export default function CategoryPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["category-products", category],
    queryFn: () => getCategoryProducts(category),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  });

  const sort = searchParams.get("sort");
  const price = searchParams.get("price");

  let filtered: Product[] | undefined;
  const searchParamsObj: any = {};
  if (sort) searchParamsObj.sort = sort;
  if (price) searchParamsObj.price = price;
  if (sort || price) filtered = filteredData(searchParamsObj, products);

  const displayProducts = filtered || products;

  if (!category) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Missing category. Use URL like: /shop/category?category=...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {displayProducts.map((product: Product) => (
        <ProductCard key={product.id} data={product} />
      ))}
    </div>
  );
}


