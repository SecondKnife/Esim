"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { CheckCircle, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { formatVND } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  customerName: string;
  bankTransferInfo?: string;
};

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      toast.error("Không tìm thấy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Đã sao chép!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen py-8 flex items-center justify-center">
          <p className="text-foreground">Đang tải...</p>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="min-h-screen py-8 flex items-center justify-center">
          <p className="text-foreground">Không tìm thấy đơn hàng</p>
        </div>
      </Container>
    );
  }

  const bankInfo = order.bankTransferInfo
    ? JSON.parse(order.bankTransferInfo)
    : null;

  return (
    <Container>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:{" "}
              <span className="font-bold text-foreground">{order.id}</span>
            </p>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-mono text-foreground">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="text-foreground font-medium">
                  {order.status === "pending_payment" && "Đang chờ thanh toán"}
                  {order.status === "paid" && "Đã thanh toán"}
                  {order.status === "shipping" && "Đang giao hàng"}
                  {order.status === "delivered" && "Đã giao hàng"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức thanh toán:</span>
                <span className="text-foreground">
                  {order.paymentMethod === "bank_transfer" && "Chuyển khoản ngân hàng"}
                  {order.paymentMethod === "visa" && "Thẻ Visa/Mastercard"}
                  {order.paymentMethod === "cod" && "Thanh toán khi nhận hàng (COD)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="text-orange-500 font-bold">{formatVND(order.totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {order.paymentMethod === "bank_transfer" && order.status === "pending_payment" && (
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Hướng dẫn thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bankInfo && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng chuyển khoản theo thông tin sau:
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">Ngân hàng:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bankInfo.bankName}</span>
                          <button
                            onClick={() => copyToClipboard(bankInfo.bankName)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{bankInfo.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(bankInfo.accountNumber)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">Chủ tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bankInfo.accountName}</span>
                          <button
                            onClick={() => copyToClipboard(bankInfo.accountName)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">Nội dung chuyển khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{order.id}</span>
                          <button
                            onClick={() => copyToClipboard(order.id)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Sau khi chuyển khoản, đơn hàng của bạn sẽ được xử lý trong vòng 24 giờ.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {order.paymentMethod === "cod" && (
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Thông tin COD</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Đơn hàng COD của bạn đã được gửi đến admin. Admin sẽ liên hệ với bạn để xác nhận
                  và sắp xếp giao hàng. Vui lòng giữ máy để nhận cuộc gọi từ chúng tôi.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/shop")}
              variant="outline"
              className="flex-1"
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              onClick={() => router.push(`/orders/${order.id}`)}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Xem chi tiết đơn hàng
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default CheckoutSuccessPage;

