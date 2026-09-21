import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { UserInfoApi } from "@/types/community/profile";
import { UserSkillItem } from "../types/userSkills";

export const userService = {
    getMe: async (): Promise<UserInfoApi> => {
        const response = await AxiosAPI.get("/api/v1/users/me/");
        return response.data.data.user;
    },
    getUserSkills : async () : Promise<UserSkillItem[]> =>   {
        const response = await AxiosAPI.get(`/api/v1/users/me/skills`);
        return response.data.data.skills
    }
}

