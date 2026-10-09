"use client";

import { Loader2 } from "lucide-react";
import { AdminReport } from "@repo/shared";
import { AdminPagination } from "@/shared";
import { ReportCard } from "./ReportCard";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ReportsGridProps {
  reports: AdminReport[];
  isLoading: boolean;
  pagination?: PaginationInfo;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewInterview: (id: string | number) => void;
}

export function ReportsGrid({
  reports,
  isLoading,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onViewInterview,
}: ReportsGridProps) {
  if (isLoading) {
    return (
      <div className="p-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>Loading candidate evaluation reports...</span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground border border-border/50 rounded-2xl bg-card/30">
        No reports found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onViewInterview={onViewInterview}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 overflow-hidden shadow-xs">
        <AdminPagination
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="evaluations"
        />
      </div>
    </div>
  );
}
