"use client";

import { MediaStreamProvider } from "@/shared/components/provider/MediaStermProvider";
import { ReactNode } from "react";

export default function InterviewLayout({ children }: { children: ReactNode }) {
  return (
    <MediaStreamProvider>
      <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
        {children}
      </div>
    </MediaStreamProvider>
  );
}
