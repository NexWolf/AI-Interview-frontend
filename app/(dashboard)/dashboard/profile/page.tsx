import ProfilePreview from "@/features/profile/components/ProfilePreview";
import { profileService } from "@/features/profile/services/profile.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const DashboardProfilePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: profileService.getAll,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePreview editable />
    </HydrationBoundary>
  );
};

export default DashboardProfilePage;