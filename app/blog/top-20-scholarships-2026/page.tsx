import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, Globe, GraduationCap, ArrowRight, Award } from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";
import { ConsultingCTAInline, ConsultingCTABanner, ConsultingCTACompact } from "@/components/consulting-cta";

export const metadata: Metadata = generateSEO({
  title: "Top 20 Fully-Funded Scholarships for African Students in 2026",
  description:
    "Discover the best fully-funded scholarship opportunities for African students in 2026. Complete list with amounts, deadlines, and application requirements.",
  keywords: [
    "scholarships for African students",
    "fully funded scholarships 2026",
    "African student scholarships",
    "study abroad scholarships",
    "international scholarships Africa",
  ],
  canonicalUrl: "/blog/top-20-scholarships-2026",
});

const scholarships = [
  {
    name: "Mastercard Foundation Scholars Program",
    provider: "Mastercard Foundation",
    amount: 100000,
    currency: "USD",
    deadline: "March 31, 2026",
    country: "Multiple Countries",
    targetCountries: ["Kenya", "Ghana", "Nigeria", "Rwanda", "Senegal", "Uganda", "Ethiopia", "South Africa"],
    degreeLevel: "Bachelor's & Master's",
    fields: "Engineering, Business, Agriculture, Health Sciences, Technology",
  },
  {
    name: "Stanford University Knight-Hennessy Scholars",
    provider: "Stanford University",
    amount: 80000,
    currency: "USD",
    deadline: "October 12, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "African Leadership Academy Scholarships",
    provider: "African Leadership Academy",
    amount: 75000,
    currency: "USD",
    deadline: "February 15, 2026",
    country: "South Africa",
    targetCountries: ["All African Countries"],
    degreeLevel: "Diploma",
    fields: "Leadership & All Fields",
  },
  {
    name: "MIT African Graduate Fellowship",
    provider: "Massachusetts Institute of Technology",
    amount: 70000,
    currency: "USD",
    deadline: "December 15, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "Engineering, Science, Technology, Mathematics",
  },
  {
    name: "Rhodes Scholarship",
    provider: "Rhodes Trust",
    amount: 70000,
    currency: "GBP",
    deadline: "October 15, 2026",
    country: "United Kingdom",
    targetCountries: ["South Africa", "Zimbabwe", "Kenya", "Ghana", "Nigeria"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Yale University African Scholars Program",
    provider: "Yale University",
    amount: 65000,
    currency: "USD",
    deadline: "December 15, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Gates Cambridge Scholarship",
    provider: "Gates Cambridge Trust",
    amount: 60000,
    currency: "GBP",
    deadline: "October 11, 2026",
    country: "United Kingdom",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "MasterCard Foundation Scholars at University of Cape Town",
    provider: "MasterCard Foundation & UCT",
    amount: 60000,
    currency: "USD",
    deadline: "August 31, 2026",
    country: "South Africa",
    targetCountries: ["South Africa", "Zimbabwe", "Lesotho", "Botswana"],
    degreeLevel: "Bachelor's & Master's",
    fields: "All Fields",
  },
  {
    name: "Princeton University African Graduate Fellowship",
    provider: "Princeton University",
    amount: 60000,
    currency: "USD",
    deadline: "December 1, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Harvard University African Studies Fellowship",
    provider: "Harvard University",
    amount: 60000,
    currency: "USD",
    deadline: "December 1, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "African Studies, Social Sciences, Humanities, Public Policy",
  },
  {
    name: "Fulbright Foreign Student Program",
    provider: "US Department of State",
    amount: 50000,
    currency: "USD",
    deadline: "May 15, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "African Women in STEM Scholarship",
    provider: "African Union Commission",
    amount: 50000,
    currency: "USD",
    deadline: "May 15, 2026",
    country: "Pan-African",
    targetCountries: ["All African Countries"],
    degreeLevel: "Bachelor's, Master's & PhD",
    fields: "Engineering, Computer Science, Mathematics, Physics, Chemistry, Biology",
  },
  {
    name: "Commonwealth Scholarship",
    provider: "Commonwealth Scholarship Commission",
    amount: 50000,
    currency: "GBP",
    deadline: "December 1, 2026",
    country: "United Kingdom",
    targetCountries: ["Kenya", "Ghana", "Nigeria", "Tanzania", "Uganda", "Zambia", "Zimbabwe"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Joint Japan World Bank Graduate Scholarship",
    provider: "World Bank & Government of Japan",
    amount: 50000,
    currency: "USD",
    deadline: "May 26, 2026",
    country: "Multiple Countries",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's",
    fields: "Economics, Public Policy, Agriculture, Health, Education",
  },
  {
    name: "University of Toronto African Scholars Program",
    provider: "University of Toronto",
    amount: 50000,
    currency: "CAD",
    deadline: "November 15, 2026",
    country: "Canada",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Australia Awards Scholarships",
    provider: "Australian Government",
    amount: 50000,
    currency: "AUD",
    deadline: "April 30, 2026",
    country: "Australia",
    targetCountries: ["Kenya", "Ghana", "Nigeria", "South Africa", "Tanzania", "Uganda", "Zambia"],
    degreeLevel: "Bachelor's, Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "University of Oxford Clarendon Scholarships",
    provider: "University of Oxford",
    amount: 50000,
    currency: "GBP",
    deadline: "January 20, 2026",
    country: "United Kingdom",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Vanier Canada Graduate Scholarships",
    provider: "Government of Canada",
    amount: 50000,
    currency: "CAD",
    deadline: "November 1, 2026",
    country: "Canada",
    targetCountries: ["All African Countries"],
    degreeLevel: "PhD",
    fields: "All Fields",
  },
  {
    name: "AAUW International Fellowships for Women",
    provider: "American Association of University Women",
    amount: 50000,
    currency: "USD",
    deadline: "November 15, 2026",
    country: "United States",
    targetCountries: ["All African Countries"],
    degreeLevel: "Master's & PhD",
    fields: "All Fields",
  },
  {
    name: "Next Einstein Forum (NEF) Fellows Program",
    provider: "Next Einstein Forum",
    amount: 50000,
    currency: "USD",
    deadline: "June 30, 2026",
    country: "Pan-African",
    targetCountries: ["All African Countries"],
    degreeLevel: "PhD",
    fields: "Science, Technology, Engineering, Mathematics",
  },
];

function formatAmount(amount: number, currency: string): string {
  if (amount >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(0)}K+`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export default function Top20Scholarships2026Page() {
  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top 20 Fully-Funded Scholarships for African Students in 2026
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Published: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>12 min read</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Are you an African student dreaming of studying abroad but worried about the costs? You're not alone. 
            The good news is that there are hundreds of fully-funded scholarship opportunities specifically designed 
            for African students.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            We've compiled the top 20 fully-funded scholarships for African students in 2026, covering amounts from 
            $50,000 to $100,000+. These scholarships cover tuition, living expenses, travel, and more - giving you 
            the opportunity to focus on your studies without financial stress.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you're interested in studying in the US, UK, Canada, Australia, or staying in Africa, there's 
            a scholarship opportunity waiting for you. Let's dive in!
          </p>
        </div>

        {/* Scholarships List */}
        <div className="space-y-6 mb-12">
          {scholarships.map((scholarship, index) => (
            <Card key={index} className="border-2 border-gray-200 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                        #{index + 1}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900">{scholarship.name}</h2>
                    </div>
                    <p className="text-primary font-semibold mb-3">{scholarship.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatAmount(scholarship.amount, scholarship.currency)}
                    </div>
                    <div className="text-sm text-gray-600">Fully Funded</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Deadline</div>
                      <div className="text-gray-600">{scholarship.deadline}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Country</div>
                      <div className="text-gray-600">{scholarship.country}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Degree Level</div>
                      <div className="text-gray-600">{scholarship.degreeLevel}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Fields of Study</div>
                      <div className="text-gray-600">{scholarship.fields}</div>
                    </div>
                  </div>
                </div>

                {scholarship.targetCountries.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Eligible Countries:</div>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.targetCountries.map((country, idx) => (
                        <span
                          key={idx}
                          className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consulting CTA mid-page */}
        <ConsultingCTAInline />

        {/* How to Apply Section */}
        <Card className="bg-primary-light border-2 border-primary mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Apply for These Scholarships</h2>
            <ol className="space-y-4 text-lg text-gray-700 list-decimal list-inside">
              <li>
                <strong>Check Eligibility:</strong> Review each scholarship's requirements carefully. Most require 
                excellent academic records, English proficiency (IELTS/TOEFL), and sometimes work experience.
              </li>
              <li>
                <strong>Prepare Documents:</strong> Gather your transcripts, recommendation letters, statement of 
                purpose, CV/resume, and test scores well in advance.
              </li>
              <li>
                <strong>Start Early:</strong> Begin your applications 3-6 months before deadlines. Many scholarships 
                require multiple essays and interviews.
              </li>
              <li>
                <strong>Tailor Your Application:</strong> Customize your essays and documents for each scholarship. 
                Show how you align with their values and goals.
              </li>
              <li>
                <strong>Get Help:</strong> Consider having your application reviewed by mentors or using our AI-powered 
                application assistance platform.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect Scholarship Match</h2>
            <p className="text-xl mb-6 text-white/90">
              Don't see a scholarship that fits? Use our AI-powered matching system to discover hundreds more 
              opportunities tailored to your profile, field of study, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships/match">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  <Award className="mr-2 h-5 w-5" />
                  Get AI-Matched Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/scholarships">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Browse All Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="prose prose-lg max-w-none mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pro Tips for Scholarship Success</h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li>
              <strong>Apply to Multiple Scholarships:</strong> Don't put all your eggs in one basket. Apply to 
              5-10 scholarships to increase your chances.
            </li>
            <li>
              <strong>Meet All Deadlines:</strong> Late applications are automatically rejected. Set reminders 
              and submit early.
            </li>
            <li>
              <strong>Tell Your Story:</strong> Scholarship committees want to know who you are beyond your grades. 
              Share your unique experiences, challenges overcome, and future goals.
            </li>
            <li>
              <strong>Get Strong Recommendations:</strong> Choose recommenders who know you well and can speak 
              specifically about your achievements and potential.
            </li>
            <li>
              <strong>Follow Instructions:</strong> Read application requirements carefully. Missing documents 
              or incorrect formatting can disqualify you.
            </li>
          </ul>
        </div>

        {/* Conclusion */}
        <div className="prose prose-lg max-w-none mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            These 20 scholarships represent just a fraction of the opportunities available to African students. 
            With amounts ranging from $50,000 to over $100,000, they can completely transform your educational 
            journey and future career prospects.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Remember, the key to scholarship success is preparation, persistence, and finding the right match. 
            Use our platform to discover scholarships that align with your profile, get personalized application 
            guidance, and track deadlines all in one place.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed font-semibold mt-4">
            Your dream of studying abroad is within reach. Start your scholarship search today!
          </p>
        </div>

        {/* Expert Help CTA */}
        <ConsultingCTABanner />

        {/* Back to Blog */}
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

