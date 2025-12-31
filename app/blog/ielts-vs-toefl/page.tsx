import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, CheckCircle2, X, Clock, DollarSign } from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "Understanding IELTS vs TOEFL: Which Test Should You Take?",
  description:
    "Compare IELTS and TOEFL to determine which English proficiency test is right for your study abroad goals. Learn about format, scoring, costs, and acceptance.",
  keywords: [
    "IELTS vs TOEFL",
    "English proficiency test",
    "IELTS test",
    "TOEFL test",
    "study abroad English test",
  ],
  canonicalUrl: "/blog/ielts-vs-toefl",
});

export default function IELTSvsTOEFLPage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Understanding IELTS vs TOEFL: Which Test Should You Take?
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>December 20, 2024</span>
            </div>
            <span>7 min read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            One of the first questions African students ask when planning to study abroad is: "Should I take IELTS or TOEFL?" 
            Both tests prove your English proficiency, but they're different in format, scoring, and acceptance. This guide 
            will help you decide which test is right for you.
          </p>
        </div>

        <Card className="bg-primary-light border-2 border-primary mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Comparison</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">IELTS</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>British English focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Paper or computer-based</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Score: 0-9 band scale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>More common in UK, Australia, Canada</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">TOEFL</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>American English focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Primarily computer-based</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Score: 0-120 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>More common in USA</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Format Comparison</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">IELTS Format</h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <strong>Listening:</strong> 30 minutes, 40 questions (4 sections)
                    </div>
                    <div>
                      <strong>Reading:</strong> 60 minutes, 40 questions (3 passages)
                    </div>
                    <div>
                      <strong>Writing:</strong> 60 minutes (2 tasks: essay + report/letter)
                    </div>
                    <div>
                      <strong>Speaking:</strong> 11-14 minutes (face-to-face interview)
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <strong>Total Time:</strong> ~2 hours 45 minutes
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">TOEFL Format</h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <strong>Reading:</strong> 54-72 minutes, 30-40 questions
                    </div>
                    <div>
                      <strong>Listening:</strong> 41-57 minutes, 28-39 questions
                    </div>
                    <div>
                      <strong>Speaking:</strong> 17 minutes, 4 tasks (recorded responses)
                    </div>
                    <div>
                      <strong>Writing:</strong> 50 minutes, 2 tasks (integrated + independent)
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <strong>Total Time:</strong> ~3 hours
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Scoring Systems</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">IELTS Scoring</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Band 9:</strong> Expert user</li>
                    <li><strong>Band 8:</strong> Very good user</li>
                    <li><strong>Band 7:</strong> Good user (most universities require 6.5-7.0)</li>
                    <li><strong>Band 6:</strong> Competent user</li>
                    <li><strong>Band 5:</strong> Modest user</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    You get individual scores for each section and an overall band score (average).
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">TOEFL Scoring</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>90-120:</strong> Advanced (most universities require 80-100)</li>
                    <li><strong>70-89:</strong> High-intermediate</li>
                    <li><strong>60-69:</strong> Intermediate</li>
                    <li><strong>0-59:</strong> Low-intermediate</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Each section scored 0-30, total score is sum of all sections.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Which Test Should You Take?</h2>
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-green-900">Choose IELTS if:</h3>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Applying to UK, Australia, Canada, or New Zealand universities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Prefer face-to-face speaking test</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>More comfortable with British English</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Want paper-based option</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-900">Choose TOEFL if:</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Applying to US universities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Prefer computer-based test</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>More comfortable with American English</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Good at typing quickly</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cost & Availability</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">IELTS</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Cost:</strong> $200-250 (varies by country)</li>
                    <li><strong>Test Dates:</strong> Multiple dates monthly</li>
                    <li><strong>Results:</strong> 5-7 days (computer) or 13 days (paper)</li>
                    <li><strong>Validity:</strong> 2 years</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">TOEFL</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Cost:</strong> $180-300 (varies by country)</li>
                    <li><strong>Test Dates:</strong> Multiple dates monthly</li>
                    <li><strong>Results:</strong> 6-10 days</li>
                    <li><strong>Validity:</strong> 2 years</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Preparation Tips</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">For IELTS:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Practice British English spelling and vocabulary</li>
                    <li>Focus on handwriting legibility (if taking paper test)</li>
                    <li>Practice speaking with native speakers or tutors</li>
                    <li>Take practice tests under timed conditions</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">For TOEFL:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Improve typing speed and accuracy</li>
                    <li>Practice American English spelling</li>
                    <li>Get comfortable with computer-based format</li>
                    <li>Practice integrated tasks (reading+listening+writing)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">University Acceptance</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                <strong>Most universities accept both tests.</strong> However:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>US universities often prefer TOEFL but accept IELTS</li>
                <li>UK universities prefer IELTS but accept TOEFL</li>
                <li>Canadian universities accept both equally</li>
                <li>Australian universities prefer IELTS</li>
                <li><strong>Always check your specific university's requirements!</strong></li>
              </ul>
            </div>
          </section>
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Preparing?</h2>
            <p className="text-xl mb-6 text-white/90">
              Our test preparation services can help you achieve your target score
            </p>
            <Link href="/services">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Get Test Prep Help
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

