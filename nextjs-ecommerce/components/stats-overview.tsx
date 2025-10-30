"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

interface StatsData {
  totalProducts: number;
  totalCategories: number;
  countries: string[];
  dataPlans: string[];
  simTypes: string[];
}

const StatsOverview = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/product"),
          fetch("/api/categories"),
        ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();

        // Extract unique values
        const countries = Array.from(new Set(products.map((p: any) => p.country).filter(Boolean))) as string[];
        const dataPlans = Array.from(new Set(products.map((p: any) => p.dataPlan).filter(Boolean))) as string[];
        const simTypes = Array.from(new Set(products.map((p: any) => p.simType).filter(Boolean))) as string[];

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          countries,
          dataPlans,
          simTypes,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📊 Thống kê eSIM Store
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalProducts}
            </div>
            <div className="text-sm text-gray-600">Sản phẩm eSIM/SIM</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalCategories}
            </div>
            <div className="text-sm text-gray-600">Quốc gia</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.dataPlans.length}
            </div>
            <div className="text-sm text-gray-600">Gói dung lượng</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.simTypes.length}
            </div>
            <div className="text-sm text-gray-600">Loại SIM</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">🌍 Quốc gia có sẵn:</h3>
          <div className="flex flex-wrap gap-1">
            {stats.countries.map((country, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {country}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">📱 Gói dung lượng:</h3>
          <div className="flex flex-wrap gap-1">
            {stats.dataPlans.map((plan, index) => (
              <span
                key={index}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
              >
                {plan}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">🔧 Loại SIM:</h3>
          <div className="flex flex-wrap gap-1">
            {stats.simTypes.map((type, index) => (
              <span
                key={index}
                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
