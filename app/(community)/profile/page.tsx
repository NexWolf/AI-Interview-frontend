import ProfilePreview from "@/features/profile/components/ProfilePreview"
import {  USER_PROFILE_QUERY_KEY } from "@/features/profile/hook/useProfile";
import { profileService } from "@/features/profile/services/profile.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const page = async () => {

  /* FETCH PROFILE DATA HERE */

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey : USER_PROFILE_QUERY_KEY,
    queryFn : profileService.getAll
  })


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfilePreview  editable={true} />
    </HydrationBoundary>
  )
}

export default page