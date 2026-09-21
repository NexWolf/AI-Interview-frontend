"use client";

import { useInterview } from "@/features/interview/hooks/useInterview";
import AIPlayer from "./AIPlayer";
import { useEffect } from "react";
import { useAudioRecorder } from "@/features/interview/hooks/useAudioRecorder";

const SessionContainer = () => {
    
    const {status, currentQuestion, currentQuestionIndex, startInterview, handleAIEnded } = useInterview();
    const {isListening, startListening} = useAudioRecorder();

    useEffect(() => {
        startInterview();
    },[])

    useEffect(() => {
        if(status === "listening") {
            startListening();
        }
    }, [status])


  return (
    <div>
    <p>status : {status}</p>
    {status === "ai-speaking" && (
        <div>
            <p>AI speaking...</p>
            <AIPlayer audioUrl={currentQuestion.audioUrl} onEnded={() => handleAIEnded()} />

        </div>
    )}

    <p>Microphone : {isListening ? "ON" : "OFF"} </p>

  </div>
  )
};

export default SessionContainer;
