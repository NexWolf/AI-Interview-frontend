import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { ProfileApi } from "../types/profile.types";

export const profileService = {
    getAll: async (): Promise<ProfileApi | null> => {
        const response = await AxiosAPI.get(`/api/v1/users/me/`);
        return response.data.data.user;
    },
    update: async (data: FormData) => {
        const response = await AxiosAPI.patch(`/api/v1/users/me/`, data)
        return response;
    },
    getByUsername: async (username: string): Promise<ProfileApi | null> => {
        const response = await AxiosAPI.get(`/api/v1/users/profile/${username}`);
        return response.data.data.user;
    },
    updateSkills: async (skills: { skillId: number | string; proficiencyLevel: string }[]) => {
        const response = await AxiosAPI.put(`/api/v1/users/me/skills`, {
            skills: skills.map((s) => ({
                skillId: Number(s.skillId),
                proficiencyLevel: s.proficiencyLevel || "Intermediate",
            })),
        });
        return response.data;
    },
}

