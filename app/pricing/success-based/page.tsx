"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Shield, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export default function SuccessBasedPricing() {
  return (
    <div className="min-h-screen bg-primary-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Zero Risk, Pay When You Win</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-4">
            Success-Based Pricing
          </h1>
          <p className="text-lg text-gray-soft max-w-3xl mx-auto">
            No upfront costs. No risk. Pay only when you secure a scholarship. 
            We're so confident in our service, we only get paid when you succeed.
          </p>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white mb-4">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Use Platform Free",
                    description: "Full access to all features at no cost",
                  },
                  {
                    step: "2",
                    title: "Find Scholarships",
                    description: "AI matching, search, and application support",
                  },
                  {
                    step: "3",
                    title: "Win Scholarship",
                    description: "Secure your fully-funded opportunity",
                  },
                  {
                    step: "4",
                    title: "Pay Success Fee",
                    description: "Only 5% of scholarship value (installments available)",
                  },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold">{item.step}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Examples */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Real Examples</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                scholarship: "$10,000",
                successFee: "$500",
                monthly: "$100/month × 5",
                example: "Chevening Scholarship",
              },
              {
                scholarship: "$20,000",
                successFee: "$1,000",
                monthly: "$200/month × 5",
                example: "Mastercard Foundation",
              },
              {
                scholarship: "$50,000",
                successFee: "$2,500",
                monthly: "$500/month × 5",
                example: "Full Tuition + Living",
              },
            ].map((example, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{example.example}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-primary">{example.scholarship}</span>
                      <span className="text-gray-soft ml-2">scholarship</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary-light rounded-lg">
                      <span className="text-sm font-medium">Success Fee (5%)</span>
                      <span className="text-lg font-bold text-primary">{example.successFee}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-soft">Or pay monthly</span>
                      <span className="text-sm font-medium">{example.monthly}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-soft">
                        ✅ No upfront payment<br />
                        ✅ Pay only if you win<br />
                        ✅ Installment options<br />
                        ✅ Mobile money accepted
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why Success-Based Pricing?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Zero Risk",
                    description: "No upfront costs. You only pay when you secure a scholarship.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Aligned Incentives",
                    description: "We only succeed when you succeed. We're invested in your success.",
                  },
                  {
                    icon: DollarSign,
                    title: "Affordable",
                    description: "5% of scholarship value is much less than upfront consulting fees.",
                  },
                  {
                    icon: Clock,
                    title: "Flexible Payments",
                    description: "Pay in installments over 3-6 months. Mobile money accepted.",
                  },
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-light rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-soft">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Success-Based vs Traditional</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-light">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Success-Based</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Traditional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Upfront Cost",
                        success: "Free",
                        traditional: "$299 - $799",
                      },
                      {
                        feature: "Risk",
                        success: "Zero (pay only if you win)",
                        traditional: "High (pay regardless of outcome)",
                      },
                      {
                        feature: "Total Cost (for $20k scholarship)",
                        success: "$1,000 (5%)",
                        traditional: "$299 - $799",
                      },
                      {
                        feature: "Payment Timing",
                        success: "After winning",
                        traditional: "Before service",
                      },
                      {
                        feature: "Installment Options",
                        success: "Yes (3-6 months)",
                        traditional: "Limited",
                      },
                    ].map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 text-sm font-medium">{row.feature}</td>
                        <td className="px-6 py-4 text-center text-sm text-success font-semibold">
                          {row.success}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-soft">
                          {row.traditional}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Risk-Free?</h2>
            <p className="text-gray-soft mb-6">
              Get full access to our platform today. Pay only when you secure a scholarship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-xs text-gray-soft mt-4">
              No credit card required. No commitment. Start your journey today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

