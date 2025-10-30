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
    
    // Check if user is logged in
    try {
      const response = await axios.get("/api/auth/me");
      if (!response.data.user) {
        setLoading(false);
        return router.push("/login");
      }
    } catch {
      setLoading(false);
      return router.push("/login");
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/checkout`,
      {
        items,
      }
    );
    setLoading(false);
    window.location = response.data.url;
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Tổng quan đơn hàng</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Tổng cộng</div>
          <p className="text-lg text-gray-900 font-semibold">
            {formatVND(totalPrice)}
          </p>
        </div>
      </div>
      <Button disabled={loading} onClick={onCheckout} className="w-full mt-6">
        {loading ? <LoadingDots /> : "Thanh toán"}
      </Button>
    </div>
  );
};

export default Summary;
