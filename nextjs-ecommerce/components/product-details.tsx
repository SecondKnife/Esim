"use client";

import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Wifi, MessageSquare, Clock, MapPin, Shield, CheckCircle } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  // Map countries to carrier information
  const carrierInfo: { [key: string]: { name: string; coverage: string; features: string[] } } = {
    "Thailand": {
      name: "AIS/True/DTAC",
      coverage: "Toàn quốc với độ phủ sóng mạnh nhất",
      features: ["5G", "4G LTE", "WiFi Hotspot", "Roaming"]
    },
    "Singapore": {
      name: "Singtel/StarHub/M1",
      coverage: "Phủ sóng toàn Singapore với tốc độ cao",
      features: ["5G", "4G LTE", "WiFi Hotspot", "Unlimited"]
    },
    "USA": {
      name: "Verizon/AT&T/T-Mobile",
      coverage: "Phủ sóng rộng khắp nước Mỹ",
      features: ["5G", "4G LTE", "WiFi Hotspot", "Unlimited"]
    },
    "Japan": {
      name: "NTT Docomo/SoftBank/KDDI",
      coverage: "Phủ sóng toàn Nhật Bản với công nghệ tiên tiến",
      features: ["5G", "4G LTE", "WiFi Hotspot", "High Speed"]
    },
    "Europe": {
      name: "Orange/Vodafone/Deutsche Telekom",
      coverage: "Phủ sóng 40+ quốc gia châu Âu",
      features: ["5G", "4G LTE", "WiFi Hotspot", "Multi-country"]
    },
    "Korea": {
      name: "SK Telecom/KT/LG U+",
      coverage: "Phủ sóng toàn Hàn Quốc với tốc độ cao",
      features: ["5G", "4G LTE", "WiFi Hotspot", "High Speed"]
    },
    "Australia": {
      name: "Telstra/Optus/Vodafone",
      coverage: "Phủ sóng toàn Australia",
      features: ["5G", "4G LTE", "WiFi Hotspot", "Wide Coverage"]
    }
  };

  const carrier = (product.country && carrierInfo[product.country]) || {
    name: "Local Carrier",
    coverage: "Phủ sóng tốt",
    features: ["4G LTE", "WiFi Hotspot"]
  };

  return (
    <div className="space-y-6">
      {/* Product Specifications */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">Thông tin chi tiết gói cước</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Nhà mạng</div>
                  <div className="text-muted-foreground">{carrier.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Thời gian sử dụng</div>
                  <div className="text-muted-foreground">{product.validityDays} ngày</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Dung lượng</div>
                  <div className="text-muted-foreground">{product.dataPlan} data tốc độ cao</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Loại SIM</div>
                  <div className="text-muted-foreground">{product.simType}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carrier Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">
            Nhà mạng di động nào là &ldquo;đỉnh&rdquo; nhất tại {product.country}?
          </h3>
          <p className="text-muted-foreground mb-4">
            {carrier.name} hiện đang nắm giữ vị trí thủ lĩnh thị trường {product.country}. 
            {carrier.coverage}. Với <strong className="text-foreground">SIM du lịch {product.country}</strong> của {carrier.name} 
            bạn sẽ thoải mái dùng Internet tốc độ cao trong suốt hành trình của mình.
          </p>
          <div className="flex flex-wrap gap-2">
            {carrier.features.map((feature: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">Hướng dẫn sử dụng SIM 4G {product.country}</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {product.simType === "eSIM" ? "Cài đặt eSIM" : "Lắp SIM"}
                </div>
                <div className="text-muted-foreground">
                  {product.simType === "eSIM" 
                    ? "Quét mã QR để cài đặt eSIM trên thiết bị"
                    : "Lắp sim vào khe SIM 1 (nếu điện thoại 2 SIM 2 sóng)"
                  }
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-semibold text-foreground">Kích hoạt</div>
                <div className="text-muted-foreground">
                  Bật &ldquo;Dữ liệu di động/ Cellular Data&rdquo; và &ldquo;Chuyển vùng dữ liệu&rdquo;/ Data Roaming
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-semibold text-foreground">Sử dụng</div>
                <div className="text-muted-foreground">
                  Khởi động lại máy và bắt đầu sử dụng
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">Lưu ý khi dùng SIM 4G {product.country}</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Sau khi SIM du lịch {product.country} được kích hoạt thành công theo hướng dẫn sử dụng, 
                thì thời hạn sử dụng SIM mới bắt đầu được tính ngày.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Một ngày sử dụng của SIM sẽ được tính từ khi cài đặt thành công cho tới 23:59.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Có thể sử dụng Wifi Hotspot để chia sẻ internet cho các thiết bị khác.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Tiết kiệm đến hơn 90% so với chi phí gói cước chuyển vùng quốc tế của các nhà mạng Việt Nam.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">Vì sao bạn nên mua SIM {product.country} tại eSIM Store?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Hỗ trợ chuyên nghiệp</div>
                  <div className="text-sm text-muted-foreground">
                    Đội ngũ nhân viên tư vấn chuyên nghiệp, hỗ trợ tận tình qua hotline/Zalo/Telegram
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Bảo mật thông tin</div>
                  <div className="text-sm text-muted-foreground">
                    Cam kết bảo mật thông tin khách hàng tuyệt đối
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Sản phẩm chính hãng</div>
                  <div className="text-sm text-muted-foreground">
                    Sản phẩm chính hãng, chính sách bảo hành minh bạch, hoàn tiền 100%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Mua hàng tiện lợi</div>
                  <div className="text-sm text-muted-foreground">
                    Mua hàng và thanh toán online nhanh chóng, có giao hàng COD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
