import { useRef, useCallback, useEffect } from 'react';

interface UseInterviewAudioProps {
  selectedVoice: string;
  setIsAISpeaking: (isSpeaking: boolean) => void;
  speakDoneRef: React.MutableRefObject<(() => void) | null>;
}

export function useInterviewAudio({
  selectedVoice,
  setIsAISpeaking,
  speakDoneRef,
}: UseInterviewAudioProps) {
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef<Set<string>>(new Set());

  // base64 audio -> playable object URL (uses the real mimeType Gemini returns)
  const makeAudioUrl = useCallback((b64: string, mime: string) => {
    try {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      audioUrlsRef.current.add(url);
      return url;
    } catch {
      return null;
    }
  }, []);

  const fallbackTTS = useCallback(
    (text: string, language: string, onDone?: () => void) => {
      const complete = () => {
        setIsAISpeaking(false);
        onDone?.();
      };
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === "Arabic" ? "ar-SA" : "en-US";

        if (selectedVoice === "Charon") {
          utterance.pitch = 0.85;
          utterance.rate = 0.95;
        } else if (selectedVoice === "Aoede") {
          utterance.pitch = 1.15;
          utterance.rate = 0.98;
        } else if (selectedVoice === "Puck") {
          utterance.pitch = 1.0;
          utterance.rate = 1.05;
        } else if (selectedVoice === "Fenrir") {
          utterance.pitch = 0.9;
          utterance.rate = 1.0;
        } else {
          utterance.pitch = 1.05;
          utterance.rate = 1.0;
        }

        if (language === "Arabic") {
          const voices = window.speechSynthesis.getVoices();
          const arabic = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
          if (arabic) utterance.voice = arabic;
        } else {
          const voices = window.speechSynthesis.getVoices();
          const isFemale = selectedVoice === "Kore" || selectedVoice === "Aoede";
          const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
          if (enVoices.length > 0) {
            const matched = enVoices.find((v) =>
              isFemale
                ? /female|samantha|victoria|zira|karen/i.test(v.name)
                : /male|david|george|mark|alex/i.test(v.name)
            );
            if (matched) utterance.voice = matched;
          }
        }
        utterance.onstart = () => setIsAISpeaking(true);
        utterance.onend = complete;
        utterance.onerror = complete;
        window.speechSynthesis.speak(utterance);
        return;
      }
      complete();
    },
    [selectedVoice, setIsAISpeaking]
  );

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
            audioPlayerRef.current.onended = null;
            audioPlayerRef.current.onerror = null;
            audioPlayerRef.current.src = ""; // Release the media element's memory
          }
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;
          setIsAISpeaking(true);
          audio.onended = finish;
          audio.onerror = () => {
            setIsAISpeaking(false);
            fallbackTTS(text, language, finish);
          };
          audio.play().catch(() => {
            setIsAISpeaking(false);
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
    [fallbackTTS, setIsAISpeaking, speakDoneRef]
  );

  const stopSpeaking = useCallback(() => {
    speakDoneRef.current = null;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsAISpeaking(false);
  }, [setIsAISpeaking, speakDoneRef]);

  useEffect(() => {
    return () => {
      // 1. Cleanup old audio element reference
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
        audioPlayerRef.current.src = "";
      }

      // 2. Revoke all Blob URLs to free browser memory
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioUrlsRef.current.clear();
    };
  }, []);

  return {
    makeAudioUrl,
    speakQuestion,
    stopSpeaking,
  };
}
