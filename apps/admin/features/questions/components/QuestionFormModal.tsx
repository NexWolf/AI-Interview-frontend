"use client";

import { useEffect, useState } from "react";
import { X, HelpCircle, Loader2 } from "lucide-react";
import { AdminQuestion, useAllSkills } from "@repo/shared";

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    questionTextAr: string;
    questionTextEn: string;
    technicalField: string;
    difficultyLevel: string;
    skillIds?: Array<string | number>;
    isActive?: boolean;
  }) => void;
  isLoading: boolean;
  initialData?: AdminQuestion | null;
}

export function QuestionFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: QuestionFormModalProps) {
  const [questionTextEn, setQuestionTextEn] = useState("");
  const [questionTextAr, setQuestionTextAr] = useState("");
  const [technicalField, setTechnicalField] = useState("Software Engineering");
  const [difficultyLevel, setDifficultyLevel] = useState("Intermediate");
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");

  const { data: skills = [] } = useAllSkills();

  useEffect(() => {
    if (initialData) {
      setQuestionTextEn(initialData.questionTextEn || "");
      setQuestionTextAr(initialData.questionTextAr || "");
      setTechnicalField(initialData.technicalField || "Software Engineering");
      setDifficultyLevel(initialData.difficultyLevel || "Intermediate");
      if (initialData.primarySkillId) {
        setSelectedSkillId(String(initialData.primarySkillId));
      } else if (initialData.questionSkills?.[0]) {
        setSelectedSkillId(String(initialData.questionSkills[0].skillId));
      } else {
        setSelectedSkillId("");
      }
    } else {
      setQuestionTextEn("");
      setQuestionTextAr("");
      setTechnicalField("Software Engineering");
      setDifficultyLevel("Intermediate");
      setSelectedSkillId("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTextEn.trim() || !questionTextAr.trim()) return;

    onSubmit({
      questionTextAr: questionTextAr.trim(),
      questionTextEn: questionTextEn.trim(),
      technicalField: technicalField.trim(),
      difficultyLevel,
      skillIds: selectedSkillId ? [Number(selectedSkillId)] : [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-xl bg-card border border-border/80 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {initialData ? "Edit Assessment Question" : "Add New Question"}
              </h3>
              <p className="text-xs text-muted-foreground">Technical interview question bank</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Question Text (English) *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Explain the difference between process and thread in operating systems."
              value={questionTextEn}
              onChange={(e) => setQuestionTextEn(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground text-right block">
              نص السؤال (باللغة العربية) *
            </label>
            <textarea
              dir="rtl"
              rows={3}
              placeholder="مثال: اشرح الفرق بين العملية (Process) والخيط (Thread) في أنظمة التشغيل."
              value={questionTextAr}
              onChange={(e) => setQuestionTextAr(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Difficulty Level *</label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Technical Field</label>
              <input
                type="text"
                placeholder="e.g. Backend, Frontend, Cloud"
                value={technicalField}
                onChange={(e) => setTechnicalField(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Associated Skill (Tag)</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
            >
              <option value="">None / General</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameEn || s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !questionTextEn.trim() || !questionTextAr.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {initialData ? "Update Question" : "Save Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
