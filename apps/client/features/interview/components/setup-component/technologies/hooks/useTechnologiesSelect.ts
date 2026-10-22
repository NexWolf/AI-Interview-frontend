"use client";

import { useMemo } from "react";
import { useFormContext, get } from "react-hook-form";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useUserSkills } from "@/shared/hook/useUserSkills";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { SkillItem } from "../types";

/**
 * Dedicated Custom Hook for Technology & Skill Selection in Setup Wizard.
 * Encapsulates:
 * - Server data fetching & caching (User skills & all system skills).
 * - Multi-language label resolution & Map indexing.
 * - Prioritized quick suggestion partitioning.
 * - Form state synchronization with react-hook-form.
 */
export function useTechnologiesSelect() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // 1. Fetch cached skills from React Query
  const {
    data: userSkills,
    isLoading: isUserSkillsLoading,
  } = useUserSkills();

  const {
    data: allSkills,
    isLoading: isAllSkillsLoading,
    isError: isAllSkillsError,
    refetch: refetchAllSkills,
  } = useAllSkills();

  // 2. Watch current selected skill IDs
  const rawSelected: unknown = watch("skillsIds");
  const selectedSkillsIds: string[] = useMemo(() => {
    if (Array.isArray(rawSelected)) {
      return rawSelected.map((id) => String(id));
    }
    return [];
  }, [rawSelected]);

  const isLoading =
    (isUserSkillsLoading || isAllSkillsLoading) && (!allSkills || allSkills.length === 0);

  // 3. Normalized dictionary of all skills
  const skillMap = useMemo(() => {
    const map = new Map<string, SkillItem>();

    if (allSkills && allSkills.length > 0) {
      for (const s of allSkills) {
        const id = String(s.id);
        const displayName = isAr && s.nameAr ? s.nameAr : (s.name || s.nameEn || id);
        map.set(id, {
          id,
          name: displayName,
          isUserSkill: false,
        });
      }
    }

    if (userSkills && userSkills.length > 0) {
      for (const us of userSkills) {
        const id = String(us.skill?.id || us.skillId);
        const existing = map.get(id);
        const name = isAr && us.skill?.name ? us.skill.name : (us.skill?.name || existing?.name || id);
        map.set(id, {
          id,
          name: existing?.name || name,
          isUserSkill: true,
        });
      }
    }

    return map;
  }, [allSkills, userSkills, isAr]);

  // 4. Sorted list of all active system skills for the dropdown
  const allSkillsList = useMemo<SkillItem[]>(() => {
    if (!allSkills) return [];
    return allSkills
      .filter((s) => s.isActive !== false)
      .map((s) => {
        const id = String(s.id);
        const info = skillMap.get(id);
        return {
          id,
          name: info?.name || s.name || id,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allSkills, skillMap]);

  // 5. Unselected user profile skills (quick-add priority 1)
  const availableUserSkills = useMemo<SkillItem[]>(() => {
    if (!userSkills) return [];
    const set = new Set(selectedSkillsIds);
    return userSkills
      .map((us) => {
        const id = String(us.skill?.id || us.skillId);
        const info = skillMap.get(id);
        return {
          id,
          name: info?.name || us.skill?.name || id,
          isUserSkill: true,
        };
      })
      .filter((item) => !set.has(item.id));
  }, [userSkills, selectedSkillsIds, skillMap]);

  // 6. Unselected general popular skills (quick-add priority 2)
  const availableGeneralSkills = useMemo<SkillItem[]>(() => {
    const selectedSet = new Set(selectedSkillsIds);
    const userSkillSet = new Set((userSkills || []).map((us) => String(us.skill?.id || us.skillId)));

    return allSkillsList.filter(
      (item) => !selectedSet.has(item.id) && !userSkillSet.has(item.id)
    );
  }, [allSkillsList, selectedSkillsIds, userSkills]);

  // 7. Form Mutators
  const addSkill = (skillIdToAdd: string) => {
    if (!skillIdToAdd || selectedSkillsIds.includes(skillIdToAdd)) return;
    setValue("skillsIds", [...selectedSkillsIds, skillIdToAdd], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeSkill = (skillIdToRemove: string) => {
    if (!skillIdToRemove) return;
    const updated = selectedSkillsIds.filter((id) => id !== skillIdToRemove);
    setValue("skillsIds", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const clearAll = () => {
    setValue("skillsIds", [], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const skillsError = get(errors, "skillsIds");
  const errorMessage = skillsError?.message ? String(skillsError.message) : undefined;

  return {
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
  };
}
