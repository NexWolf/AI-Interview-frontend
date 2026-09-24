"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Volume2, VolumeX, Play, Square, Sparkles, Check, Mic } from "lucide-react";
import { VoiceName } from "@/features/interview/types/setup";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";

export interface VoiceProfile {
  id: VoiceName;
  displayName: string;
  persona: string;
  gender: "Female" | "Male";
  tone: string;
  description: string;
  gradient: string;
  previewSampleEn: string;
  previewSampleAr: string;
}

export const AI_VOICES: VoiceProfile[] = [
  {
    id: "Kore",
    displayName: "Kore",
    persona: "Sarah",
    gender: "Female",
    tone: "Balanced & Professional",
    description: "Clear, measured articulation with a calm, supportive demeanor.",
    gradient: "from-purple-500 to-indigo-600",
    previewSampleEn: "Hello! I'm Kore. I'll be conducting your technical interview today. Take your time and communicate your thought process clearly.",
    previewSampleAr: "مرحباً بك! أنا كوري، سأقود مقابلتك التقنية اليوم. خذ وقتك واشرح طريقة تفكيرك بكل هدوء ووضوح.",
  },
  {
    id: "Aoede",
    displayName: "Aoede",
    persona: "Elena",
    gender: "Female",
    tone: "Warm & Articulate",
    description: "Expressive and encouraging cadence, great for conversational and behavioral rounds.",
    gradient: "from-rose-500 to-purple-600",
    previewSampleEn: "Hi there! I'm Aoede. I'm excited to explore your background and technical skills. Let's make this an engaging session.",
    previewSampleAr: "أهلاً بك! أنا أويـدي. يسعدني التعرف على خبراتك ومهاراتك التقنية اليوم. نتمنى لك جلسة ممتعة وموفقة.",
  },
  {
    id: "Charon",
    displayName: "Charon",
    persona: "David",
    gender: "Male",
    tone: "Deep & Confident",
    description: "Authoritative, resonant, and grounded tone suitable for senior engineering scenarios.",
    gradient: "from-blue-600 to-indigo-900",
    previewSampleEn: "Welcome. I am Charon. We'll be diving deep into core architectures and practical problem-solving. Ready when you are.",
    previewSampleAr: "أهلاً بك. أنا تشارون. سنناقش بعمق بنية الأنظمة والحلول الهندسية العملية. أنا جاهز متى ما كنت مستعداً.",
  },
  {
    id: "Puck",
    displayName: "Puck",
    persona: "Alex",
    gender: "Male",
    tone: "Dynamic & Energetic",
    description: "Modern, upbeat, and interactive pace designed for quick problem-solving.",
    gradient: "from-amber-500 to-violet-600",
    previewSampleEn: "Hey! I'm Puck. Let's keep things interactive, fast-paced, and focused on real-world engineering challenges. Let's do this!",
    previewSampleAr: "مرحباً! أنا باك. دعنا نجعل المقابلة تفاعلية وممتعة ونركز على التحديات البرمجية الحقيقية. هيا نبدأ!",
  },
  {
    id: "Fenrir",
    displayName: "Fenrir",
    persona: "Marcus",
    gender: "Male",
    tone: "Focused & Analytical",
    description: "Precise, deliberate, and direct delivery centered on system design and logic.",
    gradient: "from-emerald-600 to-teal-800",
    previewSampleEn: "Good day. I am Fenrir. We will focus strictly on optimal algorithms, scalability, and code correctness.",
    previewSampleAr: "طاب يومك. أنا فنرير. سنركز على كفاءة الخوارزميات، وقابلية التوسع، وصحة الكود البرمجي.",
  },
];

export const VoiceSelect = () => {
  const { register, watch, setValue } = useFormContext();
  const selectedVoice: VoiceName = watch("aiVoice") || "Kore";
  const selectedLanguage = watch("interviewLanguage") || "Arabic";

  const [playingVoice, setPlayingVoice] = useState<VoiceName | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      // Revoke all cached blob URLs to prevent memory leak
      audioCacheRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
      audioCacheRef.current.clear();
    };
  }, []);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingVoice(null);
    setIsLoadingPreview(false);
  };

  const playBrowserFallback = (voiceProfile: VoiceProfile) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlayingVoice(null);
      return;
    }

    window.speechSynthesis.cancel();
    const text = selectedLanguage === "Arabic" ? voiceProfile.previewSampleAr : voiceProfile.previewSampleEn;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === "Arabic" ? "ar-SA" : "en-US";

    if (voiceProfile.gender === "Female") {
      utterance.pitch = voiceProfile.id === "Aoede" ? 1.15 : 1.05;
      utterance.rate = 1.0;
    } else {
      utterance.pitch = voiceProfile.id === "Charon" ? 0.85 : 0.95;
      utterance.rate = voiceProfile.id === "Puck" ? 1.05 : 0.98;
    }

    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage === "Arabic") {
      const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
      if (arVoice) utterance.voice = arVoice;
    } else {
      // Pick matching gender in English voices if available
      const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (enVoices.length > 0) {
        const matched = enVoices.find((v) =>
          voiceProfile.gender === "Female"
            ? /female|samantha|victoria|zira|karen/i.test(v.name)
            : /male|david|george|mark|alex/i.test(v.name),
        );
        if (matched) utterance.voice = matched;
      }
    }

    utterance.onend = () => setPlayingVoice(null);
    utterance.onerror = () => setPlayingVoice(null);

    setPlayingVoice(voiceProfile.id);
    window.speechSynthesis.speak(utterance);
  };

  const handlePreview = async (e: React.MouseEvent, voiceProfile: VoiceProfile) => {
    e.stopPropagation();

    if (playingVoice === voiceProfile.id) {
      stopPlayback();
      return;
    }

    stopPlayback();
    setPlayingVoice(voiceProfile.id);

    const cacheKey = `${voiceProfile.id}-${selectedLanguage}`;
    const cachedUrl = audioCacheRef.current.get(cacheKey);

    if (cachedUrl) {
      const audio = new Audio(cachedUrl);
      audioRef.current = audio;
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => playBrowserFallback(voiceProfile);
      try {
        await audio.play();
        return;
      } catch {
        playBrowserFallback(voiceProfile);
        return;
      }
    }

    setIsLoadingPreview(true);

    try {
      const res = await AxiosAPI.post("/api/interviews/voices/preview", {
        voice: voiceProfile.id,
        language: selectedLanguage,
      });

      const audioData = res.data?.data?.audioBase64;
      const mimeType = res.data?.data?.mimeType || "audio/wav";

      if (audioData) {
        const bin = atob(audioData);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);

        audioCacheRef.current.set(cacheKey, url);

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setPlayingVoice(null);
        };
        audio.onerror = () => {
          playBrowserFallback(voiceProfile);
        };

        setIsLoadingPreview(false);
        await audio.play();
        return;
      }

      setIsLoadingPreview(false);
      playBrowserFallback(voiceProfile);
    } catch (err) {
      setIsLoadingPreview(false);
      playBrowserFallback(voiceProfile);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden input for form registration */}
      <input type="hidden" {...register("aiVoice")} value={selectedVoice} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {AI_VOICES.map((v) => {
          const isSelected = selectedVoice === v.id;
          const isPlaying = playingVoice === v.id;

          return (
            <div
              key={v.id}
              onClick={() => setValue("aiVoice", v.id, { shouldValidate: true, shouldDirty: true })}
              className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none group ${
                isSelected
                  ? "border-primary bg-primary/10 dark:bg-primary/15 ring-2 ring-primary/40 shadow-md shadow-primary/10"
                  : "border-border/70 bg-card/70 hover:border-primary/40 hover:bg-muted/40 shadow-xs"
              }`}
            >
              <div>
                {/* Header: Persona Avatar + Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {/* Glowing Avatar Orb */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.gradient} text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0 transition-transform group-hover:scale-105`}
                    >
                      {v.displayName.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          {v.displayName}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          ({v.persona})
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide bg-muted/80 text-muted-foreground border border-border/50">
                        {v.gender}
                      </span>
                    </div>
                  </div>

                  {/* Radio Selection Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30 bg-background"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />
                    )}
                  </div>
                </div>

                {/* Tone Pill & Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-primary/95">
                      {v.tone}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>

              {/* Action: Preview Audio Button */}
              <div className="pt-3.5 mt-3 border-t border-border/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => handlePreview(e, v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isPlaying
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "bg-muted/70 hover:bg-muted text-foreground border border-border/60 hover:border-primary/40"
                  }`}
                  title={isPlaying ? "Stop audio preview" : "Listen to voice preview"}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>Playing</span>
                      {/* Animated audio bars */}
                      <span className="flex items-end gap-0.5 h-3 ml-0.5">
                        <span className="w-0.5 h-full bg-current animate-pulse" />
                        <span className="w-0.5 h-2/3 bg-current animate-pulse delay-75" />
                        <span className="w-0.5 h-4/5 bg-current animate-pulse delay-150" />
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-primary" />
                      <span>Preview Voice</span>
                    </>
                  )}
                </button>

                {isSelected && (
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                    Selected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceSelect;
