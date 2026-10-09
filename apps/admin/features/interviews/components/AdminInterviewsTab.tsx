"use client";

import { useState } from "react";
import { AdminInterview, useAdminInterviews, useDebounce } from "@repo/shared";
import { AdminInterviewsTabProps } from "../types/interviews.types";
import { InterviewsFiltersBar } from "./InterviewsFiltersBar";
import { InterviewsTable } from "./InterviewsTable";

export function AdminInterviewsTab({ onViewDetails }: AdminInterviewsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [langFilter, setLangFilter] = useState("ALL");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useAdminInterviews({
    page,
    limit,
    user: debouncedSearch.trim() || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    language: langFilter !== "ALL" ? langFilter : undefined,
  });

  const interviews: AdminInterview[] = data?.interviews || [];
  const pagination = data?.pagination;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleLangChange = (val: string) => {
    setLangFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <InterviewsFiltersBar
        search={search}
        statusFilter={statusFilter}
        langFilter={langFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onLangChange={handleLangChange}
      />

      {/* Interviews Table */}
      <InterviewsTable
        interviews={interviews}
        isLoading={isLoading}
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}
