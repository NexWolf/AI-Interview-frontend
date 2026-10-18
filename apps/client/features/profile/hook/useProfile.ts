import { useQuery } from "@tanstack/react-query"
import { profileService } from "../services/profile.service"
import { defaultAuthRetry } from "@/shared/lib/queryUtils"


import { USER_PROFILE_QUERY_KEY } from "../queryKeys";
export { USER_PROFILE_QUERY_KEY };
export const useProfile = () => {
    return useQuery({
        queryKey : USER_PROFILE_QUERY_KEY,
        queryFn : profileService.getAll,
        staleTime : 1000 * 60 * 5,
        retry : defaultAuthRetry
    })
}