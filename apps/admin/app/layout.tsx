import type { Metadata } from "next";
import "./global.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { AdminLayout } from "@/shared";

export const metadata: Metadata = {
  title: "Admin Command Center | NexWolf",
  description: "Administrative console and telemetry dashboard for NexWolf AI Interview platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>
          <Toaster theme="dark" position="top-right" richColors />
          <AdminLayout>{children}</AdminLayout>
        </Providers>
      </body>
    </html>
  );
}