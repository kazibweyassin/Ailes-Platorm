"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Zap, X } from "lucide-react";

export default function ScholarshipFinderFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCopilotOffer, setShowCopilotOffer] = useState(false);
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

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last question - complete the flow
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Store answers in localStorage for after auth
    localStorage.setItem("scholarshipFinderData", JSON.stringify(answers));
    
    // Show Copilot upgrade offer instead of immediate redirect
    setShowCopilotOffer(true);
  };

  const handleSkipCopilot = () => {
    // Redirect to sign in with callback to matcher
    router.push("/auth/signin?callbackUrl=/scholarships/match");
  };

  const handleActivateCopilot = () => {
    // Store that they want Copilot
    localStorage.setItem("wantsCopilot", "true");
    // Redirect to Copilot payment page
    router.push("/copilot/activate");
  };

  const isAnswered = answers[currentQuestion.id as keyof typeof answers];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-purple-50 flex items-center justify-center p-4">
      {/* Copilot Upgrade Modal */}
      {showCopilotOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={handleSkipCopilot}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Want AI to Apply For You?</h2>
                <p className="text-lg opacity-90">Your Scholarship Copilot is ready to work</p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-lg text-gray-700 mb-2">
                    <strong>Great news!</strong> We found <span className="text-primary font-bold">25+ scholarships</span> that match your profile.
                  </p>
                  <p className="text-gray-600">
                    But filling out 25 applications manually takes <strong>weeks of work</strong>...
                  </p>
                </div>

                <h3 className="text-xl font-bold mb-4">Here's what Scholarship Copilot does:</h3>
                
                <div className="space-y-3 mb-6">
                  {[
                    "Generates 25 custom motivation letters (tailored to each scholarship)",
                    "Pre-fills all application forms with your profile data",
                    "Creates document package ready to submit",
                    "Provides deadline reminders for each scholarship",
                    "Saves you 40+ hours of repetitive work",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-primary/10 to-purple-100 rounded-xl p-6 mb-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">One-time payment</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl line-through text-gray-400">$50</span>
                    <span className="text-5xl font-bold text-primary">$20</span>
                  </div>
                  <p className="text-sm text-gray-600">Same price as lunch, saves you 40+ hours</p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleActivateCopilot}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-bold text-lg py-6"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Activate Copilot - $20
                  </Button>
                  
                  <Button
                    onClick={handleSkipCopilot}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    No Thanks, I'll Apply Manually
                  </Button>
                </div>

                {/* Trust Badge */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  <CheckCircle2 className="inline h-4 w-4 text-green-600 mr-1" />
                  100% Money-back guarantee if not satisfied
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-2xl">
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
                  type={currentQuestion.type === "number" ? "number" : "text"}
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id as keyof typeof answers]}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="text-lg p-6"
                  autoFocus
                  step={currentQuestion.type === "number" ? "0.01" : undefined}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                size="lg"
                className="flex-1"
              >
                {currentStep === questions.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Find My Scholarships
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip Option */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
