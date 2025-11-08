import { Product } from "@/types";
import ProductCard from "./ui/product-card";
import Link from "next/link";

interface CountryProducts {
  country: string;
  products: Product[];
  totalCount: number;
}

interface PopularByCountryProps {
  products: Product[];
}

const PopularByCountry = ({ products }: PopularByCountryProps) => {
  // Group products by country
  const groupedByCountry: { [key: string]: Product[] } = {};
  
  products.forEach((product) => {
    if (product.country) {
      if (!groupedByCountry[product.country]) {
        groupedByCountry[product.country] = [];
      }
      groupedByCountry[product.country].push(product);
    }
  });

  // Convert to array and sort by product count
  const countryProducts = Object.entries(groupedByCountry)
    .map(([country, products]) => ({
      country,
      products: products.slice(0, 3), // Show only top 3 products per country
      totalCount: products.length, // Store total count before slicing
    }))
    .sort((a, b) => b.totalCount - a.totalCount);

  return (
    <div className="space-y-12 py-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
          🌍 Sản phẩm phổ biến theo quốc gia
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Khám phá các gói eSIM/SIM được yêu thích nhất tại từng quốc gia
        </p>
      </div>

      {countryProducts.map((countryData) => {
        // Get category from first product (all products in same country should have same category)
        const category = countryData.products[0]?.category;

        return (
          <div key={countryData.country} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-foreground">
                  {countryData.country}
                </h3>
                <span className="text-sm bg-orange-500/20 text-orange-700 dark:text-orange-300 px-4 py-1.5 rounded-full font-semibold">
                  {countryData.totalCount} sản phẩm
                </span>
              </div>
              {category ? (
                <Link 
                  href={`/shop/${category}`}
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm flex items-center gap-1 transition-colors"
                >
                  Xem tất cả →
                </Link>
              ) : (
                <Link 
                  href="/shop"
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm flex items-center gap-1 transition-colors"
                >
                  Xem tất cả →
                </Link>
              )}
            </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {countryData.products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          </div>
        );
      })}

      {countryProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-muted-foreground text-lg">
            Không có sản phẩm nào được tìm thấy
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularByCountry;
