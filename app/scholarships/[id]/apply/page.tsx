"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScholarshipApplicationForm from "@/components/scholarship-application-form";
import { Loader2, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScholarshipApplicationPage({ params }: PageProps) {
  const { id } = await params;
  return <ApplicationClient scholarshipId={id} />;
}

function ApplicationClient({ scholarshipId }: { scholarshipId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/scholarships/${scholarshipId}/apply`);
      return;
    }

    if (status === "authenticated") {
      fetchScholarship();
    }
  }, [status, scholarshipId, router]);

  const fetchScholarship = async () => {
    try {
      const res = await fetch(`/api/scholarships/${scholarshipId}`);
      if (res.ok) {
        const data = await res.json();
        setScholarship(data.scholarship);
      }
    } catch (error) {
      console.error("Error fetching scholarship:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scholarship Not Found</h2>
          <Link href="/scholarships" className="text-primary hover:underline">
            ← Back to Scholarships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/scholarships/${scholarshipId}`}
            className="text-primary hover:underline inline-flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scholarship Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for Scholarship
          </h1>
          <p className="text-lg text-gray-600">{scholarship.title}</p>
        </div>

        {/* Application Form */}
        <ScholarshipApplicationForm
          scholarshipId={scholarshipId}
          scholarshipTitle={scholarship.title}
        />
      </div>
    </div>
  );
}
