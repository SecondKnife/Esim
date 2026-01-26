"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { productAPI } from "@/lib/api-client";
import { useState } from "react";

/**
 * Product detail page (static export friendly)
 * Reads product id from query param: /product?productId=...
 */
export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const router = useRouter();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading, error: productError } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => productAPI.getById(productId as string) as Promise<Product>,
    retry: 2,
    retryDelay: 1000,
    enabled: !!productId,
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => productAPI.getAll() as Promise<Product[]>,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  const relatedProducts =
    product && allProducts
      ? allProducts
          .filter((p: Product) => p.country === product.country && p.id !== product.id)
          .slice(0, 4)
      : [];

  const handleAddToCart = () => {
    if (!product) return;
    const productWithQuantity = { ...product, quantity };
    cart.addItem(productWithQuantity);
  };

  // Missing id
  if (!productId) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Missing productId. Use URL like: /product?productId=...</p>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Loading product...</p>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Product not found.</p>
      </div>
    );
  }

  // NOTE: We keep the original UI/logic from the previous component to minimize behavior changes.
  return (
    <div className="px-4 md:px-8 py-6">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={Array.isArray(product.imageURLs) ? product.imageURLs[0] : product.imageURLs}
                alt={product.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold">{product.title}</h1>
          <ProductDetails product={product as any} />

          <div className="flex items-center gap-3">
            <Button onClick={handleAddToCart} className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <RelatedProducts products={relatedProducts} currentProduct={product} />
      </div>
    </div>
  );
}


