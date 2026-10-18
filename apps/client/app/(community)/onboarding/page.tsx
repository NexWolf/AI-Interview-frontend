import OnBoardingComponent from "@/features/onboarding/components/OnBoardingComponent";
import { skillsKey } from "@/shared/constants/query-key";
import { accountServer } from "@/shared/services/account.server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: skillsKey.All,
    queryFn : accountServer.skills,
    staleTime: 5 * 60 * 1000,
    retry : false,
  })


  
  return (
    <HydrationBoundary  state={dehydrate(queryClient)}>
      <OnBoardingComponent />
    </HydrationBoundary>
  );
} 