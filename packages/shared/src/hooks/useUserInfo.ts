import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { defaultAuthRetry } from "../lib/queryUtils";
import { USER_INFO_QUERY_KEY } from "../constants/query-key";

export { USER_INFO_QUERY_KEY };

export const useUserInfo = () => {
  return useQuery({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: userService.getMe,
    staleTime: 5 * 60 * 1000,
    retry: defaultAuthRetry,
  });
};
