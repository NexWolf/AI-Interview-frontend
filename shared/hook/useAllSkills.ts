import { useQuery } from "@tanstack/react-query";
import { skillsService } from "../services/skills.service";
import { defaultAuthRetry } from "../lib/queryUtils";
import { skillsKey } from "../constants/query-key";
import { AdminSkill } from "../types/allSkills";

export type SkillOption = AdminSkill & { name: string };

export const useAllSkills = () => {
  return useQuery({
    queryKey: skillsKey.All,
    queryFn: async (): Promise<SkillOption[]> => {
      const skills = await skillsService.getAll();
      return skills.map((skill) => ({ ...skill, name: skill.nameEn }));
    },
    staleTime: 5 * 60 * 1000,
    retry: defaultAuthRetry,
  });
};