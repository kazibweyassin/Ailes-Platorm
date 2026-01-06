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

// Partner and company logos data
const partnerLogos = [
  { name: "Association Partners", image: "/partners/associationLogo2.webp" },
];

const companyLogos = [
  { name: "Top Companies", image: "/partners/companiesLogo.png" },
];

export default function HomeClient(): JSX.Element {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [scholarshipCount, setScholarshipCount] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [currentLogoSet, setCurrentLogoSet] = useState<'partners' | 'companies'>('partners');
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
  const [heroScholarships, setHeroScholarships] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

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

  // Fetch hero scholarships for sidebar
  useEffect(() => {
    const fetchHeroScholarships = async () => {
      try {
        const response = await fetch('/api/scholarships?limit=8&sort=createdAt');
        const data = await response.json();
        if (data.scholarships && data.scholarships.length > 0) {
          setHeroScholarships(data.scholarships);
        }
      } catch (error) {
        console.error('Error fetching hero scholarships:', error);
      }
    };
    fetchHeroScholarships();
  }, []);

  // Auto-rotate hero scholarships every 3 seconds
  useEffect(() => {
    if (heroScholarships.length <= 4) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 4) % heroScholarships.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroScholarships.length]);

  // Auto-rotate logos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoSet((prev) => prev === 'partners' ? 'companies' : 'partners');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatStatsCurrency = (amount: number | null): string => {
    if (amount === null) return '...';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M+`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K+`;
    return `$${amount.toLocaleString()}+`;
  };

  const formatScholarshipCurrency = (amount: number | null, currency: string = 'USD'): string => {
    if (!amount) return 'Full Funding';
    if (amount >= 1000000) return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${currency} ${(amount / 1000).toFixed(0)}K`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getDaysUntilDeadline = (deadline: string | null): number | null => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  return (
    <>
      <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find scholarships. Match universities. Study abroad.
              </h1>
              
              <p className="text-xl text-gray-700 mb-8">
                {scholarshipCount ? `${scholarshipCount}+ scholarships` : 'Hundreds of scholarships'} from universities in 50+ countries. 
                Free to search. Real opportunities for African students.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/find-scholarships">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Find Scholarships in 60 Seconds
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/scholarships">
                  <Button size="lg" variant="outline" className="border-gray-300">
                    Browse All Scholarships
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">{scholarshipCount || '500'}+</span> scholarships
                </div>
                <div>
                  <span className="font-semibold text-gray-900">50+</span> countries
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Free</span> to use
                </div>
              </div>

              {/* Rotating Logos Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="transition-opacity duration-500">
                  {currentLogoSet === 'partners' ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">Proudly associated with</p>
                      <div className="flex items-center">
                        <Image 
                          src="/partners/associationLogo2.webp" 
                          alt="Association Partners" 
                          width={600} 
                          height={80}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">Our students finished University to work at global offices of</p>
                      <div className="flex items-center">
                        <Image 
                          src="/partners/companiesLogo.png" 
                          alt="Top Companies" 
                          width={600} 
                          height={80}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Recent Opportunities */}
            <div className="hidden md:flex flex-col gap-3">
              <div className="text-sm font-medium text-gray-500 mb-2">Just Added</div>
              
              {heroScholarships.length > 0 ? (
                <>
                  {heroScholarships.slice(currentHeroIndex, currentHeroIndex + 4).map((scholarship, idx) => {
                    const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                    return (
                      <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`}>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-gray-900 line-clamp-1">{scholarship.name}</div>
                            <div className="text-blue-600 font-bold whitespace-nowrap ml-2">
                              {formatScholarshipCurrency(scholarship.amount, scholarship.currency || 'USD')}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {scholarship.country} • {daysLeft ? `Closes in ${daysLeft} days` : 'Open'}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </>
              ) : (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
                      <div className="h-5 bg-blue-100 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-blue-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </>
              )}

              <Link href="/scholarships" className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                View all scholarships →
              </Link>
            </div>
          </div>
        </div>
      </section>      {/* Mobile Quick Actions - App-like Interface */}
      <MobileQuickActions />

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-600">
              Three steps to find and apply for scholarships
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                number: "1",
                title: "Find Scholarships",
                description: "Search 500+ opportunities or use AI matching to find scholarships that fit your profile.",
              },
              {
                number: "2",
                title: "Match Universities",
                description: "Get matched with universities that accept those scholarships. Funding comes first.",
              },
              {
                number: "3",
                title: "Apply",
                description: "Use AI Copilot to generate applications, essays, and recommendation letters.",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6 items-start border-l-2 border-blue-600 pl-6">
                <div className="flex-shrink-0 -ml-9 mt-1">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Recent Scholarships
            </h2>
            <p className="text-gray-600">
              New opportunities added this week
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
                    <Card className="h-full hover:border-blue-300 transition-colors border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {scholarship.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {scholarship.provider}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-blue-600 font-semibold">
                          {formatScholarshipCurrency(scholarship.amount, scholarship.currency || 'USD')}
                        </div>
                        {scholarship.country && (
                          <div className="text-sm text-gray-600">
                            📍 {scholarship.country}
                          </div>
                        )}
                        {daysLeft !== null && daysLeft > 0 && (
                          <div className={`text-sm ${daysLeft <= 30 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            Deadline: {daysLeft} days left
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : null}
          <div className="mt-8">
            <Link href="/scholarships">
              <Button variant="outline" size="lg">
                View All Scholarships →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Copilot CTA */}
      <section className="py-16 bg-gray-50 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI Copilot for Applications
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Generate scholarship applications, motivation letters, and essays with AI. 
              Save 40+ hours per application cycle.
            </p>
            <Link href="/copilot/activate">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Try AI Copilot
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Study Destinations
            </h2>
            <p className="text-gray-600">
              Scholarships available in 50+ countries
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "United States", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&q=80" },
              { name: "United Kingdom", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80" },
              { name: "Canada", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&q=80" },
              { name: "Germany", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80" },
              { name: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80" },
              { name: "Netherlands", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80" },
            ].map((destination, index) => (
              <Link key={index} href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="relative h-32 border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer overflow-hidden group">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-semibold text-sm text-center">{destination.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Success Stories
            </h2>
            <p className="text-gray-600">
              Students who found scholarships through Ailes Global
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {getFeaturedStories().map((story, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                      {story.image.startsWith('/') ? (
                        !imageErrors[story.image] ? (
                          <Image
                            src={story.image}
                            alt={`${story.name} - ${story.program}`}
                            fill
                            className="object-cover"
                            onError={() => setImageErrors(prev => ({ ...prev, [story.image]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-semibold text-xs">
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )
                      ) : (
                        <span className="text-2xl">{story.image}</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">{story.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {story.program}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">"{story.testimonial}"</p>
                  <div className="text-sm text-blue-600 font-medium">
                    {story.scholarship}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/success-stories">
              <Button variant="outline" size="lg">
                View All Stories →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsor a Scholar Section */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Image Side */}
            <div className="relative h-[350px] lg:h-[400px] overflow-hidden border border-gray-200 order-2 lg:order-1">
              <Image
                src="/scholarships-banner.jpg"
                alt="Female students studying together - Empowering future leaders through education"
                fill
                className="object-cover"
              />
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Sponsor a Scholar
                </h2>
                <p className="text-gray-600">
                  Help African students access world-class education. 
                  100% of your sponsorship goes directly to supporting their journey.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center border border-gray-200 p-4">
                  {loadingStats ? (
                    <div className="space-y-2">
                      <div className="h-6 w-16 bg-gray-200 animate-pulse mx-auto"></div>
                      <div className="h-4 w-20 bg-gray-200 animate-pulse mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.sponsoredScholars !== null ? `${stats.sponsoredScholars}+` : '127+'}
                      </div>
                      <div className="text-xs text-gray-600">Scholars</div>
                    </>
                  )}
                </div>
                <div className="text-center border border-gray-200 p-4">
                  {loadingStats ? (
                    <div className="space-y-2">
                      <div className="h-6 w-20 bg-gray-200 animate-pulse mx-auto"></div>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.totalFunding !== null ? formatStatsCurrency(stats.totalFunding) : '$2.5M+'}
                      </div>
                      <div className="text-xs text-gray-600">Funding</div>
                    </>
                  )}
                </div>
                <div className="text-center border border-gray-200 p-4">
                  {loadingStats ? (
                    <div className="space-y-2">
                      <div className="h-6 w-16 bg-gray-200 animate-pulse mx-auto"></div>
                      <div className="h-4 w-20 bg-gray-200 animate-pulse mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.successRate !== null ? `${stats.successRate}%` : '92%'}
                      </div>
                      <div className="text-xs text-gray-600">Success</div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Link href="/sponsor">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Sponsor a Scholar
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

      {/* Latest Resources */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-dark mb-2">
                Latest Resources & Guides
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Expert guides to help you succeed in your scholarship journey
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                        FEATURED
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Top 20 Fully-Funded Scholarships for African Students in 2026
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Discover the best fully-funded scholarship opportunities with amounts from $50K to $100K+. 
                        Complete list with deadlines, requirements, and application tips.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>12 min read</span>
                        </div>
                      </div>
                      <Link href="/blog/top-20-scholarships-2026">
                        <Button className="w-full sm:w-auto">
                          Read Full Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                        RESOURCES
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        More Helpful Guides
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Explore our complete blog with guides on applications, visas, test prep, and success stories.
                      </p>
                      <Link href="/blog">
                        <Button variant="outline" className="w-full sm:w-auto">
                          Browse All Articles
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                Questions? Email <a href="mailto:support@ailesglobal.com" className="text-primary underline hover:text-primary-dark">support@ailesglobal.com</a> or WhatsApp <a href="https://wa.me/256786367460" className="text-primary underline hover:text-primary-dark">+256 786 367460</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

