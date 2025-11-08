"use client";

import { Product } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { formatVND } from "@/lib/utils";

type PriceInputProps = {
  data: Product[];
};

const PriceInput = ({ data }: PriceInputProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [value, setValue] = useState<number>();

  const handleSortChange = useCallback(
    async (value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!value || +value === maxPrice) {
        current.delete("price");
      } else {
        current.set("price", value);
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";

      await router.replace(`${pathName}${query}`);
    },
    [searchParams, pathName, router, maxPrice]
  );

  useEffect(() => {
    // Use data from props instead of fetching again
    if (!data || data.length === 0) return;
    
    const prices = data.map((product: Product) => {
      if (product.finalPrice && product.finalPrice > 0) {
        return product.finalPrice;
      } else {
        return +product.price;
      }
    });

    if (prices.length > 0) {
      setMaxPrice(Math.max(...prices));
      setMinPrice(Math.min(...prices));
      setValue(Math.max(...prices));
    }
  }, [pathName, data]);

  return (
    <div className="range-container mt-2">
      <div className="range-label flex justify-between">
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold text-foreground">Giá tiền</p>
          <span className="font-serif text-foreground">{formatVND(value || 0)}</span>
        </div>
      </div>
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={value || 0}
        step="0.01"
        onChange={(e) => {
          handleSortChange(e.target.value);
          setValue(parseFloat(e.target.value));
        }}
        className="accent-orange-500 w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default PriceInput;
