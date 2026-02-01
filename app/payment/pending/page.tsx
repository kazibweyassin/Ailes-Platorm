"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, RefreshCw, Home, MessageCircle } from "lucide-react";

function PendingContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams?.get("tx_ref") || null;
  const trackingId = searchParams?.get("tracking_id") || null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Payment Pending</CardTitle>
          <CardDescription>
            Your payment is being processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Please wait:</strong> Mobile Money payments may take a few minutes to complete. 
              Check your phone for the payment prompt and enter your PIN.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-gray-600">
              <strong>What to do:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Check your phone for an MTN/Airtel prompt</li>
              <li>Enter your Mobile Money PIN to confirm</li>
              <li>Wait for the confirmation SMS</li>
              <li>Your account will be upgraded automatically</li>
            </ul>
          </div>

          {txRef && (
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="font-mono text-sm">{txRef}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Payment Status
            </Button>

            <Link href="/" className="block">
              <Button className="w-full" variant="ghost">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 text-center">
              Having issues?{" "}
              <a 
                href="https://wa.me/256700000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="h-3 w-3" />
                Contact us on WhatsApp
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Clock className="h-8 w-8 animate-pulse text-yellow-600" />
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
