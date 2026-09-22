import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { AxiosError } from "axios";

export const useUpdateSkills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skills: { skillId: number | string; proficiencyLevel: string }[]) =>
      profileService.updateSkills(skills),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me", "skills"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("Error updating skills:", error);
    },
  });
};
