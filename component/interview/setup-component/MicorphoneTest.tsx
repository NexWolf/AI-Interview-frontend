"use client";
import { Check, Mic } from "lucide-react";
import { Average } from "next/font/google";
import { useEffect, useRef, useState } from "react";

type PropsMic = {
  language: "ar" | "en";
};

const MicorphoneTest = ({ language }: PropsMic) => {
  const [microphoneReady, setMicrophoneReady] = useState<boolean>(false);
  const [microphoneError, setMicrophoneError] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const expectedText = "I am ready now";
  const newLanguage = language === "ar" ? "ar-SA" : "en-US";

  /* TEST THE MICROPHONE AUDIO IS WORK OR NOT */
  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioTrack: MediaStreamTrack | null = null;

    const handleEnded = () => {
      setMicrophoneReady(false);
      setMicrophoneError(true);
    };

    const startMicrophone = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        stream = streamRef.current;

        audioTrack = stream.getAudioTracks()[0];

        if (!audioTrack) {
          setMicrophoneError(true);
          return;
        }

        setMicrophoneReady(true);

        audioTrack.addEventListener("ended", () => {
          setMicrophoneError(true);
          setMicrophoneReady(false);
        });
      } catch (e) {
        console.error("Audio Error", e);
        setMicrophoneReady(false);
        setMicrophoneError(true);
      }
    };

    startMicrophone();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      audioTrack?.removeEventListener("ended", handleEnded);
    };
  }, []);

  /* TEST THE USER SOUND IS CAN COVERT IT TO THE TEXT IN THE RIGHT TEXT OR NOT  */

  const startVoiceTest = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = newLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
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
    };
    recognition.start();
  };

  const startAudioVisualizer = () => {
    if (!streamRef.current) return;

    /** هنا يقوم ال context بمعالجة الصوت */
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    /* عشان يقدر context يعالج الصوت لازم نوفرلو شئ يقدر يتعامل معو */
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
        0,
      );
      const avarage = sum / dataArray.length;
      setVolume(avarage);
      console.log(avarage);
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    audioContextRef.current?.close();
    audioContextRef.current = null;

    setVolume(0);
  };

  return (
    <div className="w-full md:w-1/2 p-5 rounded-xl border border-[#1F2937] bg-[#0D121F] transition-all flex flex-col justify-between h-full">
  {/* Header */}
  <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
    <div className="flex items-center gap-2.5">
      <Mic className="h-5 w-5 text-[#6366F1]" />
      <h2 className="font-semibold text-white text-base">Microphone Check</h2>
    </div>

    {microphoneReady && (
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
        <Check className="h-3.5 w-3.5 stroke-[3]" />
        Working
      </div>
    )}

    {microphoneError && (
      <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-400">
        Microphone unavailable
      </div>
    )}
  </div>

  {/* Content Container */}
  <div className="mt-4 rounded-lg bg-[#0B0F19] border border-[#1F2937] p-5 flex-1 flex flex-col justify-between gap-4">
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
          Please read the following sentence:
        </p>
        <p className="mt-2 text-base font-medium text-white leading-relaxed">
          {expectedText}
        </p>
      </div>

      {spokenText && (
        <div className="p-3 rounded-lg bg-[#0D121F] border border-[#1F2937]">
          <p className="text-xs font-medium text-gray-400">
            YOU SAID:{" "}
            <span className="text-white font-normal">{spokenText}</span>
          </p>
        </div>
      )}
    </div>

    {/* Dynamic Outer Wave Visualizer */}
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer Expanding Wave (الحلقة الخارجية المتحركة) */}
        <div
          style={{
            transform: `scale(${1 + Math.min(volume / 30, 1.2)})`,
            opacity: isListening ? Math.min(0.2 + volume / 50, 0.8) : 0,
          }}
          className="absolute inset-0 rounded-full bg-[#6366F1] transition-all duration-75 ease-out"
        />

        {/* Core Microphone Button (المركز الثابت) */}
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30">
          <Mic className="w-5 h-5" />
        </div>
      </div>

      <span className="text-xs text-gray-400">
        {isListening ? "Listening to your voice..." : "Voice Level Indicator"}
      </span>
    </div>

    {/* Action Button */}
    {!isListening && (
      <button
        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] active:scale-[0.99] transition-all cursor-pointer disabled:bg-[#1F2937] disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-[#1F2937]"
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
