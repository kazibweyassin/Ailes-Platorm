"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Globe, Award, Users, Star, MapPin, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const MobileQuickActions = dynamic(() => import("@/components/mobile-quick-actions"), {
  ssr: false,
});

export default function Home() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-light via-white to-primary-light/30 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-dark leading-tight">
                Find Your <span className="text-primary">Scholarship First</span>,{" "}
                Then Your University
              </h1>
              <p className="text-xs md:text-sm lg:text-base text-gray-soft">
                Africa's #1 scholarship-first platform. We help you discover fully-funded opportunities
                before university selection - because admission without funding isn't an option.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/scholarships/match" className="w-full sm:w-auto">
                  <Button size="default" className="w-full sm:w-auto text-sm">
                    Find My Scholarships (AI)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/scholarships" className="w-full sm:w-auto">
                  <Button size="default" variant="outline" className="w-full sm:w-auto text-sm">
                    Browse 500+ Scholarships
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 md:flex md:items-center md:gap-6 pt-4">
                <div className="text-center md:text-left">
                  <p className="text-base md:text-lg font-bold text-primary">500+</p>
                  <p className="text-[10px] md:text-xs text-gray-soft">Scholarships</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base md:text-lg font-bold text-primary">$50M+</p>
                  <p className="text-[10px] md:text-xs text-gray-soft">Funding Available</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base md:text-lg font-bold text-primary">85%</p>
                  <p className="text-[10px] md:text-xs text-gray-soft">Match Accuracy</p>
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

      {/* Destinations */}
      <section className="py-20 bg-primary-light">
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
      <section className="py-20 bg-gradient-to-b from-white to-primary-light/30">
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
            {[
              {
                name: "Amina Hassan",
                country: "United States",
                program: "Master's in Computer Science",
                scholarship: "Full Scholarship",
                testimonial:
                  "Ailes Global helped me secure a full scholarship to study in the US. Their guidance was invaluable throughout the entire process.",
                image: "/testimonials/1563233589-41b3764fc123.jpg"
              },
              {
                name: "Chinwe Okafor",
                country: "Canada",
                program: "MBA",
                scholarship: "Partial Scholarship",
                testimonial:
                  "The team's expertise and personalized support made my dream of studying in Canada a reality. Highly recommended!",
                image: "/testimonials/1602657800280-d4f59674983b.jpg"
              },
              {
                name: "Fatima Diallo",
                country: "Germany",
                program: "PhD in Engineering",
                scholarship: "Research Grant",
                testimonial:
                  "From application to visa, Ailes Global was with me every step. I'm now pursuing my PhD in Germany!",
                image: "/testimonials/1657781763968-253a9656bfba.jpg"
              },
            ].map((story, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover"
                      />
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
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop"
                alt="Female students studying together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/70 via-purple-900/40 to-transparent"></div>
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
                    <h3 className="font-semibold mb-2">127 Scholars</h3>
                    <p className="text-sm text-gray-600">Sponsored to date</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">$2.5M+</h3>
                    <p className="text-sm text-gray-600">In scholarships secured</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">92% Success</h3>
                    <p className="text-sm text-gray-600">Scholarship success rate</p>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
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
    </div>
  );
}

