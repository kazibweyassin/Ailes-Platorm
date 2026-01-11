import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Award, 
  Calendar, 
  DollarSign, 
  Globe, 
  CheckCircle2,
  GraduationCap,
  MapPin,
  Clock,
  Star,
  Users,
  BookOpen
} from "lucide-react";
import { ConsultingCTAInline, ConsultingCTABanner, ConsultingCTACompact } from "@/components/consulting-cta";

export const metadata: Metadata = generateSEO({
  title: "Scholarships for Ugandan Students 2026: 50+ Fully Funded Opportunities",
  description:
    "Complete list of scholarships in Uganda for 2026. Find fully funded scholarships for Ugandan students to study abroad or locally. Updated weekly with new opportunities.",
  keywords: [
    "scholarships in uganda",
    "scholarships for ugandan students",
    "fully funded scholarships for ugandan students",
    "scholarships in uganda 2026",
    "uganda scholarships",
    "scholarships for ugandans",
    "study abroad scholarships uganda",
    "masters scholarships for ugandans",
    "undergraduate scholarships uganda",
    "government scholarships uganda",
    "fully funded scholarships uganda 2026",
    "scholarship opportunities in uganda",
  ],
  canonicalUrl: "/blog/scholarships-for-ugandan-students",
});

const featuredScholarships = [
  {
    name: "Mastercard Foundation Scholars Program",
    provider: "Mastercard Foundation",
    countries: ["USA", "UK", "Rwanda", "South Africa"],
    amount: "Full Funding",
    deadline: "Varies by university",
    coverage: ["Tuition", "Living expenses", "Books", "Travel", "Laptop"],
    eligibility: "Ugandan citizens with academic excellence and financial need",
    link: "/blog/mastercard-foundation-scholarship-guide",
    featured: true,
  },
  {
    name: "Chevening Scholarships",
    provider: "UK Government",
    countries: ["United Kingdom"],
    amount: "£30,000+",
    deadline: "November 2026",
    coverage: ["Tuition", "Living allowance", "Flights", "Visa"],
    eligibility: "2+ years work experience, return to Uganda commitment",
    link: "/blog/chevening-scholarship-guide",
    featured: true,
  },
  {
    name: "Commonwealth Scholarships",
    provider: "Commonwealth Scholarship Commission",
    countries: ["United Kingdom"],
    amount: "Full Funding",
    deadline: "December 2026",
    coverage: ["Tuition", "Living allowance", "Flights", "Thesis grant"],
    eligibility: "Ugandan citizens, academic excellence",
    link: "/blog/commonwealth-scholarship-guide",
    featured: true,
  },
  {
    name: "DAAD Scholarships",
    provider: "German Academic Exchange Service",
    countries: ["Germany"],
    amount: "€934/month + benefits",
    deadline: "October 2026",
    coverage: ["Monthly stipend", "Health insurance", "Travel grant"],
    eligibility: "Bachelor's degree holders, 2 years work experience",
    link: "/blog/study-germany-free-guide",
    featured: true,
  },
  {
    name: "Fulbright Foreign Student Program",
    provider: "US Department of State",
    countries: ["United States"],
    amount: "Full Funding",
    deadline: "April 2026",
    coverage: ["Tuition", "Living stipend", "Flights", "Health insurance"],
    eligibility: "Ugandan citizens with leadership potential",
    link: "/scholarships?country=United%20States",
    featured: true,
  },
  {
    name: "Australia Awards Scholarships",
    provider: "Australian Government",
    countries: ["Australia"],
    amount: "Full Funding",
    deadline: "April 2026",
    coverage: ["Tuition", "Living allowance", "Flights", "Health cover"],
    eligibility: "Ugandan citizens, development-focused study",
    link: "/scholarships?country=Australia",
    featured: false,
  },
  {
    name: "Swedish Institute Scholarships",
    provider: "Swedish Institute",
    countries: ["Sweden"],
    amount: "SEK 10,000/month",
    deadline: "January 2026",
    coverage: ["Tuition", "Living expenses", "Travel grant", "Insurance"],
    eligibility: "Ugandan citizens with leadership experience",
    link: "/scholarships?country=Sweden",
    featured: false,
  },
  {
    name: "Makerere University Scholarships",
    provider: "Makerere University",
    countries: ["Uganda"],
    amount: "Tuition waiver",
    deadline: "Rolling",
    coverage: ["Full or partial tuition", "Research grants"],
    eligibility: "High academic performance",
    link: "/scholarships?provider=Makerere",
    featured: false,
  },
];

const scholarshipsByLevel = {
  undergraduate: [
    "Mastercard Foundation Scholars Program",
    "MasterCard Foundation Scholarship at KNUST",
    "African Leadership Academy Scholarship",
    "United World Colleges Scholarship",
    "Equity Bank Wings to Fly (East Africa)",
  ],
  masters: [
    "Chevening Scholarships",
    "Commonwealth Scholarships", 
    "DAAD Scholarships",
    "Fulbright Program",
    "Australia Awards",
    "Swedish Institute Scholarships",
    "Eiffel Excellence Scholarship (France)",
    "Netherlands Fellowship Programme",
  ],
  phd: [
    "Commonwealth PhD Scholarships",
    "DAAD Research Grants",
    "Gates Cambridge Scholarship",
    "Rhodes Scholarship",
    "Mandela Rhodes Scholarship",
  ],
};

const localScholarships = [
  {
    name: "Government of Uganda Scholarships",
    description: "State House scholarships for outstanding students to study abroad",
    eligibility: "Ugandan citizens with excellent academics",
  },
  {
    name: "Makerere University Merit Scholarships",
    description: "Scholarships for top performers at Uganda's leading university",
    eligibility: "High UACE scores, financial need",
  },
  {
    name: "Private Sector Foundation Uganda",
    description: "Scholarships from Ugandan businesses and organizations",
    eligibility: "Various requirements",
  },
  {
    name: "Religious Institution Scholarships",
    description: "From Uganda Christian University, Islamic University in Uganda, etc.",
    eligibility: "Academic merit, faith community involvement",
  },
];

export default function UgandaScholarshipsPage() {
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
          
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              🇺🇬 UGANDA
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
              Updated January 2026
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Scholarships for Ugandan Students 2026: Complete Guide
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Discover 50+ fully funded scholarships available to Ugandan students. 
            Study in Uganda or abroad with full financial support.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>25 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>For Ugandan citizens</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-700">50+</p>
              <p className="text-sm text-yellow-800">Scholarships</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-700">$500K+</p>
              <p className="text-sm text-green-800">Total Value</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-700">30+</p>
              <p className="text-sm text-blue-800">Countries</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-700">Weekly</p>
              <p className="text-sm text-purple-800">Updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Navigation
            </h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#featured" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> Top 8 Scholarships for Ugandans
              </a>
              <a href="#undergraduate" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> Undergraduate Scholarships
              </a>
              <a href="#masters" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> Masters Scholarships
              </a>
              <a href="#phd" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> PhD Scholarships
              </a>
              <a href="#local" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> Scholarships to Study in Uganda
              </a>
              <a href="#tips" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> Application Tips
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            As a Ugandan student, you have access to dozens of fully funded scholarship opportunities 
            to study both locally and internationally. Whether you're looking to pursue undergraduate, 
            masters, or PhD studies, this comprehensive guide covers every major scholarship available 
            to Ugandan citizens in 2026.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We've organized scholarships by study level and destination, with deadlines, eligibility 
            requirements, and direct application links. Bookmark this page – we update it weekly with 
            new opportunities.
          </p>
        </div>

        <ConsultingCTACompact />

        {/* Featured Scholarships */}
        <section id="featured" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-500" />
            Top Scholarships for Ugandan Students 2026
          </h2>
          
          <div className="space-y-6">
            {featuredScholarships.map((scholarship, index) => (
              <Card 
                key={index} 
                className={`overflow-hidden transition-all hover:shadow-lg ${
                  scholarship.featured ? 'border-2 border-primary/30' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {scholarship.featured && (
                          <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                            ⭐ HIGHLY RECOMMENDED
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {scholarship.name}
                      </h3>
                      <p className="text-gray-600 mb-3">by {scholarship.provider}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {scholarship.countries.map((country, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            <Globe className="h-3 w-3 inline mr-1" />
                            {country}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span><strong>Value:</strong> {scholarship.amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span><strong>Deadline:</strong> {scholarship.deadline}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">What's Covered:</p>
                        <div className="flex flex-wrap gap-2">
                          {scholarship.coverage.map((item, i) => (
                            <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        <strong>Eligibility:</strong> {scholarship.eligibility}
                      </p>
                    </div>
                    
                    <div className="md:text-right">
                      <Link href={scholarship.link}>
                        <Button className="w-full md:w-auto">
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/scholarships?country=Uganda&forAfrican=true">
              <Button size="lg" variant="outline">
                View All 50+ Scholarships for Ugandans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <ConsultingCTAInline />

        {/* By Level Sections */}
        <section id="undergraduate" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            Undergraduate Scholarships for Ugandan Students
          </h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              These scholarships cover full bachelor's degree programs (3-4 years) for Ugandan students 
              who have completed UACE or equivalent.
            </p>
            <ul className="space-y-3">
              {scholarshipsByLevel.undergraduate.map((name, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Link href="/scholarships?degreeLevel=BACHELOR">
            <Button variant="outline">
              Browse Undergraduate Scholarships <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>

        <section id="masters" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="h-8 w-8 text-purple-600" />
            Masters Scholarships for Ugandan Students
          </h2>
          
          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              For Ugandan graduates looking to pursue postgraduate studies. Most require a bachelor's 
              degree and 2+ years of work experience.
            </p>
            <ul className="space-y-3">
              {scholarshipsByLevel.masters.map((name, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Link href="/scholarships?degreeLevel=MASTER">
            <Button variant="outline">
              Browse Masters Scholarships <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>

        <section id="phd" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-green-600" />
            PhD Scholarships for Ugandan Students
          </h2>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              Fully funded doctoral opportunities for Ugandan researchers and academics. 
              These typically cover 3-5 years of study.
            </p>
            <ul className="space-y-3">
              {scholarshipsByLevel.phd.map((name, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Link href="/scholarships?degreeLevel=PHD">
            <Button variant="outline">
              Browse PhD Scholarships <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>

        {/* Local Scholarships */}
        <section id="local" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <MapPin className="h-8 w-8 text-yellow-600" />
            Scholarships to Study in Uganda
          </h2>
          
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-6">
              Not everyone wants to study abroad! Here are scholarship opportunities to study at 
              top universities within Uganda:
            </p>
            
            <div className="space-y-4">
              {localScholarships.map((scholarship, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-1">{scholarship.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{scholarship.description}</p>
                  <p className="text-xs text-gray-500">
                    <strong>Eligibility:</strong> {scholarship.eligibility}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ConsultingCTABanner />

        {/* Application Tips */}
        <section id="tips" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Application Tips for Ugandan Students
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                  Start Early
                </h3>
                <p className="text-gray-700">
                  Most international scholarships have deadlines 9-12 months before the study start date. 
                  Begin preparing your documents at least 6 months in advance. Chevening opens in August, 
                  Commonwealth in September – mark your calendar!
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                  Prepare Your English Proficiency
                </h3>
                <p className="text-gray-700">
                  Most scholarships require IELTS (minimum 6.5) or TOEFL scores. Book your test early – 
                  testing centers in Kampala fill up quickly. Budget UGX 750,000-1,000,000 for the test.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                  Get Strong Reference Letters
                </h3>
                <p className="text-gray-700">
                  Ask supervisors, professors, or employers who know your work well. Give them at least 
                  4 weeks notice and provide them with your CV and the scholarship details.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
                  Showcase Your Leadership
                </h3>
                <p className="text-gray-700">
                  Many scholarships (Chevening, Mandela Rhodes, MasterCard) prioritize leadership. 
                  Document your community involvement, volunteer work, and initiatives you've led in Uganda.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</span>
                  Connect Study to Uganda's Development
                </h3>
                <p className="text-gray-700">
                  Scholarship committees want to see how your studies will benefit Uganda. Connect your 
                  proposed field of study to specific challenges facing our country – agriculture, healthcare, 
                  education, technology, or governance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Deadline Calendar */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            2026 Scholarship Deadline Calendar for Uganda
          </h2>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4 font-semibold">Month</th>
                    <th className="text-left p-4 font-semibold">Scholarship</th>
                    <th className="text-left p-4 font-semibold">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">January</td>
                    <td className="p-4">Swedish Institute Scholarships</td>
                    <td className="p-4">Sweden</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">February</td>
                    <td className="p-4">Netherlands Fellowship Programme</td>
                    <td className="p-4">Netherlands</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">April</td>
                    <td className="p-4">Fulbright Program, Australia Awards</td>
                    <td className="p-4">USA, Australia</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">August</td>
                    <td className="p-4">Chevening Scholarships (Opens)</td>
                    <td className="p-4">UK</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">October</td>
                    <td className="p-4">DAAD Scholarships</td>
                    <td className="p-4">Germany</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">November</td>
                    <td className="p-4">Chevening (Closes)</td>
                    <td className="p-4">UK</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">December</td>
                    <td className="p-4">Commonwealth Scholarships</td>
                    <td className="p-4">UK</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <div className="mt-4 text-center">
            <Link href="/scholarships/deadlines">
              <Button variant="link" className="text-primary">
                View Full Deadline Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2">
                Can I apply for scholarships with a UACE certificate only?
              </h3>
              <p className="text-gray-700">
                Yes! For undergraduate scholarships like MasterCard Foundation Scholars Program 
                and United World Colleges, you can apply directly after completing UACE. Most 
                masters scholarships require a completed bachelor's degree.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2">
                Do I need work experience for all scholarships?
              </h3>
              <p className="text-gray-700">
                Not all! Undergraduate scholarships don't require work experience. For masters, 
                Chevening requires 2+ years, but others like Swedish Institute accept fresh graduates. 
                Check each scholarship's specific requirements.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2">
                Are there scholarships specifically for Ugandan students?
              </h3>
              <p className="text-gray-700">
                Yes! Government of Uganda State House scholarships, Makerere University scholarships, 
                and many international scholarships specifically target East African or Ugandan citizens. 
                Many global scholarships also prioritize African applicants.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2">
                Where can I take IELTS in Uganda?
              </h3>
              <p className="text-gray-700">
                You can take IELTS at the British Council in Kampala (Garden City or Acacia Mall). 
                Tests are held regularly, but book at least 2 months in advance. The fee is approximately 
                UGX 780,000.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Get Personalized Scholarship Matches
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Answer a few questions about your background, academic level, and study goals, 
                and we'll show you the scholarships you're most likely to win.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scholarships/match">
                  <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100">
                    <Star className="mr-2 h-5 w-5" />
                    Find My Scholarships
                  </Button>
                </Link>
                <Link href="/consulting">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Get Expert Help
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Guides */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Scholarship Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/chevening-scholarship-guide">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Chevening Scholarship Guide</h3>
                  <p className="text-sm text-gray-600">Complete guide to the UK's flagship scholarship</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/mastercard-foundation-scholarship-guide">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">MasterCard Foundation Guide</h3>
                  <p className="text-sm text-gray-600">Full funding for African students</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/study-germany-free-guide">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Study in Germany Free</h3>
                  <p className="text-sm text-gray-600">No tuition fees at German universities</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/commonwealth-scholarship-guide">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Commonwealth Scholarships</h3>
                  <p className="text-sm text-gray-600">UK scholarships for Commonwealth citizens</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
