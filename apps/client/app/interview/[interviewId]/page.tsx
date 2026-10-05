import InterviewSessionClient from "@/features/interview/components/session-component/InterviewSessionClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ interviewId: string }>;
}

export default async function InterviewPage({ params }: PageProps) {
  const { interviewId } = await params;
  return <InterviewSessionClient interviewId={interviewId} />;
}