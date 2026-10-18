import { Suspense } from "react";
import SetupContainer from "@/features/interview/components/setup-component/SetupContainer";
import { skillsKey } from "@/shared/constants/query-key";
import { USER_INFO_QUERY_KEY } from "@/shared/hook/useUserInfo";
import { USER_SKILLS_QUERY_KEY } from "@/shared/hook/useUserSkills";
import { accountServer } from "@/shared/services/account.server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const page = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: USER_INFO_QUERY_KEY,
      queryFn: accountServer.user,
      retry: false,
    }),
    queryClient.prefetchQuery({
      queryKey: USER_SKILLS_QUERY_KEY,
      queryFn: accountServer.userSkills,
      retry: false,
    }),
    queryClient.prefetchQuery({
      queryKey: skillsKey.All,
      queryFn: accountServer.skills,
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading setup...</div>}>
        <SetupContainer />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
