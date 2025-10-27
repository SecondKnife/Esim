"use client";

import { useEffect, useState } from "react";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const FeatureHighlight = ({ icon, title, description, delay = 0 }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`text-center transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const FeatureHighlights = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 w-1/3 mx-auto rounded"></div>
            <div className="h-4 bg-gray-200 w-1/2 mx-auto rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    { icon: "🌍", title: "200 quốc gia", description: "Hơn 200 điểm đến du lịch toàn cầu" },
    { icon: "⚡", title: "Siêu nhanh", description: "Chỉ cần 2 giờ để giao sim tới tận nhà" },
    { icon: "💰", title: "Tiết kiệm", description: "Tiết kiệm 50% so với mua ở nước ngoài" },
    { icon: "✅", title: "Đảm bảo hoàn tiền", description: "Cam kết hoàn tiền 100% nếu SIM bị lỗi" },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50" data-section="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tại sao chọn eSIM STORE?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Giải pháp SIM du lịch hiện đại, tiện lợi và tiết kiệm cho mọi chuyến đi của bạn
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureHighlight
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
