import { QuestionItem } from "../types";

/**
 * Safely converts Base64 audio into a playable browser Blob URL (or Data URI fallback).
 * Normalizes non-standard "audio/mp3" to the standard "audio/mpeg" required by browser decoders.
 */
export function base64ToAudioUrl(
  audioBase64: string,
  mimeType: string = "audio/mpeg"
): string | null {
  if (typeof window === "undefined" || !audioBase64) return null;

  // 1. Normalize MIME type (browsers require audio/mpeg for MP3 playback)
  let normalizedMime = (mimeType || "").trim().toLowerCase();
  if (normalizedMime === "audio/mp3" || normalizedMime.includes("mp3")) {
    normalizedMime = "audio/mpeg";
  } else if (normalizedMime.includes("wav")) {
    normalizedMime = "audio/wav";
  } else if (!normalizedMime) {
    normalizedMime = "audio/mpeg";
  }

  // 2. Clean base64 input (strip existing data URI prefix and all whitespace/newlines)
  const cleanBase64 = String(audioBase64)
    .replace(/^data:[^;]+;base64,/, "")
    .replace(/\s+/g, "");

  if (!cleanBase64) return null;

  try {
    const bin = atob(cleanBase64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: normalizedMime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn("[questionMapper] Blob creation failed, falling back to data URI:", err);
    // Data URI fallback is natively supported by new Audio() without Blob URL allocation
    return `data:${normalizedMime};base64,${cleanBase64}`;
  }
}

/**
 * Resolves question audio into a guaranteed playable URL string.
 * Supports:
 * - Direct URL string (http, https, blob:, data:audio/)
 * - Raw Base64 string
 * - Audio object { audioBase64, mimeType } / { audio, mimeType } / { audioUrl }
 * - Null / undefined
 */
export function resolveQuestionAudio(audioData: any): string | null {
  if (!audioData) return null;

  // Direct string handling
  if (typeof audioData === "string") {
    const trimmed = audioData.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("blob:") ||
      trimmed.startsWith("data:audio/")
    ) {
      return trimmed;
    }
    // Raw Base64 string passed directly
    return base64ToAudioUrl(trimmed, "audio/mpeg");
  }

  // Object payload handling from backend or state
  if (typeof audioData === "object") {
    const b64 =
      audioData.audioBase64 ||
      audioData.audio ||
      audioData.data ||
      audioData.audioUrl ||
      audioData.url;

    if (typeof b64 === "string") {
      const trimmed = b64.trim();
      if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("blob:") ||
        trimmed.startsWith("data:audio/")
      ) {
        return trimmed;
      }
      return base64ToAudioUrl(
        trimmed,
        audioData.mimeType || audioData.type || "audio/mpeg"
      );
    }
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
    options: Array.isArray(rawQuestion.options) ? rawQuestion.options : null,
    reaction: typeof rawQuestion.reaction === "string" ? rawQuestion.reaction : null,
    inputType: rawQuestion.inputType || null,
    freeTextPrompt: typeof rawQuestion.freeTextPrompt === "string" ? rawQuestion.freeTextPrompt : null,
    followUp: typeof rawQuestion.followUp === "string" ? rawQuestion.followUp : null,
  };
}
