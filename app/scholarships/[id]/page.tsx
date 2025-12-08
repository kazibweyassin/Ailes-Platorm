import { ScholarshipDetailClient } from "./client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ScholarshipDetailClient id={id} />;
}
