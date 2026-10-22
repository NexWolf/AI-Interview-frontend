import { create } from 'zustand';
import { Phase, QuestionItem } from '../types';

interface InterviewState {
  phase: Phase;
  currentQuestion: QuestionItem | null;
  nextQuestion: QuestionItem | null;
  questionList: QuestionItem[];
  answerText: string;
  
  isGeneratingQuestion: boolean;
  isSubmittingAnswer: boolean;
  isFinishing: boolean;
  isAISpeaking: boolean;
  isListening: boolean;
  submissionError: string | null;
  autoSubmitCountdown: number | null;

  // Live streaming text buffers
  questionLiveText: string;
  reportLiveText: string;
  isGenerationLagging: boolean;
  isPendingCompletion: boolean;

  setPhase: (phase: Phase) => void;
  setCurrentQuestion: (q: QuestionItem | null) => void;
  setNextQuestion: (q: QuestionItem | null) => void;
  setQuestionList: (list: QuestionItem[]) => void;
  addQuestion: (q: QuestionItem) => void;
  markQuestionAnswered: (questionId: string) => void;
  setIsPendingCompletion: (pending: boolean) => void;
  setAnswerText: (text: string) => void;
  setIsAISpeaking: (is: boolean) => void;
  setIsListening: (is: boolean) => void;
  setSubmissionError: (err: string | null) => void;
  setAutoSubmitCountdown: (count: number | null) => void;

  setQuestionLiveText: (text: string) => void;
  appendQuestionLiveText: (chunk: string) => void;
  clearQuestionLiveText: () => void;

  setReportLiveText: (text: string) => void;
  appendReportLiveText: (chunk: string) => void;
  clearReportLiveText: () => void;

  setIsGenerationLagging: (lagging: boolean) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  phase: "idle",
  currentQuestion: null,
  nextQuestion: null,
  questionList: [],
  answerText: "",
  
  isGeneratingQuestion: false,
  isSubmittingAnswer: false,
  isFinishing: false,
  isAISpeaking: false,
  isListening: false,
  submissionError: null,
  autoSubmitCountdown: null,

  questionLiveText: "",
  reportLiveText: "",
  isGenerationLagging: false,
  isPendingCompletion: false,

  setPhase: (phase) => set((state) => ({ 
    phase,
    isGeneratingQuestion: phase === "generating",
    isSubmittingAnswer: phase === "processing",
    isFinishing: phase === "closing",
    isListening: phase === "listening",
    isAISpeaking: phase !== "speaking" ? false : state.isAISpeaking,
    // Reset generation lagging whenever phase leaves 'generating'
    isGenerationLagging: phase === "generating" ? state.isGenerationLagging : false,
  })),
  
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setNextQuestion: (nextQuestion) => set({ nextQuestion }),
  setQuestionList: (questionList) => set({ questionList }),
  addQuestion: (q) => set((state) => ({ 
    questionList: state.questionList.some(x => x.id === q.id) 
      ? state.questionList.map(x => x.id === q.id ? { ...x, ...q } : x)
      : [...state.questionList, q] 
  })),
  markQuestionAnswered: (questionId) => set((state) => ({
    currentQuestion:
      state.currentQuestion?.id === questionId
        ? { ...state.currentQuestion, isAnswered: true }
        : state.currentQuestion,
    questionList: state.questionList.map((item) =>
      item.id === questionId ? { ...item, isAnswered: true } : item
    ),
  })),
  setIsPendingCompletion: (isPendingCompletion) => set({ isPendingCompletion }),
  
  setAnswerText: (answerText) => set((state) => {
    const q = state.currentQuestion;
    if (q?.id && typeof window !== "undefined") {
      try {
        if (answerText.trim()) {
          sessionStorage.setItem(`interview_draft_${q.id}`, answerText);
        } else {
          sessionStorage.removeItem(`interview_draft_${q.id}`);
        }
      } catch {}
    }
    return { answerText };
  }),

  setIsAISpeaking: (isAISpeaking) => set({ isAISpeaking }),
  setIsListening: (isListening) => set({ isListening }),
  setSubmissionError: (submissionError) => set({ submissionError }),
  setAutoSubmitCountdown: (autoSubmitCountdown) => set({ autoSubmitCountdown }),

  setQuestionLiveText: (questionLiveText) => set({ questionLiveText }),
  appendQuestionLiveText: (chunk) => set((state) => ({ questionLiveText: state.questionLiveText + chunk })),
  clearQuestionLiveText: () => set({ questionLiveText: "" }),

  setReportLiveText: (reportLiveText) => set({ reportLiveText }),
  appendReportLiveText: (chunk) => set((state) => ({ reportLiveText: state.reportLiveText + chunk })),
  clearReportLiveText: () => set({ reportLiveText: "" }),

  setIsGenerationLagging: (isGenerationLagging) => set({ isGenerationLagging }),
}));
