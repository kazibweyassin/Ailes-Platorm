import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Calendar, DollarSign, Globe, CheckCircle2 } from "lucide-react";
import { ConsultingCTAInline, ConsultingCTABanner, ConsultingCTACompact } from "@/components/consulting-cta";

export const metadata: Metadata = generateSEO({
  title: "Chevening Scholarship 2026: Complete Application Guide for African Students",
  description:
    "Everything you need to know about Chevening Scholarships: eligibility, application process, deadlines, and tips to win this prestigious UK scholarship worth £30,000+.",
  keywords: [
    "chevening scholarship",
    "chevening scholarship 2026",
    "chevening application",
    "UK government scholarship",
    "fully funded UK scholarships",
    "chevening for African students",
  ],
  canonicalUrl: "/blog/chevening-scholarship-guide",
});

export default function CheveningScholarshipPage() {
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
            Chevening Scholarship 2026: Your Complete Application Guide
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>18 min read</span>
            </div>
          </div>
        </div>

        {/* Quick Facts Card */}
        <Card className="mb-12 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Chevening Scholarship at a Glance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Full Funding</p>
                  <p className="text-gray-700">£30,000+ covering tuition, living, flights</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Application Opens</p>
                  <p className="text-gray-700">August 2026 (closes November 2026)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Study Destination</p>
                  <p className="text-gray-700">United Kingdom - Any university</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Award Level</p>
                  <p className="text-gray-700">1-year Masters programs only</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            The Chevening Scholarship is the UK government's flagship international scholarship program, 
            funding future leaders and influencers from around the world to pursue one-year master's degrees 
            in the UK. With over 1,500 scholarships awarded annually across 160+ countries, it's one of the 
            most prestigious and competitive scholarships available to African students.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In this comprehensive guide, we'll walk you through everything you need to know to craft a 
            winning Chevening application, from understanding eligibility requirements to writing compelling 
            essays that showcase your leadership potential.
          </p>
        </div>

        {/* CTA after intro */}
        <ConsultingCTACompact />

        {/* What's Covered */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Does Chevening Cover?</h2>
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Full tuition fees at any UK university",
                  "Monthly living allowance (£1,347/month)",
                  "Return airfare to the UK",
                  "Arrival and departure allowances",
                  "Visa application costs",
                  "Travel grant for conferences",
                  "Thesis or dissertation grant",
                  "Access to exclusive networking events",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Eligibility */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Eligibility Requirements</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">✅ You MUST have:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Citizenship of a Chevening-eligible country (most African countries qualify)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>An undergraduate degree that qualifies for UK Masters entry</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>At least 2 years</strong> (2,800 hours) of work experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Admission to 3 different UK universities (conditional offers accepted)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Meet English language requirements (IELTS, TOEFL, or equivalent)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-600">❌ You are NOT eligible if:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You hold British or dual British citizenship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You have previously studied in the UK with UK government funding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You are employees of Her Majesty's Government, or family members</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Application Timeline */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Application Timeline 2026/2027</h2>
          <div className="space-y-4">
            {[
              { month: "August 2026", event: "Applications open", action: "Start preparing documents" },
              { month: "November 2026", event: "Applications close", action: "Submit by 5pm UK time" },
              { month: "January 2027", event: "First round results", action: "Shortlisted for interviews" },
              { month: "February-March 2027", event: "Interviews", action: "In-person or video interviews" },
              { month: "June 2027", event: "Final results", action: "Award announcements" },
              { month: "September 2027", event: "Course start", action: "Begin studies in UK" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.month}</p>
                  <p className="text-gray-700">{item.event}</p>
                </div>
                <div className="text-sm text-gray-600 hidden md:block">{item.action}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Essay Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The 4 Chevening Essays (Most Important!)</h2>
          <p className="text-lg text-gray-700 mb-6">
            Your essays are the heart of your Chevening application. Each essay has a strict 500-word limit. 
            Here's what you need to know:
          </p>
          
          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Essay 1: Leadership and Influence</h3>
                <p className="text-gray-700 mb-3">
                  <em>"Chevening is looking for individuals who will be future leaders or influencers in their home countries..."</em>
                </p>
                <p className="text-gray-700 mb-3"><strong>What they want to see:</strong></p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Specific examples of when you led teams or influenced outcomes</li>
                  <li>Impact of your leadership (quantify with numbers if possible)</li>
                  <li>Challenges you overcame</li>
                  <li>How you developed others</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Pro Tip:</p>
                  <p className="text-sm text-blue-800">Use the STAR method: Situation, Task, Action, Result. Be specific with numbers and outcomes.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Essay 2: Networking</h3>
                <p className="text-gray-700 mb-3">
                  <em>"Explain how you build and maintain relationships in professional contexts..."</em>
                </p>
                <p className="text-gray-700 mb-3"><strong>What to include:</strong></p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Your networking strategies</li>
                  <li>Specific examples of valuable relationships you've built</li>
                  <li>How these relationships led to opportunities or results</li>
                  <li>Your plans to use the Chevening network</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Essay 3: Study in the UK</h3>
                <p className="text-gray-700 mb-3">
                  <em>"Why have you chosen your courses? What impact will they have?"</em>
                </p>
                <p className="text-gray-700 mb-3"><strong>Must address:</strong></p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Why UK specifically (not just "quality education")</li>
                  <li>Why these 3 universities and courses</li>
                  <li>How courses align with your career goals</li>
                  <li>Specific modules, professors, or research you're excited about</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Essay 4: Career Plan</h3>
                <p className="text-gray-700 mb-3">
                  <em>"What are your career plans and how will Chevening help?"</em>
                </p>
                <p className="text-gray-700 mb-3"><strong>Structure:</strong></p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Short-term goals (0-5 years)</li>
                  <li>Long-term goals (5-10 years)</li>
                  <li>Impact on your home country</li>
                  <li>How Chevening specifically helps you achieve these goals</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Expert Help CTA after essays section */}
        <ConsultingCTAInline />

        {/* Tips from Winners */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Insider Tips from Chevening Alumni</h2>
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { tip: "Start 6 months early", why: "You need time to apply to universities, get offers, and craft perfect essays" },
                  { tip: "Be authentic", why: "Chevening wants genuine stories, not what you think they want to hear" },
                  { tip: "Quantify your impact", why: "Numbers make your achievements concrete: '20% increase' beats 'improved'" },
                  { tip: "Show country commitment", why: "You MUST return home. Show deep ties and specific post-study plans" },
                  { tip: "Get feedback early", why: "Have mentors review essays. Fresh eyes catch unclear points" },
                  { tip: "Research your universities", why: "Mention specific professors, courses, facilities - show you've done homework" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{item.tip}</p>
                      <p className="text-gray-700 text-sm">{item.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
          <Card className="border-red-200">
            <CardContent className="p-6">
              <ul className="space-y-3 text-gray-700">
                {[
                  "Generic essays that could apply to any scholarship",
                  "Not addressing all parts of the essay questions",
                  "Exceeding the 500-word limit (automatic disqualification!)",
                  "Choosing courses that don't align with career goals",
                  "Not getting 3 university offers in time",
                  "Weak or generic references",
                  "Not demonstrating leadership clearly",
                  "Forgetting to show commitment to returning home",
                ].map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Application?</h2>
            <p className="text-xl mb-6 text-white/90">
              Find more fully-funded scholarships like Chevening using our AI-powered matcher
            </p>
            <Link href="/scholarships/match">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Find My Perfect Scholarships
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
          <p className="text-gray-700 leading-relaxed">
            Winning a Chevening Scholarship is highly competitive, but with thorough preparation and compelling 
            essays, African students have excellent chances. The key is to start early, be authentic in your 
            storytelling, and clearly demonstrate your leadership potential and commitment to making an impact 
            in your home country.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Remember: Chevening isn't just about academic excellence - they're looking for future leaders who 
            will create positive change. Show them why you're that person.
          </p>
        </div>

        {/* Final Consulting CTA */}
        <ConsultingCTABanner />

        {/* Back to Blog */}
        <div className="text-center pt-8 border-t border-gray-200">
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
