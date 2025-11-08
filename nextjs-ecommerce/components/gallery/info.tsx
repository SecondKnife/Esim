"use client";
import { ShoppingCart } from "lucide-react";

import { Category, Product } from "@/types";
import { Button } from "../ui/button";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { formatVND } from "@/lib/utils";

interface InfoProps {
  data: Product;
  categories: Category[];
  availableSizes: Category[];
}

const Info: React.FC<InfoProps> = ({ data, categories, availableSizes }) => {
  const [size, setSize] = useState("");

  const cart = useCart();

  const isSizeAvailable = (sizeId: string) => {
    return availableSizes.some((size: any) => size.sizeId === sizeId);
  };

  const onAddToCart = () => {
    const productWithSize = {
      ...data,
      size: size,
    };
    cart.addItem(productWithSize);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">{data.title}</h1>
      <div className="mt-3 flex items-end justify-between">
        {data.finalPrice && data.finalPrice > 0 ? (
          <div className="font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground line-through">
                {formatVND(data.price)}
              </span>
              <div className="bg-red-600 text-sm text-white p-1 px-1 font-semibold rounded-sm">
                -{data?.discount}%
              </div>
            </div>
            <p className="text-2xl text-foreground font-semibold mt-1">
              {formatVND(data.finalPrice)}
            </p>
          </div>
        ) : (
          <p className="text-2xl text-foreground font-semibold">
            {formatVND(data.price)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-x-4 mt-3">
        <span className="text-sm font-serif text-muted-foreground">
          {data?.description}
        </span>
      </div>
      
      {/* eSIM/SIM Specific Information */}
      {(data.country || data.region || data.dataPlan || data.validityDays || data.simType) && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-3 text-foreground">Thông tin chi tiết</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.country && (
              <div>
                <span className="text-sm text-muted-foreground">Quốc gia:</span>
                <p className="font-medium text-foreground">{data.country}</p>
              </div>
            )}
            {data.region && (
              <div>
                <span className="text-sm text-muted-foreground">Khu vực:</span>
                <p className="font-medium text-foreground">{data.region}</p>
              </div>
            )}
            {data.dataPlan && (
              <div>
                <span className="text-sm text-muted-foreground">Dung lượng:</span>
                <p className="font-medium text-foreground">{data.dataPlan}</p>
              </div>
            )}
            {data.validityDays && (
              <div>
                <span className="text-sm text-muted-foreground">Thời hạn:</span>
                <p className="font-medium text-foreground">{data.validityDays} ngày</p>
              </div>
            )}
            {data.simType && (
              <div>
                <span className="text-sm text-muted-foreground">Loại SIM:</span>
                <p className="font-medium text-foreground">{data.simType}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex mt-2 flex-wrap gap-2 flex-col">
        <span className="text-xl font-semibold py-2 text-foreground">Size</span>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category: any) => {
            const isSizeAvailableInCategory = isSizeAvailable(category.id);
            return (
              <Button
                type="button"
                className={`${
                  isSizeAvailableInCategory
                    ? ""
                    : "disabled:pointer-events-auto relative z-10 cursor-not-allowed overflow-hidden bg-muted text-muted-foreground ring-1 ring-border before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-border before:transition-transform hover:bg-transparent"
                } flex min-w-[48px] items-center justify-center rounded-full border border-border px-2 py-1 text-sm ${
                  size === category.name ? "ring-2 ring-primary" : ""
                }`}
                key={category.id}
                disabled={!isSizeAvailableInCategory}
                onClick={() => setSize(category.name)}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
      <hr className="my-4 border-border" />
      <div className="flex flex-col gap-y-6"></div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          disabled={!size}
          onClick={onAddToCart}
          className={`flex items-center gap-x-2 ${
            !size
              ? "disabled:pointer-events-auto relative z-10 cursor-not-allowed"
              : ""
          }`}
        >
          Thêm vào giỏ hàng
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
