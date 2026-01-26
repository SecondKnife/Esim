"use client";

import Gallery from "@/components/gallery/gallery";
import Info from "@/components/gallery/info";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import { Category, type Product } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { getCategories } from "@/lib/apiCalls";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { productAPI, sizeAPI } from "@/lib/api-client";

const ProductItem = () => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const { productId } = useParams();

  const [productQuery, relatedQuery] = useQueries({
    queries: [
      {
        queryKey: ["single product", productId],
        queryFn: async () => await productAPI.getById(productId as string) as Promise<Product>,
      },
      {
        queryKey: ["related products"],
        queryFn: async () => await productAPI.getAll() as Promise<Product[]>,
      },
    ],
  });

  const { isLoading, data } = useQuery({
    queryKey: ["product categories", productQuery.data?.categoryId],
    queryFn: async () => {
      if (!productQuery.data?.categoryId) return [];
      const data = await sizeAPI.getByCategoryId(productQuery.data.categoryId) as Array<{ id: string; name: string }>;
      const sortedData = data.sort((a: any, b: any) => {
        return a.name - b.name;
      });
      setCategories(sortedData);
      return data;
    },
    enabled: !!productQuery.data?.categoryId,
  });

  if (productQuery.isLoading || relatedQuery.isLoading) {
    return (
      <Container>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (!productQuery.data || !relatedQuery.data) {
    return <Container><p className="text-foreground">Something went wrong!</p></Container>;
  }

  const filteredData: Product[] = relatedQuery?.data?.filter(
    (item: Product) => item.category === productQuery?.data?.category && productQuery.data.id !== item.id
  );

  return (
    <div className="bg-background">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-16">
          <Link href="/shop" className="flex items-center mb-5 gap-x-1 text-foreground hover:text-primary transition-colors">
            <ArrowBackIcon style={{ width: "20px", height: "20px" }} />
            <p className="text-md font-semibold">Back to shop</p>
          </Link>
          <div className="lg:grid lg:grid-cols-[500px_minmax(400px,_1fr)_100px] lg:items-start lg:gap-x-8">
            <Gallery images={Array.isArray(productQuery.data?.imageURLs) ? productQuery.data.imageURLs : productQuery.data?.imageURLs ? [productQuery.data.imageURLs] : []} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info
                data={productQuery?.data}
                categories={categories as unknown as Category[]}
                availableSizes={(productQuery.data as any).productSizes as unknown as Category[]}
              />
            </div>
          </div>

          <hr className="my-10 border-border" />
          <div className="space-y-4">
           {
            filteredData.length > 0 && <h3 className="font-semibold text-3xl text-foreground">Recommended</h3>
           }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredData?.map((item: Product) => {
                return <ProductCard key={item.id} data={item} />;
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductItem;
