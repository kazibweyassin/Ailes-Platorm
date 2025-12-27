"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Immediate redirect version - redirects instantly to scholarship finder
 * To use this, rename this file to not-found.tsx (backup the current one first)
 */
export default function NotFoundImmediate() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect
    router.replace("/find-scholarships");
  }, [router]);

  // Show minimal loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to scholarship finder...</p>
      </div>
    </div>
  );
}

