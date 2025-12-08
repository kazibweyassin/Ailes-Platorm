import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Pricing & Packages - Transparent Education Consulting Rates",
  description:
    "Affordable study abroad consulting packages. From basic scholarship search to premium full-service packages. Transparent pricing, no hidden fees. Free initial consultation available.",
  keywords: ["study abroad cost", "consulting fees", "scholarship services pricing", "education consulting rates"],
  canonicalUrl: "/pricing",
});

export default function PricingPage() {
  const packages = [
    {
      name: "Free Tier",
      price: "$0",
      period: "Forever",
      description: "Perfect for getting started with your study abroad journey",
      features: [
        "Access to scholarship database",
        "Basic university matching",
        "Educational resources and blog",
        "Email support",
        "Application guides",
      ],
      notIncluded: [
        "Personalized consultation",
        "Application review",
        "Visa assistance",
        "Priority support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Standard Package",
      price: "$299",
      period: "One-time",
      description: "Comprehensive support for your application journey",
      features: [
        "Everything in Free Tier",
        "1-on-1 consultation session",
        "University matching (up to 5 matches)",
        "Application review and feedback",
        "SOP editing (1 revision)",
        "Document checklist and guidance",
        "Email and chat support",
        "Application deadline tracking",
      ],
      notIncluded: [
        "Visa application assistance",
        "Multiple SOP revisions",
        "Pre-departure orientation",
      ],
      cta: "Choose Standard",
      popular: true,
    },
    {
      name: "Premium Mentorship",
      price: "$799",
      period: "One-time",
      description: "Complete end-to-end support with dedicated mentor",
      features: [
        "Everything in Standard Package",
        "Dedicated personal mentor",
        "Unlimited consultations",
        "Unlimited university matches",
        "SOP editing (unlimited revisions)",
        "Visa application assistance",
        "Interview preparation",
        "Pre-departure orientation",
        "Priority support (24/7)",
        "Application status tracking",
        "Scholarship application support",
        "Post-admission support",
      ],
      notIncluded: [],
      cta: "Choose Premium",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-primary-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-4">
            Choose Your Package
          </h1>
          <p className="text-lg text-gray-soft max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Start free or choose a package
            that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative ${
                pkg.popular
                  ? "border-2 border-primary shadow-lg scale-105"
                  : "hover:shadow-lg transition-shadow"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-dark">{pkg.price}</span>
                  <span className="text-gray-soft ml-2">/{pkg.period}</span>
                </div>
                <CardDescription className="text-base mt-2">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-soft">{feature}</span>
                    </li>
                  ))}
                  {pkg.notIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start opacity-50">
                      <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-soft line-through">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="block">
                  <Button
                    className={`w-full ${
                      pkg.popular ? "" : "variant-outline"
                    }`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    {pkg.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade my package later?</h3>
                <p className="text-gray-soft">
                  Yes! You can upgrade from Free to Standard or Premium at any time. We'll
                  apply any payments you've already made toward your new package.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-soft">
                  We accept credit cards, debit cards, bank transfers, and mobile money
                  payments. All transactions are secure and encrypted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a money-back guarantee?</h3>
                <p className="text-gray-soft">
                  We offer a 30-day money-back guarantee for Standard and Premium packages
                  if you're not satisfied with our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer payment plans?</h3>
                <p className="text-gray-soft">
                  Yes, we offer flexible payment plans for Premium packages. Contact us
                  to discuss options that work for you.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-soft mb-4">Still have questions?</p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}



