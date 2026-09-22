import { useMutation, useQueryClient } from "@tanstack/react-query"
import { profileService } from "../services/profile.service";
import { AxiosError } from "axios";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (data : FormData)  => profileService.update(data),
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["profile"]});
            queryClient.invalidateQueries({queryKey : ["user", "me"]});
        },
        onError : (error : AxiosError<{message? : string, errors ?: any}>) => {
            const severMessage = error.response?.data?.message || "error from server";
            const serverError = error.response?.data?.errors;

            console.error("the error :", error);
            console.log("error message form server : " , severMessage);

            if(serverError) {
                console.log("this from error server validation : ", serverError);
            }
        }
    })
}