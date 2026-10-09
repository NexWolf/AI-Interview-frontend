"use client";

import React from "react";
import { Brain } from "lucide-react";
import { ScoreBar } from "../shared/ScoreBar";
import { toNumber } from "../../../utils/interviewDetails.utils";

import type { InterviewRoomSkill } from "@/features/interview/types/interviewRoom";

interface ReportSkillsAssessmentProps {
  skills?: InterviewRoomSkill[];
}

export const ReportSkillsAssessment: React.FC<ReportSkillsAssessmentProps> = ({
  skills,
}) => {
  const evaluatedSkills = (skills ?? []).filter((s) => Boolean(s.evaluation));
  if (!evaluatedSkills.length) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4">
      <h2 className="font-bold text-sm flex items-center gap-2">
        <Brain className="w-4 h-4 text-cyan-400" />
        Skill-Level Assessment
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {evaluatedSkills.map((skill) => {
          const score = toNumber(skill.evaluation?.aiAssessmentScore);
          return (
            <div
              key={skill.id}
              className="rounded-xl border border-border/50 bg-background/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{skill.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                  {skill.evaluation?.proficiencyLevel || "Assessed"}
                </span>
              </div>
              <div className="mt-3">
                <ScoreBar value={score} />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {skill.evaluation?.aiAssessmentScore !== null &&
                  skill.evaluation?.aiAssessmentScore !== undefined
                    ? `${Math.round(score)}%`
                    : "Not scored"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportSkillsAssessment;
