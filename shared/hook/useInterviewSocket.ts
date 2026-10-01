"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/constants/routes";

// ============================================================================
// TYPES & PAYLOAD DEFINITIONS (Matching Backend Socket Server)
// ============================================================================

export type SocketEventPayload =
  | Record<string, unknown>
  | string
  | unknown[]
  | number
  | boolean
  | null;

export interface QuestionStreamPayload {
  text: string;
  interviewId: string | number;
}

export interface QuestionNewPayload {
  question: {
    interviewId: string | number;
    questionId: string | number;
    questionOrder: number;
    totalQuestions: number;
    question: string;
    keyTopics?: string[];
    interactionId?: string | null;
    questionAudio?: { audioBase64: string; mimeType: string } | null;
  };
}

export interface AnswerSavedPayload {
  interviewId: string | number;
  questionId: string | number;
}

export interface SummaryStreamPayload {
  text: string;
  interviewId: string | number;
}

export interface SummaryDonePayload {
  result: Record<string, unknown>;
}

export interface SocketErrorPayload {
  interviewId?: string | number;
  message: string;
}

export interface SocketAckResponse<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
}

export interface UseInterviewSocketOptions {
  interviewId?: string | number;
  autoConnect?: boolean;
}

// Fetch the current user JWT access token from the Next.js internal auth route
async function fetchAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/token");
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken || null;
  } catch (error) {
    console.error("[useInterviewSocket] Failed to fetch access token:", error);
    return null;
  }
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useInterviewSocket(options: UseInterviewSocketOptions = {}) {
  const { interviewId, autoConnect = true } = options;

  const [connected, setConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const interviewIdRef = useRef(interviewId);
  interviewIdRef.current = interviewId;

  // Track listeners across re-connections and asynchronous socket creation
  const listenersRef = useRef<Map<string, Set<(payload: any) => void>>>(new Map());

  // Initialize and connect socket
  const connect = useCallback(async () => {
    if (socketRef.current?.connected) return;

    setIsConnecting(true);
    setError(null);

    const token = await fetchAccessToken();
    if (!token) {
      setIsConnecting(false);
      setError("No access token available for socket connection");
      return;
    }

    const socketUrl = API_URL?.replace(/\/$/, "") || "http://localhost:5000";

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;

    // Attach any listeners that were registered prior to connection
    listenersRef.current.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        socket.on(event, handler);
      });
    });

    socket.on("connect", () => {
      setConnected(true);
      setIsConnecting(false);
      setError(null);

      // Auto-join interview room if interviewId was provided
      if (interviewIdRef.current) {
        socket.emit("interview:join", {
          interviewId: String(interviewIdRef.current),
        });
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setIsConnecting(false);
    });

    socket.on("connect_error", (err) => {
      setConnected(false);
      setIsConnecting(false);
      setError(err?.message || "Socket connection failed");
    });
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      if (interviewIdRef.current) {
        socketRef.current.emit("interview:leave", {
          interviewId: String(interviewIdRef.current),
        });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Handle dynamic changes to interviewId when socket is already open
  useEffect(() => {
    if (connected && socketRef.current && interviewId) {
      socketRef.current.emit("interview:join", {
        interviewId: String(interviewId),
      });
    }
  }, [connected, interviewId]);

  // Generic emitter (compatible with previous interface)
  const emitEvent = useCallback(
    (
      event: string,
      payload: Record<string, unknown>,
      ack?: (response: SocketAckResponse) => void,
    ) => {
      if (!socketRef.current) {
        ack?.({ ok: false, message: "Socket is not initialized" });
        return;
      }
      socketRef.current.emit(event, payload, ack);
    },
    [],
  );

  // Generic listener (compatible with previous interface and preserves across reconnects)
  const onEvent = useCallback(
    <T = SocketEventPayload>(event: string, handler: (payload: T) => void) => {
      if (!listenersRef.current.has(event)) {
        listenersRef.current.set(event, new Set());
      }

      const handlerFn = handler as (payload: any) => void;
      listenersRef.current.get(event)!.add(handlerFn);

      if (socketRef.current) {
        socketRef.current.on(event, handlerFn);
      }

      return () => {
        listenersRef.current.get(event)?.delete(handlerFn);
        if (socketRef.current) {
          socketRef.current.off(event, handlerFn);
        }
      };
    },
    [],
  );

  // Helper: Join interview
  const joinInterview = useCallback((id: string | number) => {
    socketRef.current?.emit("interview:join", { interviewId: String(id) });
  }, []);

  // Helper: Leave interview
  const leaveInterview = useCallback((id: string | number) => {
    socketRef.current?.emit("interview:leave", { interviewId: String(id) });
  }, []);

  // Helper: Request AI to generate question
  const generateQuestion = useCallback(
    (params: { interviewId: string | number; speakQuestion?: boolean }) => {
      return new Promise<SocketAckResponse>((resolve) => {
        if (!socketRef.current) {
          return resolve({ ok: false, message: "Socket not connected" });
        }
        socketRef.current.emit(
          "question:generate",
          {
            interviewId: String(params.interviewId),
            speakQuestion: params.speakQuestion ?? true,
          },
          (response: SocketAckResponse) => resolve(response || { ok: true }),
        );
      });
    },
    [],
  );

  // Helper: Submit candidate's answer
  const submitAnswer = useCallback(
    (params: {
      interviewId: string | number;
      questionId: string | number;
      answerText: string;
    }) => {
      return new Promise<SocketAckResponse>((resolve) => {
        if (!socketRef.current) {
          return resolve({ ok: false, message: "Socket not connected" });
        }
        socketRef.current.emit(
          "answer:submit",
          {
            interviewId: String(params.interviewId),
            questionId: String(params.questionId),
            answerText: params.answerText,
          },
          (response: SocketAckResponse) => resolve(response || { ok: true }),
        );
      });
    },
    [],
  );

  // Helper: Finish interview and trigger report summary
  const finishInterview = useCallback(
    (params: { interviewId: string | number }) => {
      return new Promise<SocketAckResponse>((resolve) => {
        if (!socketRef.current) {
          return resolve({ ok: false, message: "Socket not connected" });
        }
        socketRef.current.emit(
          "interview:finish",
          { interviewId: String(params.interviewId) },
          (response: SocketAckResponse) => resolve(response || { ok: true }),
        );
      });
    },
    [],
  );

  return {
    connected,
    isConnecting,
    error,
    socket: socketRef.current,
    emitEvent,
    onEvent,
    connect,
    disconnect,
    joinInterview,
    leaveInterview,
    generateQuestion,
    submitAnswer,
    finishInterview,
  };
}