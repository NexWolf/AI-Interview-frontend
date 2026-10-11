"use client";

import { Pagination, type AdminPagination as AdminPaginationType } from "@repo/shared";

interface AdminPaginationProps {
  pagination?: AdminPaginationType;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export function AdminPagination({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = "items",
}: AdminPaginationProps) {
  return (
    <Pagination
      page={page}
      limit={limit}
      total={pagination?.total}
      totalPages={pagination?.totalPages}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      pageSizeOptions={pageSizeOptions}
      itemLabel={itemLabel}
      variant="default"
      className="border-x-0 border-b-0 rounded-none bg-card/30"
    />
  );
}
