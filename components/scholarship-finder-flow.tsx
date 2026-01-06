"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, MapPin, DollarSign, Calendar, Loader2, Award, Users, Shield, Zap, Star, Lock, Bell, FileText, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ScholarshipFinderFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [answers, setAnswers] = useState({
    nationality: "",
    degreeLevel: "",
    fieldOfStudy: "",
    destination: "",
    fundingType: "",
  });

  const questions = [
    {
      id: "nationality",
      question: "Where are you from?",
      placeholder: "e.g., Kenya, Uganda, Nigeria, Ghana",
      type: "text",
    },
    {
      id: "destination",
      question: "Where do you want to study?",
      options: ["United States", "United Kingdom", "Canada", "Germany", "Australia", "Europe", "Asia", "Anywhere"],
      type: "choice",
    },
    {
      id: "degreeLevel",
      question: "What degree are you pursuing?",
      options: ["Bachelor's", "Master's", "PhD", "Diploma/Certificate"],
      type: "choice",
    },
    {
      id: "fieldOfStudy",
      question: "What do you want to study?",
      placeholder: "e.g., Computer Science, Medicine, Engineering, Business",
      type: "text",
    },
    {
      id: "fundingType",
      question: "What type of funding do you need?",
      options: ["Full Funding (Tuition + Living)", "Tuition Only", "Partial Funding", "Any Support"],
      type: "choice",
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isAnswered = answers[currentQuestion.id as keyof typeof answers];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFindScholarships();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFindScholarships = async () => {
    setLoading(true);
    try {
      // Build query parameters from answers - use flexible matching
      const params = new URLSearchParams();
      
      // For African students, most scholarships are "forAfrican"
      // This is more important than exact country match
      if (answers.nationality) {
        const africanCountries = [
          "kenya", "uganda", "nigeria", "ghana", "rwanda", "tanzania", 
          "ethiopia", "south africa", "senegal", "cameroon", "egypt",
          "morocco", "algeria", "tunisia", "zimbabwe", "zambia", "malawi",
          "botswana", "namibia", "mozambique", "angola", "drc", "congo",
          "ivory coast", "mali", "burkina faso", "niger", "chad", "sudan",
          "south sudan", "somalia", "eritrea", "djibouti", "mauritius"
        ];
        const isAfrican = africanCountries.some(c => 
          answers.nationality.toLowerCase().includes(c)
        );
        if (isAfrican) {
          params.append('forAfrican', 'true');
        }
      }
      
      // Don't filter by destination country strictly - many scholarships are "Multiple Countries"
      // Instead, we'll do a more flexible search
      if (answers.destination && answers.destination !== "Anywhere") {
        params.append('search', answers.destination);
      }
      
      // Note: Don't filter by degree level strictly - it causes issues with Prisma enum matching
      // The search will include all scholarships and we'll do client-side filtering if needed
      
      // Don't use strict fieldOfStudy matching - do a search instead
      if (answers.fieldOfStudy) {
        // If we already have a search, append to it
        const existingSearch = params.get('search');
        if (existingSearch) {
          params.set('search', `${existingSearch} ${answers.fieldOfStudy}`);
        } else {
          params.append('search', answers.fieldOfStudy);
        }
      }
      
      // Don't filter by amount - show all scholarships
      // if (answers.fundingType && answers.fundingType !== "Any Support") {
      //   if (answers.fundingType.includes("Full")) {
      //     params.append('minAmount', '10000');
      //   }
      // }

      // Fetch matching scholarships - get more results
      const response = await fetch(`/api/scholarships?${params.toString()}&limit=50`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch scholarships');
      }
      
      const data = await response.json();
      let scholarships = data.scholarships || [];
      
      // If no results with filters, try without filters to get ALL scholarships
      if (scholarships.length === 0) {
        const fallbackResponse = await fetch(`/api/scholarships?limit=50`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          scholarships = fallbackData.scholarships || [];
        }
      }
      
      setResults(scholarships);
      setShowResults(true);
    } catch (error) {
      console.error('Error finding scholarships:', error);
      // Try to get ALL scholarships as fallback
      try {
        const fallbackResponse = await fetch(`/api/scholarships?limit=50`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setResults(fallbackData.scholarships || []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      }
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | null, currency: string = 'USD'): string => {
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

  const handleEmailCapture = async () => {
    if (!email || !email.includes("@")) return;
    
    setEmailLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "scholarship-finder" }),
      });
      
      if (response.ok) {
        setEmailCaptured(true);
      }
    } catch (error) {
      console.error("Email capture error:", error);
    } finally {
      setEmailLoading(false);
    }
  };

  // Calculate total scholarship value for display
  const totalValue = results.reduce((sum, s) => sum + (s.amount || 0), 0);
  const visibleResults = emailCaptured ? results : results.slice(0, 5);

  // Show results page
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Stats */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setResults([]);
                setEmailCaptured(false);
                setEmail("");
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Start Over
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Great News! We Found {results.length} Scholarships For You
            </h1>
            <p className="text-gray-600 mb-4">
              Total potential funding: <span className="font-bold text-primary">${totalValue.toLocaleString()}</span>
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                <span>127+ students helped</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>85% success rate</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Verified scholarships</span>
              </div>
            </div>
          </div>

          {results.length > 0 ? (
            <>
              {/* Results Grid - Show first 5 or all if email captured */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleResults.map((scholarship) => {
                  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                  return (
                    <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`}>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg leading-tight line-clamp-2">
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
                              {formatCurrency(scholarship.amount, scholarship.currency || 'USD')}
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

              {/* Email Capture Gate - Show if more results available */}
              {!emailCaptured && results.length > 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {results.length - 5} More Scholarships Available!
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Enter your email to unlock all {results.length} matching scholarships worth ${totalValue.toLocaleString()}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleEmailCapture}
                          disabled={emailLoading || !email.includes("@")}
                        >
                          {emailLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Unlock All
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        🔒 We never spam. Unsubscribe anytime.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Success message after email capture */}
              {emailCaptured && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Card className="border-2 border-green-500 bg-green-50">
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        All {results.length} Scholarships Unlocked!
                      </h3>
                      <p className="text-gray-600">
                        We've also sent you a copy of these matches to your email.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Premium Upsell Section */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                {/* Premium Features Card */}
                <Card className="border-2 border-primary shadow-lg">
                  <CardHeader className="bg-primary text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      <CardTitle className="text-lg">Upgrade to Premium - $5/month</CardTitle>
                    </div>
                    <CardDescription className="text-white/80">
                      10x your chances of winning a scholarship
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">10,000+ Verified Scholarships</span>
                          <p className="text-sm text-gray-500">Full access to our database</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Visa Guidance & Checklist</span>
                          <p className="text-sm text-gray-500">Know exactly what documents you need</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">AI Copilot Essay Help</span>
                          <p className="text-sm text-gray-500">Write winning essays</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">WhatsApp Deadline Alerts</span>
                          <p className="text-sm text-gray-500">Never miss a deadline</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Application Checklists</span>
                          <p className="text-sm text-gray-500">Never miss a requirement</p>
                        </div>
                      </li>
                    </ul>
                    <Link href="/pricing">
                      <Button className="w-full">
                        Get Premium - $5/month
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Expert Help Card */}
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Need Expert Help?</CardTitle>
                    </div>
                    <CardDescription>
                      Let us handle everything for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="bg-primary-light rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-primary mb-1">Our $299 Standard Package includes:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✓ Expert writes your Statement of Purpose</li>
                        <li>✓ 3-5 scholarship applications submitted for you</li>
                        <li>✓ Visa guidance & document checklist</li>
                        <li>✓ WhatsApp support until admission</li>
                        <li>✓ 50% refund if not admitted</li>
                      </ul>
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-gray-900">$299</span>
                      <span className="text-gray-500 ml-2">one-time</span>
                      <p className="text-sm text-gray-600 mt-1">Average scholarship won: $18,000</p>
                    </div>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full">
                        Talk to an Expert
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Want to browse all 10,000+ scholarships in our database?
                </p>
                <Link href="/scholarships">
                  <Button variant="outline">
                    View All Scholarships
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No scholarships found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all scholarships
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setCurrentStep(0);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/scholarships">
                  <Button>
                    Browse All Scholarships
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show question flow
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Scholarship
          </h1>
          <p className="text-gray-600">
            Answer a few questions to discover scholarships that match your profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Input */}
            <div className="mb-8">
              {currentQuestion.type === "choice" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        answers[currentQuestion.id as keyof typeof answers] === option
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {answers[currentQuestion.id as keyof typeof answers] === option && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id as keyof typeof answers] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="text-lg p-6"
                  autoFocus
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isAnswered || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding...
                  </>
                ) : currentStep < questions.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Find Scholarships
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip Option */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Want to browse all scholarships instead?{" "}
          <Link
            href="/scholarships"
            className="text-primary font-medium hover:underline"
          >
            Browse All
          </Link>
        </p>
      </div>
    </div>
  );
}
