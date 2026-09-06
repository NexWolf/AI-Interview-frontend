import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { UserInfoApi } from "@/types/community/profile";

export const userService = {
    getMe: async (): Promise<UserInfoApi> => {
        const response = await AxiosAPI.get("/api/v1/users/me/");
        return response.data.data.user;
    }
}

