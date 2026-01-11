import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Calendar, DollarSign, Globe, CheckCircle2, Users } from "lucide-react";
import { ConsultingCTAInline, ConsultingCTABanner, ConsultingCTACompact } from "@/components/consulting-cta";

export const metadata: Metadata = generateSEO({
  title: "Mastercard Foundation Scholars Program 2026: Complete Application Guide",
  description:
    "Everything you need to know about Mastercard Foundation Scholarships: eligibility, partner universities, application deadlines, and tips to win funding.",
  keywords: [
    "mastercard foundation scholarship",
    "mastercard scholars program",
    "mastercard foundation scholars 2026",
    "african scholarships",
    "fully funded scholarships for african students",
    "mastercard scholarship application",
  ],
  canonicalUrl: "/blog/mastercard-foundation-scholarship-guide",
});

export default function MastercardScholarshipPage() {
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
            Mastercard Foundation Scholars Program 2026
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            The world's largest university-based scholarship program for African students. 
            Here's everything you need to know to apply successfully.
          </p>
        </div>

        {/* Quick Facts Card */}
        <Card className="mb-12 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Program Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Full Funding</p>
                  <p className="text-gray-700">Tuition, accommodation, meals, books, travel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">35,000+ Scholars</p>
                  <p className="text-gray-700">Already impacting Africa since 2012</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Multiple Destinations</p>
                  <p className="text-gray-700">Africa, North America, Europe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">All Levels</p>
                  <p className="text-gray-700">Undergraduate, Master's, PhD</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Makes It Special */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Makes Mastercard Foundation Different?</h2>
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 mb-6">
                Unlike traditional scholarships that only cover education costs, Mastercard Foundation 
                invests in your complete transformation as a leader:
              </p>
              <div className="space-y-4">
                {[
                  { title: "Comprehensive Support", desc: "Not just tuition - includes accommodation, meals, books, laptop, health insurance, and even emotional support" },
                  { title: "Leadership Development", desc: "Access to leadership training, mentorship programs, and community service opportunities" },
                  { title: "Career Services", desc: "Internships, job placement support, and networking with 35,000+ alumni across Africa" },
                  { title: "Lifelong Community", desc: "Join a network of changemakers committed to transforming Africa" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                      <p className="text-gray-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA after intro */}
        <ConsultingCTACompact />

        {/* Eligibility */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Who Can Apply?</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-700">✅ General Requirements:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>African citizenship</strong> - Must be from Sub-Saharan Africa</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Demonstrated financial need</strong> - Program prioritizes talented students who lack resources</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Academic excellence</strong> - Strong grades and potential</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Leadership potential</strong> - Evidence of giving back to community</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Commitment to Africa</strong> - Plan to return and contribute to continent's development</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-3 text-blue-700">📌 Important Notes:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Requirements vary by partner university</li>
                    <li>• Each university has its own application process and deadline</li>
                    <li>• You apply directly to the university, not to Mastercard Foundation</li>
                    <li>• Female students are particularly encouraged to apply</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Partner Universities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Partner Universities by Region</h2>
          
          {/* African Universities */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">🌍 African Universities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "University of Cape Town", country: "South Africa", programs: "All levels" },
                { name: "University of Pretoria", country: "South Africa", programs: "Undergrad, Postgrad" },
                { name: "African Leadership University", country: "Rwanda/Mauritius", programs: "Undergrad" },
                { name: "Ashesi University", country: "Ghana", programs: "Undergrad" },
                { name: "University of Ghana", country: "Ghana", programs: "All levels" },
                { name: "Makerere University", country: "Uganda", programs: "All levels" },
                { name: "Kenyatta University", country: "Kenya", programs: "Undergrad, Master's" },
                { name: "USIU Africa", country: "Kenya", programs: "Undergrad, Postgrad" },
              ].map((uni, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900">{uni.name}</h4>
                    <p className="text-sm text-gray-600">{uni.country}</p>
                    <p className="text-xs text-primary mt-1">{uni.programs}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* North American Universities */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">🇺🇸 🇨🇦 North American Universities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Arizona State University", country: "USA", programs: "Undergrad, Graduate" },
                { name: "Michigan State University", country: "USA", programs: "Undergrad, Graduate" },
                { name: "Duke University", country: "USA", programs: "Master's" },
                { name: "UC Berkeley", country: "USA", programs: "Master's, PhD" },
                { name: "McGill University", country: "Canada", programs: "Undergrad, Postgrad" },
                { name: "University of Toronto", country: "Canada", programs: "All levels" },
              ].map((uni, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900">{uni.name}</h4>
                    <p className="text-sm text-gray-600">{uni.country}</p>
                    <p className="text-xs text-primary mt-1">{uni.programs}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* European Universities */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">🇪🇺 European Universities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Sciences Po", country: "France", programs: "Undergrad, Master's" },
                { name: "University of Edinburgh", country: "UK", programs: "Master's" },
              ].map((uni, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900">{uni.name}</h4>
                    <p className="text-sm text-gray-600">{uni.country}</p>
                    <p className="text-xs text-primary mt-1">{uni.programs}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Important:</strong> Each university has different deadlines and application requirements. 
                Visit individual university websites for specific details.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What's Covered */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Full Benefits Package</h2>
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: "✓", item: "100% tuition and fees" },
                  { icon: "✓", item: "Accommodation (on or off-campus)" },
                  { icon: "✓", item: "Meal plans or food allowance" },
                  { icon: "✓", item: "Books and learning materials" },
                  { icon: "✓", item: "Laptop computer" },
                  { icon: "✓", item: "International airfare" },
                  { icon: "✓", item: "Visa and travel costs" },
                  { icon: "✓", item: "Health insurance" },
                  { icon: "✓", item: "Personal stipend" },
                  { icon: "✓", item: "Leadership training programs" },
                  { icon: "✓", item: "Career counseling and mentorship" },
                  { icon: "✓", item: "Community service opportunities" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-green-600 font-bold text-xl">{benefit.icon}</span>
                    <span className="text-gray-700">{benefit.item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Application Process */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How to Apply: Step-by-Step</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Choose Your University",
                desc: "Research partner universities and select ones that fit your academic interests and career goals",
                timeline: "12 months before",
              },
              {
                step: 2,
                title: "Check Specific Requirements",
                desc: "Visit the university's Mastercard Scholars page for detailed eligibility and application requirements",
                timeline: "10-12 months before",
              },
              {
                step: 3,
                title: "Prepare Documents",
                desc: "Academic transcripts, recommendation letters, personal statement, proof of citizenship, financial need documentation",
                timeline: "6-10 months before",
              },
              {
                step: 4,
                title: "Complete University Application",
                desc: "Apply for admission through the university's standard application system. Indicate you're applying for Mastercard Scholarship",
                timeline: "Varies by university",
              },
              {
                step: 5,
                title: "Write Compelling Essays",
                desc: "Most applications require essays about leadership, community service, and how you'll contribute to Africa",
                timeline: "2-3 months before deadline",
              },
              {
                step: 6,
                title: "Submit Application",
                desc: "Submit well before the deadline. Late applications are NOT accepted",
                timeline: "Before deadline!",
              },
              {
                step: 7,
                title: "Interview (if shortlisted)",
                desc: "Selected candidates are invited for interviews - in-person or virtual",
                timeline: "2-4 months after application",
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <span className="text-sm text-gray-500 hidden md:block">{item.timeline}</span>
                    </div>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA after application process */}
        <ConsultingCTAInline />

        {/* Application Deadlines */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Important Deadlines 2026</h2>
          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-2">Deadlines vary by university:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>African universities:</strong> Typically November - February</li>
                      <li>• <strong>North American universities:</strong> Usually January - March</li>
                      <li>• <strong>European universities:</strong> Generally January - April</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-red-600 font-semibold">
                    ⚠️ CRITICAL: Each university has its own deadline. Start research NOW to avoid missing opportunities!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Essay Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How to Write Winning Essays</h2>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Show, Don't Tell Leadership</h3>
                  <p className="text-gray-700 mb-2">Instead of: "I am a good leader"</p>
                  <p className="text-gray-700">Write: "I organized a community reading program that taught 50 children to read, recruited 10 volunteer teachers, and raised $500 for books"</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Connect to Africa's Development</h3>
                  <p className="text-gray-700">Every essay should tie back to how you'll contribute to Africa. Be specific about sectors, challenges, and your planned impact.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Be Authentic About Financial Need</h3>
                  <p className="text-gray-700">Don't exaggerate or underplay. Be honest about your family's financial situation and why you need support.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Demonstrate Community Service</h3>
                  <p className="text-gray-700">Mastercard looks for "Scholars who give back." Share specific examples of how you've served others, even in small ways.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Articulate Clear Career Goals</h3>
                  <p className="text-gray-700">Have a clear vision: What will you study? Why? What job/sector? What specific problem will you solve in Africa?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tips from Scholars */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Advice from Current Scholars</h2>
          <div className="space-y-4">
            {[
              { quote: "Don't wait for the 'perfect' application. Start early and improve as you go. I worked on my essays for 4 months!", author: "Amara, Ghana → McGill University" },
              { quote: "The program changed my life completely. It's not just about the money - the mentorship and network are invaluable.", author: "Kwame, Kenya → Duke University" },
              { quote: "Be genuine in your essays. They can tell when you're being authentic vs. trying to sound impressive.", author: "Fatima, Nigeria → Ashesi University" },
              { quote: "Community service doesn't have to be fancy. Tutoring kids, helping at church, organizing clean-ups - it all counts!", author: "David, Rwanda → Arizona State" },
            ].map((testimonial, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-3">"{testimonial.quote}"</p>
                  <p className="text-sm text-gray-600 font-semibold">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
          <Card className="border-red-200">
            <CardContent className="p-6">
              <ul className="space-y-3">
                {[
                  "Applying to universities you don't actually want to attend",
                  "Generic essays that could work for any scholarship",
                  "Not demonstrating financial need clearly",
                  "Weak or rushed recommendation letters",
                  "Missing university-specific deadlines",
                  "Not following word limits or formatting guidelines",
                  "Focusing only on grades without showing leadership",
                  "Forgetting to explain WHY you want to return to Africa",
                ].map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span className="text-gray-700">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Find More Scholarships Like This</h2>
            <p className="text-xl mb-6 text-white/90">
              Discover other fully-funded scholarships matching your profile
            </p>
            <Link href="/scholarships/match">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Get Personalized Matches
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Next Steps</h2>
          <ol className="space-y-3 text-gray-700">
            <li>Visit the <a href="https://mastercardfdn.org/all/scholars/" target="_blank" rel="noopener" className="text-primary hover:underline">official Mastercard Foundation website</a></li>
            <li>Research partner universities and their specific programs</li>
            <li>Check individual university deadline calendars</li>
            <li>Start gathering required documents (transcripts, recommendations)</li>
            <li>Draft your essays focusing on leadership and community impact</li>
            <li>Have mentors review your application before submission</li>
            <li>Submit early - don't wait until the last minute!</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mt-6">
            The Mastercard Foundation Scholars Program has transformed thousands of lives. With thorough 
            preparation, authentic storytelling, and demonstrated commitment to Africa, you could be next. 
            Start your application today!
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
