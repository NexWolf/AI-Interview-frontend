export type Phase =
  | "idle"
  | "generating"
  | "speaking"
  | "listening"
  | "processing"
  | "closing";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  questionOrder: number;
  keyTopics?: string[];
  questionAudio?: string | null;
  isAnswered?: boolean;
  options?: QuestionOption[] | null;
  reaction?: string | null;
  inputType?: "single_choice" | "single_choice_plus_text" | "open_text" | string | null;
  freeTextPrompt?: string | null;
  followUp?: string | null;
}

export interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: SpeechRecognitionResultItem;
    };
  };
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
