"use client";

import React from "react";
import { PresetRole } from "@/features/interview/hooks/useInterviewSetupWizard";
import { StudentScopeView, CandidateScopeView } from "../scope";

export interface SetupStepScopeProps {
  isCareerDiscovery: boolean;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  currentSkillsIds: string[];
  hasJobDescription: boolean;
  setHasJobDescription: (val: boolean) => void;
  handleApplyPreset: (preset: PresetRole) => void;
  onNext: () => void;
  onPrev?: () => void;
  prevLabel?: string;
}

/**
 * Step 1: Interview Scope Orchestrator.
 * Adheres strictly to Clean Code & Single Responsibility Principle (SRP):
 * - Delegates Student / Career Discovery mode to `StudentScopeView`.
 * - Delegates Standard Candidate technical configuration to `CandidateScopeView`.
 */
export const SetupStepScope: React.FC<SetupStepScopeProps> = ({
  isCareerDiscovery,
  activeProjectId,
  setActiveProjectId,
  currentSkillsIds,
  hasJobDescription,
  setHasJobDescription,
  handleApplyPreset,
  onNext,
  onPrev,
  prevLabel,
}) => {
  if (isCareerDiscovery) {
    return (
      <StudentScopeView
        onNext={onNext}
        onPrev={onPrev}
        prevLabel={prevLabel}
      />
    );
  }

  return (
    <CandidateScopeView
      activeProjectId={activeProjectId}
      onDetachProject={() => setActiveProjectId(null)}
      onApplyPreset={handleApplyPreset}
      hasJobDescription={hasJobDescription}
      setHasJobDescription={setHasJobDescription}
      currentSkillsCount={currentSkillsIds.length}
      onNext={onNext}
      onPrev={onPrev}
      prevLabel={prevLabel}
    />
  );
};

export default SetupStepScope;
