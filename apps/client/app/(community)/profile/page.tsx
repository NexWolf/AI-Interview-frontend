import ProfilePreview from "@/features/profile/components/ProfilePreview"
import { accountServer } from "@/shared/services/account.server"
import { USER_PROFILE_QUERY_KEY } from "@/features/profile/queryKeys"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export const dynamic = "force-dynamic";

const page = async () => {

  /* FETCH PROFILE DATA HERE */
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey : USER_PROFILE_QUERY_KEY,
    queryFn : accountServer.profile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfilePreview  editable={true} />
    </HydrationBoundary>
  )
}

export default page