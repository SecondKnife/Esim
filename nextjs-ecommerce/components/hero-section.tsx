"use client";

import { useEffect, useState } from "react";
import { R2_IMAGES } from "@/lib/r2-urls";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
        <div className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-gray-200 animate-pulse" />
      </div>
    );
  }
  const baseUrl = R2_IMAGES.BANNER_MAIN;

  return (
    <section className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden" data-section="hero">
      <div
        style={{
          backgroundImage: `url(${baseUrl})`,
        }}
        className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
      >
        <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8 bg-black/20 backdrop-blur-sm">
          <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs text-white drop-shadow-lg">
            eSIM STORE
          </div>
          <div className="font-semibold text-lg sm:text-xl text-white">
            Sim du lịch & eSIM quốc tế tới 200 quốc gia
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-800">✓ 200 quốc gia</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-800">⚡ Siêu nhanh 2 giờ</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-800">💰 Tiết kiệm 50%</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-800">✅ Hoàn tiền 100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
