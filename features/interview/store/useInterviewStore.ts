import { create } from 'zustand';
import { Phase, QuestionItem } from '../types';

interface InterviewState {
  phase: Phase;
  currentQuestion: QuestionItem | null;
  questionList: QuestionItem[];
  answerText: string;
  
  isGeneratingQuestion: boolean;
  isSubmittingAnswer: boolean;
  isFinishing: boolean;
  isAISpeaking: boolean;
  isListening: boolean;
  submissionError: string | null;
  autoSubmitCountdown: number | null;

  setPhase: (phase: Phase) => void;
  setCurrentQuestion: (q: QuestionItem | null) => void;
  setQuestionList: (list: QuestionItem[]) => void;
  addQuestion: (q: QuestionItem) => void;
  setAnswerText: (text: string) => void;
  setIsAISpeaking: (is: boolean) => void;
  setIsListening: (is: boolean) => void;
  setSubmissionError: (err: string | null) => void;
  setAutoSubmitCountdown: (count: number | null) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  phase: "idle",
  currentQuestion: null,
  questionList: [],
  answerText: "",
  
  isGeneratingQuestion: false,
  isSubmittingAnswer: false,
  isFinishing: false,
  isAISpeaking: false,
  isListening: false,
  submissionError: null,
  autoSubmitCountdown: null,

  setPhase: (phase) => set((state) => ({ 
    phase,
    isGeneratingQuestion: phase === "generating",
    isSubmittingAnswer: phase === "processing",
    isFinishing: phase === "closing",
    isListening: phase === "listening",
    isAISpeaking: phase !== "speaking" ? false : state.isAISpeaking
  })),
  
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setQuestionList: (questionList) => set({ questionList }),
  addQuestion: (q) => set((state) => ({ 
    questionList: state.questionList.some(x => x.id === q.id) ? state.questionList : [...state.questionList, q] 
  })),
  
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
}));
