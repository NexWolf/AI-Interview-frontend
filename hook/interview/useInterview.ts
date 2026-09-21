import { mockInterview } from "@/data/mockInterview"; 
import { InterviewStatus } from "@/types/interview/interview"; 
import { useState } from "react"; 
 
export function useInterview () { 
    const [status , setStatus] = useState<InterviewStatus>('idle'); 
    const [currentQuestionIndex , setCurrentQuestionIndex] = useState<number>(0); 
 
    const currentQuestion = mockInterview.questions[currentQuestionIndex]; 

    
 
    const startInterview = () => { 
        setStatus("ai-speaking") 
    } 

    const handleAIEnded = () => {
        setStatus("listening");
    }
 
    return { 
        status, 
        currentQuestion, 
        currentQuestionIndex, 
        startInterview, 
        handleAIEnded
    } 
}