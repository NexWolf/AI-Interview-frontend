import InterviewDetailsClient from "@/features/dashboard/components/InterviewDetailsClient";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function InterviewDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params?.id ? String(params.id).trim() : undefined;

  return <InterviewDetailsClient id={id} />;
}