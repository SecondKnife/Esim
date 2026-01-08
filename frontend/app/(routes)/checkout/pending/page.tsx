"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { CheckCircle, Copy, Check, AlertCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { formatVND } from "@/lib/utils";
import CountdownTimer from "@/components/countdown-timer";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
};

type BankTransferInfo = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  transferContent?: string;
};

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  orderItems: OrderItem[];
  bankTransferInfo?: string;
  paymentDeadline?: string;
  createdAt: string;
};

const CheckoutPendingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const hasRedirectedRef = useRef(false); // Track if we've already redirected

  const fetchOrder = useCallback(async () => {
    if (!orderId || hasRedirectedRef.current) return;
    
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      const orderData = response.data;
      
      if (!orderData) {
        toast.error("Không tìm thấy đơn hàng");
        router.push("/cart");
        return;
      }
      
      setOrder(orderData);

      // Check if payment deadline has passed
      if (orderData.paymentDeadline) {
        const deadline = new Date(orderData.paymentDeadline);
        const now = new Date();
        if (now > deadline && orderData.status === "pending_payment") {
          setIsExpired(true);
        }
      }

      // If order is paid, redirect to cart (as per user requirement)
      // Only show toast and redirect once
      if (orderData.status === "paid" && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true; // Mark as redirected
        toast.success("✅ Thanh toán đã được xác nhận thành công!");
        setTimeout(() => {
          // Redirect to cart page as requested
          window.location.href = "/cart";
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error fetching order:", error);
      if (error.response?.status === 404) {
        toast.error("Không tìm thấy đơn hàng");
        setTimeout(() => {
          router.push("/cart");
        }, 2000);
      } else {
        toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!orderId) {
      // If no orderId, redirect to cart
      router.push("/cart");
      return;
    }

    // Fetch order immediately
    fetchOrder();
    
    // Poll order status every 5 seconds
    // fetchOrder will stop polling internally when order is paid
    const interval = setInterval(() => {
      if (!hasRedirectedRef.current) {
        fetchOrder();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, fetchOrder, router]);

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-foreground">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="min-h-screen py-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-foreground text-lg">Không tìm thấy đơn hàng</p>
            <Button
              onClick={() => router.push("/cart")}
              className="mt-4 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
            >
              Quay lại giỏ hàng
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const bankInfo: BankTransferInfo | null = order.bankTransferInfo
    ? JSON.parse(order.bankTransferInfo)
    : null;

  const getTransferContent = (): string => {
    if (bankInfo && bankInfo.transferContent) {
      return bankInfo.transferContent;
    }
    if (order.customerPhone && order.orderItems && order.orderItems.length > 0) {
      const productNames = order.orderItems.map((item) => item.productName).join(" - ");
      return `${productNames} - ${order.customerPhone}`;
    }
    return order.id;
  };

  const transferContent = getTransferContent();
  const qrCodeData = transferContent || "";

  // Check if order is paid
  if (order.status === "paid") {
    return (
      <Container>
        <div className="min-h-screen py-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Thanh toán đã được xác nhận!
            </h1>
            <p className="text-muted-foreground mb-6">
              Đơn hàng của bạn đã được xác nhận thanh toán thành công.
            </p>
            <Button
              onClick={() => window.location.href = "/cart"}
              className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
            >
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <Clock className="w-20 h-20 text-orange-500 mx-auto animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              ⏰ Đang chờ xác nhận thanh toán
            </h1>
            <p className="text-muted-foreground text-lg">
              Mã đơn hàng: <span className="font-mono font-bold text-orange-500">{order.id}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Vui lòng chuyển khoản trong vòng <strong className="text-orange-500">15 phút</strong> để đơn hàng được xử lý
            </p>
          </div>

          {/* Countdown Timer - Hiển thị nổi bật */}
          {order.paymentDeadline && order.status === "pending_payment" && !isExpired && (
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 border-2 border-orange-300 dark:border-orange-700 mb-6 shadow-lg">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-foreground text-xl flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Thời gian còn lại để thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="text-center">
                  <div className="mb-4">
                    <CountdownTimer
                      deadline={order.paymentDeadline}
                      onExpire={() => {
                        setIsExpired(true);
                        toast.error("Đã hết thời gian thanh toán");
                        fetchOrder(); // Refresh order status
                      }}
                      className="justify-center text-2xl"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground mt-4">
                    ⚠️ Vui lòng chuyển khoản trong thời gian trên để đơn hàng được xử lý.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sau khi chuyển khoản, admin sẽ xác nhận thanh toán trong vòng vài phút.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Info */}
          <Card className="bg-card border-border mb-6">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-foreground">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-mono text-foreground">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="text-foreground font-medium">
                  {order.status === "pending_payment" && (
                    <span className="text-orange-500">⏳ Đang chờ thanh toán</span>
                  )}
                  {order.status === "paid" && (
                    <span className="text-green-500">✅ Đã thanh toán</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức thanh toán:</span>
                <span className="text-foreground">Chuyển khoản ngân hàng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="text-orange-500 font-bold">{formatVND(order.totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Info */}
          {order.paymentMethod === "bank_transfer" && bankInfo && (
            <Card className="bg-card border-border mb-6">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-foreground">Hướng dẫn thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 space-y-4">
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
                        className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
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
                        className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
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
                        className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Section - Hiển thị nổi bật */}
                {transferContent && !isExpired && order.status === "pending_payment" && (
                  <div className="mt-6 pt-6 border-t-2 border-orange-200 dark:border-orange-800">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        📱 Quét mã QR để chuyển khoản
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quét mã QR bằng ứng dụng ngân hàng của bạn
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      {/* QR Code với viền nổi bật */}
                      <div className="bg-white p-6 rounded-xl border-4 border-orange-300 dark:border-orange-700 shadow-2xl">
                        <div className="w-64 h-64 flex items-center justify-center bg-white">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCodeData)}&margin=2`}
                            alt="Mã QR chuyển khoản"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML =
                                  '<div class="text-center text-muted-foreground p-8"><p class="text-sm">Không thể tạo mã QR</p></div>';
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Thông báo quan trọng */}
                      <div className="bg-orange-100 dark:bg-orange-900/40 border border-orange-300 dark:border-orange-700 rounded-lg p-4 max-w-md">
                        <p className="text-sm text-orange-700 dark:text-orange-300 font-semibold text-center">
                          💡 Lưu ý quan trọng:
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 text-center mt-2">
                          Khi quét mã QR, vui lòng nhập nội dung chuyển khoản là:<br />
                          <span className="font-mono font-bold">
                            {transferContent}
                          </span>
                        </p>
                      </div>

                      {/* Copy nội dung chuyển khoản */}
                      <div className="w-full max-w-md">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nội dung chuyển khoản:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={transferContent}
                            className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted text-foreground font-mono text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(transferContent)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                          >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mt-4">
                  Sau khi chuyển khoản, admin sẽ xác nhận thanh toán trong vòng vài phút. Trang này sẽ tự động cập nhật khi thanh toán được xác nhận.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Expired Message */}
          {isExpired && (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                    Đã hết thời gian thanh toán
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Thời gian thanh toán 15 phút đã hết. Vui lòng liên hệ admin để được hỗ trợ hoặc đặt hàng lại.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/shop")}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              onClick={() => window.location.href = "/cart"}
              className="flex-1 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
            >
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default CheckoutPendingPage;

