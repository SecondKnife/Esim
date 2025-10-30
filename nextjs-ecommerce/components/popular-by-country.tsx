"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Product } from "@/types";
import ProductCard from "./ui/product-card";

interface CountryProducts {
  country: string;
  products: Product[];
}

const PopularByCountry = () => {
  const [countryProducts, setCountryProducts] = useState<CountryProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const products: Product[] = await response.json();

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
        const countryArray = Object.entries(groupedByCountry)
          .map(([country, products]) => ({
            country,
            products: products.slice(0, 3), // Show only top 3 products per country
          }))
          .sort((a, b) => b.products.length - a.products.length);

        setCountryProducts(countryArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12 py-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-2xl w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-96 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          🌍 Sản phẩm phổ biến theo quốc gia
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Khám phá các gói eSIM/SIM được yêu thích nhất tại từng quốc gia
        </p>
      </div>

      {countryProducts.map((countryData) => (
        <div key={countryData.country} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold text-gray-900">
                {countryData.country}
              </h3>
              <span className="text-sm bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-semibold">
                {countryData.products.length} sản phẩm
              </span>
            </div>
            <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1">
              Xem tất cả →
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {countryData.products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      ))}

      {countryProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg">
            Không có sản phẩm nào được tìm thấy
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularByCountry;
