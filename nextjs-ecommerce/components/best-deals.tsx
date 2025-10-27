"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Product } from "@/types";
import ProductCard from "./ui/product-card";

const BestDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const allProducts: Product[] = await response.json();

        // Filter products with discounts and sort by discount percentage
        const discountedProducts = allProducts
          .filter((product) => product.discount && product.discount > 0)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 6); // Show top 6 deals

        setProducts(discountedProducts);
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
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🔥 Ưu đãi tốt nhất
        </h2>
        <p className="text-gray-600">
          Những gói eSIM/SIM có giá trị tốt nhất với mức giảm giá cao
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
              {/* Discount Badge */}
              {product.discount && product.discount > 0 && (
                <div className="absolute -top-2 -right-2 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  -{product.discount}%
                </div>
              )}
              <ProductCard data={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Hiện tại không có ưu đãi nào
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {products.length}
              </div>
              <div className="text-sm text-gray-600">Ưu đãi đang có</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...products.map(p => p.discount || 0))}%
              </div>
              <div className="text-sm text-gray-600">Giảm giá cao nhất</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(products.reduce((sum, p) => sum + (p.price - (p.finalPrice || p.price)), 0) / 1000)}K
              </div>
              <div className="text-sm text-gray-600">Tiết kiệm trung bình (VND)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestDeals;
