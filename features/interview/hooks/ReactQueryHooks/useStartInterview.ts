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
                // Do not set query data here because the response shape from startInterview
                // is different from getInterviewById. Let the interview room fetch it fresh.
                queryClient.invalidateQueries({ queryKey: ["interview", interviewId] });
            }
        } 
    })

} 