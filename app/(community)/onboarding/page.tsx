import OnBoardingComponent from "@/features/onboarding/components/OnBoardingComponent";
import { skillsKey } from "@/shared/constants/query-key";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import { skillsService } from "@/shared/services/skills.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: skillsKey.All,
    queryFn : skillsService.getAll,
    retry : defaultAuthRetry,
  })


  
  return (
    <HydrationBoundary  state={dehydrate(queryClient)}>
      <OnBoardingComponent />
    </HydrationBoundary>
  );
} 