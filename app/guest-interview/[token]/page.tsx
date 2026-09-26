import GuestInterviewPage from "@/features/partners/GuestInterviewPage";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <GuestInterviewPage token={token} />;
}
