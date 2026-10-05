import { useQuery } from "@tanstack/react-query"
import { profileService } from "../services/profile.service"
import { defaultAuthRetry } from "@/shared/lib/queryUtils"


export const USER_PROFILE_QUERY_KEY = ["profile" , "me"]
export const useProfile = () => {
    return useQuery({
        queryKey : USER_PROFILE_QUERY_KEY,
        queryFn : profileService.getAll,
        staleTime : 1000 * 60 * 20,
        retry : defaultAuthRetry
    })
}