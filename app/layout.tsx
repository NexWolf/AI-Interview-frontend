import type { Metadata } from "next";
import { Open_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "@/shared/components/provider/ThemeProvider";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "AI Interview Coach | Master Your Next Tech Interview with Real-Time AI",
  description:
    "Practice realistic technical and behavioral interviews powered by intelligent AI. Get instant scoring, feedback on your weak points, and customized improvement plans.",
  keywords: ["AI interview", "mock interview", "tech interview practice", "software engineering interview", "coding interview"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning تمنع تحذيرات التزامن الخاصة بـ next-themes
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body
        className={cn(
          openSans.className,
          "min-h-full bg-background text-foreground",
        )}
      >
        <ThemeProvider attribute="class">
          <Toaster theme="dark" position="top-right" />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
