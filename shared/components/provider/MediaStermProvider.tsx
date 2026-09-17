import { createContext, useContext, useEffect, useRef, useState } from "react";

type MediaStatus = "idle" | "loading" | "ready" | "error" | "muted";
type MediaStreamContextType = {
  stream: MediaStream | null;
  videoStatus: MediaStatus;
  audioStatus: MediaStatus;
};

const MediaStreamContext = createContext<MediaStreamContextType | null>(null);

export const MediaStreamProvider = ({ children }: { children: React.ReactNode }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStatus, setVedioStatus] = useState<MediaStatus>("loading");
  const [audioStatus, setAudioStatus] = useState<MediaStatus>("loading");
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let cancelled = false;

    const handleVideoEnded = () => setVedioStatus("error");
    const handleVideoMute = () => setVedioStatus("muted");
    const handleVideoUnmute = () => setVedioStatus("ready");
    const handleAudioEnded = () => setAudioStatus("error");
    const handleAudioMute = () => setAudioStatus("muted");
    const handleAudioUnmute = () => setAudioStatus("ready");

    const start = async () => {
      try {
        const acquiredStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // StrictMode double-invokes effects (setup -> cleanup -> setup).
        // If this call finished after its cleanup already ran, stop the
        // freshly acquired stream so only one live stream survives.
        if (cancelled) {
          acquiredStream.getTracks().forEach((track) => track.stop());
          return;
        }

        currentStream = acquiredStream;
        streamRef.current = acquiredStream;
        setStream(currentStream);

        const videoTrack = currentStream.getVideoTracks()[0];
        const audioTrack = currentStream.getAudioTracks()[0];

        setVedioStatus(videoTrack ? "ready" : "error");
        setAudioStatus(audioTrack ? "ready" : "error");

        videoTrack?.addEventListener("ended", handleVideoEnded);
        videoTrack?.addEventListener("mute", handleVideoMute);
        videoTrack?.addEventListener("unmute", handleVideoUnmute);

        audioTrack?.addEventListener("ended", handleAudioEnded);
        audioTrack?.addEventListener("mute", handleAudioMute);
        audioTrack?.addEventListener("unmute", handleAudioUnmute);
      } catch (e) {
        if (cancelled) return;
        console.log("Media Error", e);
        setVedioStatus("error");
        setAudioStatus("error");
      }
    };

    start();

    return () => {
      cancelled = true;
      const videoTrack = currentStream?.getVideoTracks()[0];
      const audioTrack = currentStream?.getAudioTracks()[0];

      videoTrack?.removeEventListener("ended", handleVideoEnded);
      videoTrack?.removeEventListener("mute", handleVideoMute);
      videoTrack?.removeEventListener("unmute", handleVideoUnmute);

      audioTrack?.removeEventListener("ended", handleAudioEnded);
      audioTrack?.removeEventListener("mute", handleAudioMute);
      audioTrack?.removeEventListener("unmute", handleAudioUnmute);

      currentStream?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  return (
    <MediaStreamContext.Provider value={{ stream, videoStatus, audioStatus }}>
        {children}
    </MediaStreamContext.Provider>
  )
};


export const useMediaStream = () => {
    const ctx = useContext(MediaStreamContext);
    if(!ctx) throw Error("useMediaStream must be used inside MediaStreamProvider");
    return ctx;
}