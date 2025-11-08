"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RegionProps {
  title: string;
  countries: { name: string; href: string }[];
}

const CountryRegions = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted w-1/3 rounded"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const regions = [
    {
      title: "SIM Đông Nam Á",
      countries: [
        { name: "SIM Thái Lan", href: "/shop/Thái Lan" },
        { name: "SIM Singapore", href: "/shop/Singapore" },
        { name: "SIM Malaysia", href: "/shop/Malaysia" },
        { name: "SIM Indonesia", href: "/shop/Indonesia" },
        { name: "SIM Philippines", href: "/shop/Philippines" },
      ],
    },
    {
      title: "SIM Châu Á",
      countries: [
        { name: "SIM Nhật Bản", href: "/shop/Nhật Bản" },
        { name: "SIM Hàn Quốc", href: "/shop/Hàn Quốc" },
        { name: "SIM Trung Quốc", href: "/shop/Trung Quốc" },
        { name: "SIM Ấn Độ", href: "/shop/Ấn Độ" },
      ],
    },
    {
      title: "SIM Châu Âu",
      countries: [
        { name: "SIM Anh Quốc", href: "/shop/Anh Quốc" },
        { name: "SIM Pháp", href: "/shop/Pháp" },
        { name: "SIM Đức", href: "/shop/Đức" },
        { name: "SIM Italia", href: "/shop/Italia" },
      ],
    },
    {
      title: "SIM Châu Mỹ",
      countries: [
        { name: "SIM Mỹ", href: "/shop/Mỹ" },
        { name: "SIM Canada", href: "/shop/Canada" },
        { name: "SIM Mexico", href: "/shop/Mexico" },
      ],
    },
  ];

  return (
    <section className="py-16 bg-background" data-section="regions">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Bạn đi đâu tiếp theo?
          </h2>
          <p className="text-muted-foreground">
            Hãy chọn điểm đến để tìm gói cước phù hợp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {regions.map((region, idx) => (
            <div
              key={idx}
              className="border border-border bg-card rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                {region.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {region.countries.map((country, i) => (
                  <Link
                    key={i}
                    href={country.href}
                    className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-colors"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountryRegions;
