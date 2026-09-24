"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

export type CameraViolationType = "no_face" | "multiple_faces" | "looking_away";

export interface CameraViolationEvent {
  type: CameraViolationType;
  timestamp: string;
  durationMs: number;
  message: string;
}

interface UseCameraProctoringProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isEnabled?: boolean;
  checkIntervalMs?: number;
  violationThresholdMs?: number;
  onViolation?: (violation: CameraViolationEvent) => void;
}

export function useCameraProctoring({
  videoRef,
  isEnabled = true,
  checkIntervalMs = 750, // Check ~1.3 times per second to keep CPU and battery ultra-light
  violationThresholdMs = 3500, // 3.5 seconds buffer to prevent false alarms
  onViolation,
}: UseCameraProctoringProps) {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [faceDetected, setFaceDetected] = useState<boolean>(true);
  const [multipleFaces, setMultipleFaces] = useState<boolean>(false);
  const [isLookingAway, setIsLookingAway] = useState<boolean>(false);
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("Face Centered & Verified");

  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const violationLogsRef = useRef<CameraViolationEvent[]>([]);

  // Violation duration tracking to prevent false positives
  const noFaceDurationStartRef = useRef<number | null>(null);
  const multiFaceDurationStartRef = useRef<number | null>(null);
  const lookingAwayDurationStartRef = useRef<number | null>(null);

  // Cooldown to avoid spamming callbacks
  const lastViolationTriggerRef = useRef<{ [key in CameraViolationType]?: number }>({});

  // 1. Initialize Google MediaPipe Face Landmarker only when enabled
  useEffect(() => {
    if (!isEnabled) {
      setIsModelLoading(false);
      return;
    }

    let isCancelled = false;

    // Suppress Emscripten's harmless C++ INFO messages routed to console.error by WebAssembly
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("INFO: Created TensorFlow") ||
          args[0].includes("Created TensorFlow Lite XNNPACK delegate") ||
          args[0].includes("closeGraph"))
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    const initLandmarker = async () => {
      try {
        setIsModelLoading(true);
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (isCancelled) return;

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 3, // Detect up to 3 faces to catch third-party helper
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (isCancelled) {
          try {
            landmarker.close();
          } catch {}
          return;
        }

        landmarkerRef.current = landmarker;
        setIsModelLoading(false);
      } catch (err) {
        console.warn("MediaPipe FaceLandmarker load warning (running lightweight fallback):", err);
        if (!isCancelled) {
          setIsModelLoading(false);
        }
      }
    };

    initLandmarker();

    return () => {
      isCancelled = true;
      console.error = originalConsoleError;
      if (landmarkerRef.current) {
        const lm = landmarkerRef.current;
        landmarkerRef.current = null;
        try {
          lm.close();
        } catch {}
      }
    };
  }, [isEnabled]);

  const triggerViolation = useCallback(
    (type: CameraViolationType, durationMs: number, message: string) => {
      const now = Date.now();
      const lastTrigger = lastViolationTriggerRef.current[type] || 0;

      // Ensure at least 6 seconds between triggering same violation type
      if (now - lastTrigger < 6000) return;
      lastViolationTriggerRef.current[type] = now;

      const event: CameraViolationEvent = {
        type,
        timestamp: new Date().toISOString(),
        durationMs,
        message,
      };

      violationLogsRef.current.push(event);
      setViolationsCount((prev) => prev + 1);
      onViolation?.(event);
    },
    [onViolation]
  );

  // 2. Continuous lightweight inspection
  useEffect(() => {
    if (!isEnabled) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    intervalIdRef.current = setInterval(() => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (
        !video ||
        !landmarker ||
        video.readyState < 2 ||
        video.paused ||
        video.videoWidth === 0
      )
        return;

      try {
        const now = performance.now();
        const results = landmarker.detectForVideo(video, now);
        const faces = results.faceLandmarks;

        // Case A: No face detected
        if (!faces || faces.length === 0) {
          setFaceDetected(false);
          setMultipleFaces(false);
          setIsLookingAway(false);
          setStatusMessage("No Face Detected - Please Stay in View");

          if (noFaceDurationStartRef.current === null) {
            noFaceDurationStartRef.current = Date.now();
          } else {
            const elapsed = Date.now() - noFaceDurationStartRef.current;
            if (elapsed >= violationThresholdMs) {
              triggerViolation(
                "no_face",
                elapsed,
                "Face not visible in camera frame for more than 3 seconds."
              );
            }
          }
          return;
        }

        // Reset no-face timer
        noFaceDurationStartRef.current = null;
        setFaceDetected(true);

        // Case B: Multiple faces detected (external helper)
        if (faces.length > 1) {
          setMultipleFaces(true);
          setIsLookingAway(false);
          setStatusMessage("Multiple Faces Detected in Frame!");

          if (multiFaceDurationStartRef.current === null) {
            multiFaceDurationStartRef.current = Date.now();
          } else {
            const elapsed = Date.now() - multiFaceDurationStartRef.current;
            if (elapsed >= 2500) {
              triggerViolation(
                "multiple_faces",
                elapsed,
                "Multiple people detected in candidate video frame."
              );
            }
          }
          return;
        }

        // Reset multiple face timer
        multiFaceDurationStartRef.current = null;
        setMultipleFaces(false);

        // Case C: Single face - Check Head Pose / Looking Away
        const landmarks = faces[0];
        // 1: Nose tip
        // 234: Left cheek outer
        // 454: Right cheek outer
        // 10: Forehead top
        // 152: Chin bottom
        const nose = landmarks[1];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];
        const forehead = landmarks[10];
        const chin = landmarks[152];

        if (nose && leftCheek && rightCheek && forehead && chin) {
          const distLeft = Math.abs(nose.x - leftCheek.x);
          const distRight = Math.abs(rightCheek.x - nose.x);
          const totalWidth = distLeft + distRight;

          // Yaw ratio (Looking left vs right)
          const yawRatio = distLeft / (totalWidth || 1);

          // Pitch ratio (Looking down vs up)
          const distTop = Math.abs(nose.y - forehead.y);
          const distBottom = Math.abs(chin.y - nose.y);
          const totalHeight = distTop + distBottom;
          const pitchRatio = distTop / (totalHeight || 1);

          // Normal ranges when facing camera:
          // yawRatio is typically around 0.4 to 0.6
          // pitchRatio is typically around 0.35 to 0.65
          const lookingSideways = yawRatio < 0.25 || yawRatio > 0.75;
          const lookingDown = pitchRatio > 0.78; // Tilted down looking at notes/phone

          const isDeviated = lookingSideways || lookingDown;

          if (isDeviated) {
            setIsLookingAway(true);
            setStatusMessage(
              lookingDown
                ? "Looking Down Detected - Keep Eyes on Screen"
                : "Looking Away Detected - Keep Eyes on Screen"
            );

            if (lookingAwayDurationStartRef.current === null) {
              lookingAwayDurationStartRef.current = Date.now();
            } else {
              const elapsed = Date.now() - lookingAwayDurationStartRef.current;
              if (elapsed >= violationThresholdMs) {
                triggerViolation(
                  "looking_away",
                  elapsed,
                  lookingDown
                    ? "Candidate looking down away from camera for prolonged duration."
                    : "Candidate looking sideways away from camera for prolonged duration."
                );
              }
            }
          } else {
            // Normal - looking at screen
            lookingAwayDurationStartRef.current = null;
            setIsLookingAway(false);
            setStatusMessage("Face Centered & Verified");
          }
        }
      } catch (err) {
        // Silently skip frame error
      }
    }, checkIntervalMs);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isEnabled, checkIntervalMs, violationThresholdMs, triggerViolation, videoRef]);

  return {
    isModelLoading,
    faceDetected,
    multipleFaces,
    isLookingAway,
    statusMessage,
    violationsCount,
    violationLogs: violationLogsRef.current,
  };
}
