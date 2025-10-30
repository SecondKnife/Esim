"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { parseImageURLs, formatVND } from "@/lib/utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const router = useRouter();
  const images = parseImageURLs(data.imageURLs);

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/product/${data?.id}`);
  };

  return (
    <div className="bg-white group cursor-pointer rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div 
        onClick={handleClick}
        className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <Image
          src={images[0] || "/placeholder.png"}
          alt={data.title}
          fill
          className="object-cover opacity-0 group-hover:scale-105 duration-300 transition-all"
          onLoad={(event: React.SyntheticEvent<HTMLImageElement, Event>) =>
            event.currentTarget.classList.remove("opacity-0")
          }
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
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
          <h3 className="font-bold text-base text-gray-900 line-clamp-2 min-h-[3rem]">
            {data.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {data.country || data.category[0].toUpperCase() + data.category.slice(1)}
          </p>
        </div>

        {/* Plan Details */}
        {(data.dataPlan || data.validityDays) && (
          <div className="flex flex-col gap-1 text-xs text-gray-700">
            {data.validityDays && (
              <div className="flex items-center gap-1">
                <span className="text-gray-500">{data.validityDays} ngày sử dụng</span>
              </div>
            )}
            {data.dataPlan && (
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Internet tốc độ cao</span>
              </div>
            )}
          </div>
        )}

        {/* Provider badges */}
        {data.simType && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded font-medium">
              Nhà mạng: {data.simType}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div>
              {data.finalPrice && data.finalPrice > 0 ? (
                <>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {formatVND(data.finalPrice)}
                  </p>
                  <p className="text-sm text-gray-400 line-through mt-0.5">
                    {formatVND(data.price)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-extrabold text-gray-900">
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
          className="w-full py-3 px-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-all duration-200 text-sm"
        >
          Chi tiết sản phẩm
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
