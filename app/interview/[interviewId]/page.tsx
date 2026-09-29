"use client";

/* ============================================================================
 * SECTION 0: IMPORTS & TYPES
 * ========================================================================== */

import { useGetInterveiwRoom } from "@/features/interview/hooks/ReactQueryHooks/useGetInterviewRoom";
import { use, useEffect, useRef, useState, useCallback } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { useInterviewTimer } from "@/shared/hook/useInterviewTimer";
import { useInterviewProtection } from "@/features/interview/hooks/useInterviewProtection";
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

interface PageProps {
  params: Promise<{ interviewId: string }>;
}

export default function InterviewSessionPage({ params }: PageProps) {
  const { interviewId } = use(params);
  const router = useRouter();
  const { stopStream, ensureStreamActive } = useMediaStream();

  // Ensure webcam and mic are active upon entering the interview room
  useEffect(() => {
    ensureStreamActive().catch(() => { });
  }, [ensureStreamActive]);

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
   * SECTION 2: CORE STATE + PHASE STATE MACHINE
   * ----------------------------------------------------------------------
   * This is the "brain" of the page. Everything else (audio, STT, socket,
   * domain flow) reads/writes `phase` through `transition()`.
   *
   * idle -> generating -> speaking -> listening -> processing -> (loop)
   *                                                            -> closing
   * ======================================================================== */

  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");

  // Question/answer domain state
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [answerText, setAnswerText] = useState<string>("");

  // Derived UI flags (kept in sync with `phase` by transition())
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState<boolean>(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Integrity / proctoring state
  const [warning, setWarning] = useState<IntegrityEvent | null>(null);
  const [warningCount, setWarningCount] = useState<number>(0);

  // Live socket text (used only during report generation)
  const [reportLiveText, setReportLiveText] = useState<string>("");

  // Live socket text (used during question generation)
  const [questionLiveText, setQuestionLiveText] = useState<string>("");

  // Error state for answer submission resilience
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const transition = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
    setIsGeneratingQuestion(next === "generating");
    setIsSubmittingAnswer(next === "processing");
    setIsFinishing(next === "closing");
    setIsAISpeaking(next === "speaking");
    setIsListening(next === "listening");
  }, []);

  /* ==========================================================================
   * SECTION 3: SHARED REFS
   * ----------------------------------------------------------------------
   * These refs exist so callbacks (speech recognition events, socket
   * callbacks, audio "onended" handlers) can always read the *latest*
   * value without being re-created / re-subscribed on every render.
   * ======================================================================== */

  // The audio and STT refs have been moved to their respective hooks.

  // Snapshot of text that existed before live transcription started, so we
  // don't wipe user's typed text or duplicate interim results.
  const draftBaseRef = useRef<string>("");

  // Latest answer text (kept in sync with answerText state and cached in sessionStorage)
  const answerTextRef = useRef<string>("");
  const setAnswer = useCallback((text: string) => {
    answerTextRef.current = text;
    setAnswerText(text);
    const q = currentQuestionRef.current;
    if (q?.id && typeof window !== "undefined") {
      try {
        if (text.trim()) {
          sessionStorage.setItem(`interview_draft_${q.id}`, text);
        } else {
          sessionStorage.removeItem(`interview_draft_${q.id}`);
        }
      } catch { }
    }
  }, []);

  // Latest current question (kept in sync with currentQuestion state)
  const currentQuestionRef = useRef<QuestionItem | null>(null);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Lock to avoid double submission
  const isSubmittingRef = useRef<boolean>(false);

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
    transition,
    phaseRef,
    isSubmittingRef,
    setIsListening,
    answerTextRef,
    stopSpeaking,
    submitAnswerRef,
    setAnswer,
    draftBaseRef,
    interviewLanguage: RoomData?.interviewLanguage,
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
    transition,
    phaseRef,
    isSubmittingRef,
    currentQuestionRef,
    setCurrentQuestion,
    setQuestionList,
    answerTextRef,
    setAnswer,
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
    currentQuestion,
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

  // Explicit room join guard — the hook auto-joins via interviewId option,
  // but this ensures the room is joined even after a reconnect.
  useEffect(() => {
    if (!interviewId || !liveConnected) return;
    console.log("[SOCKET] Joining room:", interviewId);
    emitEvent("interview:join", { interviewId });
  }, [interviewId, liveConnected, emitEvent]);

  useEffect(() => {
    if (!interviewId) return;

    const offs = [
      onEvent<QuestionNewPayload>("question:new", ({ question }) => {
        console.log("[SOCKET] question:new received, id:", question.questionId);
        setQuestionLiveText(""); // Clear stream text when done
        onAskQuestion(toQuestionItem(question), true, true);
      }),
      onEvent<{ text: string }>("question:stream", ({ text }) => {
        setQuestionLiveText((prev) => prev + text);
      }),
      onEvent<SocketErrorPayload>("question:error", ({ message }) => {
        console.log("[SOCKET] question:error:", message);
        if (phaseRef.current === "generating") transition("idle");
        toast.error(message || "Failed to generate next question");
      }),
      onEvent<SocketErrorPayload>("answer:error", ({ message }) => {
        console.log("[SOCKET] answer:error:", message);
        if (phaseRef.current === "processing") transition("idle");
        toast.error(message || "Failed to save answer");
      }),
      onEvent<SocketErrorPayload>("summary:error", ({ message }) => {
        console.log("[SOCKET] summary:error:", message);
        toast.dismiss();
        transition("idle");
        toast.error(message || "Error generating report");
      }),
      onEvent<{ text: string }>("summary:stream", ({ text }) => {
        setReportLiveText((prev) => prev + text);
      }),
      onEvent<SummaryDonePayload>("summary:done", () => {
        console.log("[SOCKET] summary:done received");
        setReportLiveText("");
        transition("idle");
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
  }, [interviewId, emitEvent, onEvent, transition, router, onAskQuestion, toQuestionItem]);

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

    const qs: any[] = RoomData.questions ?? [];
    const formatted: QuestionItem[] = qs.map((q: any) => ({
      id: String(q.id),
      question: q.questionText,
      questionOrder: q.questionOrder,
      isAnswered: q.isAnswered,
    }));
    setQuestionList(formatted);

    const pending = formatted.find((q) => !q.isAnswered);
    console.log("[BOOT] status:", RoomData.status, "qs:", formatted.length, "pending:", !!pending);
    if (pending) {
      // Resume: Sara re-reads the unanswered question, then the mic opens
      setAnswer("");
      onAskQuestion(pending, false, true);
    } else {
      // Fresh interview (or all questions answered) -> start the next one
      requestNextQuestion();
    }
  }, [RoomData, interviewId, router, setAnswer, onAskQuestion, requestNextQuestion]);

  /* ==========================================================================
   * SECTION 10: INTEGRITY / PROCTORING / TIMER
   * ======================================================================== */

  useIntegrityMonitor({
    interviewId,
    onViolation: (event: IntegrityEvent) => {
      setWarning(event);
      setWarningCount((prev) => prev + 1);
      toast.warning(`Integrity Notice: Hardware event detected (${event.type})`);
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

      {/* 2. Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Main Stage (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* 12b. Dual Stage: AI Avatar & Candidate Video Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[260px] h-[300px]">
            {/* AI Avatar */}
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

            {/* Candidate Webcam Feed */}
            <div className="w-full h-full">
              {!isFinishing && (
                <CameraPreview
                  isRoomInterview={true}
                  onCameraViolation={(v) => {
                    setWarningCount((prev) => prev + 1);
                    toast.warning(`Proctoring Notice: ${v.message}`);
                  }}
                />
              )}
            </div>
          </div>

          {/* 12c. Question Display Card */}
          <QuestionDisplayCard
            currentQuestion={currentQuestion}
            questionList={questionList}
            replayQuestion={replayQuestion}
            isGeneratingQuestion={isGeneratingQuestion}
            questionLiveText={questionLiveText}
            displayedQuestion={displayedQuestion}
            isTyping={isTyping}
          />

          {/* 12d. Candidate Response Workspace */}
          <CandidateResponseWorkspace
            isListening={isListening}
            isSubmittingAnswer={isSubmittingAnswer}
            toggleListening={toggleListening}
            answerText={answerText}
            setAnswer={setAnswer}
            submissionError={submissionError}
            handleSubmitAnswer={handleSubmitAnswer}
            handleSkipQuestion={handleSkipQuestion}
            isGeneratingQuestion={isGeneratingQuestion}
          />
        </div>

        {/* 12e. Sidebar Info (4 Columns) */}
        <InterviewSidebar
          RoomData={RoomData}
          questionList={questionList}
          currentQuestion={currentQuestion}
        />
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