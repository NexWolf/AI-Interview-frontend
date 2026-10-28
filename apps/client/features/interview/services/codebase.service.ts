import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { StandardApiResponse } from "@/shared/types/api";
import { AnalyzeRepositoryResult } from "../types/codebase";

export interface UserCodebaseProject {
  id: string;
  repositoryUrl: string;
  repositoryName: string;
  repositoryOwner: string;
  defaultBranch: string;
  analyzedAt: string;
  statistics?: {
    files: number;
    symbols: number;
  };
}

export const codebaseService = {
  analyzeRepository: async (repositoryUrl: string): Promise<AnalyzeRepositoryResult> => {
    const response = await AxiosAPI.post<StandardApiResponse<AnalyzeRepositoryResult>>(
      "/api/codebase/analyze",
      { repositoryUrl },
    );
    return response.data.data;
  },

  getUserProjects: async (): Promise<UserCodebaseProject[]> => {
    try {
      const response = await AxiosAPI.get<StandardApiResponse<UserCodebaseProject[]>>(
        "/api/codebase/projects"
      );
      return response.data.data || [];
    } catch {
      return [];
    }
  },
};
