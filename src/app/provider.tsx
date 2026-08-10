// app/providers.js
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // ✅ Keep data fresh for 1 min
        // cacheTime: 5 * 60 * 1000,   // 🗃 Keep unused data in memory for 5 mins
        retry: 3, // 🔁 Retry failed queries up to 3 times
        refetchOnWindowFocus: true, // 🪟 Don't refetch when window gains focus
        refetchOnMount: false, // ⛰ Don't refetch on mount (if cached)
        refetchInterval: false, // ⏱ No polling by default
        // suspense: false,            // 🧘 Disable React suspense
        // useErrorBoundary: false,    // 🧱 Don't throw errors to error boundary
      },
    },
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
