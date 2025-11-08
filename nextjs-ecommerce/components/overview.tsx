"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatVND } from "@/lib/utils";

type OverviewProps = {
  data: any[];
};

export const Overview: React.FC<OverviewProps> = ({
  data
}) => {
  // Format VND for chart display (shortened version for chart)
  const formatVNDShort = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}Mđ`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}Kđ`;
    }
    return `${value}đ`;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatVNDShort}
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
};