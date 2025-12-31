import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, CheckCircle2, DollarSign, GraduationCap, Globe } from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "How to Study in Canada: Complete Guide for African Students",
  description:
    "Complete guide to studying in Canada for African students. Learn about application requirements, visa processes, living costs, scholarships, and universities.",
  keywords: [
    "study in Canada",
    "Canada student visa",
    "Canadian universities",
    "study abroad Canada",
    "African students Canada",
  ],
  canonicalUrl: "/blog/study-in-canada",
});

export default function StudyInCanadaPage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How to Study in Canada: Complete Guide for African Students
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 15, 2025</span>
            </div>
            <span>8 min read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Canada has become one of the most popular study destinations for African students, offering world-class 
            education, multicultural communities, and excellent post-graduation opportunities. This comprehensive guide 
            will walk you through everything you need to know about studying in Canada.
          </p>
        </div>

        <Card className="bg-primary-light border-2 border-primary mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Study in Canada?</h2>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>World-Class Education:</strong> Canadian universities rank among the best globally</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Affordable Tuition:</strong> Lower costs compared to US and UK</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Post-Graduation Work:</strong> Work permits available after graduation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Multicultural Environment:</strong> Welcoming to international students</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Pathway to Permanent Residence:</strong> Opportunities to stay after studies</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Requirements</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-2">Academic Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>High school diploma or equivalent (for undergraduate programs)</li>
                  <li>Bachelor's degree (for master's programs)</li>
                  <li>Minimum GPA of 3.0/4.0 (varies by university)</li>
                  <li>Official transcripts from all previous institutions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">English Language Proficiency</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IELTS: Minimum 6.5 overall (some programs require 7.0+)</li>
                  <li>TOEFL: Minimum 90 (internet-based)</li>
                  <li>Some universities accept Duolingo English Test</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Required Documents</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Completed application form</li>
                  <li>Statement of Purpose (SOP)</li>
                  <li>Letters of recommendation (2-3)</li>
                  <li>CV/Resume</li>
                  <li>Proof of financial support</li>
                  <li>Passport copy</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Timeline</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">September - December (Year Before)</h3>
                      <p className="text-gray-700">Research universities and programs, prepare for language tests, gather documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">January - March</h3>
                      <p className="text-gray-700">Submit applications (deadlines vary, typically January-March for September intake)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">April - June</h3>
                      <p className="text-gray-700">Receive admission decisions, accept offer, pay deposit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">May - August</h3>
                      <p className="text-gray-700">Apply for study permit, book flights, arrange accommodation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Visa (Study Permit) Process</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-2">Required Documents</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Letter of acceptance from Designated Learning Institution (DLI)</li>
                  <li>Proof of financial support (minimum CAD $10,000 per year + tuition)</li>
                  <li>Passport valid for duration of stay</li>
                  <li>Medical exam (if required)</li>
                  <li>Police clearance certificate</li>
                  <li>Biometrics</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Processing Time</h3>
                <p>Typically 4-6 weeks, but can take up to 12 weeks during peak seasons</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Application Fee</h3>
                <p>CAD $150 for study permit</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cost of Studying in Canada</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold">Tuition Fees</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>Undergraduate: CAD $15,000 - $35,000/year</li>
                    <li>Graduate: CAD $10,000 - $25,000/year</li>
                    <li>MBA: CAD $30,000 - $60,000/year</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold">Living Costs</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>Accommodation: CAD $500 - $1,500/month</li>
                    <li>Food: CAD $300 - $500/month</li>
                    <li>Transport: CAD $100 - $150/month</li>
                    <li>Other expenses: CAD $200 - $400/month</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-gray-700">
              <strong>Total estimated cost:</strong> CAD $25,000 - $45,000 per year (including tuition and living expenses)
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Universities in Canada</h2>
            <div className="space-y-3 text-lg text-gray-700">
              <ul className="list-disc pl-6 space-y-2">
                <li>University of Toronto</li>
                <li>University of British Columbia</li>
                <li>McGill University</li>
                <li>University of Alberta</li>
                <li>McMaster University</li>
                <li>University of Waterloo</li>
                <li>Western University</li>
                <li>Queen's University</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Scholarships for African Students</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>Several scholarships are available specifically for African students:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vanier Canada Graduate Scholarships</li>
                <li>University of Toronto African Scholars Program</li>
                <li>Mastercard Foundation Scholars Program</li>
                <li>Lester B. Pearson International Scholarship</li>
                <li>University-specific scholarships</li>
              </ul>
              <p className="mt-4">
                <Link href="/blog/top-20-scholarships-2026" className="text-primary hover:underline font-semibold">
                  View our complete list of scholarships →
                </Link>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Working While Studying</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>International students in Canada can work:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>On-campus:</strong> Unlimited hours</li>
                <li><strong>Off-campus:</strong> Up to 20 hours/week during studies, full-time during breaks</li>
                <li><strong>Co-op/Internship:</strong> If part of your program</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Post-Graduation Opportunities</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>After graduation, you can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Apply for Post-Graduation Work Permit (PGWP) - valid for up to 3 years</li>
                <li>Gain Canadian work experience</li>
                <li>Apply for Permanent Residence through Express Entry or Provincial Nominee Programs</li>
              </ul>
            </div>
          </section>
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Study in Canada?</h2>
            <p className="text-xl mb-6 text-white/90">
              Use our AI-powered platform to find scholarships and universities that match your profile
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships/match">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Find Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/university-matcher">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Find Universities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-8 border-t border-gray-200">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              ← Back to All Blog Posts
            </Button>
          </Link>
        </div>
      </article>
      <EmailCapturePopup />
    </div>
  );
}

