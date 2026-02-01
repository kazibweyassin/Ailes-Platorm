"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from "lucide-react";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || null;
  const txRef = searchParams?.get("tx_ref") || null;

  const errorMessages: Record<string, string> = {
    missing_params: "Payment information was incomplete. Please try again.",
    payment_not_found: "We couldn't find your payment record. Please contact support.",
    verification_failed: "Payment verification failed. If money was deducted, please contact support.",
    server_error: "Something went wrong on our end. Please try again or contact support.",
  };

  const errorMessage = errorMessages[error || ""] || "Your payment could not be completed.";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-red-300">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
            <CardDescription className="text-lg">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What to do */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What you can do:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>Check your mobile money or bank account to confirm if money was deducted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">2.</span>
                  <span>If money was deducted but you see this page, contact support immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">3.</span>
                  <span>If no money was deducted, try the payment again</span>
                </li>
              </ul>
            </div>

            {/* Transaction Reference */}
            {txRef && (
              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Save this reference number for support:{" "}
                  <span className="font-mono">{txRef}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <Link href="/pricing">
                <Button className="w-full" size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Payment Again
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <a 
                  href="https://wa.me/256700000000?text=Hi,%20I%20had%20a%20payment%20issue.%20Reference:%20" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Support
                  </Button>
                </a>
              </div>
            </div>

            {/* Support Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Need help? Email us at{" "}
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
