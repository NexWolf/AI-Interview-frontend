"use client";

import { Loader2 } from "lucide-react";
import { AdminViolation } from "@repo/shared";
import { AdminPagination } from "@/shared";
import { ViolationTableRow } from "./ViolationTableRow";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ViolationsTableProps {
  violations: AdminViolation[];
  isLoading: boolean;
  pagination?: PaginationInfo;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewInterview: (id: string | number) => void;
}

export function ViolationsTable({
  violations,
  isLoading,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onViewInterview,
}: ViolationsTableProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
            <tr>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Candidate</th>
              <th className="px-5 py-3.5">Violation Details</th>
              <th className="px-5 py-3.5">Risk Level</th>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5 text-right">Related Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Loading proctoring records...</span>
                  </div>
                </td>
              </tr>
            ) : violations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No integrity incidents recorded.
                </td>
              </tr>
            ) : (
              violations.map((item) => (
                <ViolationTableRow
                  key={item.id}
                  violation={item}
                  onViewInterview={onViewInterview}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        itemLabel="violations"
      />
    </div>
  );
}
