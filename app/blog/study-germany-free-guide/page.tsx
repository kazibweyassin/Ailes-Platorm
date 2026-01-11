import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, CheckCircle2, Euro, Plane, Home } from "lucide-react";
import { ConsultingCTAInline, ConsultingCTABanner, ConsultingCTACompact } from "@/components/consulting-cta";

export const metadata: Metadata = generateSEO({
  title: "Study in Germany for Free: Complete Guide for African Students 2026",
  description:
    "Discover how to study in Germany for free! Learn about tuition-free universities, living costs, visa requirements, and scholarships for African students.",
  keywords: [
    "study in germany free",
    "tuition free universities germany",
    "germany student visa",
    "study in germany for african students",
    "cost of living germany students",
    "german universities no tuition",
  ],
  canonicalUrl: "/blog/study-germany-free-guide",
});

export default function StudyGermanyFreePage() {
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
            Study in Germany for FREE: Complete Guide 2026
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Yes, you can study in one of Europe's best education systems without paying tuition fees! 
            Here's everything African students need to know.
          </p>
        </div>

        {/* Quick Facts */}
        <Card className="mb-12 bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Germany?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">€0</div>
                <p className="text-gray-700 font-semibold">Tuition Fees</p>
                <p className="text-sm text-gray-600">at public universities</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">400+</div>
                <p className="text-gray-700 font-semibold">Universities</p>
                <p className="text-sm text-gray-600">offering quality education</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">1,000+</div>
                <p className="text-gray-700 font-semibold">English Programs</p>
                <p className="text-sm text-gray-600">no German required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            Germany is unique: most public universities charge <strong>zero tuition fees</strong>, even for 
            international students! You only pay a small semester contribution (€250-350) and cover your living 
            expenses. This makes Germany one of the most affordable study destinations in Europe for African students.
          </p>
        </div>

        {/* CTA after intro */}
        <ConsultingCTACompact />

        {/* The Truth About Free Education */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Truth: Is It Really Free?</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold">✅ What's FREE:</h3>
                  </div>
                  <ul className="list-disc pl-12 space-y-2 text-gray-700">
                    <li>Tuition fees at all public universities (Bachelor's & Master's)</li>
                    <li>Access to world-class education and facilities</li>
                    <li>Student transportation pass (included in semester fee)</li>
                    <li>University sports and library facilities</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Euro className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-semibold">💶 What You Pay:</h3>
                  </div>
                  <ul className="list-disc pl-12 space-y-2 text-gray-700">
                    <li><strong>Semester contribution:</strong> €250-350 per semester</li>
                    <li><strong>Living costs:</strong> €850-1,200 per month</li>
                    <li><strong>Health insurance:</strong> €110 per month (mandatory)</li>
                    <li><strong>Visa application:</strong> €75 one-time</li>
                    <li><strong>Blocked account:</strong> €11,208 (proof of funds for visa)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cost Breakdown */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Monthly Budget Breakdown</h2>
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { item: "Rent (student dormitory)", cost: "€300-400" },
                  { item: "Food & groceries", cost: "€200-250" },
                  { item: "Health insurance", cost: "€110" },
                  { item: "Transportation (included in semester fee)", cost: "€0" },
                  { item: "Phone & internet", cost: "€30-40" },
                  { item: "Books & supplies", cost: "€30-50" },
                  { item: "Personal expenses", cost: "€100-150" },
                  { item: "Total per month", cost: "€850-1,100", highlight: true },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 ${
                      item.highlight ? 'bg-white font-bold text-lg border-t-2 border-gray-300' : 'bg-white/50'
                    } rounded-lg`}
                  >
                    <span className="text-gray-900">{item.item}</span>
                    <span className={item.highlight ? 'text-primary' : 'text-gray-700'}>{item.cost}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">
                *Berlin and Munich are 20-30% more expensive than smaller cities
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Requirements */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Admission Requirements</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">For Bachelor's Programs:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Secondary school certificate equivalent to German Abitur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>OR: Complete 1 year at recognized university in home country</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>German proficiency (TestDaF/DSH) OR English (IELTS 6.5+/TOEFL 90+)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Uni-Assist application (processing fee: €75)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">For Master's Programs:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Relevant Bachelor's degree (minimum 3 years)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Good GPA (usually 2.5/4.0 or equivalent)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Language proficiency (German or English depending on program)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Statement of Purpose and CV</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>2 letters of recommendation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Top Universities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top Free Universities in Germany</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Technical University of Munich (TUM)", rank: "#1 in Germany", strong: "Engineering, Tech" },
              { name: "Ludwig Maximilian University", rank: "#2 in Germany", strong: "Sciences, Medicine" },
              { name: "Heidelberg University", rank: "#3 in Germany", strong: "Life Sciences" },
              { name: "Humboldt University Berlin", rank: "Top 100 Global", strong: "Arts, Humanities" },
              { name: "RWTH Aachen University", rank: "Top Engineering", strong: "Engineering" },
              { name: "Free University of Berlin", rank: "Top Research", strong: "Social Sciences" },
            ].map((uni, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-1">{uni.name}</h3>
                  <p className="text-sm text-primary mb-1">{uni.rank}</p>
                  <p className="text-sm text-gray-600">Strong in: {uni.strong}</p>
                  <div className="mt-3 text-green-600 font-semibold text-sm">
                    ✓ €0 Tuition
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA after universities section */}
        <ConsultingCTAInline />

        {/* Visa Process */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">German Student Visa Process</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Get Admission Letter", time: "2-4 months before", desc: "Apply to universities early" },
              { step: 2, title: "Open Blocked Account", time: "Immediately after admission", desc: "Deposit €11,208 at Fintiba or Deutsche Bank" },
              { step: 3, title: "Get Health Insurance", time: "After blocked account", desc: "Public insurance €110/month" },
              { step: 4, title: "Book Visa Appointment", time: "2-3 months in advance", desc: "At German embassy in your country" },
              { step: 5, title: "Attend Interview", time: "On appointment day", desc: "Bring all documents + originals" },
              { step: 6, title: "Receive Visa", time: "4-12 weeks after", desc: "Valid for 90 days initial entry" },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Working While Studying */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Can I Work While Studying?</h2>
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">YES! Students can work:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 120 full days OR 240 half days per year</li>
                      <li>• Unlimited hours as student assistant at university</li>
                      <li>• Average student job pays €12-15/hour</li>
                      <li>• Can earn €500-800/month part-time</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-700">
                    <strong>💡 Pro tip:</strong> Working part-time can cover 50-70% of your living costs, 
                    making Germany even more affordable!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Scholarships */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Scholarships for Living Costs</h2>
          <p className="text-lg text-gray-700 mb-6">
            While tuition is free, you still need living expenses. These scholarships can help:
          </p>
          <div className="space-y-4">
            {[
              { name: "DAAD Scholarships", amount: "€861/month + insurance", for: "All levels" },
              { name: "Deutschland stipendium", amount: "€300/month", for: "High achievers" },
              { name: "Erasmus+", amount: "€500-700/month", for: "EU mobility" },
              { name: "Heinrich Böll Foundation", amount: "€850/month", for: "Social engagement" },
            ].map((scholarship, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                    <p className="text-sm text-gray-600">For: {scholarship.for}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{scholarship.amount}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Pros & Cons: The Reality Check</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-700">✅ Advantages:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• No tuition fees = huge savings</li>
                  <li>• World-class education quality</li>
                  <li>• 18-month post-study work visa</li>
                  <li>• Safe, organized country</li>
                  <li>• Central Europe location (easy travel)</li>
                  <li>• Strong job market</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-700">⚠️ Challenges:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Cold weather (especially winter)</li>
                  <li>• Language barrier (daily life)</li>
                  <li>• Bureaucracy can be complex</li>
                  <li>• Need €11,208 upfront for visa</li>
                  <li>• Competitive admission process</li>
                  <li>• Cultural adjustment needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Study in Germany?</h2>
            <p className="text-xl mb-6 text-white/90">
              Find German universities and scholarships that match your profile
            </p>
            <Link href="/scholarships/match">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Find Universities & Scholarships
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
          <p className="text-gray-700 leading-relaxed">
            Germany offers an incredible opportunity to get a world-class education without the burden of 
            tuition fees. While you'll need to manage living costs and navigate some bureaucracy, the quality 
            of education, work opportunities, and post-study prospects make it one of the best destinations 
            for African students.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Start your application early (12-18 months before intended start), learn some basic German 
            (even for English programs), and secure your funding. Your German education journey awaits!
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
