"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Container>
        <div className="py-20 max-w-xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 size={48} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground text-lg">
              Cảm ơn bạn đã tin tưởng và mua sắm tại sim4travel.vn
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            {orderId ? (
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-bold text-foreground">#{orderId.slice(-8).toUpperCase()}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Đơn hàng của bạn đã được ghi nhận vào hệ thống. Đội ngũ sim4travel sẽ kiểm tra và gởi thông tin eSIM đến email của bạn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <p className="text-red-500">Thiếu thông tin mã đơn hàng.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8"
              onClick={() => router.push("/shop")}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8"
              onClick={() => router.push("/shop")}
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}


