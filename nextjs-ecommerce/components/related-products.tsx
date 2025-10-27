"use client";

import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";
import { Card, CardContent } from "@/components/ui/card";

interface RelatedProductsProps {
  products: Product[];
  currentProduct: Product;
}

const RelatedProducts = ({ products, currentProduct }: RelatedProductsProps) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Sản phẩm liên quan
        </h3>
        <p className="text-gray-600">
          Khám phá thêm các gói eSIM/SIM khác tại {currentProduct.country}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard data={product} />
            {/* Highlight if it's a better deal */}
            {product.finalPrice && product.finalPrice < (currentProduct.finalPrice || currentProduct.price) && (
              <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Giá tốt hơn
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {products.length}
            </div>
            <div className="text-sm text-gray-600">Sản phẩm khác</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {Math.min(...products.map(p => p.finalPrice || p.price)).toLocaleString('vi-VN')} ₫
            </div>
            <div className="text-sm text-gray-600">Giá thấp nhất</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {Math.max(...products.map(p => p.validityDays || 0))} ngày
            </div>
            <div className="text-sm text-gray-600">Thời hạn dài nhất</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
