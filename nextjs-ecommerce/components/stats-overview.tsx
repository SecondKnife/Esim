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
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-lg mb-8 border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        📊 Thống kê eSIM Store
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.totalProducts}
            </div>
            <div className="text-sm text-muted-foreground">Sản phẩm eSIM/SIM</div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.totalCategories}
            </div>
            <div className="text-sm text-muted-foreground">Quốc gia</div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.dataPlans.length}
            </div>
            <div className="text-sm text-muted-foreground">Gói dung lượng</div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {stats.simTypes.length}
            </div>
            <div className="text-sm text-muted-foreground">Loại SIM</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="font-semibold text-card-foreground mb-2">🌍 Quốc gia có sẵn:</h3>
          <div className="flex flex-wrap gap-1">
            {stats.countries.map((country, index) => (
              <span
                key={index}
                className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
              >
                {country}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="font-semibold text-card-foreground mb-2">📱 Gói dung lượng:</h3>
          <div className="flex flex-wrap gap-1">
            {stats.dataPlans.map((plan, index) => (
              <span
                key={index}
                className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded"
              >
                {plan}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="font-semibold text-card-foreground mb-2">🔧 Loại SIM:</h3>
          <div className="flex flex-wrap gap-1">
            {stats.simTypes.map((type, index) => (
              <span
                key={index}
                className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
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
