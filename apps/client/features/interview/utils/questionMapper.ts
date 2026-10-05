import { QuestionItem } from "../types";

/**
 * Safely converts Base64 audio into a playable browser Blob URL
 */
export function base64ToAudioUrl(
  audioBase64: string,
  mimeType: string = "audio/wav"
): string | null {
  if (typeof window === "undefined" || !audioBase64) return null;
  try {
    const bin = atob(audioBase64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn("[questionMapper] Failed to create audio URL from base64:", err);
    return null;
  }
}

/**
 * Resolves the question audio into a playable URL string
 * Supports:
 * - Direct string URL
 * - Audio object { audioBase64, mimeType }
 * - Null / undefined
 */
export function resolveQuestionAudio(audioData: any): string | null {
  if (!audioData) return null;
  if (typeof audioData === "string") return audioData;
  if (typeof audioData === "object" && audioData.audioBase64) {
    return base64ToAudioUrl(audioData.audioBase64, audioData.mimeType);
  }
  return null;
}

/**
 * Unified helper function that transforms any raw question payload into a standard QuestionItem.
 * 
 * Handles all sources:
 * 1. startInterview response (introductionQuestion / firstTechnicalQuestion)
 * 2. generateQuestion response (via WebSocket question:new or REST API)
 * 3. RoomData.questions from Database
 */
export function formatToQuestionItem(
  rawQuestion: any,
  options?: {
    defaultOrder?: number;
    fallbackText?: string;
    existingAudio?: string | null;
  }
): QuestionItem | null {
  if (!rawQuestion) return null;

  // 1. Resolve ID (handles id, questionId, interviewQuestionId)
  const id = String(
    rawQuestion.id ??
    rawQuestion.questionId ??
    rawQuestion.interviewQuestionId ??
    ""
  );

  // 2. Resolve Question Text (handles question, questionText, aiQuestionTextAr/En, fallback)
  const questionText = String(
    rawQuestion.question ??
    rawQuestion.questionText ??
    rawQuestion.aiQuestionTextAr ??
    rawQuestion.aiQuestionTextEn ??
    options?.fallbackText ??
    ""
  ).trim();

  // 3. Resolve Order
  const questionOrder = Number(
    rawQuestion.questionOrder ??
    options?.defaultOrder ??
    1
  );

  // 4. Resolve Key Topics
  const keyTopics: string[] = Array.isArray(rawQuestion.keyTopics)
    ? rawQuestion.keyTopics
    : [];

  // 5. Resolve Audio URL
  // If the object already has a resolved audio or audio payload, use it; otherwise fallback to existingAudio
  const resolvedAudio = resolveQuestionAudio(rawQuestion.questionAudio) || options?.existingAudio || null;

  // 6. Resolve Answered status
  const isAnswered = Boolean(rawQuestion.isAnswered ?? false);

  return {
    id,
    question: questionText,
    questionOrder,
    keyTopics,
    questionAudio: resolvedAudio,
    isAnswered,
  };
}
