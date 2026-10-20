"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { setAuthLoginPath, defaultAuthRetry } from "@repo/shared";
import { LanguageProvider } from "@/shared";

setAuthLoginPath("/login");

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: defaultAuthRetry,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
