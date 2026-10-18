import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { StandardApiResponse } from "@/shared/types/api";
import { AnalyzeRepositoryResult } from "../types/codebase";

export const codebaseService = {
  analyzeRepository: async (repositoryUrl: string): Promise<AnalyzeRepositoryResult> => {
    type Job = { jobId: string; status: string };
    const response = await AxiosAPI.post<StandardApiResponse<AnalyzeRepositoryResult | Job>>(
      "/api/codebase/analyze",
      { repositoryUrl },
      { headers: { Prefer: 'respond-async' } },
    );
    const data = response.data.data;
    // Servers without background jobs retain the synchronous response contract.
    if ('projectId' in data) return data;
    const deadline = Date.now() + 10 * 60 * 1000;
    while (Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const status = await AxiosAPI.get<StandardApiResponse<{
        status: string; result: AnalyzeRepositoryResult | null; error: string | null;
      }>>(`/api/codebase/jobs/${data.jobId}`);
      const job = status.data.data;
      if (job.status === 'completed' && job.result) return job.result;
      if (job.status === 'failed') throw new Error(job.error || 'Repository analysis failed. Please retry.');
    }
    throw new Error('Repository analysis is taking longer than expected. Please try again shortly.');
  },
};
