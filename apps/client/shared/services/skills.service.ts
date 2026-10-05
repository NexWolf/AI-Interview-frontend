import { AxiosAPI } from "../lib/AxiosAPI";
import { AllSkills, AdminSkill, CreateSkillPayload } from "../types/allSkills";


export const skillsService = {
    getAll : async (): Promise<AdminSkill[]> => {
        const response = await AxiosAPI.get("/api/v1/skills/admin/skills");
        return response?.data.data;
    },

    getById : async (id : string) : Promise<AllSkills> => {
        const response = await AxiosAPI.get(`/api/v1/skills/skill/${id}`)
        return response.data.data;
    },

    create : async (payload: CreateSkillPayload): Promise<AllSkills> => {
        const response = await AxiosAPI.post("/api/v1/skills/admin/skills", payload);
        return response.data.data;
    },

    update : async (id: string | number, payload: Partial<CreateSkillPayload> ) => {
        const response = await AxiosAPI.patch(`/api/v1/skills/admin/skills/${id}`, payload);
        return response.data.data;
    },

    delete : async (id: string | number) => {
        const response = await AxiosAPI.delete(`/api/v1/skills/admin/skills/${id}`);
        return response.data.data;
    },
}