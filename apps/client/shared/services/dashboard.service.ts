import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { StandardApiResponse } from "@/shared/types/api";
import { DashboardApi, DashboardResponse } from "@/shared/types/dashboard";

export const dashboardService = {
  getDashboard: async (): Promise<DashboardApi> => {
    const response = await AxiosAPI.get<StandardApiResponse<DashboardResponse>>(
      "/api/v1/users/me/dashboard",
    );
    return response.data.data.dashboard;
  },
};