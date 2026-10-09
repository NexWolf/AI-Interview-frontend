"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Briefcase, Plus } from "lucide-react";
import { Loading, Pagination, Skeleton } from "@repo/shared";
import { useGetAllInterviews } from "@/features/interview/hooks/ReactQueryHooks/useGetAllInterviews";
import { InterviewListItem } from "./InterviewListItem";

export const MyInterviewsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetAllInterviews({ page, limit });

  // Initial load skeleton (only when we don't have any cached or previous data)
  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Loading variant="skeleton" skeletonCount={4} skeletonHeight="h-28" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Failed to load interviews</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Could not retrieve your interview list.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const items = data?.interviews || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Interviews
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your previous AI technical interviews, view detailed performance evaluations, or resume ongoing sessions.
          </p>
        </div>
        <Link
          href="/interview/setup"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Start New Interview
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 p-12 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-lg font-bold">No interviews yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Take your first realistic AI mock interview to practice your skills and get immediate actionable feedback.
          </p>
          <Link
            href="/interview/setup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Scrollable list container wrapped in the shared Loading overlay */}
          <Loading
            active={isFetching}
            variant="overlay"
            text="جاري تحميل المقابلات..."
            className="rounded-2xl"
          >
            <div
              ref={listContainerRef}
              className="max-h-[620px] overflow-y-auto pr-1 sm:pr-2 space-y-3.5 scroll-smooth [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]"
            >
              {items.map((interview) => (
                <InterviewListItem key={interview.id} interview={interview} />
              ))}
            </div>
          </Loading>

          {/* Locked / Stable Pagination directly below list */}
          {pagination && pagination.total > 0 && (
            <Pagination
              page={page}
              limit={limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              disabled={isFetching}
              isLoading={isFetching}
              onPageChange={(newPage) => {
                setPage(newPage);
                // Scroll only the internal list container, no entire window jump!
                listContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
                listContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
              pageSizeOptions={[10, 20, 50]}
              showPageSizeSelector
              showInfo
              itemLabel="interviews"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MyInterviewsList;
