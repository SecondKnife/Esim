"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/lib/api-client";
import { useState } from "react";

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Tạo QueryClient mới cho mỗi component instance
  // Có cấu hình để tránh duplicate requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - keep in memory
            refetchOnWindowFocus: false, // Không refetch khi focus window
            refetchOnMount: false, // Không refetch khi component mount lại
            refetchOnReconnect: false, // Không refetch khi reconnect
            retry: 2,
            retryDelay: 1000,
            networkMode: "online",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
