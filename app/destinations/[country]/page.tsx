import { CountryPageClient } from "./client";

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  return <CountryPageClient country={country} />;
}
