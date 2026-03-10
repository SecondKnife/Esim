"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { orderAPI } from "@/lib/api-client";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { formatVND } from "@/lib/utils";

type OrderItem = {
  id: string;
  productName: string;
  product: {
    price: number;
    finalPrice?: number;
    simType?: string;
  };
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  orderItems: OrderItem[];
  status: string;
  paymentMethod: string;
  createdAt: string;
};

export default function CheckoutPendingClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const data = await orderAPI.getById(orderId) as Order;
          setOrder(data);
        } catch (err: any) {
          setError("Không tìm thấy thông tin đơn hàng.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
      setError("Thiếu mã đơn hàng.");
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner />
        <p className="mt-4 text-muted-foreground">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <div className="py-12 text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/shop")}>Quay lại cửa hàng</Button>
        </div>
      </Container>
    );
  }

  const totalPrice = order.orderItems.reduce((total, item) => {
    return total + (item.product.finalPrice || item.product.price);
  }, 0);

  const productNamesShort = order.orderItems.map(item => item.productName).join(", ");
  const transferContent = `${productNamesShort} - ${order.customerPhone}`;

  return (
    <>
      <Container>
        <div className="py-12 max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Thanh toán chuyển khoản</h1>
            <p className="text-muted-foreground">Vui lòng thực hiện chuyển khoản để hoàn tất đơn hàng</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 bg-orange-500 text-white text-center">
              <p className="text-sm opacity-90 uppercase tracking-widest font-semibold mb-1">Số tiền cần thanh toán</p>
              <h2 className="text-4xl font-bold">{formatVND(totalPrice)}</h2>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-64 h-auto aspect-[3/4] border-4 border-white shadow-xl rounded-xl overflow-hidden">
                  <Image
                    src="/qr-payment.jpg"
                    alt="QR Payment"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground italic">Quét mã QR để thanh toán nhanh qua ứng dụng ngân hàng</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Tên tài khoản</p>
                    <p className="font-bold text-foreground">TRAN THI THANH HIEN</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Số tài khoản</p>
                    <p className="font-bold text-foreground">1903 5063 4640 14</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Ngân hàng</p>
                    <p className="font-bold text-foreground">Techcombank</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Nội dung chuyển khoản</p>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded font-mono text-orange-700 dark:text-orange-300 font-bold select-all break-all">
                      {transferContent}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-foreground">
                    <strong className="text-orange-600">Lưu ý:</strong> Nội dung chuyển khoản ghi: <strong>{transferContent}</strong> (Tên sản phẩm + Số điện thoại người mua).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 h-12 px-8"
              onClick={() => router.push(`/checkout/success?orderId=${orderId}`)}
            >
              Tôi đã chuyển khoản
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8"
              onClick={() => router.push("/shop")}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}


