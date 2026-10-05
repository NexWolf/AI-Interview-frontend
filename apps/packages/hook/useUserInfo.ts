import { userService } from "../../packages/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { defaultAuthRetry } from "../../client/shared/lib/queryUtils";

export const USER_INFO_QUERY_KEY = ["user" , "me"] as const;

export const useUserInfo = () => {
    return useQuery({
        queryKey : USER_INFO_QUERY_KEY,
        queryFn : userService.getMe,
        staleTime : 5 * 60 * 1000,
        retry : defaultAuthRetry
    })
}


