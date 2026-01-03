"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface QuickApplyButtonProps {
  scholarshipId: string;
  scholarshipName: string;
  onSuccess?: () => void;
}

export default function QuickApplyButton({ 
  scholarshipId, 
  scholarshipName,
  onSuccess 
}: QuickApplyButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleQuickApply = async () => {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    setApplying(true);
    try {
      const res = await fetch("/api/applications/quick-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });

      const data = await res.json();

      if (res.ok) {
        setApplied(true);
        if (onSuccess) onSuccess();
        
        // Show success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (applied) {
    return (
      <Button
        className="bg-green-600 hover:bg-green-700"
        disabled
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Applied!
      </Button>
    );
  }

  return (
    <Button
      onClick={handleQuickApply}
      disabled={applying}
      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
    >
      {applying ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Applying...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 mr-2" />
          Quick Apply
        </>
      )}
    </Button>
  );
}
