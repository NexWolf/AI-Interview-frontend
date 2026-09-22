"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { ProficiencyLevel } from "@/shared/types/userSkills";
import { SkillsApiData } from "../types/profile.types";
import {
  Award,
  ChevronDown,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type SkillItem = {
  skillId: string;
  name: string;
  proficiencyLevel?: ProficiencyLevel;
};

type ProfileSkillsDialogProps = {
  open: boolean;
  onClose: () => void;
  currentSkills: SkillsApiData[];
  onSave: (skills: { skillId: string; proficiencyLevel?: ProficiencyLevel }[]) => Promise<void> | void;
  isLoading?: boolean;
};

export const ProfileSkillsDialog = ({
  open,
  onClose,
  currentSkills,
  onSave,
  isLoading = false,
}: ProfileSkillsDialogProps) => {
  const { data: allSkills = [], isLoading: isLoadingAllSkills } = useAllSkills();

  const [skillsList, setSkillsList] = useState<SkillItem[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync with currentSkills when dialog opens
  useEffect(() => {
    if (open) {
      const initial = (currentSkills || []).map((s) => ({
        skillId: String(s.skillId),
        name: s.name,
        proficiencyLevel: (s.proficiencyLevel as ProficiencyLevel) || undefined,
      }));
      setSkillsList(initial);
      setSelectedSkillId("");
      setSearchQuery("");
    }
  }, [open, currentSkills]);

  const selectedSkillIds = useMemo(
    () => new Set(skillsList.map((s) => String(s.skillId))),
    [skillsList]
  );

  // Available skills not yet selected
  const availableSkills = useMemo(() => {
    return allSkills.filter((s) => !selectedSkillIds.has(String(s.id)));
  }, [allSkills, selectedSkillIds]);

  // Filtered by search
  const filteredAvailableSkills = useMemo(() => {
    if (!searchQuery.trim()) return availableSkills;
    const q = searchQuery.toLowerCase();
    return availableSkills.filter(
      (s) =>
        s.nameEn.toLowerCase().includes(q) ||
        (s.nameAr && s.nameAr.toLowerCase().includes(q))
    );
  }, [availableSkills, searchQuery]);

  const handleAddSkill = (skillIdToAdd?: string) => {
    const targetId = skillIdToAdd || selectedSkillId;
    if (!targetId) return;

    const skillObj = allSkills.find((s) => String(s.id) === String(targetId));
    if (!skillObj) return;

    if (!selectedSkillIds.has(String(targetId))) {
      setSkillsList((prev) => [
        ...prev,
        {
          skillId: String(skillObj.id),
          name: skillObj.nameEn,
        },
      ]);
    }

    setSelectedSkillId("");
    setSearchQuery("");
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkillsList((prev) => prev.filter((s) => s.skillId !== skillId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = skillsList.map((s) => ({
      skillId: s.skillId,
      proficiencyLevel: s.proficiencyLevel || "Beginner",
    }));
    await onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-6 rounded-2xl bg-card border-border/70 shadow-2xl overflow-hidden">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Select Your Skills
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose the technical skills you possess. Your proficiency level will be assessed and verified through your AI interviews.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden space-y-5 pt-3">
          {/* Add Skill Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Choose a Skill to Add</span>
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 text-xs sm:text-sm bg-muted/40 text-foreground rounded-xl border border-border/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                  disabled={isLoadingAllSkills}
                >
                  <option value="">
                    {isLoadingAllSkills
                      ? "Loading available skills..."
                      : "Select a skill from database..."}
                  </option>
                  {filteredAvailableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.nameEn}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleAddSkill()}
                disabled={!selectedSkillId || isLoadingAllSkills}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>

            {/* Quick Suggestions */}
            {availableSkills.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Popular suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {availableSkills.slice(0, 10).map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleAddSkill(String(skill.id))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border/50 text-muted-foreground transition-all cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      {skill.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Skills List */}
          <div className="flex flex-col flex-1 min-h-[160px] max-h-[300px] space-y-2 overflow-hidden">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selected Skills ({skillsList.length})
              </label>
              {skillsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSkillsList([])}
                  className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {skillsList.length === 0 ? (
                <div className="h-full min-h-[120px] flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border/60 text-center">
                  <Award className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No skills selected yet. Choose from the list above.
                  </p>
                </div>
              ) : (
                skillsList.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                        {skill.name ? skill.name[0].toUpperCase() : "S"}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">
                        {skill.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground italic px-2 py-0.5 rounded-md bg-muted/40 border border-border/40">
                        Assessed via Interview
                      </span>

                      {/* Remove Skill */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.skillId)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl text-xs h-9 px-5 font-semibold gap-1.5"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Skills
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSkillsDialog;
