import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, CheckCircle2, FileText, Lightbulb } from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "How to Write a Perfect Statement of Purpose (SOP)",
  description:
    "Master the art of writing a compelling Statement of Purpose. Learn structure, tips, common mistakes, and see examples for scholarship and university applications.",
  keywords: [
    "statement of purpose",
    "SOP writing",
    "SOP examples",
    "university application",
    "scholarship application",
  ],
  canonicalUrl: "/blog/write-perfect-sop",
});

export default function WritePerfectSOPPage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How to Write a Perfect Statement of Purpose (SOP)
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>December 28, 2024</span>
            </div>
            <span>15 min read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Your Statement of Purpose (SOP) is one of the most critical documents in your university or scholarship 
            application. It's your chance to tell your story, showcase your passion, and convince the admissions 
            committee why you're the perfect candidate. This comprehensive guide will help you write an outstanding SOP.
          </p>
        </div>

        <Card className="bg-primary-light border-2 border-primary mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What is a Statement of Purpose?</h2>
            <p className="text-lg text-gray-700 mb-4">
              A Statement of Purpose is a 1-2 page essay that explains:
            </p>
            <ul className="space-y-2 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Who you are and your background</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Why you want to study this specific program</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Why you chose this university</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Your career goals and how this program helps</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>What you'll contribute to the university</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SOP Structure (5-Paragraph Format)</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Introduction (150-200 words)</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Hook: Start with an engaging story or statement</li>
                        <li>Brief background introduction</li>
                        <li>State your interest in the field</li>
                        <li>Mention the program you're applying to</li>
                      </ul>
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
                      <h3 className="font-semibold text-lg mb-2">Academic Background (200-250 words)</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Relevant coursework and projects</li>
                        <li>Research experience</li>
                        <li>Academic achievements</li>
                        <li>How your background prepares you</li>
                      </ul>
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
                      <h3 className="font-semibold text-lg mb-2">Why This Program/University (200-250 words)</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Specific courses that interest you</li>
                        <li>Professors you want to work with</li>
                        <li>Research opportunities</li>
                        <li>University resources and facilities</li>
                        <li>Why this program aligns with your goals</li>
                      </ul>
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
                      <h3 className="font-semibold text-lg mb-2">Career Goals (150-200 words)</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Short-term goals (1-3 years)</li>
                        <li>Long-term goals (5-10 years)</li>
                        <li>How this program helps achieve them</li>
                        <li>Impact you want to make</li>
                      </ul>
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
                      <h3 className="font-semibold text-lg mb-2">Conclusion (100-150 words)</h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Summarize key points</li>
                        <li>Reinforce your fit</li>
                        <li>Confident closing statement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Writing Tips</h2>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Be Specific</h3>
                      <p className="text-green-800">Mention specific courses, professors, research areas. Generic statements don't stand out.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Show, Don't Tell</h3>
                      <p className="text-green-800">Use examples and stories instead of just stating facts. "I led a team of 5..." vs "I'm a leader."</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Connect Everything</h3>
                      <p className="text-green-800">Show how your past experiences connect to your future goals through this program.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Be Authentic</h3>
                      <p className="text-green-800">Write in your own voice. Admissions committees can spot fake enthusiasm.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Proofread Multiple Times</h3>
                      <p className="text-green-800">Typos and grammar errors create a bad impression. Have others review it too.</p>
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
                <li><strong>Being too generic:</strong> "I want to study because I love learning" - too vague</li>
                <li><strong>Repeating your CV:</strong> Don't just list achievements, explain their significance</li>
                <li><strong>Negative tone:</strong> Don't complain about your current situation</li>
                <li><strong>Too long or too short:</strong> Stick to 800-1000 words unless specified</li>
                <li><strong>Grammatical errors:</strong> Shows lack of attention to detail</li>
                <li><strong>Using the same SOP for all universities:</strong> Customize for each application</li>
                <li><strong>Being arrogant:</strong> Confidence is good, arrogance is not</li>
                <li><strong>Not answering the prompt:</strong> Read requirements carefully</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SOP Example Opening</h2>
            <Card className="bg-gray-50 border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">❌ Bad Opening:</h3>
                    <p className="text-gray-700 italic">
                      "I am writing to apply for the Master's program in Computer Science. I have always been interested 
                      in computers and want to further my education."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Good Opening:</h3>
                    <p className="text-gray-700 italic">
                      "When I developed my first mobile app at 16 to help farmers in my village track crop prices, 
                      I realized technology's power to transform lives. This experience sparked my passion for 
                      computer science and led me to pursue a Master's degree at [University], where I can combine 
                      my technical skills with my desire to create solutions for African communities."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Before You Submit</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Final Checklist:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Within word/character limit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>No spelling or grammar errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>University name and program mentioned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Specific details about the program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Clear career goals stated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Reviewed by 2-3 people</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Formatted correctly (font, spacing)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Writing Your SOP?</h2>
            <p className="text-xl mb-6 text-white/90">
              Our expert team can help you craft a compelling Statement of Purpose that stands out
            </p>
            <Link href="/services">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Get SOP Writing Help
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

