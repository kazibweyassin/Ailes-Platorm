"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Globe, Award, Users, Star, MapPin, ChevronDown, Sparkles, Calendar, DollarSign } from "lucide-react";
import dynamic from "next/dynamic";
import { LeadMagnet } from "@/components/lead-magnet";
import { getFeaturedStories } from "@/lib/success-stories";

const MobileQuickActions = dynamic(() => import("@/components/mobile-quick-actions"), {
  ssr: false,
});

export default function HomeClient() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [scholarshipCount, setScholarshipCount] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<{
    sponsoredScholars: number | null;
    totalFunding: number | null;
    successRate: number | null;
  }>({
    sponsoredScholars: null,
    totalFunding: null,
    successRate: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [featuredScholarships, setFeaturedScholarships] = useState<any[]>([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);

  // Fetch actual scholarship count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/scholarships?limit=1');
        const data = await response.json();
        if (data.pagination?.total) {
          setScholarshipCount(data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching scholarship count:', error);
        setScholarshipCount(0);
      }
    };
    fetchCount();
  }, []);

  // Fetch dynamic statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats({
          sponsoredScholars: data.sponsoredScholars ?? null,
          totalFunding: data.totalFunding ?? null,
          successRate: data.successRate ?? null,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep null values if fetch fails
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch featured scholarships
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingScholarships(true);
        const response = await fetch('/api/scholarships?featured=true&limit=3');
        const data = await response.json();
        if (data.scholarships && data.scholarships.length > 0) {
          setFeaturedScholarships(data.scholarships);
        } else {
          // Fallback: Get top 3 by amount or deadline
          const fallbackResponse = await fetch('/api/scholarships?limit=3&sort=amount');
          const fallbackData = await fallbackResponse.json();
          setFeaturedScholarships(fallbackData.scholarships || []);
        }
      } catch (error) {
        console.error('Error fetching featured scholarships:', error);
        setFeaturedScholarships([]);
      } finally {
        setLoadingScholarships(false);
      }
    };
    fetchFeatured();
  }, []);

  // Helper function to format currency for stats (with + suffix)
  const formatStatsCurrency = (amount: number | null): string => {
    if (amount === null) return '...';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M+`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K+`;
    }
    return `$${amount.toLocaleString()}+`;
  };

  // Helper function to format currency for scholarships
  const formatScholarshipCurrency = (amount: number | null, currency: string = 'USD'): string => {
    if (!amount) return 'Full Funding';
    if (amount >= 1000000) return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${currency} ${(amount / 1000).toFixed(0)}K`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Helper function to get days until deadline
  const getDaysUntilDeadline = (deadline: string | null): number | null => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary-light py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5 md:space-y-6 lg:space-y-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-dark leading-tight">
                Find Your <span className="text-primary">Scholarship First</span>,{" "}
                Then Your University
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-soft leading-relaxed">
                Africa's #1 scholarship-first platform. We help you discover fully-funded opportunities
                before university selection - because admission without funding isn't an option.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <Link href="/find-scholarships" className="w-full sm:w-auto sm:flex-1">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg font-semibold py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Find My Scholarships (AI)
                  </Button>
                </Link>
                <Link href="/scholarships" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg font-medium py-6 sm:py-7 border-2">
                    {scholarshipCount !== null 
                      ? `Browse ${scholarshipCount}+ Scholarships` 
                      : 'Browse Scholarships'}
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 md:flex md:items-center md:gap-6 pt-6 md:pt-4">
                <div className="text-center md:text-left">
                  {scholarshipCount !== null ? (
                    <>
                      <p className="text-base md:text-lg font-bold text-primary">
                        {scholarshipCount}+
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-soft">Scholarships</p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mx-auto md:mx-0"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto md:mx-0"></div>
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base md:text-lg font-bold text-primary">50+</p>
                  <p className="text-[10px] md:text-xs text-gray-soft">Countries</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base md:text-lg font-bold text-primary">1000+</p>
                  <p className="text-[10px] md:text-xs text-gray-soft">Students Helped</p>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image - Visible on all screens */}
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/scholars.jpg"
                  alt="Students celebrating graduation"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5" />
                    <span className="text-sm font-semibold">Study in 50+ Countries</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["US 🇺🇸", "UK 🇬🇧", "Canada 🇨🇦", "Germany 🇩🇪"].map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Quick Actions - App-like Interface */}
      <MobileQuickActions />

      {/* AI Copilot Section - Moved from Hero */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border-2 border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-dark">
                      Unlock AI Copilot
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    Let AI handle the paperwork while you focus on winning scholarships
                  </p>
                  <div className="bg-white/80 rounded-lg p-4 border-l-4 border-primary">
                    <div className="font-semibold text-primary mb-2 text-sm md:text-base">Why use Copilot?</div>
                    <ul className="list-disc pl-5 text-xs md:text-sm text-gray-700 space-y-1">
                      <li>Get 25+ custom scholarship applications, motivation letters, and deadline reminders</li>
                      <li>Save 40+ hours of manual work</li>
                      <li>Boost your chances of winning funding</li>
                      <li>Access to exclusive scholarships from our sponsors</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/copilot/activate">
                    <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-base md:text-lg px-8 py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all border-2 border-primary">
                      🚀 Activate Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ailes Global */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
              Why Choose Ailes Global?
            </h2>
            <p className="text-xs md:text-sm text-gray-soft max-w-2xl mx-auto">
              We combine expertise, technology, and personalized support to help you
              achieve your study abroad dreams.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Expert Guidance",
                description:
                  "Our team of experienced consultants provides personalized advice tailored to your goals and background.",
              },
              {
                icon: Globe,
                title: "Global Network",
                description:
                  "Partnerships with top universities worldwide and access to exclusive scholarship opportunities.",
              },
              {
                icon: Users,
                title: "Women-Focused",
                description:
                  "Specialized support for female scholars, with programs designed to empower and uplift.",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
              Featured Scholarships
            </h2>
            <p className="text-xs md:text-sm text-gray-soft max-w-2xl mx-auto">
              Discover top opportunities worth up to $100,000+ in funding
            </p>
          </div>
          {loadingScholarships ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredScholarships.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredScholarships.map((scholarship) => {
                const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                return (
                  <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-base leading-tight line-clamp-2">
                            {scholarship.name}
                          </CardTitle>
                          {scholarship.featured && (
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap flex-shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {scholarship.provider}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-semibold text-success">
                            {formatScholarshipCurrency(scholarship.amount, scholarship.currency || 'USD')}
                          </span>
                        </div>
                        {scholarship.country && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{scholarship.country}</span>
                          </div>
                        )}
                        {daysLeft !== null && daysLeft > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className={`h-4 w-4 ${daysLeft <= 30 ? 'text-red-500' : 'text-gray-600'}`} />
                            <span className={daysLeft <= 30 ? 'text-red-500 font-semibold' : 'text-gray-600'}>
                              {daysLeft} days left
                            </span>
                          </div>
                        )}
                        {scholarship.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {scholarship.description}
                          </p>
                        )}
                        <div className="pt-2">
                          <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary-dark">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : null}
          <div className="text-center mt-8">
            <Link href="/scholarships">
              <Button variant="outline" size="default">
                View All Scholarships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
              Study in Top Destinations
            </h2>
            <p className="text-xs md:text-sm text-gray-soft max-w-2xl mx-auto">
              Explore world-class education opportunities across the globe.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "United States", flag: "🇺🇸", count: "150+ Universities" },
              { name: "United Kingdom", flag: "🇬🇧", count: "80+ Universities" },
              { name: "Canada", flag: "🇨🇦", count: "100+ Universities" },
              { name: "Germany", flag: "🇩🇪", count: "60+ Universities" },
              { name: "Australia", flag: "🇦🇺", count: "50+ Universities" },
              { name: "Netherlands", flag: "🇳🇱", count: "40+ Universities" },
            ].map((destination, index) => (
              <Link key={index} href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl mb-2">{destination.flag}</p>
                        <h3 className="font-semibold text-base">{destination.name}</h3>
                        <p className="text-xs text-gray-soft">{destination.count}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-dark mb-3">
              Your Path to Fully-Funded Education
            </h2>
            <p className="text-sm md:text-base text-gray-soft max-w-3xl mx-auto">
              From scholarship discovery to university admission - we guide you through every step
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                step: "01",
                icon: "🎯",
                title: "Find Scholarships First",
                description: "Use our AI-powered matching system to discover fully-funded scholarships that fit your profile, goals, and preferences.",
                action: "Start Matching",
                link: "/scholarships/match"
              },
              {
                step: "02",
                icon: "🎓",
                title: "Match with Universities",
                description: "Browse universities offering your selected scholarships. Filter by country, program, ranking, and application deadlines.",
                action: "Browse Universities",
                link: "/university-matcher"
              },
              {
                step: "03",
                icon: "📝",
                title: "Apply with Expert Help",
                description: "Get personalized guidance on applications, essays, documents, and interviews. Track all deadlines in one place.",
                action: "Get Support",
                link: "/services"
              },
              {
                step: "04",
                icon: "✈️",
                title: "Prepare for Departure",
                description: "Receive visa assistance, pre-departure briefings, accommodation support, and connect with fellow scholars.",
                action: "Learn More",
                link: "/about"
              },
            ].map((step, index) => (
              <Card 
                key={index} 
                className={`transition-all duration-300 border-2 cursor-pointer ${
                  expandedStep === index ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="text-3xl flex-shrink-0">{step.icon}</div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                        expandedStep === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                {expandedStep === index && (
                  <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                    <CardDescription className="text-sm text-gray-600 mb-4 pl-14">
                      {step.description}
                    </CardDescription>
                    <Link href={step.link} onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark ml-14 p-0 h-auto font-semibold">
                        {step.action}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
          
          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-600 mb-4">Ready to start your journey?</p>
            <Link href="/scholarships/match">
              <Button size="lg" className="text-base">
                Find Your Scholarships Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
              Success Stories
            </h2>
            <p className="text-xs md:text-sm text-gray-soft max-w-2xl mx-auto">
              Real students, real results. See how we've helped transform lives.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {getFeaturedStories().map((story, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {!imageErrors[story.image] ? (
                        <Image
                          src={story.image}
                          alt={`${story.name} - ${story.program}`}
                          fill
                          className="object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [story.image]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-xs">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{story.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {story.program} • {story.country}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-gray-soft mb-4">"{story.testimonial}"</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <Award className="h-4 w-4 text-success" />
                    <span className="text-success font-medium">{story.scholarship}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/success-stories">
              <Button variant="outline" size="default">
                View All Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsor a Scholar Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <Image
                src="/scholarships-banner.jpg"
                alt="Female students studying together - Empowering future leaders through education"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 fill-white" />
                    <span className="text-lg font-bold">Empowering Future Leaders</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Join us in creating opportunities for talented African women to access world-class education
                  </p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
                  <Star className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-900">Make a Difference</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-dark mb-3">
                  Sponsor a Female Scholar
                </h2>
                <p className="text-sm md:text-base text-gray-soft">
                  Help a talented African woman access world-class education. 
                  100% of your sponsorship goes directly to supporting her journey.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="h-6 w-6 text-pink-600" />
                    </div>
                    {loadingStats ? (
                      <div className="space-y-2">
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold mb-2">
                          {stats.sponsoredScholars !== null ? `${stats.sponsoredScholars}+` : '127+'} Scholars
                        </h3>
                        <p className="text-sm text-gray-600">Sponsored to date</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    {loadingStats ? (
                      <div className="space-y-2">
                        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold mb-2">
                          {stats.totalFunding !== null ? formatStatsCurrency(stats.totalFunding) : '$2.5M+'}
                        </h3>
                        <p className="text-sm text-gray-600">In scholarships secured</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    {loadingStats ? (
                      <div className="space-y-2">
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold mb-2">
                          {stats.successRate !== null ? `${stats.successRate}%` : '92%'} Success
                        </h3>
                        <p className="text-sm text-gray-600">Scholarship success rate</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Link href="/sponsor">
                  <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto">
                    <Globe className="mr-2 h-5 w-5" />
                    Sponsor a Scholar Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Signup - Lead Magnet */}
      <section className="py-12 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <LeadMagnet />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Ready to Start Your Journey?
          </h2>
          <p className="text-sm md:text-base mb-6 max-w-2xl mx-auto opacity-90">
            Book a free consultation today and take the first step towards your
            global education dream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="default" variant="secondary" className="w-full sm:w-auto">
                Book Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/university-matcher">
              <Button size="default" variant="outline" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
                Find Your University
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - Reorganized */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-dark mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Everything you need to know about Scholarship Copilot
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "How does Copilot work?",
                  answer: "Answer a few questions about your background and goals. Let our AI match you to the best scholarships worldwide. Preview your application package (motivation letter, filled forms, etc.). Review and approve before anything is submitted. Let Copilot handle the paperwork—saving you 40+ hours!"
                },
                {
                  question: "Is my data safe?",
                  answer: "Yes. We never share your information and require your consent before any submission. All data is encrypted and stored securely."
                },
                {
                  question: "Can I review before applying?",
                  answer: "Absolutely! You review and approve every application before it's sent. Nothing is submitted without your explicit approval."
                },
                {
                  question: "What if I need help?",
                  answer: "See contact info below or join our WhatsApp support group. Our team is here to help you every step of the way."
                },
                {
                  question: "How much does it cost?",
                  answer: "Browse scholarships is completely free. Copilot premium features are available with a one-time payment."
                },
                {
                  question: "Do you help with visas?",
                  answer: "Yes! We provide visa assistance as part of our comprehensive study abroad support services."
                },
              ].map((faq, index) => (
                <Card 
                  key={index}
                  className={`transition-all duration-300 border-2 cursor-pointer ${
                    expandedStep === index + 10 ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary/30'
                  }`}
                  onClick={() => setExpandedStep(expandedStep === index + 10 ? null : index + 10)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg">{faq.question}</CardTitle>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          expandedStep === index + 10 ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>
                  {expandedStep === index + 10 && (
                    <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Questions? Email <a href="mailto:support@ailesglobal.com" className="text-primary underline hover:text-primary-dark">support@ailesglobal.com</a> or WhatsApp <a href="https://wa.me/256700123456" className="text-primary underline hover:text-primary-dark">+256 700 123 456</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

