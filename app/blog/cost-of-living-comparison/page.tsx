import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, DollarSign, Home, Utensils, Car, GraduationCap } from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "Cost of Living: Studying in the US vs UK vs Canada",
  description:
    "Compare living costs across top study destinations. Detailed breakdown of tuition, accommodation, food, and other expenses in US, UK, and Canada.",
  keywords: [
    "study abroad cost",
    "cost of living",
    "study in USA cost",
    "study in UK cost",
    "study in Canada cost",
  ],
  canonicalUrl: "/blog/cost-of-living-comparison",
});

export default function CostOfLivingComparisonPage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cost of Living: Studying in the US vs UK vs Canada
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>December 15, 2024</span>
            </div>
            <span>9 min read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Understanding the cost of studying abroad is crucial for planning your education journey. This comprehensive 
            comparison breaks down tuition fees, accommodation, food, transportation, and other expenses in the three most 
            popular study destinations for African students.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tuition Fees Comparison</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🇺🇸</div>
                  <h3 className="text-xl font-semibold mb-4">United States</h3>
                  <div className="space-y-2 text-gray-700">
                    <div>
                      <strong>Public Universities:</strong> $20,000 - $40,000/year
                    </div>
                    <div>
                      <strong>Private Universities:</strong> $30,000 - $60,000/year
                    </div>
                    <div>
                      <strong>MBA:</strong> $50,000 - $100,000/year
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-200">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🇬🇧</div>
                  <h3 className="text-xl font-semibold mb-4">United Kingdom</h3>
                  <div className="space-y-2 text-gray-700">
                    <div>
                      <strong>Undergraduate:</strong> £15,000 - £25,000/year
                    </div>
                    <div>
                      <strong>Graduate:</strong> £15,000 - £30,000/year
                    </div>
                    <div>
                      <strong>MBA:</strong> £25,000 - £50,000/year
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🇨🇦</div>
                  <h3 className="text-xl font-semibold mb-4">Canada</h3>
                  <div className="space-y-2 text-gray-700">
                    <div>
                      <strong>Undergraduate:</strong> CAD $15,000 - $35,000/year
                    </div>
                    <div>
                      <strong>Graduate:</strong> CAD $10,000 - $25,000/year
                    </div>
                    <div>
                      <strong>MBA:</strong> CAD $30,000 - $60,000/year
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Living Expenses Breakdown</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Accommodation</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                    <div>
                      <strong>USA:</strong> $800 - $2,000/month
                      <p className="text-sm text-gray-600 mt-1">Dorms: $800-1,200 | Off-campus: $1,000-2,000</p>
                    </div>
                    <div>
                      <strong>UK:</strong> £400 - £1,200/month
                      <p className="text-sm text-gray-600 mt-1">Halls: £400-800 | Private: £600-1,200</p>
                    </div>
                    <div>
                      <strong>Canada:</strong> CAD $500 - $1,500/month
                      <p className="text-sm text-gray-600 mt-1">Dorms: $500-800 | Off-campus: $800-1,500</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Utensils className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Food & Groceries</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                    <div>
                      <strong>USA:</strong> $300 - $600/month
                      <p className="text-sm text-gray-600 mt-1">Eating out: $10-20/meal</p>
                    </div>
                    <div>
                      <strong>UK:</strong> £200 - £400/month
                      <p className="text-sm text-gray-600 mt-1">Eating out: £8-15/meal</p>
                    </div>
                    <div>
                      <strong>Canada:</strong> CAD $300 - $500/month
                      <p className="text-sm text-gray-600 mt-1">Eating out: CAD $12-20/meal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Car className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Transportation</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                    <div>
                      <strong>USA:</strong> $100 - $200/month
                      <p className="text-sm text-gray-600 mt-1">Public transport: $50-100 | Car: $200-400</p>
                    </div>
                    <div>
                      <strong>UK:</strong> £50 - £150/month
                      <p className="text-sm text-gray-600 mt-1">Student railcard: £30/year | Monthly pass: £50-100</p>
                    </div>
                    <div>
                      <strong>Canada:</strong> CAD $100 - $150/month
                      <p className="text-sm text-gray-600 mt-1">Student transit pass: CAD $50-100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Expenses</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">USA</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>Health Insurance: $500-1,500/year</li>
                    <li>Books & Supplies: $1,000-2,000/year</li>
                    <li>Phone & Internet: $50-100/month</li>
                    <li>Personal: $200-400/month</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">UK</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>Health Surcharge: £470/year</li>
                    <li>Books & Supplies: £500-1,000/year</li>
                    <li>Phone & Internet: £30-60/month</li>
                    <li>Personal: £150-300/month</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Canada</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>Health Insurance: CAD $600-1,200/year</li>
                    <li>Books & Supplies: CAD $800-1,500/year</li>
                    <li>Phone & Internet: CAD $50-80/month</li>
                    <li>Personal: CAD $200-400/month</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Total Annual Cost Comparison</h2>
            <Card className="bg-primary-light border-2 border-primary">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">🇺🇸 United States</h3>
                    <div className="text-2xl font-bold text-primary mb-2">$45,000 - $85,000</div>
                    <p className="text-sm text-gray-600">per year (tuition + living)</p>
                    <p className="text-xs text-gray-500 mt-2">Most expensive option</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">🇬🇧 United Kingdom</h3>
                    <div className="text-2xl font-bold text-primary mb-2">£25,000 - £45,000</div>
                    <p className="text-sm text-gray-600">per year (tuition + living)</p>
                    <p className="text-xs text-gray-500 mt-2">Moderate cost</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">🇨🇦 Canada</h3>
                    <div className="text-2xl font-bold text-primary mb-2">CAD $25,000 - $45,000</div>
                    <p className="text-sm text-gray-600">per year (tuition + living)</p>
                    <p className="text-xs text-gray-500 mt-2">Most affordable option</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ways to Reduce Costs</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">1. Scholarships & Financial Aid</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Apply for university-specific scholarships</li>
                    <li>Look for government scholarships (Fulbright, Chevening, etc.)</li>
                    <li>Research country-specific scholarships for African students</li>
                    <li>Apply early - many deadlines are 6-12 months before start date</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">2. Choose Affordable Locations</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>USA:</strong> Consider public universities in smaller cities</li>
                    <li><strong>UK:</strong> Look at universities outside London</li>
                    <li><strong>Canada:</strong> Consider universities in smaller provinces</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">3. Work While Studying</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>USA:</strong> On-campus work, up to 20 hours/week</li>
                    <li><strong>UK:</strong> Up to 20 hours/week during term, full-time during breaks</li>
                    <li><strong>Canada:</strong> Up to 20 hours/week during studies</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">4. Budgeting Tips</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cook at home instead of eating out</li>
                    <li>Share accommodation with roommates</li>
                    <li>Buy used textbooks</li>
                    <li>Use student discounts</li>
                    <li>Take advantage of free campus activities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cost Comparison Summary</h2>
            <Card className="bg-gray-50 border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="font-semibold">Most Affordable:</span>
                    <span className="text-primary font-bold">Canada 🇨🇦</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="font-semibold">Moderate Cost:</span>
                    <span className="text-primary font-bold">United Kingdom 🇬🇧</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="font-semibold">Most Expensive:</span>
                    <span className="text-primary font-bold">United States 🇺🇸</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Note:</strong> Costs vary significantly by city, university, and lifestyle. These are average estimates.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Find Scholarships to Reduce Costs</h2>
            <p className="text-xl mb-6 text-white/90">
              Use our AI-powered platform to find scholarships that can significantly reduce your study abroad costs
            </p>
            <Link href="/scholarships/match">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Find Scholarships
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

