import SetupContainer from "@/features/interview/components/setup-component/SetupContainer";
import { skillsKey } from "@/shared/constants/query-key";
import { USER_INFO_QUERY_KEY } from "@/shared/hook/useUserInfo";
import { USER_SKILLS_QUERY_KEY } from "@/shared/hook/useUserSkills";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import { skillsService } from "@/shared/services/skills.service";
import { userService } from "@/shared/services/user.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const page = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: userService.getMe,
    retry: defaultAuthRetry,
  });

  await queryClient.prefetchQuery({
    queryKey : USER_SKILLS_QUERY_KEY,
    queryFn :userService.getUserSkills,
    retry : defaultAuthRetry,
  })

  await queryClient.prefetchQuery({
    queryKey : skillsKey.All,
    queryFn : skillsService.getAll,
    staleTime : 5 * 60 * 1000,
    retry : defaultAuthRetry,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SetupContainer />
    </HydrationBoundary>
  );
};

export default page;
