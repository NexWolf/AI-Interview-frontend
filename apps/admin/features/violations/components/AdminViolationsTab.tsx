"use client";

import { useState } from "react";
import { AdminViolation, useAdminViolations } from "@repo/shared";
import { AdminViolationsTabProps } from "../types/violations.types";
import { ViolationsKpiCards } from "./ViolationsKpiCards";
import { ViolationsFilterBar } from "./ViolationsFilterBar";
import { ViolationsTable } from "./ViolationsTable";

export function AdminViolationsTab({ onViewInterview }: AdminViolationsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const { data, isLoading } = useAdminViolations({
    page,
    limit,
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    isCheating: typeFilter === "CHEATING" ? "true" : undefined,
    isTechnicalIssue: typeFilter === "TECHNICAL" ? "true" : undefined,
  });

  const violations: AdminViolation[] = data?.violations || [];
  const pagination = data?.pagination;

  const cheatingCount = violations.filter((v) => v.isCheating).length;
  const techIssueCount = violations.filter((v) => v.isTechnicalIssue).length;

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <ViolationsKpiCards
        cheatingCount={cheatingCount}
        techIssueCount={techIssueCount}
        totalAlerts={pagination?.total ?? violations.length}
      />

      {/* Filter Toolbar */}
      <ViolationsFilterBar
        showingCount={violations.length}
        totalCount={pagination?.total ?? violations.length}
        categoryFilter={categoryFilter}
        typeFilter={typeFilter}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
      />

      {/* Violations Table & Pagination */}
      <ViolationsTable
        violations={violations}
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
