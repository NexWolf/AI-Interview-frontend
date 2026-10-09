import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { StandardApiResponse } from "@/shared/types/api";
import { AnalyzeRepositoryResult } from "../types/codebase";

export const codebaseService = {
  analyzeRepository: async (repositoryUrl: string): Promise<AnalyzeRepositoryResult> => {
    const response = await AxiosAPI.post<StandardApiResponse<AnalyzeRepositoryResult>>(
      "/api/codebase/analyze",
      { repositoryUrl },
    );
    return response.data.data;
  },
};
