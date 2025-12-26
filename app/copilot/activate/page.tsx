"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

import {
  CheckCircle2,
  Zap,
  Download,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  Mail,
  Phone,
  MessageCircle,
  CreditCard,
  Star,
  Rocket,
  TrendingUp,
  Send,
  Bot,
  Play,
} from "lucide-react";

// Interactive AI Demo Widget Component
function AIDemoWidget() {
  const [demoInput, setDemoInput] = useState("");
  const [demoMessages, setDemoMessages] = useState<Array<{ role: "user" | "assistant"; content: string; matches?: any[] }>>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Scholarship Assistant. I can help you find scholarships, write application essays, and answer questions about studying abroad. Try asking me something like 'What scholarships are available for African students?' or 'Help me find scholarships matching my profile'."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [finderData, setFinderData] = useState<any>(null);
  const lastRequestTimeRef = useRef<number>(0);

  useEffect(() => {
    const data = localStorage.getItem("scholarshipFinderData");
    if (data) {
      setFinderData(JSON.parse(data));
    }
  }, []);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim() || isLoading) return;

    // Rate limiting disabled for testing
    // const now = Date.now();
    // const timeSinceLastRequest = now - lastRequestTimeRef.current;
    // const minDelay = 500; // 500ms minimum - very lenient for demo
    // 
    // if (timeSinceLastRequest < minDelay) {
    //   // Just wait silently instead of blocking
    //   await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    // }

    lastRequestTimeRef.current = Date.now();

    const userMessage = demoInput.trim();
    setDemoInput("");
    setDemoMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          context: { finderData }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || data.details || "Failed to get AI response");
      }

      if (data.error) {
        console.error("API returned error:", data);
        throw new Error(data.error);
      }

      setDemoMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
        matches: data.matches 
      }]);
    } catch (error: any) {
      console.error("Error in AI demo:", error);
      const errorMessage = error?.message || "Sorry, I encountered an error. Please try again or use the floating AI Copilot widget on the page.";
      setDemoMessages(prev => [...prev, { 
        role: "assistant", 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What scholarships are available for African students?",
    "Help me write a motivation letter",
    "What are the requirements for studying in the UK?",
    "How do I apply for a scholarship?",
  ];

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="bg-gray-50 rounded-xl p-4 h-64 overflow-y-auto space-y-4">
        {demoMessages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.role === "assistant" && (
                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {/* Display scholarship matches if available */}
                  {msg.matches && msg.matches.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {msg.matches.slice(0, 3).map((match: any, idx: number) => {
                        const sch = match.scholarship;
                        const daysLeft = Math.ceil((new Date(sch.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={idx} className="border border-primary/20 rounded-lg p-2 bg-primary/5">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1">
                                <h5 className="font-semibold text-xs text-gray-900">{sch.name}</h5>
                                <p className="text-xs text-gray-600">{sch.provider}</p>
                              </div>
                              <span className="text-xs font-bold text-primary">{match.matchScore}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              <span>💰 {sch.currency} {sch.amount?.toLocaleString() || 'Varies'}</span>
                              <span>📍 {sch.country}</span>
                              <span>⏰ {daysLeft}d</span>
                            </div>
                            <Link href={`/scholarships/${sch.id}`} className="text-xs text-primary hover:underline">
                              View Details →
                            </Link>
                          </div>
                        );
                      })}
                      {msg.matches.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">+{msg.matches.length - 3} more matches</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Try these questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setDemoInput(q)}
              className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleDemoSubmit} className="flex gap-2">
        <Textarea
          value={demoInput}
          onChange={(e) => setDemoInput(e.target.value)}
          placeholder="Ask me anything about scholarships..."
          className="min-h-[60px] resize-none"
          rows={2}
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!demoInput.trim() || isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          💡 This is a free demo. The full AI Copilot includes document generation, form filling, and more!
        </p>
      </div>
    </div>
  );
}

export default function ActivateCopilotPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    paymentMethod: "mtn",
  });
  const [submitted, setSubmitted] = useState(false);
  const [finderData, setFinderData] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("scholarshipFinderData");
    if (data) {
      setFinderData(JSON.parse(data));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = "Valid email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/copilot/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentName: formData.name,
          paymentEmail: formData.email,
          paymentPhone: formData.phone,
          paymentWhatsapp: formData.whatsapp,
          paymentMethod: formData.paymentMethod,
          finderData: finderData || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create copilot request");
      }

      const copilotRequest = await response.json();
      localStorage.setItem("copilotRequest", JSON.stringify(copilotRequest));
      localStorage.setItem("copilotRequestId", copilotRequest.id);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting copilot request:", error);
      setErrors({ submit: error.message || "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="shadow-2xl border-2 border-green-500/20 bg-white">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="h-14 w-14 text-green-600" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-4 text-primary"
              >
                You're All Set! 🎉
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-700 mb-8"
              >
                Welcome to Scholarship Copilot, <strong className="text-primary">{formData.name}</strong>!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8 text-left"
              >
                <h3 className="font-bold mb-6 text-xl text-gray-900">What happens next:</h3>
                <div className="space-y-6">
                  {[
                    { step: 1, title: "Processing Your Request", time: "2 hours", desc: "We'll review your information and get started" },
                    { step: 2, title: "AI Generates Your Applications", time: "24 hours", desc: "Copilot will create 25+ custom motivation letters and pre-filled forms" },
                    { step: 3, title: "Download Your Package", time: "", desc: `Get ZIP file with all applications sent to ${formData.email}` },
                    { step: 4, title: "Join WhatsApp Group", time: "", desc: `Get deadline reminders and support at ${formData.whatsapp}` },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          {item.time && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{item.time}</span>}
                        </div>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 shadow-lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
              Activate AI Copilot
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Let AI handle the hard work while you focus on winning scholarships
            </p>
          </motion.div>

          {/* Interactive AI Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
                <Card className="shadow-2xl border-2 border-primary/30 bg-white">
              <CardHeader className="bg-primary/10 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Bot className="h-6 w-6 text-primary" />
                      Try AI Copilot Free - No Payment Required
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Test our AI assistant right now! Ask any scholarship question and see how it works.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                    <Play className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">Live Demo</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <AIDemoWidget />
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Benefits */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Summary */}
              {finderData && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-2 border-primary/20 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Your Scholarship Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          { label: "From", value: finderData.nationality },
                          { label: "Destination", value: finderData.destination },
                          { label: "Field of Study", value: finderData.fieldOfStudy },
                          { label: "Degree Level", value: finderData.degreeLevel },
                          { label: "Funding Type", value: finderData.fundingType, span: 2 },
                        ].map((item, idx) => (
                          <div key={idx} className={item.span === 2 ? "md:col-span-2" : ""}>
                            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-900">{item.value || "Not specified"}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* What You Get */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl">What You'll Get</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: FileText, title: "25+ Custom Letters", desc: "AI-powered motivation letters", bgClass: "bg-blue-50", borderClass: "border-blue-200", iconBgClass: "bg-blue-100", iconClass: "text-blue-600" },
                        { icon: CheckCircle2, title: "Pre-Filled Forms", desc: "Ready-to-submit applications", bgClass: "bg-primary/10", borderClass: "border-primary/20", iconBgClass: "bg-primary/20", iconClass: "text-primary" },
                        { icon: Download, title: "Complete Package", desc: "Organized ZIP file", bgClass: "bg-green-50", borderClass: "border-green-200", iconBgClass: "bg-green-100", iconClass: "text-green-600" },
                        { icon: Clock, title: "Deadline Tracker", desc: "Never miss a deadline", bgClass: "bg-orange-50", borderClass: "border-orange-200", iconBgClass: "bg-orange-100", iconClass: "text-orange-600" },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          className={`flex items-start gap-4 p-4 rounded-xl ${item.bgClass} border ${item.borderClass} hover:shadow-md transition-shadow`}
                        >
                          <div className={`p-3 rounded-lg ${item.iconBgClass}`}>
                            <item.icon className={`h-6 w-6 ${item.iconClass}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="shadow-lg bg-primary/5 border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Star className="h-6 w-6 text-primary" />
                      Why Choose Copilot?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: TrendingUp, text: "Save 40+ hours of work" },
                        { icon: Sparkles, text: "AI-powered writing" },
                        { icon: Shield, text: "Expert-reviewed templates" },
                        { icon: Award, text: "Exclusive scholarships from our sponsors" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-6 h-fit"
            >
              <Card className="shadow-2xl border-2 border-primary/20 bg-white">
                <CardHeader className="bg-primary/10 rounded-t-xl">
                  <CardTitle className="text-2xl text-center">Get Started</CardTitle>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Affordable one-time investment
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                      <p className="text-xs text-gray-500 mt-1">Applications will be sent here</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+256 786 367460"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12"
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        WhatsApp Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+256 786 367460"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="h-12"
                        aria-invalid={!!errors.whatsapp}
                      />
                      {errors.whatsapp && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "mtn", label: "MTN", color: "yellow" },
                          { id: "airtel", label: "Airtel", color: "red" },
                          { id: "bank", label: "Bank", color: "blue" },
                        ].map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                            className={`p-4 border-2 rounded-xl text-center transition-all font-semibold ${
                              formData.paymentMethod === method.id
                                ? `border-primary bg-primary/10 text-primary shadow-md`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    {formData.name && formData.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm overflow-hidden"
                      >
                        <p className="font-semibold mb-2 text-blue-900">Payment Instructions:</p>
                        <p className="text-xs text-blue-700 mb-3">Small investment to unlock your scholarship success</p>
                        {formData.paymentMethod === "mtn" && (
                          <div>
                            <p className="text-gray-700 mb-1">Send payment to:</p>
                            <p className="text-lg font-bold text-primary">+256 786 367460</p>
                            <p className="text-xs text-gray-600">Name: Ailes Global</p>
                          </div>
                        )}
                        {formData.paymentMethod === "airtel" && (
                          <div>
                            <p className="text-gray-700 mb-1">Send payment to:</p>
                            <p className="text-lg font-bold text-primary">+256 750 123 456</p>
                            <p className="text-xs text-gray-600">Name: Ailes Global</p>
                          </div>
                        )}
                        {formData.paymentMethod === "bank" && (
                          <div className="space-y-1">
                            <p className="text-gray-700"><strong>Bank:</strong> Equity Bank</p>
                            <p className="text-gray-700"><strong>Account:</strong> 1001234567890</p>
                            <p className="text-gray-700"><strong>Name:</strong> Ailes Global</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Get Started
                        </>
                      )}
                    </Button>

                    {errors.submit && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 text-center">{errors.submit}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>100% Money-back guarantee</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
