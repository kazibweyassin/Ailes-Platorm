import { ScholarshipDetailClient } from "./client";
import { generateSEO } from "@/lib/seo";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for production
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      select: {
        name: true,
        description: true,
        provider: true,
        amount: true,
        currency: true,
        country: true,
      },
    });

    if (!scholarship) {
      return generateSEO({
        title: "Scholarship Not Found",
        description: "The scholarship you're looking for doesn't exist.",
      });
    }

    const title = `${scholarship.name} - ${scholarship.provider}`;
    const description = scholarship.description 
      ? scholarship.description.substring(0, 150) + "..."
      : `Apply for ${scholarship.name} scholarship${scholarship.amount ? ` worth ${scholarship.currency} ${scholarship.amount.toLocaleString()}` : ""}`;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ailesglobal.com';
    const ogTitle = encodeURIComponent(title);
    const ogDescription = encodeURIComponent(description);
    const ogImage = `${baseUrl}/og?title=${ogTitle}&description=${ogDescription}&type=scholarship`;

    return generateSEO({
      title,
      description,
      ogImage,
      canonicalUrl: `/scholarships/${id}`,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateSEO({
      title: "Scholarship Details",
      description: "View scholarship details and apply now.",
    });
  }
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ScholarshipDetailClient id={id} />;
}
