import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  text?: string | null;
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

/**
 * Custom hook to display text with a typewriter animation effect.
 * Encapsulates interval timer lifecycle and completion callbacks.
 */
export function useTypewriter({
  text,
  speed = 35,
  enabled = true,
  onComplete,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!text || !enabled) {
      if (!enabled && text) {
        setDisplayedText("");
        setIsTyping(false);
      } else {
        setDisplayedText("");
        setIsTyping(false);
      }
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
}
