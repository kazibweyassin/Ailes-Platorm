import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "Study Abroad Blog & Resources - Scholarship Tips & University Guides",
  description:
    "Expert advice on scholarships, university applications, test prep, visa processes, and study abroad success. Free resources and guides for international students.",
  keywords: ["study abroad blog", "scholarship tips", "application guides", "IELTS prep", "visa guidance"],
  canonicalUrl: "/blog",
});

export default function BlogPage() {
  const articles = [
    {
      id: "top-20-scholarships-2026",
      title: "Top 20 Fully-Funded Scholarships for African Students in 2026",
      excerpt:
        "Discover the best fully-funded scholarship opportunities for African students in 2026. Complete list with amounts from $50K to $100K+, deadlines, and application requirements.",
      category: "Scholarships",
      date: new Date().toISOString().split('T')[0],
      readTime: "12 min read",
      image: "🎓",
      slug: "top-20-scholarships-2026",
    },
    {
      id: "commonwealth-scholarship-guide",
      title: "Commonwealth Scholarship 2026: Complete Application Guide",
      excerpt:
        "Everything you need to know about Commonwealth Scholarships for African students. Eligibility, deadlines, amounts, and expert application tips.",
      category: "Scholarships",
      date: new Date().toISOString().split('T')[0],
      readTime: "15 min read",
      image: "🇬🇧",
      slug: "commonwealth-scholarship-guide",
    },
    {
      id: "chevening-scholarship-guide",
      title: "Chevening Scholarship 2026: How to Win the UK's Most Prestigious Award",
      excerpt:
        "Master the Chevening application with our complete guide covering the 4 essays, deadlines, and insider tips from alumni.",
      category: "Scholarships",
      date: new Date().toISOString().split('T')[0],
      readTime: "18 min read",
      image: "🎯",
      slug: "chevening-scholarship-guide",
    },
    {
      id: "study-germany-free-guide",
      title: "Study in Germany for FREE: Complete Guide 2026",
      excerpt:
        "How to study at world-class German universities without paying tuition fees. Living costs, visa process, and top universities.",
      category: "Study Abroad",
      date: new Date().toISOString().split('T')[0],
      readTime: "16 min read",
      image: "🇩🇪",
      slug: "study-germany-free-guide",
    },
    {
      id: "mastercard-foundation-scholarship-guide",
      title: "Mastercard Foundation Scholars Program 2026: Complete Guide",
      excerpt:
        "Join 35,000+ scholars transforming Africa. Learn about partner universities, application process, and what makes this program unique.",
      category: "Scholarships",
      date: new Date().toISOString().split('T')[0],
      readTime: "17 min read",
      image: "🌍",
      slug: "mastercard-foundation-scholarship-guide",
    },
    {
      id: "study-in-canada",
      title: "How to Study in Canada: Complete Guide for African Students",
      excerpt:
        "Everything you need to know about studying in Canada, from application requirements to visa processes and living costs.",
      category: "Study Abroad",
      date: "2025-01-15",
      readTime: "8 min read",
      image: "🇨🇦",
      slug: "study-in-canada",
    },
    {
      id: "germany-visa-guide",
      title: "Visa Requirements for Germany: Step-by-Step Guide",
      excerpt:
        "Navigate the German student visa process with our detailed guide covering documents, timelines, and interview tips.",
      category: "Visa",
      date: "2025-01-05",
      readTime: "10 min read",
      image: "🇩🇪",
      slug: "germany-visa-guide",
    },
    {
      id: "write-perfect-sop",
      title: "How to Write a Perfect Statement of Purpose (SOP)",
      excerpt:
        "Master the art of writing a compelling SOP that stands out to admissions committees. Includes examples and templates.",
      category: "Application",
      date: "2024-12-28",
      readTime: "15 min read",
      image: "✍️",
      slug: "write-perfect-sop",
    },
    {
      id: "ielts-vs-toefl",
      title: "Understanding IELTS vs TOEFL: Which Test Should You Take?",
      excerpt:
        "Compare IELTS and TOEFL to determine which English proficiency test is right for your study abroad goals.",
      category: "Tests",
      date: "2024-12-20",
      readTime: "7 min read",
      image: "📝",
      slug: "ielts-vs-toefl",
    },
    {
      id: "cost-of-living-comparison",
      title: "Cost of Living: Studying in the US vs UK vs Canada",
      excerpt:
        "Compare living costs across top study destinations to help you plan your budget and choose the right country.",
      category: "Finance",
      date: "2024-12-15",
      readTime: "9 min read",
      image: "💰",
      slug: "cost-of-living-comparison",
    },
  ];

  return (
    <div className="min-h-screen bg-primary-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-4">
            Resources & Blog
          </h1>
          <p className="text-lg text-gray-soft max-w-2xl mx-auto">
            Expert guides, tips, and insights to help you navigate your study abroad
            journey successfully.
          </p>
        </div>

        {/* Featured Article */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Featured
                </span>
                <span className="text-white/80">Study Abroad</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {articles[0].title}
              </h2>
              <p className="text-white/90 mb-6">{articles[0].excerpt}</p>
              <div className="flex items-center space-x-4 text-sm text-white/80 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(articles[0].date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {articles[0].readTime}
                </div>
              </div>
              <Link href={articles[0].slug ? `/blog/${articles[0].slug}` : `/blog/${articles[0].id}`}>
                <Button variant="secondary">Read Article</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.slice(1).map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{article.image}</div>
                <div className="flex items-center space-x-2 text-sm text-gray-soft mb-2">
                  <span className="bg-primary-light text-primary px-2 py-1 rounded">
                    {article.category}
                  </span>
                </div>
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-soft mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <Link href={(article as any).slug ? `/blog/${(article as any).slug}` : `/blog/${article.id}`}>
                  <Button variant="outline" className="w-full">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Browse by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {["Study Abroad", "Scholarships", "Visa", "Application", "Tests", "Finance"].map(
                  (category) => (
                    <Link key={category} href={`/blog?category=${category.toLowerCase()}`}>
                      <button className="px-4 py-2 bg-primary-light text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                        {category}
                      </button>
                    </Link>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <EmailCapturePopup />
    </div>
  );
}





