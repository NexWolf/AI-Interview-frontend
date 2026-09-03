import { mockInterview } from "@/constants/mockInterview"; 
import { InterviewStatus } from "@/features/interview/types/interview"; 
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