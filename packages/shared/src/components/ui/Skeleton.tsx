"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-muted/60 relative overflow-hidden",
        shimmer ? "animate-pulse" : "",
        className,
      )}
      {...props}
    />
  );
}

export default Skeleton;
