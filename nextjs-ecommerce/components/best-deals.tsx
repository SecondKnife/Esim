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
      <div className="space-y-6 py-8">
        <div className="h-10 bg-gray-200 rounded-2xl w-1/3 mx-auto animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          🔥 Ưu đãi tốt nhất
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Những gói eSIM/SIM có giá trị tốt nhất với mức giảm giá cao nhất
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg">
            Hiện tại không có ưu đãi nào
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 p-8 rounded-3xl shadow-sm border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-orange-600">
                {products.length}
              </div>
              <div className="text-sm font-medium text-gray-700">Ưu đãi đang có</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-red-600">
                {Math.max(...products.map(p => p.discount || 0))}%
              </div>
              <div className="text-sm font-medium text-gray-700">Giảm giá cao nhất</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-green-600">
                {Math.round(products.reduce((sum, p) => sum + (p.price - (p.finalPrice || p.price)), 0) / 1000)}K
              </div>
              <div className="text-sm font-medium text-gray-700">Tiết kiệm trung bình (VNĐ)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestDeals;
