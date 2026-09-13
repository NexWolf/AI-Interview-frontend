"use client";

import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/constants/routes";

const getSocketUrl = () => {
  if (!API_URL) return "";
  return API_URL.replace(/^https:/, "wss:").replace(/^http:/, "ws:");
};

let sharedSocket: Socket | null = null;

const getSocket = (): Socket => {
  if (sharedSocket) return sharedSocket;

  sharedSocket = io(getSocketUrl(), {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket"],
    auth: (cb: (auth: Record<string, string>) => void) => {
      fetch("/api/auth/token")
        .then((res) => res.json())
        .then((data) => {
          cb({ token: data?.accessToken || "" });
        })
        .catch(() => cb({ token: "" }));
    },
  });

  sharedSocket.connect();
  return sharedSocket;
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
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    if (socket.connected) setConnected(true);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onDisconnect);
    };
  }, []);

  const emitEvent = useCallback(
    (
      event: string,
      payload: Record<string, unknown>,
      ack?: (response: { ok: boolean; message?: string; data?: unknown }) => void,
    ) => {
      const socket = getSocket();
      if (!socket.connected) {
        ack?.({ ok: false, message: "Live server is not connected" });
        return;
      }
      if (ack) socket.emit(event, payload, ack);
      else socket.emit(event, payload);
    },
    [],
  );

  const onEvent = useCallback(
    <T = SocketEventPayload>(event: string, handler: (payload: T) => void) => {
      const socket = getSocket();
      socket.on(event, handler as (...args: unknown[]) => void);
      return () => socket.off(event, handler as (...args: unknown[]) => void);
    },
    [],
  );

  return { connected, socket: getSocket(), emitEvent, onEvent };
}