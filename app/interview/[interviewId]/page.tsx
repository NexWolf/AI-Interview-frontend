"use client";

import { useGetInterveiwRoom } from "@/features/interview/hooks/ReactQueryHooks/useGetInterviewRoom";
import { use, useEffect, useRef, useState, useCallback } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  SkipForward,
  CheckCircle,
  Clock,
  Award,
  ShieldAlert,
  Cpu,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Check,
  Maximize,
} from "lucide-react";
import { useInterviewTimer } from "@/shared/hook/useInterviewTimer";
import { useInterviewProtection } from "@/features/interview/hooks/useInterviewProtection";
import CameraPreview from "@/features/interview/components/setup-component/CameraPreview";
import { useIntegrityMonitor } from "@/shared/hook/useIntegrityMonitor";
import {
  useInterviewSocket,
  QuestionNewPayload,
  SummaryDonePayload,
  SocketErrorPayload,
} from "@/shared/hook/useInterviewSocket";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ interviewId: string }>;
}

interface QuestionItem {
  id: string;
  question: string;
  questionOrder: number;
  keyTopics?: string[];
  questionAudio?: string | null;
  isAnswered?: boolean;
}

type IntegrityEvent = {
  type: "camera_off" | "camera_muted" | "mic_off" | "mic_muted" | "mic_restored";
  timestamp: string;
};

export default function InterviewSessionPage({ params }: PageProps) {
  const { interviewId } = use(params);
  const router = useRouter();

  const {
    data: RoomData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInterveiwRoom(interviewId);

  // Active question state
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [answerText, setAnswerText] = useState<string>("");
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState<boolean>(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // Audio / Voice state
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [warning, setWarning] = useState<IntegrityEvent | null>(null);
  const [warningCount, setWarningCount] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  // Snapshot of text that existed before live transcription started, so we
  // don't wipe user's typed text or duplicate interim results.
  const draftBaseRef = useRef<string>("");

  // Live socket integration
  const { connected: liveConnected, emitEvent, onEvent } = useInterviewSocket();
  const [reportLiveText, setReportLiveText] = useState<string>("");
  const languageRef = useRef<string>("English");
  useEffect(() => {
    if (RoomData?.interviewLanguage) {
      languageRef.current = RoomData.interviewLanguage;
    }
  }, [RoomData?.interviewLanguage]);

  // ----------------------------------------------------------------------
  // LIVE CONVERSATION STATE MACHINE
  // ----------------------------------------------------------------------
  // The interview runs like a real back-and-forth with no button spam:
  // Sara generates a question -> reads it out loud -> the mic auto-opens ->
  // you speak -> the answer auto-submits the moment you stop -> Sara moves on.
  type Phase =
    | "idle"
    | "generating"
    | "speaking"
    | "listening"
    | "processing"
    | "closing";
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");

  const transition = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
    setIsGeneratingQuestion(next === "generating");
    setIsSubmittingAnswer(next === "processing");
    setIsFinishing(next === "closing");
    setIsAISpeaking(next === "speaking");
    setIsListening(next === "listening");
  }, []);

  // Keep latest text/values available inside socket & speech callbacks
  const answerTextRef = useRef<string>("");
  const setAnswer = useCallback((text: string) => {
    answerTextRef.current = text;
    setAnswerText(text);
  }, []);
  const currentQuestionRef = useRef<QuestionItem | null>(null);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Runs when Sara finishes reading a question (or the audio is unavailable).
  // When the flow is live we wire this to auto-open the mic for the user.
  const speakDoneRef = useRef<(() => void) | null>(null);

  // Speak question aloud using backend audio; falls back to Web Speech API.
  const speakQuestion = useCallback(
    (text: string, audioUrl?: string | null, language: string = "English") => {
      const finish = () => {
        setIsAISpeaking(false);
        const cb = speakDoneRef.current;
        speakDoneRef.current = null;
        cb?.();
      };

      if (audioUrl) {
        try {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;
          setIsAISpeaking(true);
          audio.onended = finish;
          audio.onerror = () => {
            setIsAISpeaking(false);
            speakDoneRef.current = null;
            fallbackTTS(text, language, finish);
          };
          audio.play().catch(() => {
            setIsAISpeaking(false);
            speakDoneRef.current = null;
            fallbackTTS(text, language, finish);
          });
          return;
        } catch {
          fallbackTTS(text, language, finish);
          return;
        }
      }
      fallbackTTS(text, language, finish);
    },
    [],
  );

  const fallbackTTS = (text: string, language: string, onDone?: () => void) => {
    const complete = () => {
      setIsAISpeaking(false);
      speakDoneRef.current = null;
      onDone?.();
    };
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "Arabic" ? "ar-SA" : "en-US";
      utterance.rate = 1.0;
      if (language === "Arabic") {
        // Pick the browser's Arabic voice if one exists so Arabic text is
        // never read back with an English voice.
        const voices = window.speechSynthesis.getVoices();
        const arabic = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
        if (arabic) utterance.voice = arabic;
      }
      utterance.onstart = () => setIsAISpeaking(true);
      utterance.onend = complete;
      utterance.onerror = complete;
      window.speechSynthesis.speak(utterance);
      return;
    }
    complete();
  };

  const stopSpeaking = () => {
    speakDoneRef.current = null;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsAISpeaking(false);
  };

  // ----------------------------------------------------------------------
  // LIVE FLOW HELPERS
  // ----------------------------------------------------------------------

  // base64 audio -> playable object URL (uses the real mimeType Gemini returns)
  const makeAudioUrl = (b64: string, mime: string) => {
    try {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return URL.createObjectURL(new Blob([bytes], { type: mime }));
    } catch {
      return null;
    }
  };

  // Model a freshly generated question from the socket/HTTP payload
  const toQuestionItem = (qd: any): QuestionItem => {
    const audio = qd.questionAudio
      ? makeAudioUrl(qd.questionAudio.audioBase64, qd.questionAudio.mimeType)
      : null;
    return {
      id: String(qd.questionId),
      question: qd.question,
      questionOrder: qd.questionOrder,
      keyTopics: qd.keyTopics || [],
      questionAudio: audio,
      isAnswered: false,
    };
  };

  // Ask a question: speak it, then open the mic so the user can answer
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.info("Microphone transcription is not supported in this browser. You can type your answer directly.");
      return;
    }
    transition("listening");
    try {
      recognitionRef.current.start();
    } catch {
      // recognition already active
    }
  }, [transition]);

  const onAskQuestion = useCallback(
    (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) => {
      setCurrentQuestion(q);
      setQuestionList((prev) =>
        prev.some((x) => x.id === q.id) ? prev : [...prev, q],
      );
      setAnswer("");
      draftBaseRef.current = "";
      transition("speaking");
      if (shouldSpeak) {
        const audio = q.questionAudio || null;
        if (autoListen) {
          speakDoneRef.current = () => startListening();
        } else {
          speakDoneRef.current = null;
        }
        speakQuestion(q.question, audio, languageRef.current || "English");
      } else {
        // No stored audio (e.g. resuming a paused interview) - reuse Web Speech
        speakDoneRef.current = autoListen ? () => startListening() : null;
        speakQuestion(q.question, null, languageRef.current || "English");
      }
    },
    [setAnswer, transition, speakQuestion, startListening],
  );
  const onAskQuestionRef = useRef(onAskQuestion);
  onAskQuestionRef.current = onAskQuestion;

  // Ask the backend for the next question (socket first, HTTP fallback)
  const requestNextQuestion = useCallback(() => {
    if (phaseRef.current === "generating" || phaseRef.current === "closing") return;
    transition("generating");
    stopSpeaking();

    if (liveConnected) {
      emitEvent("question:generate", { interviewId, speakQuestion: true });
      return;
    }

    AxiosAPI.post(`/api/interviews/${interviewId}/questions/generate`, {
      speakQuestion: true,
    })
      .then((res) => {
        onAskQuestionRef.current(toQuestionItem(res.data.data), true, true);
      })
      .catch((e: any) => {
        console.error("Generate question error:", e);
        transition("idle");
        toast.error(e?.response?.data?.message || "Failed to generate next question");
      });
  }, [interviewId, liveConnected, emitEvent, transition]);
  const requestNextQuestionRef = useRef(requestNextQuestion);
  requestNextQuestionRef.current = requestNextQuestion;

  // Save the user's answer (socket first, HTTP fallback), then move on
  const submitAnswerWithText = useCallback(
    (text: string) => {
      const q = currentQuestionRef.current;
      if (!q) return;
      const proceed = () => {
        setCurrentQuestion((prev) => (prev ? { ...prev, isAnswered: true } : null));
        requestNextQuestionRef.current();
      };
      const payload = { interviewId, questionId: q.id, answerText: text };

      if (liveConnected) {
        emitEvent("answer:submit", payload, ({ ok, message }) => {
          if (!ok) {
            transition("idle");
            toast.error(message || "Failed to save answer");
            return;
          }
          proceed();
        });
        return;
      }

      AxiosAPI.post(
        `/api/interviews/${interviewId}/questions/${q.id}/answer`,
        { answerText: text },
      )
        .then(proceed)
        .catch((e: any) => {
          console.error("Save answer error:", e);
          transition("idle");
          toast.error(e?.response?.data?.message || "Failed to save answer");
        });
    },
    [interviewId, liveConnected, emitEvent, transition],
  );
  const submitAnswerRef = useRef(submitAnswerWithText);
  submitAnswerRef.current = submitAnswerWithText;

  // Fired by the speech recognition engine when the user stops talking
  const handleRecognitionEnd = () => {
    setIsListening(false);
    if (phaseRef.current !== "listening") return;
    const text = answerTextRef.current.trim();
    if (text) {
      transition("processing");
      stopSpeaking();
      submitAnswerRef.current(text);
    } else {
      // No speech detected - keep the session alive and try again
      try {
        recognitionRef.current?.start();
      } catch {}
    }
  };
  const handleRecognitionEndRef = useRef(handleRecognitionEnd);
  handleRecognitionEndRef.current = handleRecognitionEnd;

  // Re-read the current question (mic re-opens automatically after it)
  const replayQuestion = useCallback(() => {
    const q = currentQuestionRef.current;
    if (!q) return;
    speakDoneRef.current = q.isAnswered ? null : () => startListening();
    transition("speaking");
    speakQuestion(q.question, q.questionAudio, languageRef.current || "English");
  }, [speakQuestion, startListening, transition]);

  // Subscribe to live interview events + join the room for this interview
  useEffect(() => {
    if (!interviewId) return;
    emitEvent("interview:join", { interviewId });

    const offs = [
      onEvent<QuestionNewPayload>("question:new", ({ question }) => {
        onAskQuestionRef.current(toQuestionItem(question), true, true);
      }),
      onEvent<SocketErrorPayload>("question:error", ({ message }) => {
        if (phaseRef.current === "generating") transition("idle");
        toast.error(message || "Failed to generate next question");
      }),
      onEvent<SocketErrorPayload>("answer:error", ({ message }) => {
        if (phaseRef.current === "processing") transition("idle");
        toast.error(message || "Failed to save answer");
      }),
      onEvent<SocketErrorPayload>("summary:error", ({ message }) => {
        toast.dismiss();
        transition("idle");
        toast.error(message || "Error generating report");
      }),
      onEvent<{ text: string }>("summary:stream", ({ text }) => {
        setReportLiveText((prev) => prev + text);
      }),
      onEvent<SummaryDonePayload>("summary:done", () => {
        setReportLiveText("");
        transition("idle");
        toast.dismiss();
        toast.success("Interview completed! Loading your evaluation report...");
        setTimeout(() => {
          router.push(`/dashboard/interviewDetails?id=${interviewId}`);
        }, 600);
      }),
    ];

    return () => {
      offs.forEach((off) => off());
    };
  }, [interviewId, emitEvent, onEvent, transition, router]);

  // Initial load: resume an in-progress interview or kick off question #1
  const bootedRef = useRef(false);
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
    if (pending) {
      // Resume: Sara re-reads the unanswered question, then the mic opens
      setAnswer("");
      onAskQuestionRef.current(pending, false, true);
    } else {
      // Fresh interview (or all questions answered) -> start the next one
      requestNextQuestionRef.current();
    }
  }, [RoomData, interviewId, router, setAnswer]);

  // Handle speech recognition: live transcription with auto-submit when the
  // candidate stops talking (the engine fires onend after a pause in speech).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    if (!supported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      RoomData?.interviewLanguage === "Arabic" ? "ar-SA" : "en-US";

    recognition.onresult = (event: any) => {
      // Rebuild the whole transcript from event.results every time instead of
      // appending. Interim results get re-expanded in place, so appending
      // caused words to repeat (e.g. "normal JavaScript normal JavaScript...").
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      const base = draftBaseRef.current.trim();
      setAnswer(base ? `${base} ${fullTranscript}`.trim() : fullTranscript.trim());
    };

    recognition.onerror = (err: any) => {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    };

    recognition.onend = () => handleRecognitionEndRef.current();

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [setAnswer, RoomData?.interviewLanguage]);

  // Manual mic toggle (also used to stop & submit a voice answer)
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.info("Microphone transcription is not supported in this browser. You can type your answer directly.");
      return;
    }
    if (phaseRef.current === "listening") {
      stopSpeaking();
      recognitionRef.current.stop(); // "onend" auto-submits, like a real call
    } else {
      stopSpeaking();
      startListening();
    }
  };

  // Submit the typed answer (fallback - voice answers submit automatically)
  const handleSubmitAnswer = () => {
    const text = answerTextRef.current.trim();
    if (!text) {
      toast.error("Please provide or speak an answer before submitting.");
      return;
    }
    try {
      recognitionRef.current?.stop();
    } catch {}
    stopSpeaking();
    transition("processing");
    submitAnswerWithText(text);
  };

  // Skip question
  const handleSkipQuestion = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    stopSpeaking();
    toast.info("Question skipped");
    requestNextQuestionRef.current();
  };

  // Finish Interview & Generate Summary
  const handleFinishInterview = () => {
    if (phaseRef.current === "closing") return;
    transition("closing");
    stopSpeaking();
    try {
      recognitionRef.current?.stop();
    } catch {}
    toast.loading("Generating your comprehensive AI interview report...");

    if (liveConnected) {
      setReportLiveText("");
      emitEvent("interview:finish", { interviewId });
      return;
    }

    AxiosAPI.post(`/api/interviews/${interviewId}/summary`)
      .then(() => {
        toast.dismiss();
        toast.success("Interview completed! Loading your evaluation report...");
        router.push(`/dashboard/interviewDetails?id=${interviewId}`);
      })
      .catch((e: any) => {
        console.error("Finish interview error:", e);
        toast.dismiss();
        toast.error(e?.response?.data?.message || "Error completing interview");
        router.push(`/dashboard/interviewDetails?id=${interviewId}`);
      });
  };

  // Integrity & Anti-cheating monitoring
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
    onExpire: handleFinishInterview,
  });

  useInterviewProtection({
    isEnabled: true,
    onTabSwitch: () => {
      setWarningCount((prev) => prev + 1);
      toast.error("Proctoring Warning: Please do not switch tabs or minimize the browser during the interview!");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400">Loading interview room and connecting to AI interviewer...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-3" />
        <h2 className="text-lg font-bold text-red-400">Failed to load interview session</h2>
        <p className="text-xs text-slate-400 mt-1">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans w-full">
      {/* 1. Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            AI
          </div>
          <div>
            <h1 className="font-bold text-sm flex items-center gap-2">
              AI Technical Interview
              <span className="text-slate-500 font-mono text-xs hidden sm:inline">
                #{RoomData?.id}
              </span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {RoomData?.status || "Running"}
              </span>
              {liveConnected && (
                <span className="flex items-center gap-1 text-green-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Live
                </span>
              )}
              <span>• Level: {RoomData?.difficultyLevel}</span>
              <span>• Language: {RoomData?.interviewLanguage}</span>
            </div>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          {warningCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{warningCount} Warnings</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
              {formattedTime}
            </span>
          </div>

          <button
            onClick={handleFinishInterview}
            disabled={isFinishing}
            className="px-3.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:scale-95 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            {isFinishing ? "Finishing..." : "End Interview"}
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Main Stage (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Dual Stage: AI Avatar & Candidate Video Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[260px] h-[300px]">
            {/* AI Avatar */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between shadow-xl overflow-hidden">
              <div className="w-full flex items-center justify-between z-10">
                <span className="text-xs text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-full">
                  AI Interviewer (Sara)
                </span>
                <button
                  onClick={() => {
                    if (isAISpeaking) stopSpeaking();
                    else if (currentQuestion) replayQuestion();
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                  title={isAISpeaking ? "Mute AI" : "Read Question"}
                >
                  {isAISpeaking ? <VolumeX className="w-4 h-4 text-cyan-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Dynamic Sound Orb */}
              <div className="relative flex items-center justify-center my-auto">
                <div
                  className={`w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 blur-md opacity-60 transition-all duration-300 ${
                    isAISpeaking ? "animate-pulse scale-110 opacity-90" : "scale-95 opacity-30"
                  }`}
                />
                <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-cyan-400 absolute flex items-center justify-center shadow-lg">
                  <Cpu className={`w-8 h-8 text-cyan-400 transition-transform duration-300 ${isAISpeaking ? "scale-110" : ""}`} />
                </div>
              </div>

              <div className="text-xs text-slate-400 z-10 text-center">
                {isAISpeaking ? (
                  <span className="text-cyan-400 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Sara is speaking...
                  </span>
                ) : isGeneratingQuestion ? (
                  <span className="text-indigo-400 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    Sara is writing the next question...
                  </span>
                ) : isListening ? (
                  <span className="text-red-400 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    Your turn - speak now. It submits when you stop.
                  </span>
                ) : isSubmittingAnswer ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Analyzing your answer...
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1.5 justify-center">
                    Reviewing your answers...
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Webcam Feed */}
            <div className="w-full h-full">
              <CameraPreview isRoomInterview={true} />
            </div>
          </div>

          {/* Question Display Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                  Question #{currentQuestion?.questionOrder || questionList.length || 1}
                </span>
                {currentQuestion?.keyTopics && currentQuestion.keyTopics.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1">
                    {currentQuestion.keyTopics.map((topic, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={replayQuestion}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Again</span>
              </button>
            </div>

            <div className="min-h-[60px] flex items-center">
              {isGeneratingQuestion ? (
                <div className="flex items-center gap-3 text-slate-400 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  <span className="text-sm">Sara is preparing the next question for you...</span>
                </div>
              ) : (
                <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                  {currentQuestion?.question || "Waiting for Sara to start the conversation..."}
                </p>
              )}
            </div>
          </div>

          {/* Candidate Response Workspace */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Your Answer</span>
                {isListening && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Listening - auto-submits when you stop speaking
                  </span>
                )}
                {isSubmittingAnswer && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Answer submitted - Sara is thinking...
                  </span>
                )}
              </label>

              {/* Voice record button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  isListening
                    ? "bg-red-500 text-white border-red-600 shadow-md shadow-red-500/20"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isListening ? "Stop & submit" : "Start speaking"}</span>
              </button>
            </div>

            {/* Answer Textarea */}
            <textarea
              value={answerText}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak using the microphone or type your detailed response here..."
              rows={5}
              className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder:text-slate-600"
            />

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSkipQuestion}
                disabled={isGeneratingQuestion || isSubmittingAnswer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip Question</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmittingAnswer || isGeneratingQuestion || !answerText.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingAnswer ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit typed answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Skills Assessed */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Assessed Technologies</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {RoomData?.skills && RoomData.skills.length > 0 ? (
                RoomData.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200"
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">General Technical Evaluation</span>
              )}
            </div>
          </div>

          {/* Session Progress */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Questions History
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {questionList.length > 0 ? (
                questionList.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition ${
                      currentQuestion?.id === q.id
                        ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-200"
                        : q.isAnswered
                        ? "bg-slate-800/50 border-slate-800 text-slate-400"
                        : "bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    <span className="mt-0.5">
                      {q.isAnswered ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-indigo-400/50 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </div>
                      )}
                    </span>
                    <p className="line-clamp-2 leading-relaxed flex-1">{q.question}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No questions generated yet.</p>
              )}
            </div>
          </div>

          {/* Proctoring Rules */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Proctoring Integrity</span>
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              <li>Stay focused on this window. Tab switching is logged.</li>
              <li>Keep your microphone and webcam active.</li>
              <li>Provide answers in the selected language ({RoomData?.interviewLanguage}).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live report generation overlay */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Generating your AI report</h3>
                  <p className="text-xs text-slate-500">Sara is analyzing your answers live...</p>
                </div>
              </div>
              {liveConnected && (
                <span className="flex items-center gap-1.5 text-green-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live streaming
                </span>
              )}
            </div>
            <div className="p-5 max-h-[50vh] overflow-y-auto bg-slate-950/80">
              {reportLiveText ? (
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">{reportLiveText}</pre>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

