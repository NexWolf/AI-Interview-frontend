"use client";

import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/constants/routes";

const getSocketUrl = () => {
  if (!API_URL) return "";
  return API_URL.replace(/^https:/, "wss:").replace(/^http:/, "ws:");
};

let sharedSocket: Socket | null = null;

// Socket.io disabled until backend implements websocket server.
// Returning null / no-op avoids spamming connection failure errors in the console.
const getSocket = (): Socket | null => {
  return null;
};

export type SocketEventPayload = Record<string, unknown> | string | unknown[] | number | boolean | null;

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

export interface SummaryDonePayload {
  result: Record<string, unknown>;
}

export interface SocketErrorPayload {
  message: string;
}

export function useInterviewSocket() {
  const [connected] = useState(false);

  const emitEvent = useCallback(
    (
      _event: string,
      _payload: Record<string, unknown>,
      ack?: (response: { ok: boolean; message?: string; data?: unknown }) => void,
    ) => {
      ack?.({ ok: false, message: "Socket is disabled" });
    },
    [],
  );

  const onEvent = useCallback(
    <T = SocketEventPayload>(_event: string, _handler: (payload: T) => void) => {
      return () => { };
    },
    [],
  );

  return { connected, socket: null as unknown as Socket, emitEvent, onEvent };
}