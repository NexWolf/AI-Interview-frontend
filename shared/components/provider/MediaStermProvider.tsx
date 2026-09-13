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

    const start = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(currentStream)
        streamRef.current = currentStream;

        const videoTrack = currentStream.getVideoTracks()[0];
        const audioTrack = currentStream.getAudioTracks()[0];

        setVedioStatus(videoTrack ? "ready" : "error");
        setAudioStatus(audioTrack ? "ready" : "error");

        videoTrack?.addEventListener("ended" , () => setVedioStatus("error"));
        videoTrack?.addEventListener("mute" , ()=> setVedioStatus("muted"))
        videoTrack?.addEventListener("unmute", () => setVedioStatus("ready"))

        audioTrack?.addEventListener("ended", () => setAudioStatus("error"))
        audioTrack?.addEventListener("mute", () => setAudioStatus("muted"))
        audioTrack?.addEventListener("unmute", () => setAudioStatus("ready"))
        
      } catch (e) {
        console.log("Media Error", e);
        setVedioStatus("error");
        setAudioStatus("error");
      }
    };

    start();

    return () => {
        currentStream?.getTracks().forEach((track)=> track.stop);
    };
  }, []);

  return (
    <MediaStreamContext.Provider value={{stream , videoStatus , audioStatus}}>
        {children}
    </MediaStreamContext.Provider>
  )
};


export const useMediaStream = () => {
    const ctx = useContext(MediaStreamContext);
    if(!ctx) throw Error("useMediaStream must be used inside MediaStreamProvider");
    return ctx;
}
