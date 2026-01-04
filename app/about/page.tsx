import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Globe, Award, TrendingUp, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = generateSEO({
  title: "About Us - Empowering African Students",
  description: "Learn about Ailes Global's mission to empower African students, especially women, to access world-class education through scholarships and expert guidance. Our story, values, and impact.",
  keywords: ["about Ailes Global", "education consulting mission", "African student support", "women empowerment education"],
  canonicalUrl: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="py-16 md:py-24 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/herobgGradient.png')" }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Building Global Citizens
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                of Tomorrow
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're in the business of talent mobility - enabling the global flow of ambition. On one side, we help individuals chase life-changing opportunities across borders. On the other, we support nations in meeting their evolving talent needs. Around this core, we've built a full-stack platform spanning financial services, living and settling-in - designed to make every immigrant's journey smoother, smarter, and more successful. Our mission is to empower the global citizens of tomorrow - and we exist to help them thrive, anywhere.
              </p>
              <p className="text-base text-gray-500 mb-4">
                - Founder, Ailes Global
              </p>
              <Link href="/services">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Our Services
                </Button>
              </Link>
            </div>

            {/* Right side - empty for background image to show */}
            <div className="hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            
            {/* Study Abroad Consulting */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Study Abroad Consulting</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Ailes Global is a comprehensive Study Abroad Platform that helps African students access best-matched higher education opportunities globally. We specialize in scholarships, university matching, and complete application support.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">500+ Students Helped</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">85% Admission Success Rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">$18K Average Scholarship</span>
                  </div>
                </div>
                <Link href="/services">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    View Our Services
                  </Button>
                </Link>
              </div>
              <div className="relative bg-blue-50 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-sm font-medium bg-blue-900 text-white px-4 py-2 rounded-full absolute top-6 right-6">
                  Launched in 2024
                </div>
                <Image 
                  src="/scholars.jpg" 
                  alt="Study Abroad Success" 
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* AI-Powered Matching */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative bg-primary-light rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                <Award className="h-48 w-48 text-primary opacity-20" />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered University & Scholarship Matching</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our advanced AI technology analyzes your academic profile, career goals, and preferences to match you with the best universities and scholarships. Get personalized recommendations in seconds.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">10,000+ Scholarships Database</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">50+ Partner Universities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">30+ Countries Worldwide</span>
                  </div>
                </div>
                <Link href="/university-matcher">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Try AI Matcher
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Copilot */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Scholarship Copilot</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Get instant answers about scholarships, visa requirements, and study abroad process. Our AI Copilot is trained on thousands of scholarship applications and success stories to guide you every step of the way.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">24/7 AI-Powered Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Personalized Recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Application Guidance</span>
                  </div>
                </div>
                <Link href="/copilot/activate">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Activate AI Copilot
                  </Button>
                </Link>
              </div>
              <div className="relative bg-pink-50 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                <MessageCircle className="h-48 w-48 text-pink-600 opacity-20" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            {[
              { number: "500+", label: "Students Helped" },
              { number: "85%", label: "Success Rate" },
              { number: "50+", label: "Partner Universities" },
              { number: "30+", label: "Countries" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-soft">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Student-Centered",
                description:
                  "Every decision we make prioritizes student success and well-being above all else.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We maintain the highest standards in our services, technology, and partnerships.",
              },
              {
                icon: Heart,
                title: "Integrity",
                description:
                  "Transparency, honesty, and ethical practices guide everything we do.",
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}