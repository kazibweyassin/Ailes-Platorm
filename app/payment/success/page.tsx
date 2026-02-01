"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Sparkles, FileText, Bell, MessageCircle } from "lucide-react";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams?.get("plan") || "premium";
  const txRef = searchParams?.get("tx_ref") || null;

  const planDetails: Record<string, { name: string; features: string[]; nextStep: string; nextLink: string }> = {
    premium: {
      name: "Premium Access",
      features: [
        "Application checklists for every scholarship",
        "AI Copilot for essay writing & review",
        "WhatsApp deadline alerts",
        "Profile strength analysis",
        "Essay templates & examples",
      ],
      nextStep: "Start using your AI Copilot",
      nextLink: "/copilot/activate",
    },
    premium_ugx: {
      name: "Premium Access",
      features: [
        "Application checklists for every scholarship",
        "AI Copilot for essay writing & review",
        "WhatsApp deadline alerts",
        "Profile strength analysis",
        "Essay templates & examples",
      ],
      nextStep: "Start using your AI Copilot",
      nextLink: "/copilot/activate",
    },
    standard: {
      name: "Standard Package",
      features: [
        "Expert 1-hour consultation",
        "5 University + Scholarship matches",
        "Professional Statement of Purpose",
        "Complete application review",
        "3-5 Scholarship applications submitted",
      ],
      nextStep: "Book your consultation call",
      nextLink: "/contact",
    },
    standard_ugx: {
      name: "Standard Package",
      features: [
        "Expert 1-hour consultation",
        "5 University + Scholarship matches",
        "Professional Statement of Purpose",
        "Complete application review",
        "3-5 Scholarship applications submitted",
      ],
      nextStep: "Book your consultation call",
      nextLink: "/contact",
    },
    mentorship: {
      name: "Premium Mentorship",
      features: [
        "Dedicated personal mentor",
        "Unlimited 1-on-1 consultations",
        "10 University + Scholarship matches",
        "Unlimited SOP revisions",
        "Complete visa assistance",
        "Post-admission support",
      ],
      nextStep: "Meet your mentor",
      nextLink: "/contact",
    },
    mentorship_ugx: {
      name: "Premium Mentorship",
      features: [
        "Dedicated personal mentor",
        "Unlimited 1-on-1 consultations",
        "10 University + Scholarship matches",
        "Unlimited SOP revisions",
        "Complete visa assistance",
        "Post-admission support",
      ],
      nextStep: "Meet your mentor",
      nextLink: "/contact",
    },
  };

  const details = planDetails[plan] || planDetails.premium;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-500">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Welcome to {details.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What's Unlocked */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Here's what you now have access to:
              </h3>
              <ul className="space-y-3">
                {details.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transaction Reference */}
            {txRef && (
              <div className="text-center text-sm text-gray-500">
                Transaction Reference: <span className="font-mono">{txRef}</span>
              </div>
            )}

            {/* Next Steps */}
            <div className="space-y-4">
              <Link href={details.nextLink}>
                <Button className="w-full" size="lg">
                  {details.nextStep}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/scholarships">
                  <Button variant="outline" className="w-full">
                    Browse Scholarships
                  </Button>
                </Link>
              </div>
            </div>

            {/* Support Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Questions? Contact us on WhatsApp or email{" "}
                <a href="mailto:support@ailesglobal.com" className="text-primary hover:underline">
                  support@ailesglobal.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
