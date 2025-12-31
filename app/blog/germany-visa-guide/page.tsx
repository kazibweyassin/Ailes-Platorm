import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, CheckCircle2, FileText, Clock, DollarSign } from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "Visa Requirements for Germany: Step-by-Step Guide",
  description:
    "Complete guide to German student visa for African students. Learn about required documents, application process, timelines, and interview tips.",
  keywords: [
    "Germany student visa",
    "German visa requirements",
    "study in Germany",
    "student visa Germany",
    "visa application Germany",
  ],
  canonicalUrl: "/blog/germany-visa-guide",
});

export default function GermanyVisaGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Visa Requirements for Germany: Step-by-Step Guide
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 5, 2025</span>
            </div>
            <span>10 min read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Germany is an excellent study destination offering high-quality education, often with low or no tuition fees. 
            However, navigating the visa process can be complex. This guide will walk you through everything you need to 
            know about obtaining a German student visa.
          </p>
        </div>

        <Card className="bg-primary-light border-2 border-primary mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types of German Student Visas</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Student Applicant Visa (Visum zur Studienbewerbung)</h3>
                <p className="text-gray-700">If you need to be in Germany to apply for admission in person. Valid for 3 months, can be extended.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Student Visa (Visum zu Studienzwecken)</h3>
                <p className="text-gray-700">For students who have been admitted to a German university. Valid for 3 months, must be converted to residence permit.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Language Course Visa</h3>
                <p className="text-gray-700">For intensive German language courses (not for university studies).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Required Documents</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Essential Documents</h3>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Completed visa application form (2 copies)</li>
                        <li>Valid passport (valid for at least 12 months)</li>
                        <li>Two recent biometric passport photos</li>
                        <li>Letter of admission from German university</li>
                        <li>Proof of financial resources (€11,208 per year)</li>
                        <li>Health insurance certificate</li>
                        <li>Academic certificates and transcripts</li>
                        <li>German language proficiency certificate (if required)</li>
                        <li>CV/Resume</li>
                        <li>Motivation letter</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proof of Financial Resources</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>You must prove you have <strong>€11,208 per year</strong> (as of 2025) to cover living expenses. This can be shown through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Blocked Account (Sperrkonto):</strong> Most common method - open at German bank, funds are blocked</li>
                <li><strong>Scholarship Certificate:</strong> If you have a scholarship covering expenses</li>
                <li><strong>Bank Guarantee:</strong> From a German bank</li>
                <li><strong>Parent's Financial Commitment:</strong> With proof of income</li>
              </ul>
              <Card className="bg-blue-50 border-blue-200 mt-4">
                <CardContent className="p-6">
                  <p className="font-semibold text-blue-900 mb-2">💡 Tip:</p>
                  <p className="text-blue-800">The blocked account is the easiest and most accepted method. You can open it online before applying for the visa.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Step-by-Step Application Process</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Book Appointment</h3>
                      <p className="text-gray-700">Book an appointment at the German embassy/consulate in your country. Book early - slots fill up quickly!</p>
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
                      <h3 className="font-semibold text-lg mb-2">Prepare Documents</h3>
                      <p className="text-gray-700">Gather all required documents. Get translations if needed (certified translations required).</p>
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
                      <h3 className="font-semibold text-lg mb-2">Submit Application</h3>
                      <p className="text-gray-700">Attend appointment, submit documents, pay visa fee (€75), provide biometrics.</p>
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
                      <h3 className="font-semibold text-lg mb-2">Wait for Processing</h3>
                      <p className="text-gray-700">Processing takes 4-12 weeks. You can track your application online.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Collect Visa</h3>
                      <p className="text-gray-700">Once approved, collect your visa from the embassy.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Register in Germany</h3>
                      <p className="text-gray-700">Within 2 weeks of arrival, register at local registration office (Einwohnermeldeamt) and apply for residence permit.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visa Interview Tips</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Common Questions:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-green-800">
                    <li>Why do you want to study in Germany?</li>
                    <li>Why did you choose this specific university/program?</li>
                    <li>How will you finance your studies?</li>
                    <li>What are your plans after graduation?</li>
                    <li>Do you speak German? (Even if program is in English)</li>
                  </ul>
                </CardContent>
              </Card>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Tips for Success:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be honest and confident</li>
                  <li>Show genuine interest in your program</li>
                  <li>Demonstrate clear career goals</li>
                  <li>Bring all original documents</li>
                  <li>Dress professionally</li>
                  <li>Arrive early</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeline & Important Dates</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Application Timeline</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Apply 3-4 months before your program starts</li>
                        <li>Processing time: 4-12 weeks</li>
                        <li>Book appointment: 2-3 months in advance</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DollarSign className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Costs</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Visa application fee: €75</li>
                        <li>Blocked account: €11,208 (refundable)</li>
                        <li>Health insurance: €80-120/month</li>
                        <li>Translation costs: Varies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Mistakes to Avoid</h2>
            <div className="space-y-3 text-lg text-gray-700">
              <ul className="list-disc pl-6 space-y-2">
                <li>Applying too late - start 3-4 months before</li>
                <li>Insufficient financial proof</li>
                <li>Missing or incorrect documents</li>
                <li>Not having health insurance</li>
                <li>Unclear motivation letter</li>
                <li>Not booking appointment early enough</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">After Arrival in Germany</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Register your address</strong> at local registration office (within 2 weeks)</li>
                <li><strong>Apply for residence permit</strong> at Foreigners' Office (Ausländerbehörde)</li>
                <li><strong>Open a bank account</strong> (unblock your blocked account)</li>
                <li><strong>Get health insurance</strong> if not already done</li>
                <li><strong>Enroll at university</strong> and get student ID</li>
              </ol>
            </div>
          </section>
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Application?</h2>
            <p className="text-xl mb-6 text-white/90">
              Our team can help you navigate the visa process and ensure all documents are in order
            </p>
            <Link href="/services">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Get Application Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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

