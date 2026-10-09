"use client";

import { useMemo, useState } from "react";
import {
  MessageSquare,
  Search,
  Star,
  Trash2,
  Eye,
  Calendar,
  User,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import {
  AdminFeedback,
  useAdminFeedbacks,
  useDeleteFeedbackMutation,
  useDebounce,
  DeleteConfirmModal,
} from "@repo/shared";
import { FeedbackDetailModal } from "./FeedbackDetailModal";

export function AdminFeedbacksTab() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedback | null>(null);
  const [feedbackToDeleteId, setFeedbackToDeleteId] = useState<string | number | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminFeedbacks({
    limit: 100,
  });

  const feedbacks: AdminFeedback[] = data?.feedbacks || [];
  const deleteFeedbackMutation = useDeleteFeedbackMutation();

  const totalFeedbacks = feedbacks.length;
  const avgRating = totalFeedbacks
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalFeedbacks).toFixed(1)
    : "0.0";

  const fiveStarCount = feedbacks.filter((f) => f.rating === 5).length;

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchSearch =
        (f.commentEn && f.commentEn.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (f.commentAr && f.commentAr.includes(debouncedSearch)) ||
        (f.user &&
          (f.user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (f.user.firstName && f.user.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()))));

      const matchRating = ratingFilter === "ALL" ? true : f.rating === Number(ratingFilter);
      const matchCategory = categoryFilter === "ALL" ? true : f.category === categoryFilter;

      return (debouncedSearch ? matchSearch : true) && matchRating && matchCategory;
    });
  }, [feedbacks, debouncedSearch, ratingFilter, categoryFilter]);

  const handleConfirmDelete = () => {
    if (!feedbackToDeleteId) return;
    deleteFeedbackMutation.mutate(feedbackToDeleteId, {
      onSuccess: () => setFeedbackToDeleteId(null),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalFeedbacks}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Average Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{avgRating}</span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">5-Star Satisfaction</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{fiveStarCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search feedback comment or candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Stars</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★☆</option>
            <option value="3">3 Stars ★★★☆☆</option>
            <option value="2">2 Stars ★★☆☆☆</option>
            <option value="1">1 Star ★☆☆☆☆</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="General">General</option>
            <option value="Interview_Quality">Interview Quality</option>
            <option value="AI_Accuracy">AI Accuracy</option>
          </select>
        </div>
      </div>

      {/* Feedbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/40">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading candidates feedback...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="col-span-full p-12 text-center space-y-3 rounded-2xl border border-border/50 bg-card/40">
            <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">No feedbacks found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search
                ? "No matching reviews for this search query."
                : "No candidate feedback submitted yet."}
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-border transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-muted border border-border/60 text-muted-foreground">
                    {item.category.replace("_", " ")}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-foreground line-clamp-3 leading-relaxed">
                  {item.commentEn || item.commentAr || (
                    <span className="italic text-muted-foreground">Rated without comment.</span>
                  )}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {item.user
                      ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim() || item.user.userName
                      : "Candidate"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedFeedback(item)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setFeedbackToDeleteId(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <FeedbackDetailModal
        feedback={selectedFeedback}
        isOpen={Boolean(selectedFeedback)}
        onClose={() => setSelectedFeedback(null)}
        onDelete={(id) => setFeedbackToDeleteId(id)}
      />

      <DeleteConfirmModal
        isOpen={Boolean(feedbackToDeleteId)}
        onClose={() => setFeedbackToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Candidate Feedback"
        description="Are you sure you want to permanently delete this feedback review?"
        isLoading={deleteFeedbackMutation.isPending}
      />
    </div>
  );
}
