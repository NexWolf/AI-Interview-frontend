import React from "react";
import { DashboardNavbar, DashboardMobileNav } from "@/features/dashboard";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      {/* Desktop Dashboard Top Header */}
      <DashboardNavbar />

      {/* Mobile Top Header & Drawer */}
      <DashboardMobileNav />

      {/* Main Setup Page Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
