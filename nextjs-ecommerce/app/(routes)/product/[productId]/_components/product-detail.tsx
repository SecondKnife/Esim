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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sản phẩm không tồn tại</h1>
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
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Cửa hàng</Link>
            <span>/</span>
            <span className="text-foreground">{product.country || product.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Quay lại cửa hàng
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-card rounded-lg overflow-hidden shadow-lg border border-border">
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
              <Card className="p-4 text-center bg-card border-border">
                <CardContent className="p-0">
                  <Wifi className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm font-semibold text-card-foreground">Tốc độ cao</div>
                  <div className="text-xs text-muted-foreground">4G/5G</div>
                </CardContent>
              </Card>
              <Card className="p-4 text-center bg-card border-border">
                <CardContent className="p-0">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <div className="text-sm font-semibold text-card-foreground">Bảo mật</div>
                  <div className="text-xs text-muted-foreground">An toàn</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{product.country}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{product.region}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {currentPrice.toLocaleString('vi-VN')} ₫
                </span>
                {product.finalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-semibold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  Tiết kiệm {savings.toLocaleString('vi-VN')} ₫
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Dung lượng</div>
                    <div className="text-muted-foreground">{product.dataPlan}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Thời hạn</div>
                    <div className="text-muted-foreground">{product.validityDays} ngày</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Loại SIM</div>
                    <div className="text-muted-foreground">{product.simType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Đánh giá</div>
                    <div className="text-muted-foreground">4.8/5 ⭐</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">Số lượng:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none border-border"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border-x border-border bg-background text-foreground">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-l-none border-border"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Mua ngay
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-3 text-foreground">Tính năng nổi bật:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  Kích hoạt nhanh chóng, không cần đăng ký phức tạp
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  Hỗ trợ WiFi Hotspot cho nhiều thiết bị
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  Tốc độ internet cao, ổn định
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  Hỗ trợ khách hàng 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">Hướng dẫn sử dụng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Cài đặt SIM</h4>
              <p className="text-sm text-muted-foreground">
                {product.simType === "eSIM" 
                  ? "Quét mã QR để cài đặt eSIM trên thiết bị"
                  : "Lắp SIM vào khe SIM của điện thoại"
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Kích hoạt</h4>
              <p className="text-sm text-muted-foreground">
                Bật dữ liệu di động và chuyển vùng dữ liệu
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Sử dụng</h4>
              <p className="text-sm text-muted-foreground">
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
