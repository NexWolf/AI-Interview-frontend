import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useInterviewStore } from "../store/useInterviewStore";
import { QuestionItem } from "../types";
import {
  QuestionNewPayload,
  SummaryDonePayload,
  SocketErrorPayload,
} from "@/shared/hook/useInterviewSocket";
import { stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";
import {
  InterviewModeInfo,
  getInterviewRedirectUrl,
} from "../utils/interviewRouting";

interface UseInterviewSocketSubscriptionsProps {
  interviewId: string;
  onEvent: <T = any>(event: string, callback: (data: T) => void) => () => void;
  toQuestionItem: (raw: any) => QuestionItem;
  onAskQuestion: (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) => void;
  handleFinishInterview: () => void;
  modeInfo: InterviewModeInfo;
  router: AppRouterInstance;
  setQuestionLiveText?: React.Dispatch<React.SetStateAction<string>>;
  setReportLiveText?: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Encapsulates all server-push Socket.io subscriptions and event handlers
 * for the live interview room. Connects directly to Zustand store to avoid prop-drilling.
 */
export function useInterviewSocketSubscriptions({
  interviewId,
  onEvent,
  toQuestionItem,
  onAskQuestion,
  handleFinishInterview,
  modeInfo,
  router,
  setQuestionLiveText,
  setReportLiveText,
}: UseInterviewSocketSubscriptionsProps) {
  const handledQuestionIdsRef = useRef<Set<string | number>>(new Set());

  useEffect(() => {
    if (!interviewId) return;

    const offs = [
      onEvent<QuestionNewPayload>("question:new", ({ question }) => {
        const store = useInterviewStore.getState();
        const currentPhase = store.phase;

        console.debug(
          `[${currentPhase}][question:new] received id: ${question.questionId}, current q: ${store.currentQuestion?.id}`
        );

        if (currentPhase === "closing") {
          console.debug(`[${currentPhase}][question:new] ignored (closing) id: ${question.questionId}`);
          return;
        }

        if (store.currentQuestion?.id === String(question.questionId)) {
          console.debug(`[${currentPhase}][question:new] ignored (same as current) id: ${question.questionId}`);
          return;
        }

        if (handledQuestionIdsRef.current.has(question.questionId)) {
          console.debug(`[${currentPhase}][question:new] ignored (already handled) id: ${question.questionId}`);
          return;
        }

        handledQuestionIdsRef.current.add(question.questionId);
        
        // Clear streaming text in store and optional prop
        store.clearQuestionLiveText();
        setQuestionLiveText?.("");

        const newQ = toQuestionItem(question);
        store.addQuestion(newQ);
        store.setNextQuestion(newQ);

        console.log(
          "%c📥 [SOCKET question:new] Buffered new incoming question into nextQuestion:",
          "background: #0d9488; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
          {
            newQuestionId: newQ.id,
            order: newQ.questionOrder,
            questionText: newQ.question,
            hasAudio: !!newQ.questionAudio,
            currentPhase: store.phase,
          }
        );

        // If the candidate was waiting in 'generating', ask the freshly arrived question immediately!
        if (useInterviewStore.getState().phase === "generating") {
          console.log("⚡ [RECOVER FROM GENERATING] Asking newly arrived question immediately!");
          onAskQuestion(newQ, true, true);
        }
      }),

      onEvent<{ text: string }>("question:stream", ({ text }) => {
        useInterviewStore.getState().appendQuestionLiveText(text);
        setQuestionLiveText?.((prev) => prev + text);
      }),

      onEvent<SocketErrorPayload>("question:error", ({ message }) => {
        console.error("[SOCKET] question:error:", message);
        if (useInterviewStore.getState().phase === "generating") {
          useInterviewStore.getState().setPhase("idle");
        }
        toast.error(message || "Failed to generate next question");
      }),

      onEvent<SocketErrorPayload>("answer:error", ({ message }) => {
        console.error("[SOCKET] answer:error:", message);
        if (useInterviewStore.getState().phase === "processing") {
          useInterviewStore.getState().setPhase("idle");
        }
        toast.error(message || "Failed to save answer");
      }),

      onEvent<SocketErrorPayload>("summary:error", ({ message }) => {
        console.error("[SOCKET] summary:error:", message);
        toast.dismiss();
        useInterviewStore.getState().setPhase("idle");
        toast.error(message || "Error generating report");
      }),

      onEvent<{ text: string }>("summary:stream", ({ text }) => {
        useInterviewStore.getState().appendReportLiveText(text);
        setReportLiveText?.((prev) => prev + text);
      }),

      onEvent<{ interviewId?: string }>("interview:completed", () => {
        const state = useInterviewStore.getState();
        // Guard: If candidate is actively reading or answering currentQuestion, DO NOT interrupt them!
        // The session will conclude cleanly once the candidate finishes submitting or skipping this question.
        if (state.currentQuestion && !state.currentQuestion.isAnswered) {
          console.log(
            "%c⏳ [SOCKET interview:completed] Postponing finish because candidate has not submitted current question yet:",
            "background: #f59e0b; color: black; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
            {
              questionId: state.currentQuestion.id,
              order: state.currentQuestion.questionOrder,
            }
          );
          state.setIsPendingCompletion(true);
          return;
        }

        console.log("[SOCKET] interview:completed received from server");
        handleFinishInterview();
      }),

      onEvent<SummaryDonePayload>("summary:done", () => {
        console.log("[SOCKET] summary:done received");
        useInterviewStore.getState().clearReportLiveText();
        setReportLiveText?.("");
        useInterviewStore.getState().setPhase("idle");
        stopGlobalMediaStream();
        toast.dismiss();
        toast.success("Interview completed! Loading your evaluation report...");

        setTimeout(() => {
          const redirectUrl = getInterviewRedirectUrl(modeInfo, interviewId);
          router.replace(redirectUrl);
        }, 300);
      }),
    ];

    return () => {
      offs.forEach((off) => off());
    };
  }, [
    interviewId,
    onEvent,
    toQuestionItem,
    onAskQuestion,
    handleFinishInterview,
    modeInfo,
    router,
    setQuestionLiveText,
    setReportLiveText,
  ]);
}
