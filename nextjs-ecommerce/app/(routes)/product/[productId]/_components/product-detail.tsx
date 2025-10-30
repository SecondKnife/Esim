"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Phone, Wifi, Clock, MapPin, Shield, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import ProductCard from "@/components/ui/product-card";
import ProductDetails from "@/components/product-details";
import RelatedProducts from "@/components/related-products";

const ProductDetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, productsRes] = await Promise.all([
          fetch(`/api/product/${productId}`),
          fetch("/api/product"),
        ]);

        const productData = await productRes.json();
        const allProducts = await productsRes.json();

        setProduct(productData);
        
        // Get related products from same country
        const related = allProducts
          .filter((p: Product) => 
            p.country === productData.country && 
            p.id !== productData.id
          )
          .slice(0, 4);
        
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const productWithQuantity = {
        ...product,
        quantity: quantity,
      };
      cart.addItem(productWithQuantity);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sản phẩm không tồn tại</h1>
          <Link href="/shop">
            <Button>Quay lại cửa hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = typeof product.imageURLs === 'string' 
    ? JSON.parse(product.imageURLs || "[]") 
    : product.imageURLs;
  const currentPrice = product.finalPrice || product.price;
  const savings = product.finalPrice && product.finalPrice > 0 ? product.price - product.finalPrice : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-blue-600">Cửa hàng</Link>
            <span>/</span>
            <span className="text-gray-800">{product.country || product.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Quay lại cửa hàng
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={images[0] || "/placeholder.png"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <CardContent className="p-0">
                  <Wifi className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-semibold">Tốc độ cao</div>
                  <div className="text-xs text-gray-600">4G/5G</div>
                </CardContent>
              </Card>
              <Card className="p-4 text-center">
                <CardContent className="p-0">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-semibold">Bảo mật</div>
                  <div className="text-xs text-gray-600">An toàn</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{product.country}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{product.region}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">
                  {currentPrice.toLocaleString('vi-VN')} ₫
                </span>
                {product.finalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <div className="text-green-600 font-semibold">
                  Tiết kiệm {savings.toLocaleString('vi-VN')} ₫
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dung lượng</div>
                    <div className="text-gray-600">{product.dataPlan}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Thời hạn</div>
                    <div className="text-gray-600">{product.validityDays} ngày</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Loại SIM</div>
                    <div className="text-gray-600">{product.simType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Đánh giá</div>
                    <div className="text-gray-600">4.8/5 ⭐</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-l-none"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Mua ngay
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Tính năng nổi bật:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Kích hoạt nhanh chóng, không cần đăng ký phức tạp
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Hỗ trợ WiFi Hotspot cho nhiều thiết bị
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Tốc độ internet cao, ổn định
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Hỗ trợ khách hàng 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Hướng dẫn sử dụng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Cài đặt SIM</h4>
              <p className="text-sm text-gray-600">
                {product.simType === "eSIM" 
                  ? "Quét mã QR để cài đặt eSIM trên thiết bị"
                  : "Lắp SIM vào khe SIM của điện thoại"
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Kích hoạt</h4>
              <p className="text-sm text-gray-600">
                Bật dữ liệu di động và chuyển vùng dữ liệu
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Sử dụng</h4>
              <p className="text-sm text-gray-600">
                Khởi động lại thiết bị và bắt đầu sử dụng internet
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mb-8">
          <ProductDetails product={product} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} currentProduct={product} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
