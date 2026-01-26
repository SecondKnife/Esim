"use client";

import { useEffect, useState } from "react";
import { R2_IMAGES } from "@/lib/r2-urls";
import Link from "next/link";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full mb-8">
        <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-600 animate-pulse" />
      </div>
    );
  }
  const baseUrl = R2_IMAGES.BANNER_MAIN;

  return (
    <section className="w-full mb-12 rounded-3xl overflow-hidden mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8" data-section="hero">
      <div
        style={{
          backgroundImage: `url(${baseUrl})`,
        }}
        className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-600 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Gradient Overlay - giữ màu cam đẹp */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-orange-800/30 to-yellow-900/40" />
        
        {/* Content Container */}
        <div className="relative h-full w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Main Title */}
          <div className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-2xl tracking-tight mb-4 md:mb-6 max-w-5xl">
            SIM & eSIM Du Lịch Quốc Tế
          </div>
          
          {/* Subtitle */}
          <div className="font-semibold text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl drop-shadow-lg mb-8 md:mb-10 px-4">
            Kết nối internet tốc độ cao tại hơn 200 quốc gia trên toàn thế giới
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-8 md:mb-12">
            <Link href="/shop/">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Khám phá ngay
              </button>
            </Link>
            <Link href="/featured/">
              <button className="bg-white/95 hover:bg-white text-gray-900 font-bold px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Xem ưu đãi
              </button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl px-4">
            <div className="bg-white/95 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">🌍</div>
              <div className="text-xs md:text-sm font-bold text-gray-900">200 quốc gia</div>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">⚡</div>
              <div className="text-xs md:text-sm font-bold text-gray-900">Giao hàng 2h</div>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">💰</div>
              <div className="text-xs md:text-sm font-bold text-gray-900">Tiết kiệm 50%</div>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">✅</div>
              <div className="text-xs md:text-sm font-bold text-gray-900">Hoàn tiền 100%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
