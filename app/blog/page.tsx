import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

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
      id: 1,
      title: "How to Study in Canada: Complete Guide for African Students",
      excerpt:
        "Everything you need to know about studying in Canada, from application requirements to visa processes and living costs.",
      category: "Study Abroad",
      date: "2025-01-15",
      readTime: "8 min read",
      image: "🇨🇦",
    },
    {
      id: 2,
      title: "Top 20 Scholarships for African Students in 2025",
      excerpt:
        "Comprehensive list of the best scholarship opportunities available to African students worldwide, with application deadlines and requirements.",
      category: "Scholarships",
      date: "2025-01-10",
      readTime: "12 min read",
      image: "🎓",
    },
    {
      id: 3,
      title: "Visa Requirements for Germany: Step-by-Step Guide",
      excerpt:
        "Navigate the German student visa process with our detailed guide covering documents, timelines, and interview tips.",
      category: "Visa",
      date: "2025-01-05",
      readTime: "10 min read",
      image: "🇩🇪",
    },
    {
      id: 4,
      title: "How to Write a Perfect Statement of Purpose (SOP)",
      excerpt:
        "Master the art of writing a compelling SOP that stands out to admissions committees. Includes examples and templates.",
      category: "Application",
      date: "2024-12-28",
      readTime: "15 min read",
      image: "✍️",
    },
    {
      id: 5,
      title: "Understanding IELTS vs TOEFL: Which Test Should You Take?",
      excerpt:
        "Compare IELTS and TOEFL to determine which English proficiency test is right for your study abroad goals.",
      category: "Tests",
      date: "2024-12-20",
      readTime: "7 min read",
      image: "📝",
    },
    {
      id: 6,
      title: "Cost of Living: Studying in the US vs UK vs Canada",
      excerpt:
        "Compare living costs across top study destinations to help you plan your budget and choose the right country.",
      category: "Finance",
      date: "2024-12-15",
      readTime: "9 min read",
      image: "💰",
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
              <Link href={`/blog/${articles[0].id}`}>
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
                <Link href={`/blog/${article.id}`}>
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
    </div>
  );
}



