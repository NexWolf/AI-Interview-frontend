"use client";

import { StatCard } from "@repo/shared";
import { OverviewStatItem } from "../types/overview.types";

interface OverviewStatCardProps {
  stat: OverviewStatItem;
  onClick?: () => void;
}

export function OverviewStatCard({ stat, onClick }: OverviewStatCardProps) {
  return (
    <StatCard
      title={stat.title}
      value={stat.value}
      sub={stat.sub}
      icon={stat.icon}
      iconClassName={stat.color}
      className={stat.bg}
      onClick={onClick}
    />
  );
}
