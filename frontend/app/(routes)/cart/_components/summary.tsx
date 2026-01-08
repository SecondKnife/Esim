"use client";

import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingDots from "./loading-dots";
import { useRouter } from "next/navigation";
import { formatVND } from "@/lib/utils";

const Summary = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAllCart = useCart((state) => state.removeAllCart);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAllCart();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAllCart]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.totalPrice);
  }, 0);

  const onCheckout = async () => {
    setLoading(true);
    
    // Redirect to checkout page
    router.push("/checkout");
    setLoading(false);
  };

  return (
    <div className="mt-16 rounded-lg bg-card border border-border px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-foreground mb-6">Tổng quan đơn hàng</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-base font-medium text-foreground">Tổng cộng</div>
          <p className="text-lg text-foreground font-semibold">
            {formatVND(totalPrice)}
          </p>
        </div>
      </div>
      <Button 
        disabled={loading} 
        onClick={onCheckout} 
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
      >
        {loading ? <LoadingDots /> : "Thanh toán"}
      </Button>
    </div>
  );
};

export default Summary;
