"use client";

import { useState } from "react";
import ActionIcons from "@/shared/components/ui/ActionIcons";
import { SkillsApiData } from "../types/profile.types";
import { ProficiencyLevel } from "@/shared/types/userSkills";
import ProfileSkillsDialog from "./ProfileSkillsDialog";
import { useLanguage } from "@/shared/context/LanguageContext";

type PropsSkills = {
  skillsData: SkillsApiData[];
  onSave?: (skills: { skillId: string; proficiencyLevel?: ProficiencyLevel }[]) => Promise<void> | void;
  onEdit?: () => void;
  onAdd?: () => void;
  editable?: boolean;
  isLoading?: boolean;
};

const getSkillBadge = (skill: SkillsApiData, isAr: boolean) => {
  if (!skill.assessedByAi || skill.aiAssessmentScore === null || skill.aiAssessmentScore === undefined) {
    return {
      label: isAr ? "غير مقيّم" : "Not Assessed",
      score: null,
      className:
        "bg-muted/60 text-muted-foreground border-border/60 border-dashed",
    };
  }

  const scoreNum = Math.round(Number(skill.aiAssessmentScore));

  switch (skill.proficiencyLevel) {
    case "Expert":
      return {
        label: isAr ? "خبير" : "Expert",
        score: scoreNum,
        className:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      };
    case "Advanced":
      return {
        label: isAr ? "متقدم" : "Advanced",
        score: scoreNum,
        className:
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      };
    case "Intermediate":
      return {
        label: isAr ? "متوسط" : "Intermediate",
        score: scoreNum,
        className:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      };
    case "Beginner":
    default:
      return {
        label: isAr ? "مبتدئ" : "Beginner",
        score: scoreNum,
        className:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      };
  }
};

export const ProfileSkills = ({
  skillsData,
  onSave,
  onEdit,
  onAdd,
  editable,
  isLoading = false,
}: PropsSkills) => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    onAdd?.();
    onEdit?.();
  };

  const handleSaveSkills = async (
    skills: { skillId: string; proficiencyLevel?: ProficiencyLevel }[]
  ) => {
    if (onSave) {
      await onSave(skills);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
      {isDialogOpen && (
        <ProfileSkillsDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          currentSkills={skillsData || []}
          onSave={handleSaveSkills}
          isLoading={isLoading}
        />
      )}

      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">
            {isAr ? "المهارات والخبرات التقنية" : "Skills & Expertise"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {skillsData?.length || 0} {isAr ? "مهارات" : "Skills"}
          </span>
        </div>

        {/* Actions Icons */}
        {editable && (
          <ActionIcons onAdd={handleOpenDialog} onEdit={handleOpenDialog} />
        )}
      </div>

      {!skillsData || skillsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-xs text-muted-foreground italic mb-2">
            {isAr ? "لم تتم إضافة مهارات بعد." : "No skills added yet."}
          </p>
          {editable && (
            <button
              type="button"
              onClick={handleOpenDialog}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              {isAr ? "+ أضف مهاراتك الآن" : "+ Add your skills"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skillsData.map((skill) => {
            const badge = getSkillBadge(skill, isAr);
            return (
              <div
                key={skill.skillId}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* الدائرة الموحدة بالحرف الأول */}
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                    {skill.name ? skill.name[0] : "S"}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">
                    {skill.name}
                  </span>
                </div>

                {badge && (
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${badge.className}`}
                  >
                    {badge.label}
                    {badge.score !== null ? ` • ${badge.score}%` : ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileSkills;
