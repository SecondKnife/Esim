"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getCategories } from "@/lib/apiCalls";
import SidebarItems from "./sidebar-items";
import PriceInput from "./price-input";

interface SidebarProductsProps {
  products?: any[]; // Optional products from parent page
}

const SidebarProducts = ({ products }: SidebarProductsProps = {}) => {
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch products if not provided
  const { data: fetchedProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !products || products.length === 0, // Only fetch if not provided
  });

  // Use products from props if available, otherwise use fetched products
  const data = products && products.length > 0 ? products : fetchedProducts;

  return (
    <div className="w-1/6 max-sm:w-full p-4 flex flex-col gap-y-1">
      <p className="font-semibold mt-1 text-foreground">Danh mục</p>
      {categoriesLoading ? (
        <div className="py-4 text-sm text-muted-foreground">
          Đang tải danh mục...
        </div>
      ) : (
        <SidebarItems category={categories} />
      )}
      {productsLoading && (!products || products.length === 0) ? (
        <div className="py-4 text-sm text-muted-foreground">
          Đang tải sản phẩm...
        </div>
      ) : (
        <PriceInput data={data || []} />
      )}
    </div>
  );
};

export default SidebarProducts;
