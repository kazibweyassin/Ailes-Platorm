import { ScholarshipDetailClient } from "./client";

// Force dynamic rendering for production
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ScholarshipDetailClient id={id} />;
}
