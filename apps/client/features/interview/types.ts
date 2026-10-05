export type Phase =
  | "idle"
  | "generating"
  | "speaking"
  | "listening"
  | "processing"
  | "closing";

export interface QuestionItem {
  id: string;
  question: string;
  questionOrder: number;
  keyTopics?: string[];
  questionAudio?: string | null;
  isAnswered?: boolean;
}
