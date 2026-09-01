"use client";

import { Check, Video , VideoOff} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CameraPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let videoTrack: MediaStreamTrack | null = null;

    const handleEnded = () => {
      setCameraReady(false);
      setCameraError(true);
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoTrack = stream.getVideoTracks()[0];

        if (!videoTrack) {
          setCameraError(true);
          return;
        }

        setCameraReady(true);

        videoTrack.addEventListener("ended", () => {
          setCameraReady(false);
          setCameraError(true);
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setCameraError(true);
        setCameraReady(false);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      videoTrack?.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
   <div className="w-full md:w-1/2 p-5 rounded-xl border border-[#1F2937] bg-[#0D121F] transition-all flex flex-col justify-between h-full">
  {/* Header */}
  <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
    <div className="flex items-center gap-2.5">
      <Video className="h-5 w-5 text-[#6366F1]" />
      <h2 className="font-semibold text-white text-base">Camera Check</h2>
    </div>

    {cameraReady && (
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
        <Check className="h-3.5 w-3.5 stroke-[3]" />
        Working
      </div>
    )}

    {cameraError && (
      <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-400">
        Camera unavailable
      </div>
    )}
  </div>

  {/* Camera Preview Container */}
  <div className="mt-4 rounded-lg bg-[#0B0F19] border border-[#1F2937] p-4 flex-1 flex flex-col justify-between gap-4">
    <div className="relative w-full flex-1 min-h-[220px] rounded-lg overflow-hidden bg-[#030712] border border-[#1F2937] flex items-center justify-center">
      {/* Dynamic Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover -scale-x-100 ${
          cameraReady ? "block" : "hidden"
        }`}
      />

      {/* Fallback state when camera is loading / idle */}
      {!cameraReady && !cameraError && (
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <Video className="w-8 h-8 animate-pulse text-[#6366F1]" />
          <span className="text-xs">Initializing camera...</span>
        </div>
      )}

      {/* Fallback state when camera has error */}
      {cameraError && (
        <div className="flex flex-col items-center gap-2 text-rose-400">
          <VideoOff className="w-8 h-8" />
          <span className="text-xs">Unable to access camera</span>
        </div>
      )}
    </div>

    {/* Bottom Status / Footer matching microphone style structure */}
    <div className="p-3 rounded-lg bg-[#0D121F] border border-[#1F2937] text-center">
      <p className="text-xs text-gray-400">
        Status:{" "}
        <span className="text-white font-medium">
          {cameraReady
            ? "Video stream active"
            : cameraError
            ? "Device error"
            : "Connecting..."}
        </span>
      </p>
    </div>
  </div>
</div>
  );
};

export default CameraPreview;
