"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  AdminQuestion,
  useAdminQuestions,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useDebounce,
  DeleteConfirmModal,
} from "@repo/shared";
import { QuestionFormModal } from "./QuestionFormModal";

export function AdminQuestionsTab() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<AdminQuestion | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminQuestions({
    take: 100,
  });

  const rawQuestions = data?.questions;
  const questions: AdminQuestion[] = useMemo(() => {
    if (Array.isArray(rawQuestions)) return rawQuestions;
    if ((rawQuestions as any)?.data && Array.isArray((rawQuestions as any).data)) {
      return (rawQuestions as any).data;
    }
    return [];
  }, [rawQuestions]);

  const createQuestionMutation = useCreateQuestionMutation();
  const updateQuestionMutation = useUpdateQuestionMutation();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const totalQuestions = questions.length;
  const adminQuestions = questions?.filter((q) => q.source === "Admin").length;
  const aiQuestions = totalQuestions - adminQuestions;

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.questionTextEn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.questionTextAr.includes(debouncedSearch) ||
        q.technicalField.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchDifficulty =
        difficultyFilter === "ALL" ? true : q.difficultyLevel === difficultyFilter;

      return matchSearch && matchDifficulty;
    });
  }, [questions, debouncedSearch, difficultyFilter]);

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (q: AdminQuestion) => {
    setEditingQuestion(q);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingQuestion) {
      updateQuestionMutation.mutate(
        { id: editingQuestion.id, data: formData },
        {
          onSuccess: () => setIsFormOpen(false),
        }
      );
    } else {
      createQuestionMutation.mutate(formData, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!questionToDelete) return;
    deleteQuestionMutation.mutate(questionToDelete.id, {
      onSuccess: () => setQuestionToDelete(null),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Questions</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalQuestions}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Curated by Admin</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{adminQuestions}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">AI Generated</p>
            <p className="text-2xl font-bold text-purple-500 mt-1">{aiQuestions}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions by text or field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/40">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading assessment questions...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-12 text-center space-y-3 rounded-2xl border border-border/50 bg-card/40">
            <HelpCircle className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">No questions found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search
                ? "Try searching with different terms."
                : "No questions recorded in the system bank. Add your first technical question."}
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-border transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${q.difficultyLevel === "Beginner"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : q.difficultyLevel === "Intermediate"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        }`}
                    >
                      {q.difficultyLevel}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted border border-border/60 text-muted-foreground">
                      {q.technicalField}
                    </span>

                    {q.primarySkill && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        <Layers className="w-3 h-3" />
                        {q.primarySkill.nameEn}
                      </span>
                    )}

                    <span className="text-[11px] text-muted-foreground font-mono">
                      #{q.id} &bull; Source: {q.source}
                    </span>
                  </div>

                  {/* English Text */}
                  <p className="text-sm font-semibold text-foreground leading-relaxed">
                    {q.questionTextEn}
                  </p>

                  {/* Arabic Text */}
                  <p
                    dir="rtl"
                    className="text-xs text-muted-foreground leading-relaxed font-sans bg-muted/30 p-2.5 rounded-xl border border-border/40"
                  >
                    {q.questionTextAr}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                    title="Edit question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setQuestionToDelete(q)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <QuestionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
        initialData={editingQuestion}
      />

      <DeleteConfirmModal
        isOpen={Boolean(questionToDelete)}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Question"
        description="Are you sure you want to delete this question? It will no longer be available in the interview questions pool."
        isLoading={deleteQuestionMutation.isPending}
      />
    </div>
  );
}
