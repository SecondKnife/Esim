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
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🌍 Sản phẩm phổ biến theo quốc gia
        </h2>
        <p className="text-gray-600">
          Khám phá các gói eSIM/SIM được yêu thích nhất tại từng quốc gia
        </p>
      </div>

      {countryProducts.map((countryData) => (
        <div key={countryData.country} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-gray-800">
              {countryData.country}
            </h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {countryData.products.length} sản phẩm
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryData.products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      ))}

      {countryProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Không có sản phẩm nào được tìm thấy
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularByCountry;
