"use client";

/* ============================================================================
 * SECTION 0: IMPORTS & TYPES
 * ========================================================================== */

import { useGetInterveiwRoom } from "@/features/interview/hooks/ReactQueryHooks/useGetInterviewRoom";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { setCandidateToken } from "@/shared/lib/AxiosAPI";
import { useInterviewTimer } from "@/shared/hook/useInterviewTimer";
import { useInterviewProtection } from "@/features/interview/hooks/useInterviewProtection";
import { useViolationsManager } from "@/features/interview/hooks/useViolationsManager";
import CameraPreview from "@/features/interview/components/setup-component/CameraPreview";
import {
  InterviewHeader,
  QuestionTopBar,
  AIAvatarStage,
  QuestionDisplayCard,
  CandidateResponseWorkspace,
  LiveReportOverlay,
  RoomLoadingState,
  RoomErrorState,
  CandidateCompletedState,
} from "@/features/interview/components/session-component";
import { useInterviewAudio } from "@/features/interview/hooks/useInterviewAudio";
import { useAudioRecorder } from "@/features/interview/hooks/useAudioRecorder";
import { useInterviewSpeechRecognition } from "@/features/interview/hooks/useInterviewSpeechRecognition";
import { useInterviewFlow } from "@/features/interview/hooks/useInterviewFlow";
import { useInterviewSocketSubscriptions } from "@/features/interview/hooks/useInterviewSocketSubscriptions";
import { useInterviewStore } from "@/features/interview/store/useInterviewStore";
import { formatToQuestionItem } from "@/features/interview/utils/questionMapper";
import { QuestionItem } from "@/features/interview/types";
import { useIntegrityMonitor, IntegrityEvent } from "@/shared/hook/useIntegrityMonitor";
import { useInterviewSocket } from "@/shared/hook/useInterviewSocket";
import { useMediaStream } from "@/shared/components/provider/MediaStermProvider";
import {
  detectInterviewMode,
  getInterviewRedirectUrl,
} from "@/features/interview/utils/interviewRouting";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InterviewSessionClientProps {
  interviewId: string;
}

export default function InterviewSessionClient({ interviewId }: InterviewSessionClientProps) {
  const router = useRouter();

  // Media stream and violation hooks
  const { stream, stopStream, setMicEnabled } = useMediaStream();
  const { addViolation, flushViolations, pullPendingViolations } = useViolationsManager(interviewId);

  /* ==========================================================================
   * SECTION 1: DATA FETCHING (room data)
   * ======================================================================== */

  const {
    data: RoomData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInterveiwRoom(interviewId);

  // Extract and store candidate token from URL query params if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      if (tokenFromUrl) {
        setCandidateToken(tokenFromUrl);
      }
    }
  }, []);

  // Sync candidateToken from RoomData payload if provided
  useEffect(() => {
    const candidateTok = (RoomData as any)?.candidateToken;
    if (candidateTok) {
      setCandidateToken(candidateTok);
    }
  }, [RoomData]);

  // Unified Mode and Session Heuristics (DRY)
  const modeInfo = useMemo(() => detectInterviewMode(RoomData), [RoomData]);
  const { isCandidateSession, isCareerDiscovery } = modeInfo;

  const languageRef = useRef<string>("English");
  useEffect(() => {
    if (RoomData?.interviewLanguage) {
      languageRef.current = RoomData.interviewLanguage;
    }
  }, [RoomData?.interviewLanguage]);

  // Suppress and hide any toasts while inside the active interview session
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "hide-interview-toasts";
    style.innerHTML = `[data-sonner-toaster], [data-sonner-toast] { display: none !important; }`;
    document.head.appendChild(style);
    toast.dismiss();

    return () => {
      const el = document.getElementById("hide-interview-toasts");
      if (el) el.remove();
    };
  }, []);

  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const v = sessionStorage.getItem("interview_ai_voice");
      if (v) setSelectedVoice(v);
    }
  }, []);

  const aiPersonaName = {
    Kore: "Sara",
    Aoede: "Elena",
    Charon: "David",
    Puck: "Alex",
    Fenrir: "Marcus",
  }[selectedVoice] || "Sara";

  /* ==========================================================================
   * SECTION 2: CORE STATE + PHASE STATE MACHINE (ZUSTAND)
   * ======================================================================== */

  const phase = useInterviewStore((state) => state.phase);
  const currentQuestion = useInterviewStore((state) => state.currentQuestion);
  const questionList = useInterviewStore((state) => state.questionList);
  const isAISpeaking = useInterviewStore((state) => state.isAISpeaking);
  const isListening = useInterviewStore((state) => state.isListening);
  const setAnswerText = useInterviewStore((state) => state.setAnswerText);
  const setIsAISpeaking = useInterviewStore((state) => state.setIsAISpeaking);

  const isGeneratingQuestion = phase === "generating";
  const isSubmittingAnswer = phase === "processing";
  const isFinishing = phase === "closing";

  // Integrity / proctoring state
  const [warningCount, setWarningCount] = useState<number>(0);
  const [proctoringStatus, setProctoringStatus] = useState<{
    hasViolation: boolean;
    message?: string;
  } | undefined>(undefined);

  /* ==========================================================================
   * SECTION 3: SHARED REFS & SOCKET CONNECTION
   * ======================================================================== */

  const draftBaseRef = useRef<string>("");
  const speakDoneRef = useRef<(() => void) | null>(null);
  const bootedRef = useRef(false);
  const submitAnswerRef = useRef<(text: string) => void>(() => {});

  const {
    connected: liveConnected,
    isConnecting: socketConnecting,
    error: socketError,
    emitEvent,
    onEvent,
    connect: connectSocket,
  } = useInterviewSocket({ interviewId });

  // Re-attempt socket connection when RoomData candidateToken becomes available
  useEffect(() => {
    const candidateTok = (RoomData as any)?.candidateToken;
    if (candidateTok && !liveConnected) {
      connectSocket();
    }
  }, [RoomData, liveConnected, connectSocket]);

  // Debug: log socket connection state changes (use warn instead of error to prevent Next.js dev overlay)
  useEffect(() => {
    if (socketConnecting) {
      console.log("[SOCKET] 🔄 Connecting to socket server...");
    }
    if (socketError) {
      console.warn("[SOCKET] ⚠️ Connection warning:", socketError);
    }
    if (liveConnected) {
      console.log("[SOCKET] ✅ Connected! liveConnected =", liveConnected);
    }
  }, [liveConnected, socketConnecting, socketError]);

  /* ==========================================================================
   * SECTION 4: AUDIO / TEXT-TO-SPEECH
   * ======================================================================== */

  const { speakQuestion, stopSpeaking } = useInterviewAudio({
    selectedVoice,
    setIsAISpeaking,
    speakDoneRef,
  });

  /* ==========================================================================
   * SECTION 5: AUDIO RECORDER & SILENCE COUNTDOWN
   * ======================================================================== */

  const handleSubmitAnswerRef = useRef<(blob?: Blob | null) => void>(() => {});

  const {
    isRecording,
    currentVolume,
    startRecording,
    stopRecording,
    cleanupAudio,
  } = useAudioRecorder({
    stream,
    onAutoSubmit: async (blob) => {
      console.log("%c⏱️ [AUTO-SUBMIT]: Submitting recorded audio blob...", "color: #10b981", blob?.size);
      handleSubmitAnswerRef.current(blob);
    },
  });

  // Speech Recognition (fallback or auxiliary for Career Discovery)
  const {
    startListening: startSpeechRecognition,
    toggleListening: toggleSpeechRecognition,
    abortRecognition,
  } = useInterviewSpeechRecognition({
    stopSpeaking,
    submitAnswerRef,
    draftBaseRef,
    interviewLanguage: RoomData?.interviewLanguage,
    setMicEnabled,
  });

  // Unified listening handler prioritizing Audio Recording in Standard Interviews
  const startListening = useCallback(async () => {
    stopSpeaking();
    setMicEnabled?.(true, "startListening");
    useInterviewStore.getState().setPhase("listening");
    useInterviewStore.getState().setIsListening(true);

    if (isCareerDiscovery) {
      startSpeechRecognition();
    }
    await startRecording();
  }, [isCareerDiscovery, setMicEnabled, startRecording, startSpeechRecognition, stopSpeaking]);

  const toggleListening = useCallback(async () => {
    if (isRecording || isListening) {
      // Manual finish by candidate -> produce audio blob and submit
      const blob = await stopRecording();
      if (isCareerDiscovery) {
        abortRecognition();
      }
      useInterviewStore.getState().setIsListening(false);
      handleSubmitAnswerRef.current(blob);
    } else {
      await startListening();
    }
  }, [abortRecognition, isCareerDiscovery, isListening, isRecording, startListening, stopRecording]);

  // Ensure recorder is strictly stopped when AI is speaking (zero echo)
  useEffect(() => {
    if (phase === "speaking") {
      stopRecording();
      if (isCareerDiscovery) {
        abortRecognition();
      }
    }
  }, [abortRecognition, isCareerDiscovery, phase, stopRecording]);

  const onUserSubmitAnswer = useCallback(async () => {
    const blob = await stopRecording();
    if (isCareerDiscovery) {
      abortRecognition();
    }
    handleSubmitAnswerRef.current(blob);
  }, [abortRecognition, isCareerDiscovery, stopRecording]);

  /* ==========================================================================
   * SECTION 6: DOMAIN FLOW (question / answer orchestration)
   * ======================================================================== */

  const {
    displayedQuestion,
    isTyping,
    onAskQuestion,
    requestNextQuestion,
    submitAnswerWithText,
    replayQuestion,
    handleSubmitAnswer,
    handleSkipQuestion,
    handleFinishInterview,
    toQuestionItem,
  } = useInterviewFlow({
    interviewId,
    liveConnected,
    emitEvent,
    draftBaseRef,
    speakDoneRef,
    startListening,
    stopSpeaking,
    speakQuestion,
    abortRecognition,
    selectedVoice,
    languageRef,
    router,
    stopStream,
    setMicEnabled,
    flushViolations,
    pullPendingViolations,
    isCareerDiscovery,
  });

  handleSubmitAnswerRef.current = handleSubmitAnswer;
  // Wire up the submit answer ref so STT can call it
  submitAnswerRef.current = submitAnswerWithText;

  /* ==========================================================================
   * SECTION 7: SOCKET SUBSCRIPTIONS (Encapsulated Hook)
   * ======================================================================== */

  useInterviewSocketSubscriptions({
    interviewId,
    onEvent,
    toQuestionItem,
    onAskQuestion,
    handleFinishInterview,
    modeInfo,
    router,
  });

  /* ==========================================================================
   * SECTION 8: INITIAL LOAD / RESUME
   * ======================================================================== */

  useEffect(() => {
    if (!RoomData || bootedRef.current) return;

    // If the interview was already completed, jump straight to tasks or report
    if (RoomData.status === "Completed") {
      router.replace(getInterviewRedirectUrl(modeInfo, interviewId));
      return;
    }
    bootedRef.current = true;

    const storeState = useInterviewStore.getState();
    const qs: any[] = RoomData.questions ?? [];
    const formatted: QuestionItem[] = qs
      .map((q: any) => {
        const existing =
          storeState.questionList.find((x) => x.id === String(q.id)) ||
          (storeState.currentQuestion?.id === String(q.id) ? storeState.currentQuestion : null) ||
          (storeState.nextQuestion?.id === String(q.id) ? storeState.nextQuestion : null);

        return formatToQuestionItem(q, {
          existingAudio: existing?.questionAudio,
        });
      })
      .filter((q): q is QuestionItem => q !== null);

    useInterviewStore.getState().setQuestionList(formatted);

    const pending = formatted.find((q) => !q.isAnswered);
    console.log(
      "%c🚪 [ROOM BOOT] Initializing room from RoomData:",
      "background: #475569; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      {
        roomStatus: RoomData.status,
        dbQuestionsCount: qs.length,
        pendingQuestionToAsk: pending ? { id: pending.id, order: pending.questionOrder } : null,
      }
    );

    if (pending) {
      setAnswerText("");
      onAskQuestion(pending, true, true);
    } else {
      requestNextQuestion();
    }
  }, [RoomData, interviewId, router, setAnswerText, onAskQuestion, requestNextQuestion, modeInfo]);

  /* ==========================================================================
   * SECTION 9: INTEGRITY / PROCTORING / TIMER
   * ======================================================================== */

  useIntegrityMonitor({
    interviewId,
    onViolation: (event: IntegrityEvent) => {
      setWarningCount((prev) => prev + 1);

      const mappedViolation = event.type.startsWith("camera")
        ? ("CAMERA_DISCONNECTED" as const)
        : ("MICROPHONE_DISCONNECTED" as const);

      addViolation({
        violationType: mappedViolation,
        category: "System_Issue",
        details: `Integrity monitor triggered: ${event.type}`,
        description: "Hardware or system integrity event detected.",
        systemResponse: "Logged hardware integrity event.",
      });
    },
  });

  const { formattedTime } = useInterviewTimer({
    endTimeIso: RoomData?.endTime,
    durationMinutes: RoomData?.duration,
    onExpire: handleFinishInterview,
  });

  useInterviewProtection({
    isEnabled: true,
    onTabSwitch: () => {
      setWarningCount((prev) => prev + 1);

      addViolation({
        violationType: "TAB_SWITCH",
        category: "Intentional",
        details: "User switched browser tabs or minimized the window.",
        description: "Tab switch detected during active interview.",
        systemResponse: "Recorded tab switch event.",
        isCheating: true,
      });
    },
  });

  const handleProctoringStatusChange = useCallback(
    (status: { hasViolation: boolean; statusMessage?: string }) => {
      setProctoringStatus((prev) => {
        if (
          prev?.hasViolation === status.hasViolation &&
          prev?.message === status.statusMessage
        ) {
          return prev;
        }
        return {
          hasViolation: status.hasViolation,
          message: status.statusMessage,
        };
      });
    },
    []
  );

  const handleCameraViolation = useCallback(
    (v: { message: string }) => {
      setWarningCount((prev) => prev + 1);

      let mappedType: any = "SYSTEM_ISSUE";
      if (v.message.toLowerCase().includes("multiple faces")) {
        mappedType = "MULTIPLE_FACES_DETECTED";
      } else if (v.message.toLowerCase().includes("no face")) {
        mappedType = "FACE_NOT_DETECTED";
      }

      addViolation({
        violationType: mappedType,
        category:
          mappedType === "MULTIPLE_FACES_DETECTED"
            ? "Intentional"
            : "Unintentional",
        details: v.message,
        description: "Camera violation detected by model.",
        systemResponse: "Recorded camera proctoring violation.",
        isCheating: mappedType === "MULTIPLE_FACES_DETECTED",
      });
    },
    [addViolation]
  );

  /* ==========================================================================
   * SECTION 10: EARLY RETURNS (Modularized States)
   * ======================================================================== */

  if (isLoading) {
    return <RoomLoadingState />;
  }

  if (isError) {
    return (
      <RoomErrorState
        errorMessage={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (RoomData?.status === "Completed" && isCandidateSession) {
    return <CandidateCompletedState />;
  }

  /* ==========================================================================
   * SECTION 11: RENDER (Cinematic World-Class AI Conversational Layout)
   * ======================================================================== */

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-background text-foreground flex flex-col font-sans w-full lg:overflow-hidden select-none">
      {/* 11a. Top Header Bar */}
      <InterviewHeader
        RoomData={RoomData}
        liveConnected={liveConnected}
        warningCount={warningCount}
        formattedTime={formattedTime}
        isFinishing={isFinishing}
        handleFinishInterview={handleFinishInterview}
      />

      {/* 11b. Ultra-Slim Question Bar (Question counter, dots, topics, replay) */}
      <QuestionTopBar
        currentQuestion={currentQuestion}
        questionList={questionList}
        replayQuestion={replayQuestion}
        isAISpeaking={isAISpeaking}
        proctoringStatus={proctoringStatus}
        isCareerDiscovery={isCareerDiscovery}
        interviewLanguage={RoomData?.interviewLanguage}
      />

      {/* 11c. Main Conversational Stage (Focused Center + Top-Left PiP) */}
      <div className="relative flex-1 w-full max-w-5xl mx-auto px-3 sm:px-5 py-2 flex flex-col justify-between items-center min-h-0 overflow-hidden">
        
        {/* Top-Left Floating Candidate Webcam (PiP Card) */}
        <div
          className={cn(
            "absolute top-2 left-3 sm:top-3 sm:left-5 z-20 w-40 sm:w-52 md:w-56 aspect-video rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300",
            proctoringStatus?.hasViolation
              ? "ring-2 ring-red-500 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.55)] animate-pulse"
              : "border border-border/50 bg-muted/40 shadow-xl"
          )}
        >
          {!isFinishing && (
            <div className="w-full h-full">
              <CameraPreview
                isRoomInterview={true}
                onProctoringStatusChange={handleProctoringStatusChange}
                onCameraViolation={handleCameraViolation}
              />
            </div>
          )}
        </div>

        {/* Center Stage: Circular AI Avatar + Borderless Question Subtitles */}
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-1 sm:gap-3 my-auto z-10">
          {/* Circular AI Avatar with soundwave pulse rings */}
          <AIAvatarStage
            aiPersonaName={aiPersonaName}
            selectedVoice={selectedVoice}
            isAISpeaking={isAISpeaking}
            isGeneratingQuestion={isGeneratingQuestion}
            isListening={isListening}
            isSubmittingAnswer={isSubmittingAnswer}
          />

          {/* Borderless World-Class Question Subtitles */}
          <QuestionDisplayCard
            currentQuestion={currentQuestion}
            displayedQuestion={displayedQuestion}
            isTyping={isTyping}
            isCareerDiscovery={isCareerDiscovery}
            onRetryQuestion={requestNextQuestion}
            onSkipQuestion={handleSkipQuestion}
          />
        </div>

        {/* Bottom Stage: Candidate Response Workspace with Radial Countdown Mic */}
        <div className="w-full max-w-3xl shrink-0 z-10 pb-1">
          <CandidateResponseWorkspace
            toggleListening={toggleListening}
            handleSubmitAnswer={onUserSubmitAnswer}
            handleSkipQuestion={handleSkipQuestion}
            isCareerDiscovery={isCareerDiscovery}
            currentVolume={currentVolume}
          />
        </div>
      </div>

      {/* 11d. Unified Transition Screen upon completion */}
      <LiveReportOverlay
        isFinishing={isFinishing}
        liveConnected={liveConnected}
      />
    </div>
  );
}
