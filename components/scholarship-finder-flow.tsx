"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Zap, X } from "lucide-react";

import AICopilot from "@/components/ai-copilot";

export default function ScholarshipFinderFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCopilotOffer, setShowCopilotOffer] = useState(false);
  const [searchMode, setSearchMode] = useState<'manual' | 'ai'>('ai'); // Default to AI for demo
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [simulatedMatches, setSimulatedMatches] = useState<any[] | null>(null);
  const [answers, setAnswers] = useState({
    nationality: "",
    degreeLevel: "",
    fieldOfStudy: "",
    destination: "",
    fundingType: "",
  });
  const [demoMode, setDemoMode] = useState(false);
  const lastRequestTimeRef = useRef<number>(0);

  // Demo answers for investor/user demo
  const demoAnswers = {
    nationality: "Kenya",
    degreeLevel: "Master's",
    fieldOfStudy: "Computer Science",
    destination: "United Kingdom",
    fundingType: "Full Funding (Tuition + Living)",
  };

  // Auto-advance in demo mode
  useEffect(() => {
    if (demoMode && currentStep < questions.length) {
      const stepId = questions[currentStep]?.id as keyof typeof demoAnswers;
      if (stepId && answers[stepId] !== demoAnswers[stepId]) {
        setTimeout(() => {
          setAnswers((prev) => ({ ...prev, [stepId]: demoAnswers[stepId] }));
        }, 500);
      } else {
        setTimeout(() => {
          if (currentStep < questions.length - 1) setCurrentStep((prev) => prev + 1);
          else handleComplete();
        }, 700);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, currentStep, answers]);

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

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'ai' ? 'manual' : 'ai');
    setAiResponse('');
  };

  // All functions are now closed, so we can safely return the component JSX
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchMode === 'ai' ? 'AI-Powered Scholarship Finder' : 'Find Your Perfect Scholarship'}
          </h1>
          <p className="text-gray-600 mb-4">
            {searchMode === 'ai' 
              ? 'Get personalized scholarship recommendations using AI' 
              : 'Answer a few questions to discover scholarships that match your profile'}
          </p>
          <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200 mb-6">
            <button
              onClick={() => setSearchMode('manual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchMode === 'manual' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Manual Search
            </button>
            <button
              onClick={() => setSearchMode('ai')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                searchMode === 'ai' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </button>
          </div>
          <button
            className="text-xs text-primary underline mb-2"
            onClick={() => setDemoMode((d) => !d)}
          >
            {demoMode ? 'Exit Demo Mode' : 'Try Demo Mode (Investor Preview)'}
          </button>
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
            <div className="flex justify-between pt-6">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              {currentStep < questions.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!answers[questions[currentStep].id as keyof typeof answers]}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isAILoading || !answers[questions[currentStep].id as keyof typeof answers]}
                  onClick={async () => {
                    // Ensure the last question is answered
                    if (!answers[questions[currentStep].id as keyof typeof answers]) return;

                    if (searchMode === 'ai') {
                      // Light rate limiting: only prevent if requests are extremely close together
                      const now = Date.now();
                      const timeSinceLastRequest = now - lastRequestTimeRef.current;
                      const minDelay = 500; // 500ms minimum - very lenient
                      
                      if (timeSinceLastRequest < minDelay) {
                        // Just wait silently instead of blocking
                        await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
                      }

                      lastRequestTimeRef.current = Date.now();

                      try {
                        setIsAILoading(true);
                        // Persist answers for matcher or AI processing
                        localStorage.setItem('scholarshipFinderData', JSON.stringify(answers));

                        // Use AI chat API to find matching scholarships
                        (async () => {
                          try {
                            // Build a query message for the AI
                            const queryParts = [];
                            if (answers.nationality) queryParts.push(`from ${answers.nationality}`);
                            if (answers.destination) queryParts.push(`studying in ${answers.destination}`);
                            if (answers.degreeLevel) queryParts.push(`for ${answers.degreeLevel}`);
                            if (answers.fieldOfStudy) queryParts.push(`in ${answers.fieldOfStudy}`);
                            if (answers.fundingType) queryParts.push(`with ${answers.fundingType}`);

                            const queryMessage = `Find scholarships ${queryParts.join(', ')}.`;

                            // Call the AI chat API with the user's profile
                            const response = await fetch("/api/ai/chat", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ 
                                message: queryMessage,
                                context: { 
                                  finderData: answers
                                }
                              }),
                            });

                            const data = await response.json();

                            if (!response.ok || data.error) {
                              throw new Error(data.error || 'Failed to get AI response');
                            }

                            // If AI returned scholarship matches, use them
                            if (data.type === 'scholarship_matches' && data.matches && data.matches.length > 0) {
                              const recommendations = data.matches.map((match: any) => match.scholarship);
                              localStorage.setItem('simulatedScholarshipMatches', JSON.stringify(recommendations));
                              setSimulatedMatches(recommendations);
                              setAiResponse(data.reply || `I found ${recommendations.length} scholarships that match your profile.`);
                            } else {
                              // Fallback: fetch scholarships manually if AI didn't return matches
                              const params = new URLSearchParams();
                              if (answers.destination) params.set('country', answers.destination);
                              if (answers.fieldOfStudy) params.set('fieldOfStudy', answers.fieldOfStudy);
                              if (answers.degreeLevel) params.set('degreeLevel', answers.degreeLevel);
                              params.set('limit', '50');

                              const res = await fetch(`/api/scholarships?${params.toString()}`);
                              if (res.ok) {
                                const body = await res.json();
                                const list: any[] = body.scholarships || [];
                                const recommendations = list.slice(0, 3);
                                
                                localStorage.setItem('simulatedScholarshipMatches', JSON.stringify(recommendations));
                                setSimulatedMatches(recommendations);
                                setAiResponse(data.reply || `I found ${recommendations.length} scholarships that match your profile.`);
                              } else {
                                setAiResponse(data.reply || 'Sorry, I could not find matching scholarships at the moment.');
                              }
                            }
                          } catch (err: any) {
                            console.error('Error with AI search:', err);
                            setAiResponse(err?.message || 'Sorry, I encountered an error. Please try again.');
                          } finally {
                            setIsAILoading(false);
                          }
                        })();
                      } catch (err) {
                        setIsAILoading(false);
                        console.error('AI search failed', err);
                        setAiResponse('Sorry, I encountered an error. Please try again.');
                      }
                    } else {
                      // Manual flow completion
                      handleComplete();
                    }
                  }}
                >
                  {isAILoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finding Matches...
                    </>
                  ) : searchMode === 'ai' ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Find with AI
                    </>
                  ) : (
                    <>
                      Find Scholarships
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
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
      
      {/* AI Copilot Floating Button */}
      <AICopilot />

      {/* AI Response with Matches */}
      {aiResponse && (
        <div className="max-w-3xl mx-auto mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">AI Recommendations</h3>
              </div>
              <div className="prose prose-sm max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
              </div>
              
              {simulatedMatches && simulatedMatches.length > 0 && (
                <>
                  <div className="space-y-3 mt-4">
                    {simulatedMatches.map((m: any, idx: number) => (
                      <div key={m.id || idx} className="p-4 border-2 border-primary/20 rounded-lg hover:border-primary/40 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-lg mb-1">{m.name || 'Scholarship'}</p>
                            <p className="text-sm text-gray-600 mb-2">
                              {m.provider && <span className="font-medium">{m.provider}</span>}
                              {m.country && <span> • {m.country}</span>}
                              {m.amount && <span> • {m.currency || 'USD'} {m.amount.toLocaleString()}</span>}
                            </p>
                            {m.fieldOfStudy && Array.isArray(m.fieldOfStudy) && m.fieldOfStudy.length > 0 && (
                              <p className="text-xs text-gray-500">Fields: {m.fieldOfStudy.join(', ')}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {m.deadline && (
                              <>
                                <p className="text-xs text-gray-600">Deadline</p>
                                <p className="font-medium text-sm">
                                  {new Date(m.deadline).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-primary">
                                  {Math.ceil((new Date(m.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {m.id && (
                          <div className="mt-3 pt-3 border-t">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push(`/scholarships/${m.id}`)}
                              className="w-full"
                            >
                              View Details
                              <ArrowRight className="h-3 w-3 ml-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSimulatedMatches(null);
                    setAiResponse('');
                  }}
                >
                  Close
                </Button>
                {simulatedMatches && simulatedMatches.length > 0 && (
                  <Button onClick={() => router.push('/scholarships/match')}>
                    View All Matches
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
