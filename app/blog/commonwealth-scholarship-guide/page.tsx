import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Calendar, DollarSign, Globe } from "lucide-react";
import { ConsultingCTAInline, ConsultingCTABanner, ConsultingCTACompact } from "@/components/consulting-cta";

export const metadata: Metadata = generateSEO({
  title: "Commonwealth Scholarship 2026: Complete Application Guide",
  description:
    "Everything you need to know about Commonwealth Scholarships for African students. Eligibility, deadlines, amounts, and application tips for 2026.",
  keywords: [
    "commonwealth scholarship",
    "commonwealth scholarship 2026",
    "UK scholarships for African students",
    "fully funded UK scholarships",
    "commonwealth scholarship application",
  ],
  canonicalUrl: "/blog/commonwealth-scholarship-guide",
});

export default function CommonwealthScholarshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              ← Back to Blog
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Commonwealth Scholarship 2026: Complete Application Guide
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>15 min read</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            The Commonwealth Scholarship is one of the most prestigious fully-funded scholarship opportunities 
            for students from Commonwealth countries, including across Africa. With coverage of tuition, living 
            expenses, flights, and more, it's a dream scholarship for many aspiring students.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In this comprehensive guide, we'll cover everything you need to know about Commonwealth Scholarships 
            for 2026, including eligibility criteria, application process, deadlines, and insider tips to 
            strengthen your application.
          </p>
        </div>

        {/* CTA after intro */}
        <ConsultingCTACompact />

        {/* Quick Facts */}
        <Card className="mb-12 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Commonwealth Scholarship Quick Facts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Award Amount</p>
                  <p className="text-gray-700">£12,000 - £18,000/year + tuition covered</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Application Deadline</p>
                  <p className="text-gray-700">Usually December (varies by country)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Study Destination</p>
                  <p className="text-gray-700">United Kingdom</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Study Level</p>
                  <p className="text-gray-700">Masters & PhD</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-12">
          {/* What is covered */}
          <section>
            <h2 className="text-3xl font-bold mb-6">What Does Commonwealth Scholarship Cover?</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Full tuition fees</strong> at any UK university</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Living stipend</strong> of £12,000-£18,000 per year</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Round-trip airfare</strong> from your home country</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Thesis grant</strong> for research expenses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Study travel grant</strong> for conference attendance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Family allowances</strong> (if applicable)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Eligibility Criteria</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-3">General Requirements:</h3>
              <ul className="space-y-2 mb-6">
                <li>Citizen or permanent resident of a Commonwealth country</li>
                <li>Hold a bachelor's degree with at least upper second-class (2:1) honors</li>
                <li>Unable to afford to study in the UK without scholarship</li>
                <li>Not currently studying or working in a developed country</li>
                <li>Committed to returning to your home country after studies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">African Countries Eligible:</h3>
              <p className="text-gray-700 mb-4">
                Botswana, Cameroon, eSwatini, Gambia, Ghana, Kenya, Lesotho, Malawi, Mauritius, 
                Mozambique, Namibia, Nigeria, Rwanda, Seychelles, Sierra Leone, South Africa, Tanzania, 
                Uganda, Zambia, and more.
              </p>
            </div>
          </section>

          {/* Application Process */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Application Process (Step-by-Step)</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "Check Eligibility", desc: "Verify you meet all requirements for your country" },
                { step: 2, title: "Choose Your Course", desc: "Select a Masters/PhD program at any UK university" },
                { step: 3, title: "Prepare Documents", desc: "Academic transcripts, references, personal statement" },
                { step: 4, title: "Apply to University", desc: "Get admission offer from UK university first" },
                { step: 5, title: "Complete CSC Application", desc: "Submit through your national nominating agency" },
                { step: 6, title: "Wait for Results", desc: "Results typically announced in March-April" },
              ].map((item) => (
                <Card key={item.step} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-700">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Application Tips from Successful Scholars</h2>
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Start Early</p>
                      <p className="text-gray-700">Begin preparing 6-8 months before deadline</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Show Development Impact</p>
                      <p className="text-gray-700">Clearly explain how you'll contribute to your home country's development</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Choose the Right Course</p>
                      <p className="text-gray-700">Align your chosen program with Commonwealth development themes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Strong References Matter</p>
                      <p className="text-gray-700">Get references from academic supervisors who know your work well</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Expert Help CTA */}
          <ConsultingCTAInline />

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Find More Scholarships Like This</h2>
              <p className="text-xl mb-6 text-white/90">
                Use our AI-powered matcher to find fully-funded scholarships that match your profile
              </p>
              <Link href="/scholarships/match">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Find My Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Final Consulting CTA */}
        <ConsultingCTABanner />

        {/* Back to Blog */}
        <div className="text-center pt-8 mt-8 border-t border-gray-200">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              ← Back to All Blog Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
