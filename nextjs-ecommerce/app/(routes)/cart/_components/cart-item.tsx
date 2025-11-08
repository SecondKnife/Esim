import Image from "next/image";

import useCart from "@/hooks/use-cart";
import type { CartItem } from "@/hooks/use-cart";
import { Product } from "@/types";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { parseImageURLs, formatVND } from "@/lib/utils";

interface CartItemProps {
  data: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const images = parseImageURLs(data.imageURLs);

  const onRemoveAll = () => {
    cart.removeAll(data);
  };

  const onRemove = () => {
    cart.removeItem(data);
  };

  const onAdd = () => {
    cart.addItem(data);
  };

  return (
    <li className="flex py-6 border-b border-border">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48 bg-muted">
        <Image
          fill
          src={images[0] || "/placeholder.png"}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <button
            onClick={onRemoveAll}
            className="rounded-full flex items-center justify-center bg-card border border-border shadow-md p-2 hover:scale-110 transition text-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-foreground">{data.title}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-muted-foreground">
              {data.category[0].toUpperCase() + data.category.slice(1)} /{" "}
              {data.size}
            </p>
          </div>
          <div className="flex flex-col mt-2 gap-y-3 max-md:flex-row max-md:justify-between max-md:items-center">
            <p className="text-lg text-foreground font-semibold">
              {data.totalPrice
                ? formatVND(data.totalPrice)
                : data.finalPrice
                ? formatVND(data.finalPrice)
                : formatVND(data.price)}
            </p>
            <div className="flex max-md:justify-end w-full">
              <div className="border border-border bg-card w-28 rounded-3xl p-2 gap-2 flex justify-between items-center">
                <button 
                  onClick={onRemove}
                  className="text-foreground hover:text-orange-500 transition-colors"
                >
                  <RemoveIcon />
                </button>
                <p className="text-foreground font-medium">{data.quantity}</p>
                <button 
                  onClick={onAdd}
                  className="text-foreground hover:text-orange-500 transition-colors"
                >
                  <AddIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
