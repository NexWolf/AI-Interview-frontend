"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCcw,
  Check,
  X,
  Crop as CropIcon,
} from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (file: File) => void;
}

export const ImageCropModal = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Transform states
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset transforms whenever imageSrc changes
  useEffect(() => {
    if (imageSrc) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setImageLoaded(false);

      const img = new Image();
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // Keep ref synced
  useEffect(() => {
    currentPosRef.current = position;
  }, [position]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - currentPosRef.current.x,
      y: e.clientY - currentPosRef.current.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile/trackpad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - currentPosRef.current.x,
        y: e.touches[0].clientY - currentPosRef.current.y,
      };
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      setPosition({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      });
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset transforms
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Apply crop & export file
  const handleApplyCrop = async () => {
    if (!imageSrc || !naturalSize.width || !naturalSize.height) return;
    setIsSaving(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageSrc;
      });

      const exportSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not get canvas context");

      // Fill background white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, exportSize, exportSize);

      ctx.save();
      // Move to center of canvas
      ctx.translate(exportSize / 2, exportSize / 2);

      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);

      // Scale factor relative to the container preview
      // In the preview, crop circle is 240px wide (radius 120px)
      const previewCropRadius = 120;
      const ratio = (exportSize / 2) / previewCropRadius;

      // Apply user offset and scale
      ctx.translate(position.x * ratio, position.y * ratio);
      ctx.scale(scale, scale);

      // Compute draw dimensions maintaining natural aspect ratio
      const naturalAspect = naturalSize.width / naturalSize.height;
      let drawWidth = exportSize;
      let drawHeight = exportSize;

      if (naturalAspect > 1) {
        drawWidth = exportSize * naturalAspect;
        drawHeight = exportSize;
      } else {
        drawWidth = exportSize;
        drawHeight = exportSize / naturalAspect;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Convert to blob and then to File
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsSaving(false);
            return;
          }
          const croppedFile = new File([blob], "profile-avatar.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          onCropComplete(croppedFile);
          setIsSaving(false);
          onClose();
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Failed to crop image:", error);
      setIsSaving(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border/70 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full pb-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base sm:text-lg">
            <CropIcon className="w-5 h-5 text-primary" />
            <span>Adjust & Crop Photo</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Crop Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl bg-muted/40 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border border-border/40 shadow-inner"
        >
          {/* Image to be transformed */}
          {imageLoaded && (
            <div
              className="absolute pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Crop preview"
                className="max-w-none w-64 h-64 sm:w-72 sm:h-72 object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
          )}

          {/* Circular mask overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Dark mask outside the circle */}
            <div className="w-56 h-56 sm:w-60 sm:h-60 rounded-full border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] ring-4 ring-primary/20 pointer-events-none" />
          </div>

          <div className="absolute bottom-2 left-2 pointer-events-none bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] text-white/80 font-medium">
            Drag to reposition
          </div>
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="w-full space-y-4 pt-1">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-primary" />
                <span>Zoom</span>
              </span>
              <span>{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((prev) => Math.max(0.6, prev - 0.1))}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <button
                type="button"
                onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Additional Action Buttons: Rotate & Reset */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRotate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-primary" />
              <span>Rotate 90°</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 hover:bg-secondary/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center gap-3 w-full pt-2 border-t border-border/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isSaving || !imageLoaded}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Apply & Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
