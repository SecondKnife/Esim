"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product } from "@/types";
import { parseImageURLs, formatVND } from "@/lib/utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { R2_BASE_URL } from "@/lib/r2-urls";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const router = useRouter();
  const images = parseImageURLs(data.imageURLs);
  const [imageSrc, setImageSrc] = useState(() => {
    if (!images || images.length === 0) return "/placeholder.png";
    const firstImage = images[0];
    
    // If already a full URL, use it
    if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
      return firstImage;
    }
    
    // If base64, use it
    if (firstImage.startsWith("data:image/")) {
      return firstImage;
    }
    
    // If relative path, prepend R2 base URL
    const cleanPath = firstImage.startsWith("/") ? firstImage.slice(1) : firstImage;
    return `${R2_BASE_URL}/${cleanPath}`;
  });
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    router.push(`/product?productId=${data?.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/product?productId=${data?.id}`);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc("/placeholder.png");
    }
  };

  return (
    <div className="bg-card text-card-foreground group cursor-pointer rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
      {/* Image Container */}
      <div 
        onClick={handleClick}
        className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50"
      >
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={data.title}
            fill
            className="object-cover opacity-0 group-hover:scale-105 duration-300 transition-all"
            onLoad={(event: React.SyntheticEvent<HTMLImageElement, Event>) =>
              event.currentTarget.classList.remove("opacity-0")
            }
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={imageSrc.startsWith("data:image/")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <span className="text-sm">Không có ảnh</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {data.discount && data.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            -{data.discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Location */}
        <div onClick={handleClick}>
          <h3 className="font-bold text-base text-foreground line-clamp-2 min-h-[3rem]">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {data.country || data.category[0].toUpperCase() + data.category.slice(1)}
          </p>
        </div>

        {/* Plan Details */}
        {(data.dataPlan || data.validityDays) && (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {data.validityDays && (
              <div className="flex items-center gap-1">
                <span>{data.validityDays} ngày sử dụng</span>
              </div>
            )}
            {data.dataPlan && (
              <div className="flex items-center gap-1">
                <span>Internet tốc độ cao</span>
              </div>
            )}
          </div>
        )}

        {/* Provider badges */}
        {data.simType && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded font-medium">
              Nhà mạng: {data.simType}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-end justify-between">
            <div>
              {data.finalPrice && data.finalPrice > 0 ? (
                <>
                  <p className="text-2xl font-extrabold text-foreground">
                    {formatVND(data.finalPrice)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through mt-0.5">
                    {formatVND(data.price)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-extrabold text-foreground">
                  {formatVND(data.price)}
                </p>
              )}
            </div>
            
            {/* Cart Icon Button */}
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCartIcon style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClick}
          className="w-full py-3 px-4 border-2 border-orange-500 text-orange-500 dark:text-orange-400 font-semibold rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all duration-200 text-sm"
        >
          Chi tiết sản phẩm
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
