"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import toast from "react-hot-toast";
import { formatVND } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { isStripeAvailable, isPaymentMethodEnabled } from "@/config/payment";

const stripePromise = isStripeAvailable()
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  : null;

type PaymentMethod = "bank_transfer" | "visa" | "cod" | "vnpay" | "momo" | "zalopay";

const CheckoutPage = () => {
  const router = useRouter();
  const cart = useCart();
  const items = cart.items;
  const removeAllCart = cart.removeAllCart;

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.totalPrice);
  }, 0);

  // Get current user using React Query hook (cached)
  const { user } = useCurrentUser();

  // Auto-fill customer info if user is logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    if (paymentMethod === "cod" && !customerInfo.address) {
      toast.error("Vui lòng nhập địa chỉ giao hàng cho đơn hàng COD");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "visa") {
        if (!isStripeAvailable()) {
          toast.error("Thanh toán qua thẻ tín dụng hiện không khả dụng. Vui lòng chọn phương thức khác.");
          return;
        }
        // Stripe payment
        const response = await axios.post("/api/checkout", {
          items,
          customerInfo,
          paymentMethod: "visa",
        });

        const stripe = stripePromise ? await stripePromise : null;
        if (stripe && response.data.sessionId) {
          await stripe.redirectToCheckout({
            sessionId: response.data.sessionId,
          });
        }
      } else if (paymentMethod === "bank_transfer") {
        // Bank transfer
        const response = await axios.post("/api/checkout", {
          items,
          customerInfo,
          paymentMethod: "bank_transfer",
        });

        if (response.data.orderId) {
          toast.success("Đơn hàng đã được tạo. Vui lòng chuyển khoản theo thông tin bên dưới.");
          router.push(`/checkout/success?orderId=${response.data.orderId}`);
          removeAllCart();
        }
      } else if (paymentMethod === "cod") {
        // COD
        const response = await axios.post("/api/checkout", {
          items,
          customerInfo,
          paymentMethod: "cod",
          deliveryAddress: customerInfo.address,
        });

        if (response.data.orderId) {
          toast.success("Đơn hàng COD đã được tạo. Admin sẽ liên hệ với bạn sớm nhất.");
          router.push(`/checkout/success?orderId=${response.data.orderId}`);
          removeAllCart();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Bank account info (you can move this to env or config)
  const bankAccountInfo = {
    bankName: "Ngân hàng Techcombank",
    accountNumber: "1903 8765 4321",
    accountName: "CONG TY TNHH ESIM STORE",
    branch: "Chi nhánh Hà Nội",
  };

  return (
    <div className="bg-background min-h-screen">
      <Container>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Thanh toán</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
            {/* Customer Info & Payment Method */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card border border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Họ và tên *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Số điện thoại *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {(paymentMethod === "cod" || paymentMethod === "bank_transfer") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Địa chỉ giao hàng {paymentMethod === "cod" && "*"}
                      </label>
                      <Input
                        type="text"
                        name="address"
                        autoComplete="street-address"
                        required={paymentMethod === "cod"}
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        placeholder="Nhập địa chỉ giao hàng"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-4">
                      Phương thức thanh toán *
                    </label>
                    <div className="space-y-3">
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "bank_transfer"
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-border hover:border-orange-300"
                        }`}
                        onClick={() => setPaymentMethod("bank_transfer")}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={paymentMethod === "bank_transfer"}
                            onChange={() => setPaymentMethod("bank_transfer")}
                            className="w-4 h-4 text-orange-500"
                          />
                          <div>
                            <p className="font-semibold text-foreground">Chuyển khoản ngân hàng</p>
                            <p className="text-sm text-muted-foreground">
                              Thanh toán qua chuyển khoản ngân hàng
                            </p>
                          </div>
                        </div>
                      </div>

                      {isPaymentMethodEnabled("visa") && (
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === "visa"
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                              : "border-border hover:border-orange-300"
                          }`}
                          onClick={() => setPaymentMethod("visa")}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={paymentMethod === "visa"}
                              onChange={() => setPaymentMethod("visa")}
                              className="w-4 h-4 text-orange-500"
                            />
                            <div>
                              <p className="font-semibold text-foreground">Thẻ Visa/Mastercard</p>
                              <p className="text-sm text-muted-foreground">
                                Thanh toán qua Stripe (Visa, Mastercard)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-border hover:border-orange-300"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="w-4 h-4 text-orange-500"
                          />
                          <div>
                            <p className="font-semibold text-foreground">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-sm text-muted-foreground">
                              Chỉ áp dụng cho SIM vật lý. Thanh toán khi nhận hàng
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === "bank_transfer" && (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border text-muted-foreground">
                      <h3 className="font-semibold text-foreground mb-2">Thông tin chuyển khoản</h3>
                      <div className="space-y-2">
                        <p className="text-foreground">Ngân hàng: {bankAccountInfo.bankName}</p>
                        <p className="text-foreground">Số tài khoản: {bankAccountInfo.accountNumber}</p>
                        <p className="text-foreground">Chủ tài khoản: {bankAccountInfo.accountName}</p>
                        <p className="text-foreground">Chi nhánh: {bankAccountInfo.branch}</p>
                        <p className="text-sm mt-2 text-orange-500 dark:text-orange-400">
                          Vui lòng chuyển khoản với nội dung là SĐT của bạn để đơn hàng được xử lý nhanh nhất.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border text-muted-foreground">
                      <p className="text-orange-500 dark:text-orange-400">
                        Bạn sẽ thanh toán tiền mặt khi nhận hàng. Đơn hàng sẽ được xử lý sau khi xác nhận.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-foreground">
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Số lượng: {item.quantity || 1}</p>
                      </div>
                      <p className="font-semibold">{formatVND(Number(item.totalPrice || item.price) * (item.quantity || 1))}</p>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center text-lg font-bold text-foreground">
                  <span>Tổng cộng:</span>
                  <span>{formatVND(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </Container>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

