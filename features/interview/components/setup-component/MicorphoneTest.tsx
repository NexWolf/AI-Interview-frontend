import { useMediaStream } from "@/shared/components/provider/MediaStermProvider";
import { Check, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PropsMic = {
  language: "Arabic" | "English";
  onReady: (value: boolean) => void;
};

const MicorphoneTest = ({ language, onReady }: PropsMic) => {
  const { stream, audioStatus, ensureStreamActive } = useMediaStream();

  const [microphoneReady, setMicrophoneReady] = useState<boolean>(false);
  const [microphoneError, setMicrophoneError] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // تتغير الجملة حسب اللغة المختارة لضمان عمل التعرف الصوتي بدقة
  const expectedText =
    language === "Arabic" ? "أنا مستعد الآن" : "I am ready now";
  const newLanguage = language === "Arabic" ? "ar-SA" : "en-US";

  /* SYNC WITH SHARED MEDIA STREAM */
  useEffect(() => {
    if (audioStatus === "idle") {
      ensureStreamActive?.().catch(() => {});
    }
  }, [audioStatus, ensureStreamActive]);

  useEffect(() => {
    const hasLiveAudioTrack = Boolean(
      stream && stream.getAudioTracks().some((t) => t.readyState === "live" && t.enabled)
    );
    if ((audioStatus === "ready" || hasLiveAudioTrack) && stream) {
      streamRef.current = stream;
      setMicrophoneReady(true);
      setMicrophoneError(false);
    } else if (audioStatus === "error") {
      setMicrophoneReady(false);
      setMicrophoneError(true);
    } else {
      setMicrophoneReady(false);
      setMicrophoneError(false);
    }
  }, [audioStatus, stream]);

  const testRecognitionRef = useRef<any>(null);

  /* TEST THE USER SOUND IS CAN COVERT IT TO THE TEXT IN THE RIGHT TEXT OR NOT  */
  const startVoiceTest = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (testRecognitionRef.current) {
      try {
        testRecognitionRef.current.abort();
      } catch {}
      testRecognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    testRecognitionRef.current = recognition;

    recognition.lang = newLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setSpokenText(result);
    };
    recognition.onstart = () => {
      setIsListening(true);
      startAudioVisualizer();
    };
    recognition.onend = () => {
      setIsListening(false);
      stopAudioVisualizer();
      testRecognitionRef.current = null;
    };
    recognition.onerror = () => {
      setIsListening(false);
      stopAudioVisualizer();
      testRecognitionRef.current = null;
    };
    recognition.start();
  };

  const startAudioVisualizer = () => {
    if (!streamRef.current) return;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(streamRef.current);

    const analyzer = audioContext.createAnalyser();
    analyserRef.current = analyzer;
    analyzer.fftSize = 256;
    source.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    const updateVolume = () => {
      analyzer.getByteFrequencyData(dataArray);

      const sum = dataArray.reduce(
        (accumulator, value) => accumulator + value,
        0
      );
      const average = sum / dataArray.length;
      setVolume(average);
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;

    setVolume(0);
  };

  useEffect(() => {
    return () => {
      stopAudioVisualizer();
      if (testRecognitionRef.current) {
        try {
          testRecognitionRef.current.abort();
        } catch {}
        testRecognitionRef.current = null;
      }
    };
  }, []);

  useEffect(() =>{
    onReady(microphoneReady)
  },[microphoneReady, onReady])

  return (
    <div className="w-full md:w-1/2 p-5 sm:p-6 rounded-2xl border border-border bg-card/60 shadow-sm transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Mic className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground text-base">
            Microphone Check
          </h2>
        </div>

        {microphoneReady && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            Working
          </div>
        )}

        {microphoneError && (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            Microphone unavailable
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="mt-4 rounded-xl bg-muted/30 border border-border p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Please read the following sentence:
            </p>
            <p className="mt-2 text-base font-semibold text-foreground leading-relaxed p-3 rounded-xl bg-card border border-border">
              &quot;{expectedText}&quot;
            </p>
          </div>

          {spokenText && (
            <div className="p-3 rounded-xl bg-card border border-border shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground">
                YOU SAID:{" "}
                <span className="text-foreground font-medium">{spokenText}</span>
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Outer Wave Visualizer */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <div className="relative flex items-center justify-center w-16 h-16">
            {/* Outer Expanding Wave */}
            <div
              style={{
                transform: `scale(${1 + Math.min(volume / 30, 1.2)})`,
                opacity: isListening ? Math.min(0.2 + volume / 50, 0.8) : 0,
              }}
              className="absolute inset-0 rounded-full bg-primary transition-all duration-75 ease-out"
            />

            {/* Core Microphone Button */}
            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Mic className="w-5 h-5" />
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            {isListening ? "Listening to your voice..." : "Voice Level Indicator"}
          </span>
        </div>

        {/* Action Button */}
        {!isListening && (
          <button
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed"
            type="button"
            disabled={!microphoneReady}
            onClick={startVoiceTest}
          >
            Start Voice Test
          </button>
        )}
      </div>
    </div>
  );
};

export default MicorphoneTest;