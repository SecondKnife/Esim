"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/ui/container";
import BestDeals from "@/components/best-deals";
import { getFeaturedProducts } from "@/lib/apiCalls";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";

export default function FeaturedPage() {
  const searchParams = useSearchParams();
  
  // Fetch featured products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get sort param
  const sort = searchParams.get("sort");
  
  // Filter products
  let filtered: Product[] | undefined;
  if (sort) {
    filtered = filteredData({ sort }, products);
  }

  const displayProducts = filtered || products;

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
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.</p>
            </div>
          ) : displayProducts && displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map((product: Product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Chưa có sản phẩm nổi bật</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
