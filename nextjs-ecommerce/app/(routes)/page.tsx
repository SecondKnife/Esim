import dynamicImport from "next/dynamic";
import Footer from "@/components/footer";
import Container from "@/components/ui/container";
import HeroSection from "@/components/hero-section";
import FeatureHighlights from "@/components/feature-highlights";
import CountryRegions from "@/components/country-regions";
import StatsOverview from "@/components/stats-overview";
import { getAllProducts, getCategories } from "@/lib/apiCalls";
import ProductCard from "@/components/ui/product-card";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  ssr: true,
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
  ssr: true,
});

const TitleHeader = dynamicImport(() => import("@/components/title-header"), {
  loading: () => <div className="h-16 bg-muted"></div>,
  ssr: true,
});

const HomePage = async () => {
  try {
    const category = await getCategories();
    const products = await getAllProducts();

    const featuredProducts = products.filter(
      (product) => product.featured
    );

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
          {category && category.length > 0 ? (
            <CarouselSpacing data={category} />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>Đang tải danh mục...</p>
            </div>
          )}
          {/* Thêm sản phẩm hiển thị ngay dưới Top Category */}
          {products && products.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product) => (
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
          {featuredProducts && featuredProducts.length > 0 ? (
            <CarouselFeatured
              data={featuredProducts.map((product) => {
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
  } catch (error) {
    console.error("Error loading home page:", error);
    return (
      <>
        <HeroSection />
        <Container>
          <div className="py-12 text-center">
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }
};

export default HomePage;
