"use client";

/* ============================================================================
 * SECTION 0: IMPORTS & TYPES
 * ========================================================================== */

import { useGetInterveiwRoom } from "@/features/interview/hooks/ReactQueryHooks/useGetInterviewRoom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { useInterviewTimer } from "@/shared/hook/useInterviewTimer";
import { useInterviewProtection } from "@/features/interview/hooks/useInterviewProtection";
import { useViolationsManager } from "@/features/interview/hooks/useViolationsManager";
import CameraPreview from "@/features/interview/components/setup-component/CameraPreview";
import { InterviewHeader } from "@/features/interview/components/session-component/InterviewHeader";
import { AIAvatarStage } from "@/features/interview/components/session-component/AIAvatarStage";
import { QuestionDisplayCard } from "@/features/interview/components/session-component/QuestionDisplayCard";
import { CandidateResponseWorkspace } from "@/features/interview/components/session-component/CandidateResponseWorkspace";
import { InterviewSidebar } from "@/features/interview/components/session-component/InterviewSidebar";
import { LiveReportOverlay } from "@/features/interview/components/session-component/LiveReportOverlay";
import { useInterviewAudio } from "@/features/interview/hooks/useInterviewAudio";
import { useInterviewSpeechRecognition } from "@/features/interview/hooks/useInterviewSpeechRecognition";
import { useInterviewFlow } from "@/features/interview/hooks/useInterviewFlow";
import { useInterviewStore } from "@/features/interview/store/useInterviewStore";
import { formatToQuestionItem } from "@/features/interview/utils/questionMapper";
import { Phase, QuestionItem } from "@/features/interview/types";
import { useIntegrityMonitor, IntegrityEvent } from "@/shared/hook/useIntegrityMonitor";
import {
  useInterviewSocket,
  QuestionNewPayload,
  SummaryDonePayload,
  SocketErrorPayload,
} from "@/shared/hook/useInterviewSocket";
import { useMediaStream, stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InterviewSessionClientProps {
  interviewId: string;
}

export default function InterviewSessionClient({ interviewId }: InterviewSessionClientProps) {
  const router = useRouter();
  // Media stream and violation hooks
  const { stopStream, setMicEnabled } = useMediaStream();
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

  const languageRef = useRef<string>("English");
  useEffect(() => {
    if (RoomData?.interviewLanguage) {
      languageRef.current = RoomData.interviewLanguage;
    }
  }, [RoomData?.interviewLanguage]);

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
   * ----------------------------------------------------------------------
   * The core state is now managed globally by useInterviewStore.
   * ======================================================================== */

  const {
    phase,
    currentQuestion,
    questionList,
    answerText,
    isAISpeaking,
    isListening,
    submissionError,
    setAnswerText,
    setIsAISpeaking,
    setSubmissionError,
  } = useInterviewStore();

  const isGeneratingQuestion = phase === "generating";
  const isSubmittingAnswer = phase === "processing";
  const isFinishing = phase === "closing";



  // Integrity / proctoring state
  const [warningCount, setWarningCount] = useState<number>(0);

  // Live socket text (used only during report generation)
  const [reportLiveText, setReportLiveText] = useState<string>("");

  // Live socket text (used during question generation)
  const [questionLiveText, setQuestionLiveText] = useState<string>("");



  /* ==========================================================================
   * SECTION 3: SHARED REFS
   * ----------------------------------------------------------------------
   * These refs exist so callbacks (speech recognition events, socket
   * callbacks, audio "onended" handlers) can always read the *latest*
   * value without being re-created / re-subscribed on every render.
   * ======================================================================== */

  // Snapshot of text that existed before live transcription started, so we
  // don't wipe user's typed text or duplicate interim results.
  const draftBaseRef = useRef<string>("");

  // Callback fired when Sara finishes reading a question out loud —
  // wired to auto-open the mic when the flow is live.
  const speakDoneRef = useRef<(() => void) | null>(null);

  // Booted flag so the initial-load effect only runs once
  const bootedRef = useRef(false);

  // Flow refs hoisted to break cyclic dependencies between STT and Flow hooks
  const submitAnswerRef = useRef<(text: string) => void>(() => {});

  /* ==========================================================================
   * SECTION 3.5: SOCKET CONNECTION
   * ----------------------------------------------------------------------
   * Declared early (before Section 6/7) because `liveConnected` and
   * `emitEvent` are read inside useCallback dependency arrays below —
   * those arrays are evaluated immediately during render, so the values
   * must already exist. The actual event *subscriptions* (joining the
   * room, listening for question/answer/summary events) live in Section 7,
   * grouped with the rest of the socket wiring.
   * ======================================================================== */

  const {
    connected: liveConnected,
    isConnecting: socketConnecting,
    error: socketError,
    emitEvent,
    onEvent,
    disconnect: disconnectSocket,
  } = useInterviewSocket({ interviewId });

  /* ==========================================================================
   * SECTION 4: AUDIO / TEXT-TO-SPEECH
   * ----------------------------------------------------------------------
   * Everything related to Sara "speaking" a question out loud.
   * ======================================================================== */

  const { makeAudioUrl, speakQuestion, stopSpeaking } = useInterviewAudio({
    selectedVoice,
    setIsAISpeaking,
    speakDoneRef,
  });

  /* ==========================================================================
   * SECTION 5: SPEECH-TO-TEXT (microphone / SpeechRecognition)
   * ----------------------------------------------------------------------
   * Everything related to capturing the candidate's spoken answer.
   * ======================================================================== */

  const {
    startListening,
    toggleListening,
    forceStopRecognition,
    abortRecognition,
  } = useInterviewSpeechRecognition({
    stopSpeaking,
    submitAnswerRef,
    draftBaseRef,
    interviewLanguage: RoomData?.interviewLanguage,
    setMicEnabled,
  });

  /* ==========================================================================
   * SECTION 6: DOMAIN FLOW (question / answer orchestration)
   * ----------------------------------------------------------------------
   * The actual interview "script": ask a question, speak it, listen for
   * the answer, submit it, ask the next one. This is where Sections 4
   * (audio) and 5 (STT) get wired together via phase transitions.
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
    setSubmissionError,
    speakDoneRef,
    startListening,
    stopSpeaking,
    speakQuestion,
    forceStopRecognition,
    abortRecognition,
    makeAudioUrl,
    setQuestionLiveText,
    setReportLiveText,
    selectedVoice,
    languageRef,
    router,
    stopStream,
    disconnectSocket,
    setMicEnabled,
    flushViolations,
    pullPendingViolations,
  });

  // Wire up the submit answer ref so STT can call it
  submitAnswerRef.current = submitAnswerWithText;

  /* ==========================================================================
   * SECTION 7: SOCKET WIRING (event subscriptions)
   * ----------------------------------------------------------------------
   * `liveConnected` / `emitEvent` / `onEvent` themselves come from
   * Section 3.5 (declared early so Section 6 can use them). This section
   * is just the effect that joins the room and subscribes to
   * server-pushed events.
   * ======================================================================== */

  // Debug: log socket connection state changes
  useEffect(() => {
    if (socketConnecting) {
      console.log("[SOCKET] 🔄 Connecting to socket server...");
    }
    if (socketError) {
      console.error("[SOCKET] ❌ Connection error:", socketError);
    }
    if (liveConnected) {
      console.log("[SOCKET] ✅ Connected! liveConnected =", liveConnected);
    }
  }, [liveConnected, socketConnecting, socketError]);

  const handledQuestionIdsRef = useRef<Set<string | number>>(new Set());

  useEffect(() => {
    if (!interviewId) return;

    const offs = [
      onEvent<QuestionNewPayload>("question:new", ({ question }) => {
        console.debug(
          `[${useInterviewStore.getState().phase}][question:new] received id: ${question.questionId}, current q: ${useInterviewStore.getState().currentQuestion?.id}`
        );
        const currentPhase = useInterviewStore.getState().phase;
        if (currentPhase === "closing") {
          console.debug(`[${currentPhase}][question:new] ignored (closing) id: ${question.questionId}`);
          return;
        }
        if (useInterviewStore.getState().currentQuestion?.id === String(question.questionId)) {
          console.debug(`[${currentPhase}][question:new] ignored (same as current) id: ${question.questionId}`);
          return;
        }
        if (handledQuestionIdsRef.current.has(question.questionId)) {
          console.debug(`[${currentPhase}][question:new] ignored (already handled) id: ${question.questionId}`);
          return;
        }
        
        handledQuestionIdsRef.current.add(question.questionId);
        setQuestionLiveText(""); // Clear stream text when done
        
        const newQ = toQuestionItem(question);
        useInterviewStore.getState().addQuestion(newQ);
        useInterviewStore.getState().setNextQuestion(newQ);

        console.log(
          "%c📥 [SOCKET question:new] Buffered new incoming question into nextQuestion:",
          "background: #0d9488; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
          {
            newQuestionId: newQ.id,
            order: newQ.questionOrder,
            questionText: newQ.question,
            hasAudio: !!newQ.questionAudio,
            currentPhase: useInterviewStore.getState().phase,
          }
        );
        
        if (useInterviewStore.getState().phase === "generating") {
          console.log("⚡ [RECOVER FROM GENERATING] Asking newly arrived question immediately!");
          onAskQuestion(newQ, true, true);
        }
      }),
      onEvent<{ text: string }>("question:stream", ({ text }) => {
        setQuestionLiveText((prev) => prev + text);
      }),
      onEvent<SocketErrorPayload>("question:error", ({ message }) => {
        console.log("[SOCKET] question:error:", message);
        if (useInterviewStore.getState().phase === "generating") useInterviewStore.getState().setPhase("idle");
        toast.error(message || "Failed to generate next question");
      }),
      onEvent<SocketErrorPayload>("answer:error", ({ message }) => {
        console.log("[SOCKET] answer:error:", message);
        if (useInterviewStore.getState().phase === "processing") useInterviewStore.getState().setPhase("idle");
        toast.error(message || "Failed to save answer");
      }),
      onEvent<SocketErrorPayload>("summary:error", ({ message }) => {
        console.log("[SOCKET] summary:error:", message);
        toast.dismiss();
        useInterviewStore.getState().setPhase("idle");
        toast.error(message || "Error generating report");
      }),
      onEvent<{ text: string }>("summary:stream", ({ text }) => {
        setReportLiveText((prev) => prev + text);
      }),
      onEvent<SummaryDonePayload>("summary:done", () => {
        console.log("[SOCKET] summary:done received");
        setReportLiveText("");
        useInterviewStore.getState().setPhase("idle");
        stopGlobalMediaStream();
        toast.dismiss();
        toast.success("Interview completed! Loading your evaluation report...");
        setTimeout(() => {
          router.replace(`/dashboard/interviewDetails?id=${interviewId}`);
        }, 300);
      }),
    ];

    return () => {
      offs.forEach((off) => off());
    };
  }, [interviewId, emitEvent, onEvent, router, onAskQuestion, toQuestionItem]);

  /* ==========================================================================
   * SECTION 8: FINISH / CLOSE INTERVIEW
   * ======================================================================== */

  // handleFinishInterview is now fully encapsulated inside useInterviewFlow

  /* ==========================================================================
   * SECTION 9: INITIAL LOAD / RESUME
   * ----------------------------------------------------------------------
   * Runs once RoomData arrives: redirect if already completed, otherwise
   * either resume the last unanswered question or kick off question #1.
   * ======================================================================== */

  useEffect(() => {
    if (!RoomData || bootedRef.current) return;

    // If the interview was already completed, jump straight to the report
    if (RoomData.status === "Completed") {
      router.replace(`/dashboard/interviewDetails?id=${interviewId}`);
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
        storeCurrentQuestion: storeState.currentQuestion
          ? { id: storeState.currentQuestion.id, order: storeState.currentQuestion.questionOrder }
          : null,
        storeNextQuestion: storeState.nextQuestion
          ? { id: storeState.nextQuestion.id, order: storeState.nextQuestion.questionOrder }
          : null,
        pendingQuestionToAsk: pending ? { id: pending.id, order: pending.questionOrder } : null,
      }
    );
    if (pending) {
      // Resume: Sara re-reads the unanswered question via TTS, then the mic opens
      setAnswerText("");
      onAskQuestion(pending, true, true);
    } else {
      // Fresh interview (or all questions answered) -> start the next one
      requestNextQuestion();
    }
  }, [RoomData, interviewId, router, setAnswerText, onAskQuestion, requestNextQuestion, emitEvent]);

  /* ==========================================================================
   * SECTION 10: INTEGRITY / PROCTORING / TIMER
   * ======================================================================== */

  useIntegrityMonitor({
    interviewId,
    onViolation: (event: IntegrityEvent) => {
      setWarningCount((prev) => prev + 1);
      toast.warning(`Integrity Notice: Hardware event detected (${event.type})`);
      
      const mappedViolation = event.type.startsWith("camera")
        ? ("CAMERA_DISCONNECTED" as const)
        : ("MICROPHONE_DISCONNECTED" as const);

      addViolation({
        violationType: mappedViolation,
        category: "System_Issue",
        details: `Integrity monitor triggered: ${event.type}`,
        description: "Hardware or system integrity event detected.",
        systemResponse: "Warned user and logged event.",
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
      toast.error("Proctoring Warning: Please do not switch tabs or minimize the browser during the interview!");
      
      addViolation({
        violationType: "TAB_SWITCH",
        category: "Intentional",
        details: "User switched browser tabs or minimized the window.",
        description: "Tab switch detected during active interview.",
        systemResponse: "Displayed error toast to user.",
        isCheating: true,
      });
    },
  });

  /* ==========================================================================
   * SECTION 11: EARLY RETURNS (loading / error states)
   * ======================================================================== */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading interview room and connecting to AI interviewer...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-3" />
        <h2 className="text-lg font-bold text-destructive">Failed to load interview session</h2>
        <p className="text-xs text-muted-foreground mt-1">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ==========================================================================
   * SECTION 12: RENDER (UI)
   * ----------------------------------------------------------------------
   * 12a. Header (status / timer / end button)
   * 12b. AI avatar + candidate webcam
   * 12c. Question display card
   * 12d. Candidate answer workspace
   * 12e. Sidebar (skills / history / proctoring rules)
   * 12f. Finishing / report-generation overlay
   * ======================================================================== */

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans w-full">
      {/* 12a. Top Header Bar */}
      <InterviewHeader
        RoomData={RoomData}
        liveConnected={liveConnected}
        warningCount={warningCount}
        formattedTime={formattedTime}
        isFinishing={isFinishing}
        handleFinishInterview={handleFinishInterview}
      />

      {/* 2. Main Workspace (Dual Column / Split-Screen Layout) */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full">
        
        {/* =========================================================
            LEFT COLUMN: CANDIDATE (YOU)
            ========================================================= */}
        <div className="flex flex-col gap-6 w-full h-full">
          {/* Candidate Webcam (Top) */}
          <div className="h-[320px] w-full flex items-center justify-center relative bg-muted/20 rounded-[2rem] shadow-inner overflow-hidden border border-border/30">
            {!isFinishing && (
              <div className="absolute inset-0 w-full h-full">
                <CameraPreview
                  isRoomInterview={true}
                  onCameraViolation={(v) => {
                    setWarningCount((prev) => prev + 1);
                    toast.warning(`Proctoring Notice: ${v.message}`);
                    
                    let mappedType: any = "SYSTEM_ISSUE";
                    if (v.message.toLowerCase().includes("multiple faces")) mappedType = "MULTIPLE_FACES_DETECTED";
                    else if (v.message.toLowerCase().includes("no face")) mappedType = "FACE_NOT_DETECTED";

                    addViolation({
                      violationType: mappedType,
                      category: mappedType === "MULTIPLE_FACES_DETECTED" ? "Intentional" : "Unintentional",
                      details: v.message,
                      description: "Camera violation detected by model.",
                      systemResponse: "Displayed warning toast.",
                      isCheating: mappedType === "MULTIPLE_FACES_DETECTED",
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* Candidate Workspace / Text (Bottom) */}
          <div className="flex-1 min-h-[250px] flex flex-col justify-start">
            <CandidateResponseWorkspace
              isListening={isListening}
              isSubmittingAnswer={isSubmittingAnswer}
              toggleListening={toggleListening}
              answerText={answerText}
              setAnswer={setAnswerText}
              submissionError={submissionError}
              handleSubmitAnswer={handleSubmitAnswer}
              handleSkipQuestion={handleSkipQuestion}
              isGeneratingQuestion={isGeneratingQuestion}
            />
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: AI INTERVIEWER (SARA)
            ========================================================= */}
        <div className="flex flex-col gap-6 w-full h-full">
          {/* AI Avatar (Top) */}
          <div className="h-[320px] w-full flex items-center justify-center relative bg-muted/20 rounded-[2rem] border border-border/30 shadow-inner overflow-hidden">
            <AIAvatarStage
              aiPersonaName={aiPersonaName}
              selectedVoice={selectedVoice}
              isAISpeaking={isAISpeaking}
              currentQuestion={currentQuestion}
              isGeneratingQuestion={isGeneratingQuestion}
              isListening={isListening}
              isSubmittingAnswer={isSubmittingAnswer}
              stopSpeaking={stopSpeaking}
              replayQuestion={replayQuestion}
            />
          </div>

          {/* AI Speech Bubble (Bottom) */}
          <div className="flex-1 min-h-[250px] flex flex-col justify-start">
            <QuestionDisplayCard
              currentQuestion={currentQuestion}
              questionList={questionList}
              replayQuestion={replayQuestion}
              isGeneratingQuestion={isGeneratingQuestion}
              questionLiveText={questionLiveText}
              displayedQuestion={displayedQuestion}
              isTyping={isTyping}
            />
          </div>
        </div>

      </div>

      {/* 12f. Live report generation overlay */}
      <LiveReportOverlay
        isFinishing={isFinishing}
        liveConnected={liveConnected}
        reportLiveText={reportLiveText}
      />
    </div>
  );
}
