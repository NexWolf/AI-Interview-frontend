import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingService } from "../services/onboarding.service";
import { USER_INFO_QUERY_KEY } from "@/shared/hook/useUserInfo";

export const useCreateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn :  onboardingService.create,
        onSuccess : () => {
            /* REFRESH DATA IN ME AND USER FOR ALL PROJECT */
            queryClient.invalidateQueries({queryKey : USER_INFO_QUERY_KEY})
        },
        onError : (error ) => {
            console.error("Error creating profile:", error)
        }
    })
}