"use client";

import { useState } from "react";
import { AdminReport, useAdminReports, useDebounce } from "@repo/shared";
import { AdminReportsTabProps } from "../types/reports.types";
import { ReportsHeaderBar } from "./ReportsHeaderBar";
import { ReportsGrid } from "./ReportsGrid";

export function AdminReportsTab({ onViewInterview }: AdminReportsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useAdminReports({
    page,
    limit,
    user: debouncedSearch.trim() || undefined,
  });

  const reports: AdminReport[] = data?.reports || [];
  const pagination = data?.pagination;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search & Header Bar */}
      <ReportsHeaderBar
        search={search}
        onSearchChange={handleSearchChange}
        totalCount={pagination?.total ?? reports.length}
      />

      {/* Reports Grid & Pagination */}
      <ReportsGrid
        reports={reports}
        isLoading={isLoading}
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onViewInterview={onViewInterview}
      />
    </div>
  );
}
