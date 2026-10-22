"use client";

import React from "react";

export const TechnologiesSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Selected skills box skeleton */}
      <div className="h-16 w-full rounded-2xl bg-muted/60 border border-border/60" />

      {/* Select dropdown skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-44 rounded bg-muted" />
        <div className="h-11 w-full rounded-2xl bg-muted/50 border border-border/50" />
      </div>

      {/* Suggestions pills skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-52 rounded bg-muted" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-20 rounded-xl bg-muted/60 border border-border/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologiesSkeleton;
