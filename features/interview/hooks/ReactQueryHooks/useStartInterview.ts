import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewService } from "../../services/interview.service";
import { StartInterviewPayload } from "../../types/setup";


export const useStartInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (data : StartInterviewPayload) => interviewService.create(data),
        
        onSuccess : (response) => {
            const interviewId = response.interview.id;

            if(interviewId) {
                queryClient.setQueryData(["interview" , interviewId], response)
            }
        } 
    })

} 