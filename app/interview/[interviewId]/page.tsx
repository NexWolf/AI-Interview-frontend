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

  // Speak question aloud using audio URL or Web Speech API synthesis
  const speakQuestion = useCallback((text: string, audioUrl?: string | null, language: string = "English") => {
    if (audioUrl) {
      try {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        setIsAISpeaking(true);
        audio.onended = () => setIsAISpeaking(false);
        audio.onerror = () => {
          setIsAISpeaking(false);
          fallbackTTS(text, language);
        };
        audio.play().catch(() => {
          fallbackTTS(text, language);
        });
        return;
      } catch {
        fallbackTTS(text, language);
        return;
      }
    }
    fallbackTTS(text, language);
  }, []);

  const fallbackTTS = (text: string, language: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "Arabic" ? "ar-SA" : "en-US";
      utterance.rate = 1.0;
      utterance.onstart = () => setIsAISpeaking(true);
      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsAISpeaking(false);
  };

  // Generate a new question from backend
  const handleGenerateQuestion = useCallback(async () => {
    try {
      setIsGeneratingQuestion(true);
      const res = await AxiosAPI.post(`/api/interviews/${interviewId}/questions/generate`, {
        speakQuestion: true,
      });

      const questionData = res.data.data;
      const newQuestion: QuestionItem = {
        id: String(questionData.questionId),
        question: questionData.question,
        questionOrder: questionData.questionOrder,
        keyTopics: questionData.keyTopics || [],
        questionAudio: questionData.questionAudio || null,
        isAnswered: false,
      };

      setCurrentQuestion(newQuestion);
      setQuestionList((prev) => [...prev, newQuestion]);
      setAnswerText("");

      speakQuestion(
        newQuestion.question,
        newQuestion.questionAudio,
        RoomData?.interviewLanguage || "English",
      );
    } catch (e: any) {
      console.error("Generate question error:", e);
      toast.error(e?.response?.data?.message || "Failed to generate next question");
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [interviewId, RoomData?.interviewLanguage, speakQuestion]);

  // Initial load: determine question or trigger generation
  useEffect(() => {
    if (!RoomData) return;

    // If the interview was already completed, jump straight to the report
    if (RoomData.status === "Completed") {
      router.replace(`/dashboard/interviewDetails?id=${interviewId}`);
      return;
    }

    if (RoomData.questions && RoomData.questions.length > 0) {
      const formatted: QuestionItem[] = RoomData.questions.map((q: any) => ({
        id: String(q.id),
        question: q.questionText,
        questionOrder: q.questionOrder,
        isAnswered: q.isAnswered,
      }));
      setQuestionList(formatted);
      const active = formatted.find((q) => !q.isAnswered) || formatted[formatted.length - 1];
      setCurrentQuestion(active);
    } else if (!currentQuestion && !isGeneratingQuestion) {
      handleGenerateQuestion();
    }
  }, [RoomData, currentQuestion, isGeneratingQuestion, handleGenerateQuestion, interviewId, router]);

  // Handle Speech Recognition for Candidate voice answer
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = RoomData?.interviewLanguage === "Arabic" ? "ar-SA" : "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [RoomData?.interviewLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.info("Microphone transcription is not supported in this browser. You can type your answer directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... speak your answer clearly");
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    if (!answerText.trim()) {
      toast.error("Please provide or speak an answer before submitting.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    try {
      setIsSubmittingAnswer(true);
      await AxiosAPI.post(
        `/api/interviews/${interviewId}/questions/${currentQuestion.id}/answer`,
        { answerText: answerText.trim() },
      );

      toast.success("Answer recorded successfully!");
      setCurrentQuestion((prev) => (prev ? { ...prev, isAnswered: true } : null));

      // Auto-generate next question
      await handleGenerateQuestion();
    } catch (e: any) {
      console.error("Save answer error:", e);
      toast.error(e?.response?.data?.message || "Failed to save answer");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Skip question
  const handleSkipQuestion = async () => {
    toast.info("Question skipped");
    await handleGenerateQuestion();
  };

  // Finish Interview & Generate Summary
  const handleFinishInterview = async () => {
    try {
      setIsFinishing(true);
      stopSpeaking();
      toast.loading("Generating your comprehensive AI interview report...");

      await AxiosAPI.post(`/api/interviews/${interviewId}/summary`);
      toast.dismiss();
      toast.success("Interview completed! Loading your evaluation report...");
      router.push(`/dashboard/interviewDetails?id=${interviewId}`);
    } catch (e: any) {
      console.error("Finish interview error:", e);
      toast.dismiss();
      toast.error(e?.response?.data?.message || "Error completing interview");
      router.push(`/dashboard/interviewDetails?id=${interviewId}`);
    } finally {
      setIsFinishing(false);
    }
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
                    else if (currentQuestion) speakQuestion(currentQuestion.question, currentQuestion.questionAudio, RoomData?.interviewLanguage);
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
                    AI is speaking the question...
                  </span>
                ) : isGeneratingQuestion ? (
                  <span className="text-indigo-400">AI is formulating the next question...</span>
                ) : (
                  <span>Listening to your answer...</span>
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
                onClick={() => {
                  if (currentQuestion) speakQuestion(currentQuestion.question, currentQuestion.questionAudio, RoomData?.interviewLanguage);
                }}
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
                  {currentQuestion?.question || "Press 'Generate Next Question' to begin."}
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
                    Recording Voice...
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
                <span>{isListening ? "Stop Recording" : "Speak Answer"}</span>
              </button>
            </div>

            {/* Answer Textarea */}
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
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
                      <span>Submit Answer</span>
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
    </div>
  );
}

