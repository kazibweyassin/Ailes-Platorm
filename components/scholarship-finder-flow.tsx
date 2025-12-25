"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, MapPin, DollarSign, Calendar, Loader2, Award } from "lucide-react";
import Link from "next/link";

export default function ScholarshipFinderFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
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
      // Build query parameters from answers
      const params = new URLSearchParams();
      
      if (answers.destination && answers.destination !== "Anywhere") {
        params.append('country', answers.destination);
      }
      
      if (answers.degreeLevel) {
        // Map to API format
        const degreeMap: Record<string, string> = {
          "Bachelor's": "BACHELORS",
          "Master's": "MASTERS",
          "PhD": "PHD",
          "Diploma/Certificate": "DIPLOMA"
        };
        params.append('degreeLevel', degreeMap[answers.degreeLevel] || answers.degreeLevel);
      }
      
      if (answers.fieldOfStudy) {
        params.append('fieldOfStudy', answers.fieldOfStudy);
      }
      
      if (answers.fundingType && answers.fundingType !== "Any Support") {
        if (answers.fundingType.includes("Full")) {
          params.append('minAmount', '10000'); // Full funding usually means higher amounts
        }
      }

      // Fetch matching scholarships
      const response = await fetch(`/api/scholarships?${params.toString()}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch scholarships');
      }
      
      const data = await response.json();
      setResults(data.scholarships || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error finding scholarships:', error);
      // Still show results page even if there's an error
      setResults([]);
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

  // Show results page
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setResults([]);
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Start Over
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Scholarships Matching Your Profile
            </h1>
            <p className="text-gray-600">
              Found {results.length} {results.length === 1 ? 'scholarship' : 'scholarships'} based on your preferences
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((scholarship) => {
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

          {results.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Want to see more personalized matches? Sign in to get AI-powered recommendations
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/signin">
                  <Button variant="outline">
                    Sign In for Better Matches
                  </Button>
                </Link>
                <Link href="/scholarships">
                  <Button>
                    View All Scholarships
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
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
