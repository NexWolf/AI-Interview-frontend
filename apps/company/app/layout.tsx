import type { Metadata } from "next";
import "./global.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { CompanyLayout } from "@/shared";

export const metadata: Metadata = {
  title: "Employer Command Center | NexWolf Business",
  description: "Enterprise candidate assessment and hiring pipeline portal.",
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
          <CompanyLayout>{children}</CompanyLayout>
        </Providers>
      </body>
    </html>
  );
}
