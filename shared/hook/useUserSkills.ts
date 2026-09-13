import { useQuery } from "@tanstack/react-query"
import { userService } from "../services/user.service"
import { defaultAuthRetry } from "../lib/queryUtils"

export const USER_SKILLS_QUERY_KEY = ["user" , "me" , "skills"] as const;

export const useUserSkills = () =>  {

    return useQuery({
        queryKey :USER_SKILLS_QUERY_KEY,
        queryFn : userService.getUserSkills,
        staleTime : 5 * 60 * 1000,
        retry : defaultAuthRetry,
    })
}