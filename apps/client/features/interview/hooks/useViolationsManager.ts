import { useCallback, useEffect, useRef } from "react";
import { InterviewViolation, BatchViolationsPayload } from "../types/violation";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { API_URL } from "@/constants/routes";

const BATCH_SIZE = 5;

export const useViolationsManager = (interviewId: string | number) => {
  const storageKey = `violations_${interviewId}`;
  
  // Use a ref to keep track of violations without causing unnecessary re-renders
  const violationsRef = useRef<InterviewViolation[]>([]);

  // 1. Load from local storage on mount
  useEffect(() => {
    if (!interviewId) return;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as InterviewViolation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          violationsRef.current = parsed;
          // Initial flush: if there are old violations from a crash, send them immediately!
          flushViolations();
        }
      }
    } catch (e) {
      console.error("[ViolationsManager] Failed to parse violations from storage", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // 2. Flush violations to backend
  const flushViolations = useCallback(async () => {
    const currentViolations = [...violationsRef.current];
    if (currentViolations.length === 0) return;

    // Clear local storage and ref immediately to prevent duplicate sends
    violationsRef.current = [];
    localStorage.removeItem(storageKey);

    try {
      const payload: BatchViolationsPayload = {
        interviewId: String(interviewId),
        violations: currentViolations,
      };

      await AxiosAPI.post("/api/v1/violations/batch", payload);
      console.log(`[ViolationsManager] Flushed ${currentViolations.length} violations securely.`);
    } catch (error) {
      console.error("[ViolationsManager] Failed to flush, returning them to storage", error);
      // Put them back in front of any newly accumulated violations
      const merged = [...currentViolations, ...violationsRef.current];
      violationsRef.current = merged;
      localStorage.setItem(storageKey, JSON.stringify(merged));
    }
  }, [interviewId, storageKey]);

  // 3. Add a new violation
  const addViolation = useCallback((violationData: Omit<InterviewViolation, "occurredAt">) => {
    if (!interviewId) return;

    const newViolation: InterviewViolation = {
      ...violationData,
      occurredAt: new Date().toISOString(), // Lock in the exact time
    };

    const updated = [...violationsRef.current, newViolation];
    violationsRef.current = updated;
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // DEBUG LOG: Show the developer exactly what is happening in localStorage
    console.log(`[ViolationsManager] Added new violation: ${newViolation.violationType}`);
    console.log(`[ViolationsManager] Current localStorage batch size: ${updated.length}/${BATCH_SIZE}`, updated);

    // Micro-batching threshold check
    if (updated.length >= BATCH_SIZE) {
      console.log(`[ViolationsManager] Threshold reached (${BATCH_SIZE})! Triggering flush to backend...`);
      flushViolations();
    }
  }, [interviewId, storageKey, flushViolations]);

  // 4. Emergency Flush on tab close (Unload/Visibility change)
  useEffect(() => {
    if (!interviewId) return;

    const handleVisibilityChange = () => {
      // When user switches tabs or closes window, flush immediately in the background
      if (document.visibilityState === "hidden" && violationsRef.current.length > 0) {
        const payload: BatchViolationsPayload = {
          interviewId: String(interviewId),
          violations: violationsRef.current,
        };
        
        // Use keepalive fetch which is reliable during page unload
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        
        fetch(`${API_URL}/api/v1/violations/batch`, {
           method: "POST",
           body: blob,
           headers: {
             "Content-Type": "application/json"
           },
           keepalive: true,
        }).catch(() => {});
        
        // We do NOT clear localStorage here on purpose!
        // If the beacon fails, we want the data to survive in localStorage for the next session.
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [interviewId]);

  // 5. Pull and clear pending violations without sending (for socket piggybacking)
  const pullPendingViolations = useCallback((): InterviewViolation[] => {
    const currentViolations = [...violationsRef.current];
    if (currentViolations.length === 0) return [];
    
    // Clear local storage and ref immediately
    violationsRef.current = [];
    localStorage.removeItem(storageKey);
    return currentViolations;
  }, [storageKey]);

  return {
    addViolation,
    flushViolations,
    pullPendingViolations,
  };
};
