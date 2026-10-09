"use client";

import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { PaginationInfo } from "../../types/pagination";

export interface PaginationProps {
  /** Current active page (1-based index) */
  page?: number;
  currentPage?: number;

  /** Total number of pages */
  totalPages?: number;

  /** Total items count */
  total?: number;

  /** Items per page */
  limit?: number;
  pageSize?: number;

  /** Full pagination object fallback */
  pagination?: PaginationInfo;

  /** Callback when page number changes */
  onPageChange: (page: number) => void;

  /** Callback when limit / page size changes */
  onLimitChange?: (limit: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  /** Options for the items per page dropdown */
  pageSizeOptions?: number[];

  /** Whether to show the rows per page dropdown */
  showPageSizeSelector?: boolean;

  /** Whether to show the range info summary (e.g. "Showing 1 - 10 of 45 items") */
  showInfo?: boolean;

  /** Custom label for items (default: "items") */
  itemLabel?: string;

  /** Number of siblings around active page */
  siblingCount?: number;

  /** Whether to show jump to first and jump to last page buttons */
  showFirstLastButtons?: boolean;

  /** Whether the pagination controls are disabled */
  disabled?: boolean;

  /** Whether the data is actively loading / fetching (disables buttons and shows spinner) */
  isLoading?: boolean;

  /** Visual variant */
  variant?: "default" | "clean" | "compact";

  /** Optional custom class name */
  className?: string;

  /** Text direction */
  dir?: "rtl" | "ltr" | "auto";
}

export function Pagination({
  page: pageProp,
  currentPage,
  totalPages: totalPagesProp,
  total: totalProp,
  limit: limitProp,
  pageSize,
  pagination,
  onPageChange,
  onLimitChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector,
  showInfo,
  itemLabel = "items",
  siblingCount = 1,
  showFirstLastButtons = true,
  disabled = false,
  isLoading = false,
  variant = "default",
  className,
  dir = "auto",
}: PaginationProps) {
  // Resolve unified page, limit, total, totalPages
  const activePage = pageProp ?? currentPage ?? pagination?.page ?? 1;
  const currentLimit = limitProp ?? pageSize ?? pagination?.limit ?? 10;
  const totalItems = totalProp ?? pagination?.total ?? 0;
  const isInteractiveDisabled = disabled || isLoading;

  const computedTotalPages = useMemo(() => {
    if (totalPagesProp !== undefined) return Math.max(1, totalPagesProp);
    if (pagination?.totalPages !== undefined) return Math.max(1, pagination.totalPages);
    if (totalItems > 0 && currentLimit > 0) {
      return Math.max(1, Math.ceil(totalItems / currentLimit));
    }
    return 1;
  }, [totalPagesProp, pagination?.totalPages, totalItems, currentLimit]);

  // If no items exist and total is explicitly 0, don't render pagination
  if (totalItems === 0 && computedTotalPages <= 1 && totalProp !== undefined) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    if (isInteractiveDisabled) return;
    const clamped = Math.min(Math.max(1, newPage), computedTotalPages);
    if (clamped !== activePage) {
      onPageChange(clamped);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (isInteractiveDisabled) return;
    if (onLimitChange) onLimitChange(newLimit);
    if (onPageSizeChange) onPageSizeChange(newLimit);
    handlePageChange(1);
  };

  const hasLimitHandler = Boolean(onLimitChange || onPageSizeChange);
  const shouldShowSizeSelector = showPageSizeSelector ?? hasLimitHandler;
  const shouldShowInfo = showInfo ?? (totalItems > 0);

  const startItem = totalItems > 0 ? Math.min((activePage - 1) * currentLimit + 1, totalItems) : 0;
  const endItem = totalItems > 0 ? Math.min(activePage * currentLimit, totalItems) : 0;

  // Generate page numbers with ellipses
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const totalNumbers = siblingCount * 2 + 5; // 1 + siblings + current + siblings + last + 2 ellipses

    if (computedTotalPages <= totalNumbers) {
      for (let i = 1; i <= computedTotalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const leftSiblingIndex = Math.max(activePage - siblingCount, 1);
    const rightSiblingIndex = Math.min(activePage + siblingCount, computedTotalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < computedTotalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItemCount; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(computedTotalPages);
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      pages.push(1);
      pages.push("...");
      for (let i = computedTotalPages - rightItemCount + 1; i <= computedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(computedTotalPages);
    }

    return pages;
  }, [activePage, computedTotalPages, siblingCount]);

  // Variant containers
  const containerClasses = {
    default:
      "flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-xs transition-opacity duration-200",
    clean:
      "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 transition-opacity duration-200",
    compact:
      "flex items-center justify-between gap-3 py-2 transition-opacity duration-200",
  }[variant];

  // If compact variant
  if (variant === "compact") {
    return (
      <div
        dir={dir}
        className={cn(containerClasses, isInteractiveDisabled && "opacity-80", className)}
        role="navigation"
        aria-label="Pagination Navigation"
      >
        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
          <span>
            Page <strong className="text-foreground">{activePage}</strong> of{" "}
            <strong className="text-foreground">{computedTotalPages}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={isInteractiveDisabled || activePage <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={isInteractiveDisabled || activePage >= computedTotalPages}
            aria-label="Next page"
            className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={cn(
        containerClasses,
        isInteractiveDisabled && "opacity-90 select-none",
        className,
      )}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {/* Left side: Range Info & Page Size */}
      <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
        {isLoading && (
          <span className="flex items-center gap-1.5 text-primary font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span className="text-[11px]">Loading...</span>
          </span>
        )}

        {shouldShowInfo && totalItems > 0 && (
          <span>
            Showing <strong className="text-foreground font-semibold">{startItem}</strong> -{" "}
            <strong className="text-foreground font-semibold">{endItem}</strong> of{" "}
            <strong className="text-foreground font-semibold">{totalItems}</strong> {itemLabel}
          </span>
        )}

        {shouldShowSizeSelector && hasLimitHandler && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-border/60 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
            <span className="hidden sm:inline text-xs">Per page:</span>
            <select
              value={currentLimit}
              disabled={isInteractiveDisabled}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              aria-label="Select number of items per page"
              className="text-xs bg-background/80 border border-border/60 rounded-lg px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Navigation buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        {showFirstLastButtons && (
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={isInteractiveDisabled || activePage <= 1}
            aria-label="First page"
            title="First page"
            className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => handlePageChange(activePage - 1)}
          disabled={isInteractiveDisabled || activePage <= 1}
          aria-label="Previous page"
          title="Previous page"
          className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-muted-foreground select-none"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === activePage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                disabled={isInteractiveDisabled}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${pageNum}`}
                className={cn(
                  "min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50",
                  isInteractiveDisabled && "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => handlePageChange(activePage + 1)}
          disabled={isInteractiveDisabled || activePage >= computedTotalPages}
          aria-label="Next page"
          title="Next page"
          className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>

        {/* Last Page */}
        {showFirstLastButtons && (
          <button
            type="button"
            onClick={() => handlePageChange(computedTotalPages)}
            disabled={isInteractiveDisabled || activePage >= computedTotalPages}
            aria-label="Last page"
            title="Last page"
            className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
