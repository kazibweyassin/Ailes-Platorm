import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { getFeaturedStories } from "@/lib/success-stories";

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
      name: "Free",
      price: "$0",
      period: "Forever",
      description: "Start your scholarship search today",
      outcome: "🔍 Discover opportunities matching your profile",
      features: [
        "Browse 10,000+ verified scholarships",
        "AI scholarship matching (5 matches)",
        "Basic deadline calendar",
        "University search & comparison",
        "Educational guides & tips",
        "Community access",
      ],
      notIncluded: [
        "Application checklists",
        "AI Copilot essay help",
        "WhatsApp deadline alerts",
        "Profile review",
      ],
      cta: "Start Free",
      href: "/find-scholarships",
      popular: false,
    },
    {
      name: "Premium Access",
      price: "$5",
      period: "month",
      description: "Everything you need to apply successfully",
      outcome: "🎯 10x your chances with guided applications",
      results: "Includes: Scholarships • Visa Guide • AI Copilot • WhatsApp Alerts",
      features: [
        "Access to 10,000+ verified scholarships",
        "Visa guidance & document checklist",
        "Unlimited AI scholarship matching",
        "Application checklists for every scholarship",
        "AI Copilot for essay writing & review",
        "WhatsApp deadline alerts (never miss a deadline)",
        "Profile strength analysis",
        "Essay templates & examples",
        "Priority email support",
      ],
      notIncluded: [
        "Expert consultation",
        "Done-for-you applications",
      ],
      cta: "Get Premium - $5/mo",
      href: "/payment/checkout?plan=premium",
      popular: true,
      badge: "Best Value",
    },
    {
      name: "Standard Package",
      price: "$299",
      period: "One-time",
      description: "We handle everything - you get admitted with funding",
      outcome: "🎓 Get admitted to your dream university with a scholarship",
      results: "Average outcome: $18,000 scholarship | 85% admission rate | Save 55+ hours",
      features: [
        "Everything in Premium +",
        "Expert 1-hour consultation (personalized roadmap)",
        "5 University + Scholarship matches (pre-screened)",
        "Professional Statement of Purpose (2 revisions)",
        "Complete application review before submission",
        "3-5 Scholarship applications submitted for you",
        "Document preparation guidance",
        "Basic visa guidance & document checklist",
        "WhatsApp support until admission decision",
      ],
      notIncluded: [
        "Unlimited consultations",
        "Visa interview preparation",
      ],
      cta: "Get Started - $299",
      href: "/payment/checkout?plan=standard",
      popular: false,
      guarantee: "💚 50% refund if not admitted to any of 5 universities",
    },
    {
      name: "Premium Mentorship",
      price: "$799",
      period: "One-time",
      description: "Complete concierge service with dedicated mentor",
      outcome: "🚀 Maximum success with full hand-holding from application to landing",
      results: "Average outcome: $25,000+ scholarship | 92% admission rate | Stress-free",
      features: [
        "Everything in Standard +",
        "Dedicated personal mentor (direct WhatsApp)",
        "Unlimited 1-on-1 consultations",
        "10 University + Scholarship matches",
        "Unlimited SOP revisions",
        "Test prep resources (IELTS, TOEFL)",
        "Complete visa assistance & interview prep",
        "10+ scholarship applications submitted",
        "Pre-departure orientation",
        "Post-admission support (3 months)",
        "Priority 24/7 support (2-hour response)",
      ],
      notIncluded: [],
      cta: "Get Premium - $799",
      href: "/payment/checkout?plan=mentorship",
      popular: false,
      guarantee: "💚 50% refund if not admitted + lifetime mentorship",
    },
  ];

  return (
    <div className="min-h-screen bg-primary-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
            <span className="font-semibold">✨ New: Pay When You Win Option Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-4">
            Get Admitted with a Scholarship
          </h1>
          <p className="text-lg text-gray-soft max-w-3xl mx-auto mb-4">
            From application to acceptance, we handle everything. Average scholarship: $18,000. 
            Success rate: 85%. Choose the package that fits your goals.
          </p>
          <Link href="/pricing/success-based">
            <Button variant="outline" size="sm">
              Learn About Success-Based Pricing (Pay Only When You Win)
            </Button>
          </Link>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative ${
                pkg.popular
                  ? "border-2 border-primary shadow-xl scale-105 z-10"
                  : "hover:shadow-lg transition-shadow"
              }`}
            >
              {pkg.popular && pkg.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {pkg.badge}
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
                {pkg.outcome && (
                  <div className="mt-3 p-3 bg-primary-light rounded-lg">
                    <p className="text-sm font-semibold text-primary">{pkg.outcome}</p>
                  </div>
                )}
                {pkg.results && (
                  <div className="mt-2 text-xs text-gray-600">
                    {pkg.results}
                  </div>
                )}
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
                {pkg.guarantee && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800">{pkg.guarantee}</p>
                  </div>
                )}
                <Link href={pkg.href || "/contact"} className="block">
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

        {/* Comparison Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Why Choose Ailes Global?</CardTitle>
              <CardDescription>See how we compare to doing it yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 w-1/3"></th>
                      <th className="text-center py-3 px-4 text-gray-soft w-1/3">DIY (On Your Own)</th>
                      <th className="text-center py-3 px-4 bg-primary-light font-semibold w-1/3">With Ailes Global</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Time Required</td>
                      <td className="text-center py-3 px-4 text-gray-soft">60+ hours</td>
                      <td className="text-center py-3 px-4 bg-primary-light font-semibold">5 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">University Research</td>
                      <td className="text-center py-3 px-4 text-gray-soft">20 hours guessing</td>
                      <td className="text-center py-3 px-4 bg-primary-light">✅ We match based on data</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Scholarship Hunting</td>
                      <td className="text-center py-3 px-4 text-gray-soft">15 hours, miss deadlines</td>
                      <td className="text-center py-3 px-4 bg-primary-light">✅ We apply for you</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Essay Writing</td>
                      <td className="text-center py-3 px-4 text-gray-soft">10+ hours trial & error</td>
                      <td className="text-center py-3 px-4 bg-primary-light">✅ Expert writes it</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Avoid Mistakes</td>
                      <td className="text-center py-3 px-4 text-gray-soft">❌ Learn from rejections</td>
                      <td className="text-center py-3 px-4 bg-primary-light">✅ Expert review</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Scholarship Success Rate</td>
                      <td className="text-center py-3 px-4 text-gray-soft">~30%</td>
                      <td className="text-center py-3 px-4 bg-primary-light font-semibold">78%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Admission Success Rate</td>
                      <td className="text-center py-3 px-4 text-gray-soft">~40%</td>
                      <td className="text-center py-3 px-4 bg-primary-light font-semibold">85%</td>
                    </tr>
                    <tr className="border-t-2 border-primary">
                      <td className="py-3 px-4 font-bold">Total Investment</td>
                      <td className="text-center py-3 px-4 font-medium">$0 + 60 hours + stress</td>
                      <td className="text-center py-3 px-4 bg-primary-light font-bold">$299 + 5 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-center mt-6 text-sm text-gray-soft">
                💡 Your time is valuable. We save you 55+ hours and double your success rate.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-dark mb-4">
              Real Students, Real Results
            </h2>
            <p className="text-gray-soft text-lg">
              Students who found scholarships through Ailes Global
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {getFeaturedStories().map((story, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-light flex items-center justify-center">
                      {story.image.startsWith('/') ? (
                        <Image
                          src={story.image}
                          alt={`${story.name}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{story.image}</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">{story.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {story.program}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">"{story.testimonial}"</p>
                  <div className="text-sm text-primary font-medium">
                    {story.scholarship}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/success-stories">
              <Button variant="outline" size="lg">
                View All Success Stories →
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What exactly am I paying for?</h3>
                <p className="text-gray-soft">
                  You're paying for results: getting admitted to a university with scholarship funding. 
                  We handle all applications, write your essays, apply to scholarships, and support you 
                  until you get your acceptance letter. Average outcome: $18,000 scholarship.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What if I don't get admitted?</h3>
                <p className="text-gray-soft">
                  We offer a 50% refund guarantee. If you follow our process and don't get admitted 
                  to at least 1 of your 5 matched universities within 6 months, we refund 50% - no questions asked.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How is this different from doing it myself?</h3>
                <p className="text-gray-soft">
                  DIY takes 60+ hours with a 40% success rate. With us, you invest 5 hours with an 85% success rate. 
                  We know which universities accept students like you, which scholarships to target, and how to write 
                  winning applications. Our experts have helped 127+ students get admitted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-soft">
                  We accept credit cards, debit cards, bank transfers, and mobile money payments (M-Pesa, MTN, Airtel). 
                  All transactions are secure and encrypted. Payment plans available for Premium package.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade my package later?</h3>
                <p className="text-gray-soft">
                  Yes! You can upgrade from Free to Standard or Premium at any time. We'll credit any 
                  payments you've already made toward your new package.
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
