"use client";

import React from "react";
import {
  useTechnologiesSelect,
  SelectedSkillsBox,
  TechnologyDropdownSelect,
  TechnologySuggestionsCard,
  TechnologiesSkeleton,
  TechnologiesErrorFallback,
} from "./technologies";

/**
 * Onboarding-style Technologies selector for the Interview Setup Wizard.
 * Refactored to adhere strictly to Clean Code & Best Practices:
 * - Single Responsibility: Orchestrates modular subcomponents.
 * - Separation of Concerns: Business & caching logic encapsulated in `useTechnologiesSelect`.
 * - High cohesion, loose coupling, and maintainability.
 */
export const TechnologiesSelect: React.FC = () => {
  const {
    isAr,
    isLoading,
    isAllSkillsError,
    refetchAllSkills,
    userSkills,
    allSkills,
    selectedSkillsIds,
    skillMap,
    allSkillsList,
    availableUserSkills,
    availableGeneralSkills,
    addSkill,
    removeSkill,
    clearAll,
    errorMessage,
  } = useTechnologiesSelect();

  if (isLoading) {
    return <TechnologiesSkeleton />;
  }

  if (
    isAllSkillsError &&
    (!allSkills || allSkills.length === 0) &&
    (!userSkills || userSkills.length === 0)
  ) {
    return (
      <TechnologiesErrorFallback
        isAr={isAr}
        onRetry={() => refetchAllSkills()}
      />
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* 1. Selected Skills Box */}
      <SelectedSkillsBox
        isAr={isAr}
        selectedSkillsIds={selectedSkillsIds}
        skillMap={skillMap}
        onRemoveSkill={removeSkill}
        onClearAll={clearAll}
        errorMessage={errorMessage}
      />

      {/* 2. Dropdown Select Input */}
      <TechnologyDropdownSelect
        isAr={isAr}
        selectedSkillsIds={selectedSkillsIds}
        userSkills={userSkills}
        allSkillsList={allSkillsList}
        skillMap={skillMap}
        onAddSkill={addSkill}
      />

      {/* 3. Quick Suggestions Card */}
      <TechnologySuggestionsCard
        isAr={isAr}
        availableUserSkills={availableUserSkills}
        availableGeneralSkills={availableGeneralSkills}
        onAddSkill={addSkill}
      />
    </div>
  );
};

// Retain legacy export for backward compatibility
export const TecnologiesSelect = TechnologiesSelect;
export default TechnologiesSelect;