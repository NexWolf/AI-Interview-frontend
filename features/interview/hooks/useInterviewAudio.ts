import { useRef, useCallback, useEffect } from "react";

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
  const speechSessionRef = useRef<number>(0);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const trackedTimersRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const clearAllTimers = useCallback(() => {
    trackedTimersRef.current.forEach((t) => clearTimeout(t));
    trackedTimersRef.current.clear();
  }, []);

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

  const stopSpeaking = useCallback(() => {
    // Invalidate any ongoing speech session
    speechSessionRef.current++;
    speakDoneRef.current = null;
    clearAllTimers();

    // 1. Detach audio player handlers and pause
    if (audioPlayerRef.current) {
      audioPlayerRef.current.onended = null;
      audioPlayerRef.current.onerror = null;
      audioPlayerRef.current.onplaying = null;
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
      } catch {}
      audioPlayerRef.current = null;
    }

    // 2. Detach utterance handlers BEFORE canceling speech synthesis
    if (activeUtteranceRef.current) {
      activeUtteranceRef.current.onstart = null;
      activeUtteranceRef.current.onend = null;
      activeUtteranceRef.current.onerror = null;
      activeUtteranceRef.current = null;
    }

    // 3. Cancel window speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    setIsAISpeaking(false);
  }, [clearAllTimers, setIsAISpeaking, speakDoneRef]);

  // Speak question aloud using backend audio; falls back to Web Speech API.
  const speakQuestion = useCallback(
    (
      text: string,
      audioUrl?: string | null,
      language: string = "English",
      questionToken?: number
    ) => {
      // Increment speech session token and capture done callback immediately
      const mySession = ++speechSessionRef.current;
      const done = speakDoneRef.current;
      speakDoneRef.current = null;

      clearAllTimers();
      const qTokenTag = questionToken !== undefined ? `[qToken:${questionToken}]` : "";
      console.debug(`[speaking]${qTokenTag}[session:${mySession}] speakQuestion start (hasAudioUrl: ${Boolean(audioUrl)})`);

      let settled = false;
      const settle = (reason: string) => {
        if (settled) return;
        if (mySession !== speechSessionRef.current) return;
        settled = true;
        clearAllTimers();
        setIsAISpeaking(false);
        console.debug(`[speaking]${qTokenTag}[session:${mySession}] speakQuestion settle (${reason})`);
        done?.();
      };

      // Clean up previous playback instances
      if (audioPlayerRef.current) {
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
        audioPlayerRef.current.onplaying = null;
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.src = "";
        } catch {}
        audioPlayerRef.current = null;
      }

      if (activeUtteranceRef.current) {
        activeUtteranceRef.current.onstart = null;
        activeUtteranceRef.current.onend = null;
        activeUtteranceRef.current.onerror = null;
        activeUtteranceRef.current = null;
      }

      const runFallbackTTS = () => {
        if (mySession !== speechSessionRef.current || settled) return;

        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          // If speech synthesis is completely unavailable, settle so the flow doesn't hang
          settle("speechSynthesis unsupported");
          return;
        }

        try {
          // Detach handlers of any prior utterance before cancel to prevent unwanted events
          if (activeUtteranceRef.current) {
            activeUtteranceRef.current.onstart = null;
            activeUtteranceRef.current.onend = null;
            activeUtteranceRef.current.onerror = null;
            activeUtteranceRef.current = null;
          }
          // Only cancel previous speech if active or pending to avoid canceling the new utterance in Chromium
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
          }

          const utterance = new SpeechSynthesisUtterance(text);
          activeUtteranceRef.current = utterance;
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

          utterance.onstart = () => {
            if (mySession !== speechSessionRef.current) return;
            // Real start of playback
            setIsAISpeaking(true);
          };

          utterance.onend = () => {
            if (mySession !== speechSessionRef.current) return;
            activeUtteranceRef.current = null;
            settle("utterance onend");
          };

          utterance.onerror = (e) => {
            if (mySession !== speechSessionRef.current) return;
            activeUtteranceRef.current = null;
            console.warn(`[speaking][session:${mySession}] utterance error: ${e.error}`);
            // Always settle so interview does not freeze if browser speech synthesis fails or cancels
            settle(`utterance error: ${e.error}`);
          };

          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn(`[speaking][session:${mySession}] fallbackTTS exception:`, err);
          settle("fallbackTTS exception");
        }
      };

      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;

          audio.onplaying = () => {
            if (mySession !== speechSessionRef.current) return;
            // Real start of audio playback
            setIsAISpeaking(true);
          };

          audio.onended = () => {
            if (mySession !== speechSessionRef.current) return;
            settle("audio onended");
          };

          audio.onerror = (e) => {
            if (mySession !== speechSessionRef.current) return;
            console.warn(`[speaking][session:${mySession}] audio onerror:`, e);
            runFallbackTTS();
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              if (mySession !== speechSessionRef.current) return;
              if (err?.name === "AbortError") {
                // AbortError is normal when playback is interrupted or superseded
                return;
              }
              console.warn(`[speaking][session:${mySession}] audio.play() rejected:`, err);
              runFallbackTTS();
            });
          }
          return;
        } catch (err) {
          console.warn(`[speaking][session:${mySession}] Audio instantiation failed:`, err);
          runFallbackTTS();
          return;
        }
      }

      runFallbackTTS();
    },
    [clearAllTimers, selectedVoice, setIsAISpeaking, speakDoneRef]
  );

  useEffect(() => {
    return () => {
      // Invalidate on unmount
      speechSessionRef.current++;
      speakDoneRef.current = null;
      clearAllTimers();

      if (audioPlayerRef.current) {
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
        audioPlayerRef.current.onplaying = null;
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.src = "";
        } catch {}
        audioPlayerRef.current = null;
      }

      if (activeUtteranceRef.current) {
        activeUtteranceRef.current.onstart = null;
        activeUtteranceRef.current.onend = null;
        activeUtteranceRef.current.onerror = null;
        activeUtteranceRef.current = null;
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }

      // Revoke all Blob URLs to free browser memory
      audioUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      audioUrlsRef.current.clear();
    };
  }, [clearAllTimers, speakDoneRef]);

  return {
    makeAudioUrl,
    speakQuestion,
    stopSpeaking,
  };
}
