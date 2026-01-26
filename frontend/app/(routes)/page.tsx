"use client";

import { useEffect, useState } from "react";
import dynamicImport from "next/dynamic";
import Footer from "@/components/footer";
import Container from "@/components/ui/container";
import HeroSection from "@/components/hero-section";
import FeatureHighlights from "@/components/feature-highlights";
import CountryRegions from "@/components/country-regions";
import StatsOverview from "@/components/stats-overview";
import { getAllProducts, getCategories } from "@/lib/apiCalls";
import ProductCard from "@/components/ui/product-card";
import { useQuery } from "@tanstack/react-query";
import { Category, Product, Billboard } from "@/types";

// Lazy load các components nặng
const CarouselFeatured = dynamicImport(() => import("@/components/CarouselFeatured"), {
  loading: () => (
    <div className="py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted w-1/3 mx-auto rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const CarouselSpacing = dynamicImport(() => import("@/components/CarouselSpacing").then(mod => ({ default: mod.CarouselSpacing })), {
  loading: () => (
    <div className="py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted w-1/3 mx-auto rounded"></div>
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 w-32 bg-muted rounded flex-shrink-0"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const TitleHeader = dynamicImport(() => import("@/components/title-header"), {
  loading: () => <div className="h-16 bg-muted"></div>,
  ssr: false,
});

const HomePage = () => {
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch billboards (chỉ 1 lần duy nhất)
  const { data: billboards = [], isLoading: billboardsLoading } = useQuery<Billboard[]>({
    queryKey: ["billboards"],
    queryFn: async () => {
      const { billboardAPI } = await import("@/lib/api-client");
      return billboardAPI.getAll() as Promise<Billboard[]>;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const featuredProducts = products.filter((product: Product) => product.featured);

  return (
    <>
      {/* Hero Section - Full Width Banner */}
      <HeroSection />

      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* Stats Overview */}
      <Container>
        <StatsOverview />
      </Container>

      {/* Top Categories - Lazy Loaded */}
      <Container>
        <TitleHeader title="Top Category" url="/shop" />
        {categoriesLoading || billboardsLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Đang tải danh mục...</p>
          </div>
        ) : categoriesError ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Không thể tải danh mục. Vui lòng thử lại sau.</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <CarouselSpacing data={categories} billboards={billboards} />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>Chưa có danh mục nào</p>
          </div>
        )}
        
        {/* Products Grid */}
        {productsLoading ? (
          <div className="mt-8 py-12 text-center text-muted-foreground">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : productsError ? (
          <div className="mt-8 py-12 text-center text-muted-foreground">
            <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product: Product) => (
              <ProductCard key={product.id} data={product as any} />
            ))}
          </div>
        ) : (
          <div className="mt-8 py-12 text-center text-muted-foreground">
            <p>Chưa có sản phẩm nào</p>
          </div>
        )}
      </Container>

      {/* Country Regions */}
      <CountryRegions />

      {/* Featured Products - Lazy Loaded */}
      <div className="mb-24">
        <TitleHeader title="Featured Products" url="/featured" />
        {productsLoading ? (
          <Container>
            <div className="py-12 text-center text-muted-foreground">
              <p>Đang tải sản phẩm nổi bật...</p>
            </div>
          </Container>
        ) : productsError ? (
          <Container>
            <div className="py-12 text-center text-muted-foreground">
              <p>Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.</p>
            </div>
          </Container>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <CarouselFeatured
            data={featuredProducts.map((product: Product) => {
              const { discount, finalPrice, ...rest } = product;
              return {
                ...rest,
                price: product.price,
                finalPrice: finalPrice ?? 0,
                ...(typeof discount !== "undefined" && discount !== null ? { discount } : {}),
              };
            })}
          />
        ) : (
          <Container>
            <div className="py-12 text-center text-muted-foreground">
              <p>Chưa có sản phẩm nổi bật</p>
            </div>
          </Container>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
