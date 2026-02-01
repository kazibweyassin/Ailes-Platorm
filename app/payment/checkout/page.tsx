"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Loader2, 
  CheckCircle2, 
  Shield,
  ArrowLeft,
  Lock
} from "lucide-react";

const PLANS: Record<string, { name: string; amount: number; amountUGX: number; currency: string; description: string; features: string[] }> = {
  premium: {
    name: "Premium Access",
    amount: 5,
    amountUGX: 18500,
    currency: "USD",
    description: "Monthly subscription",
    features: [
      "10,000+ verified scholarships",
      "Visa guidance & checklist",
      "Application checklists",
      "AI Copilot essay help",
      "WhatsApp deadline alerts",
      "Profile analysis",
    ],
  },
  standard: {
    name: "Standard Package",
    amount: 299,
    amountUGX: 1100000,
    currency: "USD",
    description: "One-time payment",
    features: [
      "Expert consultation",
      "5 university matches",
      "SOP writing",
      "3-5 applications",
      "Visa guidance & checklist",
    ],
  },
  mentorship: {
    name: "Premium Mentorship",
    amount: 799,
    amountUGX: 2950000,
    currency: "USD",
    description: "One-time payment",
    features: [
      "Dedicated mentor",
      "Unlimited consultations",
      "10 applications",
      "Visa assistance",
    ],
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const planId = searchParams?.get("plan") || "premium";
  const plan = PLANS[planId] || PLANS.premium;
  
  const [paymentMethod, setPaymentMethod] = useState<string>("mobilemoney");
  const [currency, setCurrency] = useState<"USD" | "UGX">("UGX");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/payment/checkout?plan=${planId}`);
    }
  }, [status, router, planId]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const actualPlanId = currency === "UGX" ? `${planId}_ugx` : planId;
      
      const response = await fetch("/api/payments/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: actualPlanId,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentLink) {
        // Redirect to Pesapal payment page
        window.location.href = data.paymentLink;
      } else {
        setError(data.error || "Failed to initialize payment");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const amount = currency === "UGX" ? plan.amountUGX : plan.amount;
  const currencySymbol = currency === "UGX" ? "UGX" : "$";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/pricing" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pricing
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {currencySymbol} {amount.toLocaleString()}
                  </p>
                  {currency === "USD" && (
                    <button 
                      onClick={() => setCurrency("UGX")}
                      className="text-xs text-primary hover:underline"
                    >
                      Pay in UGX instead
                    </button>
                  )}
                  {currency === "UGX" && (
                    <button 
                      onClick={() => setCurrency("USD")}
                      className="text-xs text-primary hover:underline"
                    >
                      Pay in USD instead
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure payment powered by Pesapal</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mobile Money - Popular in Uganda */}
              <button
                onClick={() => setPaymentMethod("mobilemoney")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  paymentMethod === "mobilemoney"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Mobile Money</p>
                    <p className="text-sm text-gray-600">MTN, Airtel Money</p>
                  </div>
                  {paymentMethod === "mobilemoney" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>

              {/* Card Payment */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Debit/Credit Card</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard</p>
                  </div>
                  {paymentMethod === "card" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => setPaymentMethod("banktransfer")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  paymentMethod === "banktransfer"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-gray-600">Direct bank transfer</p>
                  </div>
                  {paymentMethod === "banktransfer" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Pay Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Pay {currencySymbol} {amount.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By completing this purchase, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
