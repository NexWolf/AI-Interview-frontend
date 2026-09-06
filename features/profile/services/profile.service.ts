import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { ProfileApi } from "../types/profile.types";
import { AxiosServerAPI } from "@/shared/lib/AxiosServerAPI";

export const profileService = {
    getAll : async () : Promise<ProfileApi | null> => {
        const response = await AxiosAPI.get(`/api/v1/users/me/`);
        return response.data.data.user;
    }
}