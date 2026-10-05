"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (imageDataUrl: string) => void;
}

export const CameraCaptureModal = ({
  isOpen,
  onClose,
  onPhotoCaptured,
}: CameraCaptureModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported on this browser.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      let msg = "Could not access camera. Please check camera permissions.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Camera permission was denied. Please allow camera access in your browser.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No camera found on this device.";
      }
      setCameraError(msg);
      toast.error(msg);
    }
  };

  // Stop webcam tracks
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Capture snapshot
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Retake
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm photo
  const handleConfirm = () => {
    if (!capturedImage) return;
    onPhotoCaptured(capturedImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => {
        stopCamera();
        onClose();
      }}
    >
      <div
        className="relative bg-card border border-border/70 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl flex flex-col items-center gap-4 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full pb-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base sm:text-lg">
            <Camera className="w-5 h-5 text-primary" />
            <span>Take Profile Photo</span>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View / Captured Preview */}
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-border/40 shadow-inner">
          {cameraError ? (
            <div className="flex flex-col items-center gap-3 p-6 text-center text-destructive">
              <AlertCircle className="w-10 h-10" />
              <p className="text-xs sm:text-sm font-medium">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : capturedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  isMirrored ? "-scale-x-100" : ""
                }`}
                onLoadedMetadata={() => {
                  videoRef.current?.play().catch(() => {});
                }}
              />
              {/* Overlay target circle to guide head placement */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
              </div>
            </>
          )}
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Bottom Action Controls */}
        <div className="flex items-center justify-between w-full pt-2">
          {!capturedImage && !cameraError && (
            <button
              type="button"
              onClick={() => setIsMirrored((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl bg-secondary/40 hover:bg-secondary transition-colors cursor-pointer"
              title="Flip camera"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isMirrored ? "Mirrored" : "Normal"}</span>
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Continue to Crop</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                {!cameraError && (
                  <button
                    type="button"
                    onClick={handleCapture}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
