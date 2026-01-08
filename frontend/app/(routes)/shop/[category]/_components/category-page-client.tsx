"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import filteredData from "@/app/utils/filteredData";
import ProductCard from "@/components/ui/product-card";
import { getCategoryProducts } from "@/lib/apiCalls";
import { Product } from "@/types";

export default function CategoryPageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;

  // Fetch category products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["category-products", category],
    queryFn: () => getCategoryProducts(category),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!category,
  });

  // Get search params
  const sort = searchParams.get("sort");
  const price = searchParams.get("price");
  
  // Filter products
  let filtered: Product[] | undefined;
  const searchParamsObj: any = {};
  if (sort) searchParamsObj.sort = sort;
  if (price) searchParamsObj.price = price;

  if (sort || price) {
    filtered = filteredData(searchParamsObj, products);
  }

  const displayProducts = filtered || products;

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  // Empty state
  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Chưa có sản phẩm nào trong danh mục này</p>
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
