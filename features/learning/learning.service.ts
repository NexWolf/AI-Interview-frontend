import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { AssessmentQuestion, CommunityMessage, LearningJourney } from "./types";

export const learningService = {
  questions: async (): Promise<AssessmentQuestion[]> => (await AxiosAPI.get("/api/v1/learning/assessment/questions")).data.data.questions,
  assess: async (answers: { questionId: string; answer: string }[]): Promise<LearningJourney> => (await AxiosAPI.post("/api/v1/learning/assessment", { answers })).data.data.journey,
  journey: async (): Promise<LearningJourney | null> => (await AxiosAPI.get("/api/v1/learning/journey")).data.data.journey,
  submitTask: async (taskId: string, submission: { submissionUrl?: string; notes: string }) => (await AxiosAPI.post(`/api/v1/learning/tasks/${taskId}/submit`, submission)).data.data.task,
  defendTask: async (taskId: string, answer: string) => (await AxiosAPI.post(`/api/v1/learning/tasks/${taskId}/defend`, { answer })).data.data,
  messages: async (level: number): Promise<CommunityMessage[]> => (await AxiosAPI.get(`/api/v1/learning/community/${level}/messages`)).data.data.messages,
  postMessage: async (level: number, body: string): Promise<CommunityMessage> => (await AxiosAPI.post(`/api/v1/learning/community/${level}/messages`, { body })).data.data.message,
};
