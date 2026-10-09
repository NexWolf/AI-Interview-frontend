"use client";

import { Loader2 } from "lucide-react";
import { AdminInterview } from "@repo/shared";
import { AdminPagination } from "@/shared";
import { InterviewTableRow } from "./InterviewTableRow";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface InterviewsTableProps {
  interviews: AdminInterview[];
  isLoading: boolean;
  pagination?: PaginationInfo;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewDetails: (id: string | number) => void;
}

export function InterviewsTable({
  interviews,
  isLoading,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onViewDetails,
}: InterviewsTableProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
            <tr>
              <th className="px-5 py-3.5">Candidate</th>
              <th className="px-5 py-3.5">Language / Level</th>
              <th className="px-5 py-3.5">Skills Evaluated</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Score</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Loading interview sessions...</span>
                  </div>
                </td>
              </tr>
            ) : interviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No interviews match the current criteria.
                </td>
              </tr>
            ) : (
              interviews.map((item) => (
                <InterviewTableRow
                  key={item.id}
                  interview={item}
                  onViewDetails={onViewDetails}
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
        itemLabel="interviews"
      />
    </div>
  );
}
