"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Building2,
  User,
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Download,
  ChevronDown,
  Plus,
  Minus,
  Shield,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Clock,
  Video,
  FileText,
  Star,
} from "lucide-react";
import { jsPDF } from "jspdf";

export default function SponsorPage() {
  const [sponsorType, setSponsorType] = useState<"individual" | "corporate">("individual");
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    message: "",
    preferredField: "",
    preferredCountry: "",
    anonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('sponsorFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(parsed);
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (showForm) {
      localStorage.setItem('sponsorFormData', JSON.stringify(formData));
    }
  }, [formData, showForm]);
  const [stats, setStats] = useState<{
    sponsoredScholars: number | null;
    totalFunding: number | null;
    successRate: number | null;
  }>({
    sponsoredScholars: null,
    totalFunding: null,
    successRate: null,
  });
  const [animatedStats, setAnimatedStats] = useState({
    sponsoredScholars: 0,
    successRate: 0,
    totalFunding: 0,
  });

  // Fetch dynamic statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
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
      }
    };
    fetchStats();
  }, []);

  // Animate stats on mount
  useEffect(() => {
    if (stats.sponsoredScholars !== null || stats.successRate !== null || stats.totalFunding !== null) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);

        if (stats.sponsoredScholars !== null) {
          setAnimatedStats(prev => ({
            ...prev,
            sponsoredScholars: Math.floor(stats.sponsoredScholars! * easeOut),
          }));
        }
        if (stats.successRate !== null) {
          setAnimatedStats(prev => ({
            ...prev,
            successRate: Math.floor(stats.successRate! * easeOut),
          }));
        }
        if (stats.totalFunding !== null) {
          setAnimatedStats(prev => ({
            ...prev,
            totalFunding: stats.totalFunding! * easeOut,
          }));
        }

        if (currentStep >= steps) {
          clearInterval(timer);
          // Set final values
          setAnimatedStats({
            sponsoredScholars: stats.sponsoredScholars ?? 0,
            successRate: stats.successRate ?? 0,
            totalFunding: stats.totalFunding ?? 0,
          });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [stats.sponsoredScholars, stats.successRate, stats.totalFunding]);

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

  const sponsorshipTiers = [
    {
      name: "Partial Scholarship",
      amount: 500,
      icon: Award,
      benefits: [
        "Fund partial tuition for one semester",
        "Support a scholar's university education",
        "Cover essential academic expenses",
        "Make higher education accessible",
      ],
      impact: "Help cover tuition costs for a semester",
    },
    {
      name: "Full Year Scholarship",
      amount: 2000,
      icon: GraduationCap,
      benefits: [
        "Fund full year of university tuition",
        "Support complete academic journey",
        "Cover tuition and essential fees",
        "Direct impact on scholar's education",
      ],
      impact: "Fund a full year of university education",
      popular: true,
    },
    {
      name: "Complete Degree Scholarship",
      amount: 5000,
      icon: Users,
      benefits: [
        "Fund complete degree program",
        "Support entire university journey",
        "Cover full tuition for degree",
        "Transform a scholar's future",
      ],
      impact: "Fund complete university degree program",
    },
  ];


  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      companyWebsite: "",
      message: "",
      preferredField: "",
      preferredCountry: "",
      anonymous: false,
    });
    setFormStep(1);
    setSelectedTier(null);
    setCustomAmount("");
    setErrorMessage(null);
    localStorage.removeItem('sponsorFormData');
  };

  const handleSelectTier = (tier: any) => {
    setSelectedTier(tier);
    setCustomAmount("");
    setFormStep(1);
    setErrorMessage(null);
    setShowForm(true);
  };

  const handleCustomAmount = () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }
    setSelectedTier(null);
    setFormStep(1);
    setErrorMessage(null);
    setShowForm(true);
  };

  const nextStep = () => {
    if (formStep === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.phone) {
        setErrorMessage('Please fill in all required fields');
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
    }
    setErrorMessage(null);
    setFormStep(formStep + 1);
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const totalSteps = 3;

  const generatePaymentPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Ailes Global', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Payment Instructions', 105, 30, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Sponsorship Payment Details', 20, 60);
    
    // Sponsor Information
    let currentY = 70;
    if (formData.name) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Sponsor:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.name, 50, currentY);
      currentY += 7;
      
      if (sponsorType === 'corporate' && formData.companyName) {
        doc.setFont('helvetica', 'bold');
        doc.text('Company:', 20, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.companyName, 50, currentY);
        currentY += 7;
      }
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 10;
    }
    
    // Transaction Number (if available)
    if (transactionNumber) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setFillColor(255, 243, 205);
      doc.rect(20, currentY, 170, 15, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Transaction Number:', 25, currentY + 8);
      doc.setFont('helvetica', 'normal');
      doc.text(transactionNumber, 85, currentY + 8);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 18, 190, currentY + 18);
      currentY += 25;
    }
    
    // Selected Tier Info (if available)
    const donationAmount = customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0;
    const tierName = customAmount ? "Custom Amount" : selectedTier?.name || "Donation";
    
    if (donationAmount > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Sponsorship Type: ${tierName}`, 20, currentY);
      doc.text(`Amount: $${donationAmount.toLocaleString()}`, 20, currentY + 10);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 17, 190, currentY + 17);
      currentY += 25;
    }
    
    // Bank Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Bank Account Details', 20, currentY);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Bank details table
    const bankDetails = [
      ['Bank Name:', 'Equity Bank Kenya'],
      ['Account Number:', '1001103192251'],
      ['SWIFT Code:', 'EQBLKENA'],
      ['Branch:', 'Kampala Road Branch'],
      ['Currency:', 'USD'],
    ];
    
    let yPos = currentY + 10;
    bankDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPos);
      yPos += 8;
    });
    
    // Payment Reference
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Important: Payment Reference', 20, yPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Please use this transaction number: ${transactionNumber || 'Your email address'}`, 20, yPos + 8);
    doc.text('This helps us match your payment quickly.', 20, yPos + 15);
    
    // Instructions
    yPos += 30;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Instructions', 20, yPos);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const instructions = [
      '1. Transfer the sponsorship amount to the bank account above',
      `2. Use this transaction number as payment reference: ${transactionNumber || 'N/A'}`,
      '3. Keep your payment receipt/confirmation',
      '4. Send proof of payment to sponsors@ailesglobal.org',
      '5. We will confirm your payment within 1-2 business days',
      '6. You will receive a confirmation email once verified',
    ];
    
    yPos += 10;
    instructions.forEach(instruction => {
      doc.text(instruction, 25, yPos);
      yPos += 7;
    });
    
    // Footer
    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('For questions or assistance, contact us:', 20, yPos + 10);
    doc.text('Email: sponsors@ailesglobal.org', 20, yPos + 17);
    doc.text('Phone: +256 700 000 000', 20, yPos + 24);
    doc.text('Website: www.ailesglobal.org', 20, yPos + 31);
    
    // Disclaimer
    doc.setFontSize(8);
    doc.text('This document contains confidential banking information. Please handle securely.', 105, 285, { align: 'center' });
    
    // Save PDF
    const fileName = transactionNumber 
      ? `AILES_Payment_${transactionNumber}.pdf`
      : selectedTier 
      ? `AILES_Payment_Instructions_${selectedTier.name.replace(/\s+/g, '_')}.pdf`
      : 'AILES_Payment_Instructions.pdf';
    doc.save(fileName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Form data:', formData);
    console.log('Sponsor type:', sponsorType);
    console.log('Selected tier:', selectedTier);

    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedTier?.amount;
      
      if (!amount || amount <= 0) {
        throw new Error('Please select a tier or enter a custom amount');
      }
      
      const payload = {
        ...formData,
        sponsorType,
        tierName: customAmount ? `Custom Amount` : selectedTier.name,
        amount: amount,
      };
      
      console.log('Sending payload:', payload);

      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to submit');
      }

      const data = await res.json();
      console.log('Success response:', data);
      
      // Generate transaction number from the sponsor ID
      const txnNumber = `AILES-${data.sponsor.id.substring(0, 8).toUpperCase()}`;
      setTransactionNumber(txnNumber);
      setSubmitted(true);
      setShowForm(false);
      resetForm(); // Clear form data after successful submission
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Failed to submit sponsorship. Please try again. ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Grace's Story */}
      <section className="relative bg-primary-light py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Student Photo */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-2xl border-4 border-white overflow-hidden bg-gray-200">
                {imageLoading['grace'] && (
                  <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-gray-400" />
            </div>
                )}
                {!imageErrors['grace'] && (
                <Image
                  src="/students/grace.jpg"
                  alt="Grace M."
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoading['grace'] ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(prev => ({ ...prev, grace: false }))}
                  onError={() => {
                    setImageErrors(prev => ({ ...prev, grace: true }));
                    setImageLoading(prev => ({ ...prev, grace: false }));
                  }}
                  onLoadingComplete={() => setImageLoading(prev => ({ ...prev, grace: false }))}
                />
                )}
                {imageErrors['grace'] && (
                  <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
              This is Grace.
            </h1>

            {/* Story Paragraph */}
            <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
              She has a 3.9 GPA. She was accepted to study Medicine at Makerere University. Her family earns UGX 20,000/day. Without a sponsor, she cannot enroll.
            </p>

            {/* Urgent Deadline Box */}
            <div className="inline-block bg-red-600 text-white px-4 py-3 sm:px-6 rounded-lg mb-6 shadow-lg max-w-full">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base text-center">Tuition Deadline: January 15, 2025 (12 days away)</span>
              </div>
            </div>

            {/* Impact Statement */}
            <div className="mb-6">
              <p className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Your $2,000 sends Grace to university for one year.
              </p>
              <p className="text-lg md:text-xl text-gray-700">
                She graduates in 2028 and will treat 10,000+ patients over her career.
              </p>
            </div>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl font-bold text-primary mb-6">
              15 students like Grace need sponsors this month.
            </p>

            {/* Benefits Box */}
            <div className="bg-primary text-white rounded-lg p-6 mb-8 max-w-2xl mx-auto shadow-lg">
              <div className="grid sm:grid-cols-2 gap-3 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>95% goes to tuition - 5% covers operations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Get photos, grades, and updates throughout the year</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Tax-deductible donation receipt</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Meet your scholar via video call</span>
                </div>
              </div>
            </div>

            {/* Three CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl"
                onClick={() => {
                  // Scroll to student profiles section
                  const profiles = document.querySelector('[data-student-profiles]');
                  if (profiles) {
                    profiles.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Heart className="mr-2 h-5 w-5" />
                Sponsor Grace - $2,000
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 border-2 border-primary text-primary bg-white hover:bg-primary-light"
                onClick={() => {
                  const profiles = document.querySelector('[data-student-profiles]');
                  if (profiles) {
                    profiles.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                See All Students
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 bg-primary hover:bg-primary/90 text-white font-semibold"
                onClick={() => {
                  const tiers = document.querySelector('[data-tiers]');
                  if (tiers) {
                    tiers.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Sponsor Any Amount
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                  </div>
            </div>
          </div>
        </section>

      {/* Sponsorship Type Toggle */}
      <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setSponsorType("individual")}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    sponsorType === "individual"
                      ? "bg-white shadow-sm text-slate-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Individual
                </button>
                <button
                  onClick={() => setSponsorType("corporate")}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    sponsorType === "corporate"
                    ? "bg-white shadow-sm text-slate-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Building2 className="h-4 w-4 inline mr-2" />
                  Corporate
                </button>
              </div>
            </div>

          {/* Sponsorship Tiers */}
          <div className="max-w-6xl mx-auto" data-tiers>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Create a University Scholarship
              </h2>
              <p className="text-base text-gray-600">
                {sponsorType === "corporate"
                  ? "Fund university scholarships for top-performing African students who cannot afford tuition. Your donation directly pays for their university education. Or enter any amount below."
                  : "Your donation creates a scholarship for high-achieving students who lack financial means. Choose a suggested amount or enter any amount to help bridge the gap between talent and opportunity."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {sponsorshipTiers.map((tier, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    tier.popular ? "border-2 border-slate-700 shadow-lg" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <tier.icon className="h-8 w-8 text-slate-700" />
                    </div>
                    <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-slate-700 mb-2">
                      ${tier.amount.toLocaleString()}
                    </div>
                    <CardDescription className="text-sm">
                      {tier.impact}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Where Your Money Goes Breakdown */}
                    <div className="bg-primary-light rounded-lg p-4 mb-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-primary">Where Your ${tier.amount.toLocaleString()} Goes:</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Student Tuition:</span>
                          <span className="font-semibold text-primary">${(tier.amount * 0.95).toLocaleString()} (95%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Operations:</span>
                          <span className="font-semibold text-primary">${(tier.amount * 0.05).toLocaleString()} (5%)</span>
                        </div>
                        <div className="border-t border-primary/20 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${tier.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          {tier.amount === 500 && "Operations cover: Student verification, university payment processing, progress reports, platform maintenance"}
                          {tier.amount === 2000 && "Operations cover: Student verification, university payment processing, quarterly progress reports, platform maintenance, donor communication"}
                          {tier.amount === 5000 && "Operations cover: Multi-year student tracking, annual reports, graduation coordination, long-term donor support"}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => handleSelectTier(tier)}
                    >
                      Donate ${tier.amount.toLocaleString()}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Text Below Pricing Cards */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="text-xl font-bold text-gray-900">Why 5% operations fee?</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Traditional charities keep 30-50% for overhead. We keep costs minimal so maximum impact reaches students.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Industry Comparison:</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Red Cross:</span>
                    <span className="font-medium">9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UNICEF:</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">World Vision:</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Save the Children:</span>
                    <span className="font-medium">16%</span>
                  </div>
                  <div className="flex justify-between col-span-2 sm:col-span-1">
                    <span className="font-semibold text-primary">Ailes Global:</span>
                    <span className="font-bold text-green-600">5% ✓</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Unlike large organizations, we're lean and efficient. Every dollar counts.
              </p>
            </div>

            {/* Custom Amount Option */}
            <Card className="mt-8 border-2 border-dashed border-slate-300 hover:border-slate-500 transition-colors">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-slate-700" />
                  </div>
                  <CardTitle className="text-xl mb-2">Fund Any Amount</CardTitle>
                  <CardDescription className="mb-6">
                    Create a scholarship with any amount. Your donation directly funds university tuition for top-performing students who cannot afford it.
                  </CardDescription>
                  <div className="max-w-md mx-auto">
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="text-center text-lg"
                          min="1"
                          step="1"
                        />
                      </div>
                      <Button
                        onClick={handleCustomAmount}
                        disabled={!customAmount || parseFloat(customAmount) <= 0}
                        className="px-8"
                      >
                        Create Scholarship
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum: $1. All donations go directly to funding tuition for high-achieving students who cannot afford it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {sponsorType === "corporate" && (
              <Card className="mt-8 bg-primary-light border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Corporate Partnership Benefits
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Tax-deductible CSR contribution
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Logo on our partners page
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Annual impact report
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Direct scholar communication
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Social media recognition
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Custom partnership programs
                        </li>
                      </ul>
                      <Link href="/contact">
                        <Button className="mt-4" variant="default">
                          Discuss Corporate Partnership
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Students Who Need Sponsors Now */}
      <section className="py-16 bg-white" data-student-profiles>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Students Who Need Sponsors Now
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                These students have been admitted to university but cannot afford tuition. Without a sponsor, they lose their spots when registration closes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto">
              {/* Student 1 - Grace */}
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-40 bg-gray-200">
                  {imageLoading['grace-card'] && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {!imageErrors['grace-card'] && (
                    <Image
                      src="/students/grace.jpg"
                      alt="Grace M."
                      fill
                      className={`object-cover transition-opacity duration-300 ${imageLoading['grace-card'] ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImageLoading(prev => ({ ...prev, 'grace-card': false }))}
                      onError={() => {
                        setImageErrors(prev => ({ ...prev, 'grace-card': true }));
                        setImageLoading(prev => ({ ...prev, 'grace-card': false }));
                      }}
                      onLoadingComplete={() => setImageLoading(prev => ({ ...prev, 'grace-card': false }))}
                    />
                  )}
                  {imageErrors['grace-card'] && (
                    <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Grace M., 19</h3>
                      <p className="text-xs text-gray-600">Kampala, Uganda</p>
                    </div>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      12 days left
                    </span>
                  </div>
                  <div className="space-y-1 text-xs mb-3">
                    <p><span className="font-semibold">GPA:</span> 3.9 / 4.0</p>
                    <p><span className="font-semibold">Accepted to:</span> Makerere University</p>
                    <p><span className="font-semibold">Program:</span> Medicine (MBChB)</p>
                    <p><span className="font-semibold">Deadline:</span> January 15, 2025</p>
                  </div>
                  <blockquote className="border-l-3 border-primary pl-3 italic text-gray-700 mb-3 text-xs leading-relaxed">
                    "I want to become a doctor to serve my rural community where the nearest hospital is 50km away. My mother sells vegetables but cannot afford my tuition."
                  </blockquote>
                  <div className="bg-primary-light rounded-lg p-3 mb-3">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-0.5">$2,000</div>
                    <div className="text-xs text-gray-600">Covers full year tuition + textbooks</div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-sm py-2" onClick={() => handleSelectTier({ name: "Full Year Scholarship", amount: 2000 })}>
                    Sponsor Grace - $2,000
                  </Button>
                </CardContent>
              </Card>

              {/* Student 2 - Patrick */}
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-40 bg-gray-200">
                  {imageLoading['patrick'] && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {!imageErrors['patrick'] && (
                    <Image
                      src="/students/Patrick.png"
                      alt="Patrick K."
                      fill
                      className={`object-cover transition-opacity duration-300 ${imageLoading['patrick'] ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImageLoading(prev => ({ ...prev, patrick: false }))}
                      onError={() => {
                        setImageErrors(prev => ({ ...prev, patrick: true }));
                        setImageLoading(prev => ({ ...prev, patrick: false }));
                      }}
                      onLoadingComplete={() => setImageLoading(prev => ({ ...prev, patrick: false }))}
                    />
                  )}
                  {imageErrors['patrick'] && (
                    <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Patrick K., 20</h3>
                      <p className="text-xs text-gray-600">Gulu, Uganda</p>
                    </div>
                    <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      20 days left
                    </span>
                  </div>
                  <div className="space-y-1 text-xs mb-3">
                    <p><span className="font-semibold">GPA:</span> 3.7 / 4.0</p>
                    <p><span className="font-semibold">Accepted to:</span> Makerere University</p>
                    <p><span className="font-semibold">Program:</span> Computer Science</p>
                    <p><span className="font-semibold">Deadline:</span> January 22, 2025</p>
                  </div>
                  <blockquote className="border-l-3 border-primary pl-3 italic text-gray-700 mb-3 text-xs leading-relaxed">
                    "I taught myself coding on a borrowed phone. I built 3 apps that are used by 5,000+ people in my community. With a CS degree, I can create technology solutions for African problems."
                  </blockquote>
                  <div className="bg-primary-light rounded-lg p-3 mb-3">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-0.5">$1,800</div>
                    <div className="text-xs text-gray-600">Covers full year tuition + textbooks</div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-sm py-2" onClick={() => {
                    setCustomAmount("1800");
                    handleCustomAmount();
                  }}>
                    Sponsor Patrick - $1,800
                  </Button>
                </CardContent>
              </Card>

            </div>

            {/* Can't Decide CTA */}
            <div className="text-center mt-12">
              <p className="text-lg text-gray-700 mb-4">
                More students need sponsors. Can't decide? We'll match you with a student based on your preferences.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6"
                onClick={() => {
                  const tiers = document.querySelector('[data-tiers]');
                  if (tiers) {
                    tiers.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Let Us Match You With a Student
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">The Journey of Impact</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                From Your Donation to Their Graduation
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                See how your sponsorship creates a lasting impact that extends far beyond the classroom
              </p>
            </div>

            {/* Visual Timeline */}
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-primary"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    step: "1",
                    title: "Your Donation",
                    description: "You sponsor a scholar",
                    icon: Heart,
                    color: "bg-red-500",
                    stat: "100%",
                    statLabel: "Direct to Tuition"
                  },
                  {
                    step: "2",
                    title: "Scholar Matched",
                    description: "Top-performing student selected",
                    icon: Users,
                    color: "bg-primary",
                    stat: stats.sponsoredScholars !== null ? `${animatedStats.sponsoredScholars}+` : '...',
                    statLabel: "Scholars Helped"
                  },
                  {
                    step: "3",
                    title: "Education Funded",
                    description: "Tuition paid directly to university",
                    icon: GraduationCap,
                    color: "bg-purple-500",
                    stat: formatStatsCurrency(stats.totalFunding),
                    statLabel: "Total Funded"
                  },
                  {
                    step: "4",
                    title: "Future Transformed",
                    description: "Graduate ready to change the world",
                    icon: Award,
                    color: "bg-green-500",
                    stat: stats.successRate !== null ? `${stats.successRate}%` : '...',
                    statLabel: "Success Rate"
                  },
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <Card className="text-center border-2 border-gray-200 hover:border-primary transition-all hover:shadow-lg bg-white">
                      <CardContent className="pt-6 pb-6">
                        <div className={`w-16 h-16 ${item.color} rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-white border-2 border-primary rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-sm text-primary">
                          {item.step}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                        <div className="pt-4 border-t border-gray-100">
                          <div className="text-2xl font-bold text-primary mb-1">{item.stat}</div>
                          <div className="text-xs text-gray-500">{item.statLabel}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Accordion */}
      <section id="how-it-works" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                How Scholarship Funding Works
              </h2>
              <p className="text-sm text-gray-600">
                Your donation directly funds university education - transparent and impactful
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  step: "1",
                  title: "Create Your Scholarship",
                  subtitle: "Choose a student and sponsorship amount",
                  description: [
                    "✓ Browse individual student profiles",
                    "✓ Select based on field of study, country, or deadline",
                    "✓ We verify student admission within 24 hours",
                    "✓ Receive confirmation of student eligibility",
                  ],
                },
                {
                  step: "2",
                  title: "We Match You With a Scholar",
                  subtitle: "Get complete student information",
                  description: [
                    "✓ Detailed profile with photo and story",
                    "✓ Official admission letter from university",
                    "✓ Academic transcripts and certificates",
                    "✓ Family background and financial situation",
                    "✓ Optional: Video introduction from student",
                  ],
                },
                {
                  step: "3",
                  title: "Fund Their University Education",
                  subtitle: "Your donation is processed securely",
                  description: [
                    "✓ Payment via Stripe or PayPal (secure)",
                    "✓ 95% goes directly to university tuition",
                    "✓ 5% covers operations and transparency reporting",
                    "✓ Tuition paid directly to university (not to student)",
                    "✓ Official receipt from university within 48 hours",
                    "✓ Student never handles the money",
                  ],
                },
                {
                  step: "4",
                  title: "Celebrate Their Success",
                  subtitle: "Stay connected throughout their journey",
                  description: [
                    "✓ Personal thank you message from student (week 1)",
                    "✓ Quarterly grade reports via email",
                    "✓ Photos from campus life",
                    "✓ Annual video update",
                    "✓ Graduation ceremony invitation (multi-year sponsors)",
                    "✓ Lifetime connection with your scholar",
                  ],
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 border-2 cursor-pointer h-full ${
                    expandedStep === index
                      ? "border-primary shadow-lg"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold text-gray-900">
                          {item.title}
                        </CardTitle>
                          <p className="text-xs text-gray-600 mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          expandedStep === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                  {expandedStep === index && (
                    <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2 pl-11">
                        {item.description.map((point, idx) => (
                          <p key={idx} className="text-sm text-gray-700">{point}</p>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Guarantee Section */}
      <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                100% Transparency Guarantee
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Column 1: University Receipt */}
              <Card className="text-center border-2 border-gray-200 hover:border-primary transition-all">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">University Receipt</h3>
                  <p className="text-sm text-gray-600">
                    Get official tuition payment receipt from university within 48 hours. Direct proof your money reached the student.
                  </p>
                </CardContent>
              </Card>

              {/* Column 2: Student Profile */}
              <Card className="text-center border-2 border-gray-200 hover:border-primary transition-all">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Student Profile</h3>
                  <p className="text-sm text-gray-600">
                    Receive detailed profile with photo, story, admission documents, and transcripts within 1 week.
                  </p>
                </CardContent>
              </Card>

              {/* Column 3: Quarterly Reports */}
              <Card className="text-center border-2 border-gray-200 hover:border-primary transition-all">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Quarterly Reports</h3>
                  <p className="text-sm text-gray-600">
                    Get grade reports and academic progress updates every 3 months. See exactly how your scholar is performing.
                  </p>
                </CardContent>
              </Card>

              {/* Column 4: Video Updates */}
              <Card className="text-center border-2 border-gray-200 hover:border-primary transition-all">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Video Updates</h3>
                  <p className="text-sm text-gray-600">
                    Annual video update from your scholar. Optional video call to meet them personally.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Transparency Elements */}
            <Card className="bg-primary-light border-2 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-xl mb-4 text-gray-900">What You'll Receive:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Week 1:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Student profile with photo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Admission letter from university</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Personal thank you message</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Week 2:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Official university payment receipt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Breakdown of tuition payment</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Month 3, 6, 9, 12:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Grade reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Academic progress updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Campus photos</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Annual:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Video message from student</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Annual impact report</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee Section */}
      <section className="py-16 bg-yellow-50 border-y-2 border-yellow-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-yellow-300 bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Our Guarantee to You
                  </h2>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 mb-6 border border-yellow-200">
                  <p className="text-gray-800 mb-4">
                    If your sponsored student drops out in Year 1 due to academic failure (not financial hardship), we'll either:
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-gray-900">1.</span>
                      <span className="text-gray-800">Refund 50% of your donation, OR</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-gray-900">2.</span>
                      <span className="text-gray-800">Transfer 100% to another deserving student</span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">Your choice.</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Our rigorous student selection process has a 95% retention rate. We only accept students who:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Have strong academic records (3.5+ GPA)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Demonstrate genuine financial need</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Show commitment through community involvement</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Pass our interview process</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4 font-semibold">
                    We set students up for success, not failure.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Risk-Free Sponsorship:</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Full refund if we cannot match you within 30 days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">50% refund if student fails out (Year 1 only)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">100% transfer option to new student</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">No hidden fees or surprise charges</span>
                    </div>
                    <div className="flex items-start gap-2 col-span-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Cancel future payments anytime (multi-year sponsors)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Corporate Partnership CTA */}
      {sponsorType === "corporate" && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-slate-200">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-slate-700" />
                    </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Become a Corporate Partner
              </h2>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto">
                      Join us in transforming lives through education. Partner with AILES Global to support top-performing African students who cannot afford tuition.
              </p>
            </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">CSR Impact</h3>
                        <p className="text-sm text-gray-600">
                          Tax-deductible contributions that directly fund student tuition
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Recognition</h3>
                        <p className="text-sm text-gray-600">
                          Featured on our partners page and annual impact reports
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Direct Impact</h3>
                        <p className="text-sm text-gray-600">
                          Connect with scholars and see your contribution transform lives
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Custom Programs</h3>
                        <p className="text-sm text-gray-600">
                          Tailored partnership opportunities to match your company's goals
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link href="/contact">
                      <Button size="lg" className="bg-slate-700 hover:bg-slate-800 text-white">
                        <Building2 className="mr-2 h-5 w-5" />
                        Discuss Partnership Opportunities
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">
                      Or continue below to make a corporate sponsorship donation
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}


      {/* Visual Progress & Impact Section - Aspirational */}
      <section className="py-12 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">Building Our Impact</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Join Us in Making a Difference
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                We're just getting started. Your sponsorship helps us build a track record of transforming lives through education.
              </p>
            </div>

            {/* Current Stats - Honest */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Current Scholars */}
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                    <div className="text-4xl font-bold text-primary mb-1">
                      2
                    </div>
                    <div className="text-sm text-gray-600">Scholars Currently Sponsored</div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Grace and Patrick are waiting for sponsors to fund their education
                  </p>
                </CardContent>
              </Card>

              {/* Current Funding */}
              <Card className="border-2 border-green-500/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      $3,800
                    </div>
                    <div className="text-sm text-gray-600">Total Funding Needed</div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    $2,000 for Grace + $1,800 for Patrick = Full year tuition for both
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Our Goals - Aspirational */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Our Goals for 2025
                </h3>
                <p className="text-gray-600">
                  With your support, we aim to achieve these milestones
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: GraduationCap, label: "Students to Sponsor", value: "50+", color: "text-primary", description: "Our target for this year" },
                  { icon: Award, label: "Countries", value: "5+", color: "text-primary", description: "Expanding our reach" },
                  { icon: TrendingUp, label: "Success Rate Goal", value: stats.successRate !== null ? `${stats.successRate}%` : '95%', color: "text-green-600", description: "Maintain high standards" },
                  { icon: Heart, label: "Sponsors Needed", value: "50+", color: "text-primary", description: "Join our community" },
                ].map((milestone, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center`}>
                      <milestone.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${milestone.color}`} />
                    </div>
                    <div className={`text-xl sm:text-2xl font-bold mb-1 ${milestone.color}`}>
                      {milestone.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">{milestone.label}</div>
                    <div className="text-xs text-gray-500">{milestone.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Impact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Where Your Donation Goes
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                100% of your sponsorship directly funds tuition for top-performing students. See the impact of your contribution.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center border-2 border-slate-100">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Direct Tuition Payment</h3>
                    <p className="text-sm text-gray-600">
                    Your donation goes directly to the university to pay for the scholar's tuition fees. No intermediaries, no overhead.
                    </p>
                  </CardContent>
                </Card>

              <Card className="text-center border-2 border-slate-100">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Academic Progress Tracking</h3>
                  <p className="text-sm text-gray-600">
                    Receive regular updates on your scholar's academic achievements, grades, and progress toward graduation.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-slate-100">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Full Transparency</h3>
                  <p className="text-sm text-gray-600">
                    Access detailed reports showing exactly how your funds were used, with receipts and university confirmations.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Impact Stories with Visuals */}
            <div className="bg-primary-light rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Success Stories
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Real impact from sponsors like you
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Testimonial 1 - Namukasa */}
                <Card className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-green-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                        {imageLoading['namukasa'] && (
                          <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        {!imageErrors['namukasa'] && (
                          <Image
                            src="/students/namukasa.jpg"
                            alt="Namukasa"
                            fill
                            className={`object-cover transition-opacity duration-300 ${imageLoading['namukasa'] ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setImageLoading(prev => ({ ...prev, namukasa: false }))}
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, namukasa: true }));
                              setImageLoading(prev => ({ ...prev, namukasa: false }));
                            }}
                            onLoadingComplete={() => setImageLoading(prev => ({ ...prev, namukasa: false }))}
                          />
                        )}
                        {imageErrors['namukasa'] && (
                          <div className="absolute inset-0 bg-green-100 flex items-center justify-center">
                            <User className="h-8 w-8 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">From Street Vendor to Medical Student</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="font-semibold text-gray-900">Dr. Namukasa (in training)</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Medicine, Year 3 • Makerere University
                      </div>
                      <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold mb-3">
                        Sponsored: 2022 | Total Investment: $6,000
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-3 mb-4">
                      <p>
                        "I sold vegetables on the street to help my family earn $2/day. When I got my admission letter to medical school, I cried—not from joy, but from despair. I knew we couldn't afford the $2,000 tuition."
                      </p>
                      <p>
                        "When my sponsor paid my tuition, I cried again—this time from overwhelming gratitude. I literally couldn't believe someone would invest in me, a stranger."
                      </p>
                      <p>
                        "Now I'm in Year 3 of Medicine with a 3.8 GPA. Last week I diagnosed my first patient during clinical rotations. A mother brought her sick child, and I identified the problem and recommended treatment. The child recovered. That moment made everything real."
                      </p>
                      <p className="font-semibold">
                        "My sponsor didn't just pay for school. They saved my life and gave me the power to save thousands of others."
                      </p>
                      <p>
                        "I will spend my career serving rural communities where healthcare doesn't reach. Because someone believed in me."
                      </p>
                    </div>
                    {/* Sponsor Quote Box */}
                    <div className="bg-primary-light border-l-4 border-primary p-4 rounded-r-lg mt-4">
                      <h4 className="font-semibold text-primary mb-2">What Her Sponsor Says:</h4>
                      <p className="text-sm text-gray-800 italic mb-2">
                        "Sponsoring Namukasa is the best $6,000 I've ever spent. Getting her quarterly grade reports, reading her thank you letters, seeing her progress from uncertain student to confident medical professional—that's REAL impact, not just throwing money into a void."
                      </p>
                      <p className="text-sm text-gray-800 italic mb-2">
                        "Last month she emailed me about diagnosing her first patient. I cried reading it. My investment created generational change for her entire family. Her younger siblings now believe education is possible for them too."
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        — Sarah M., Tech Executive, San Francisco, USA<br />
                        Sponsoring Namukasa since 2022
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial 2 - Nakato */}
                <Card className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-primary-light">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                        {imageLoading['nakato'] && (
                          <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        {!imageErrors['nakato'] && (
                          <Image
                            src="/students/nakato.jpg"
                            alt="Nakato"
                            fill
                            className={`object-cover transition-opacity duration-300 ${imageLoading['nakato'] ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setImageLoading(prev => ({ ...prev, nakato: false }))}
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, nakato: true }));
                              setImageLoading(prev => ({ ...prev, nakato: false }));
                            }}
                            onLoadingComplete={() => setImageLoading(prev => ({ ...prev, nakato: false }))}
                          />
                        )}
                        {imageErrors['nakato'] && (
                          <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Single Mother to Business Graduate</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="font-semibold text-gray-900">Nakato</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Business Administration, Year 2 • Makerere University
                      </div>
                      <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold mb-3">
                        Sponsored: 2023 | Total Investment: $2,000
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-3 mb-4">
                      <p>
                        "I had a baby at 19. Everyone said my life was over. My family couldn't support me. I was selling second-hand clothes at the market, earning barely enough to feed my daughter."
                      </p>
                      <p>
                        "I applied to university, thinking it was impossible. When I was accepted to study Business Administration, I knew I couldn't afford it. Then Ailes Global matched me with a sponsor."
                      </p>
                      <p>
                        "For the first time in my life, someone saw potential in me beyond my mistakes. My sponsor paid my $2,000 tuition, and I promised myself I wouldn't waste this chance."
                      </p>
                      <p>
                        "I'm now in Year 2 with a 3.6 GPA while raising my daughter. I started a small business selling handmade crafts that now earns $500/month—more than I ever made before. Next year I'll graduate and scale this business to employ other single mothers."
                      </p>
                      <p className="font-semibold">
                        "My sponsor didn't just give me education. They gave me dignity, hope, and a future for my daughter."
                      </p>
                    </div>
                    {/* Sponsor Quote Box */}
                    <div className="bg-primary-light border-l-4 border-primary p-4 rounded-r-lg mt-4">
                      <h4 className="font-semibold text-primary mb-2">What Her Sponsor Says:</h4>
                      <p className="text-sm text-gray-800 italic mb-2">
                        "I'm a single mother too, so Nakato's story resonated with me. Watching her balance school and motherhood while maintaining good grades is inspiring. She sends me photos of her daughter doing homework alongside her."
                      </p>
                      <p className="text-sm text-gray-800 italic">
                        "She's proving that circumstances don't define destiny. I'm proud to be part of her journey."
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        — Jennifer K., Marketing Manager, Toronto, Canada<br />
                        Sponsoring Nakato since 2023
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            </div>
          </div>
        </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-gray-600">
                Everything you need to know about sponsoring a scholar
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How does the payment process work?",
                  answer: (
                    <div className="space-y-3">
                      <p className="font-semibold mb-2">Step-by-step payment process:</p>
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li>You choose a student and click "Sponsor Now"</li>
                        <li>Secure checkout via Stripe or PayPal</li>
                        <li>You receive confirmation email within 5 minutes</li>
                        <li>We verify student enrollment within 24 hours</li>
                        <li>We pay university directly within 48 hours (NOT to student)</li>
                        <li>You receive official university receipt via email</li>
                        <li>Student sends you personal thank you message</li>
                        <li>Quarterly updates begin</li>
                      </ol>
                      <p className="mt-3 font-semibold">Your money NEVER goes to the student directly. It's paid to the university's official account to ensure it's used for tuition.</p>
                      <p className="text-sm">We use Stripe for secure payment processing—the same system used by Amazon, Google, and millions of businesses worldwide.</p>
                    </div>
                  )
                },
                {
                  question: "What percentage of my donation goes to the scholar?",
                  answer: (
                    <div className="space-y-3">
                      <p className="font-semibold">95% goes directly to student tuition.<br />5% covers operational costs.</p>
                      <p className="text-sm">Here's the exact breakdown of where your $2,000 goes:</p>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold">Student University Tuition:</span>
                          <span className="font-bold text-blue-600">$1,900 (95%)</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <p className="font-semibold mb-2">Operations (5% = $100):</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Student verification and background checks: $25</li>
                            <li>• University payment processing and receipts: $20</li>
                            <li>• Quarterly progress reports and updates: $25</li>
                            <li>• Platform maintenance and donor support: $20</li>
                            <li>• Impact measurement and transparency reporting: $10</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-sm mt-3">Compare this to traditional charities:</p>
                      <div className="bg-white border border-gray-200 p-4 rounded-lg text-sm space-y-1">
                        <div className="flex justify-between"><span>Red Cross:</span><span>9% overhead</span></div>
                        <div className="flex justify-between"><span>UNICEF:</span><span>12% overhead</span></div>
                        <div className="flex justify-between"><span>World Vision:</span><span>15% overhead</span></div>
                        <div className="flex justify-between"><span>Save the Children:</span><span>16% overhead</span></div>
                        <div className="flex justify-between font-bold text-green-600"><span>Ailes Global:</span><span>5% ✓</span></div>
                      </div>
                      <p className="text-sm mt-2">Our 5% is lower than any major charity because we're lean, efficient, and technology-driven.</p>
                    </div>
                  )
                },
                {
                  question: "How are scholars matched with sponsors?",
                  answer: "We match sponsors with scholars based on your preferences (field of study, country, etc.) and the scholar's needs. Our team reviews applications to ensure we match top-performing students who genuinely cannot afford tuition. You'll receive the scholar's profile, academic achievements, and story before the match is finalized."
                },
                {
                  question: "Can I visit or meet my sponsored student?",
                  answer: (
                    <div className="space-y-2">
                      <p className="font-semibold">Yes! We encourage personal connections.</p>
                      <p className="font-semibold mt-3">Options:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li><strong>Video Call:</strong> We can arrange a video call between you and your student (recommended for international sponsors)</li>
                        <li><strong>In-Person Visit:</strong> If you're traveling to Uganda/Kenya/Rwanda, we can coordinate a campus visit</li>
                        <li><strong>Email Communication:</strong> Direct email communication with your student (if both parties consent)</li>
                        <li><strong>WhatsApp Updates:</strong> Some students share photos and updates via WhatsApp</li>
                      </ol>
                      <p className="mt-2">Many sponsors develop long-term mentor relationships with their students that extend beyond just financial support.</p>
                    </div>
                  )
                },
                {
                  question: "What if my student needs more than just tuition?",
                  answer: (
                    <div className="space-y-2">
                      <p>Your sponsorship covers tuition only, which is the biggest barrier for most students.</p>
                      <p className="font-semibold mt-3">However, some students face additional challenges:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Housing costs</li>
                        <li>Textbooks and supplies</li>
                        <li>Transportation</li>
                        <li>Medical emergencies</li>
                      </ul>
                      <p className="font-semibold mt-3">If your student faces unexpected hardship, we'll contact you with options:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>You can choose to provide additional support (optional, never required)</li>
                        <li>We can help student apply for supplementary scholarships</li>
                        <li>Student can work part-time for additional income</li>
                      </ol>
                      <p className="mt-2 font-semibold">We never pressure sponsors for more money. Your commitment is tuition only.</p>
                    </div>
                  )
                },
                {
                  question: "Is my donation tax-deductible?",
                  answer: (
                    <div className="space-y-2">
                      <p>Tax deductibility depends on your country and our organization status.</p>
                      <p className="font-semibold mt-3">Current Status:</p>
                      <p>We're currently registered as a company, so donations may not be tax-deductible in all countries. We're working on NGO registration for 2025.</p>
                      <p className="font-semibold mt-3">Regardless of tax status, your $2,000 investment:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Changes one student's life completely</li>
                        <li>Creates generational impact for their family</li>
                        <li>Contributes to Africa's development</li>
                        <li>Gives you a meaningful connection with a future leader</li>
                      </ul>
                      <p className="mt-2">Many sponsors tell us the personal fulfillment is worth far more than any tax deduction.</p>
                      <p className="mt-2">For specific tax advice, consult your accountant.</p>
                    </div>
                  )
                },
                {
                  question: "Can I choose a specific scholar?",
                  answer: "Yes, you can specify preferences for field of study, country, or other criteria. We'll match you with a scholar who meets your preferences. If you have a specific scholar in mind, contact us directly and we can facilitate that connection."
                },
                {
                  question: "What updates will I receive?",
                  answer: "You'll receive regular updates including academic progress reports, grades, achievements, and photos. Updates are sent quarterly, with additional communications for major milestones like graduation. You can also request updates at any time through your sponsor dashboard."
                },
                {
                  question: "Can I remain anonymous?",
                  answer: "Yes, you can choose to remain anonymous publicly. However, we'll still need your contact information for payment verification and to send you updates. The scholar will know they have a sponsor, but won't see your name unless you choose to share it."
                },
                {
                  question: "What happens if a scholar drops out?",
                  answer: "If a scholar is unable to continue their studies, we'll work with you to either transfer your sponsorship to another qualified student or provide a refund for unused funds. We maintain a waitlist of top-performing students who need support, so we can quickly rematch your sponsorship."
                }
              ].map((faq, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    expandedFAQ === index ? "border-slate-700 shadow-md" : "border-gray-200"
                  }`}
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === index ? (
                        <Minus className="h-5 w-5 text-slate-700 flex-shrink-0" />
                      ) : (
                        <Plus className="h-5 w-5 text-slate-700 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedFAQ === index && (
                    <CardContent className="pt-0">
                      {typeof faq.answer === 'string' ? (
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      ) : (
                        <div className="text-sm text-gray-600">{faq.answer}</div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Urgent */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 px-4">
              15 Students Need Sponsors by January 15
          </h2>
            <div className="space-y-4 mb-8 px-4">
              <p className="text-lg sm:text-xl opacity-90">
                These students have admission letters. They have dreams. They have talent.
              </p>
              <p className="text-lg sm:text-xl opacity-90">
                They just don't have $2,000 for tuition.
              </p>
              <p className="text-lg sm:text-xl font-semibold">
                You can change that today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">12 Days</div>
                <div className="text-xs sm:text-sm opacity-90">Until Deadline</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">$2,000</div>
                <div className="text-xs sm:text-sm opacity-90">Changes a Life</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">10,000+</div>
                <div className="text-xs sm:text-sm opacity-90">Lives Impacted</div>
              </div>
            </div>

            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button 
            size="lg" 
                className="bg-white text-primary hover:bg-gray-100 font-semibold text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 shadow-xl"
                onClick={() => {
                  const profiles = document.querySelector('[data-student-profiles]');
                  if (profiles) {
                    profiles.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Browse Students Who Need You
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6"
            onClick={() => {
              const tiers = document.querySelector('[data-tiers]');
              if (tiers) {
                tiers.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
                Sponsor Any Amount
                <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
            </div>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-75 px-4">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Secure payment
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Official receipts
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                95% to tuition
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Quarterly updates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Old (keeping for reference) */}

      {/* Sponsorship Form Modal */}
      {showForm && !submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-xl">Complete Your Sponsorship</CardTitle>
                  <CardDescription>
                    {customAmount 
                      ? `Custom Amount - $${parseFloat(customAmount || "0").toLocaleString()}`
                      : `${selectedTier?.name} - $${selectedTier?.amount.toLocaleString()}`
                    }
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  ✕
                </Button>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        formStep >= step 
                          ? "bg-primary text-white" 
                          : "bg-gray-200 text-gray-500"
                      }`}>
                        {formStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
                      </div>
                      <span className={`text-xs mt-2 ${formStep >= step ? "text-primary font-medium" : "text-gray-500"}`}>
                        {step === 1 ? "Your Info" : step === 2 ? "Preferences" : "Payment"}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`h-1 flex-1 mx-2 transition-all ${
                        formStep > step ? "bg-primary" : "bg-gray-200"
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal/Company Details */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Your Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {sponsorType === "corporate" ? "Contact Name" : "Full Name"} *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone *</label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    {sponsorType === "corporate" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Company Name</label>
                        <Input
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          placeholder="Tech Corp (optional)"
                        />
                      </div>
                    )}
                  </div>

                  {sponsorType === "corporate" && (
                        <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Company Website</label>
                      <Input
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                  )}
                </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={nextStep}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Scholar Preferences */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Scholar Preferences (Optional)</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Field of Study</label>
                      <Input
                        value={formData.preferredField}
                        onChange={(e) => setFormData({...formData, preferredField: e.target.value})}
                        placeholder="Engineering, Medicine, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Country</label>
                      <Input
                        value={formData.preferredCountry}
                        onChange={(e) => setFormData({...formData, preferredCountry: e.target.value})}
                        placeholder="Kenya, Nigeria, etc."
                      />
                    </div>
                  </div>

                      <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <textarea
                      className="w-full border rounded-lg p-3 min-h-[100px]"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Share your motivation for sponsoring..."
                    />
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!formData.anonymous}
                      onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span>Remain anonymous publicly (we will still have your details for verification)</span>
                  </label>
                </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={prevStep}
                      >
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={nextStep}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Details & Review */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Review & Payment Details</h3>
                      
                      {/* Review Summary */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-primary">
                            ${(customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0).toLocaleString()}
                          </span>
                        </div>
                </div>

                {/* Bank Details */}
                      <div className="bg-primary-light border border-primary/20 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                          <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Payment Details</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Bank Name:</span>
                      <span className="text-gray-900">Equity Bank Kenya</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Account Number:</span>
                      <span className="text-gray-900 font-mono">1001103192251</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">SWIFT Code:</span>
                      <span className="text-gray-900 font-mono">EQBLKENA</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Amount:</span>
                      <span className="text-gray-900 font-bold text-lg text-primary">
                        ${(customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Payment Reference:</strong> Please use your email address as the payment reference. 
                      After making the payment, submit this form and we'll contact you within 24 hours to confirm.
                    </p>
                        </div>
                  </div>
                </div>

                    <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                        onClick={prevStep}
                  >
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                        Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                  >
                        {loading ? "Submitting..." : "Submit Sponsorship"}
                  </Button>
                </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Application Received!</CardTitle>
              <CardDescription>
                Your sponsorship has been registered
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {/* Transaction Number */}
              <div className="bg-slate-700 text-white rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Your Transaction Number</p>
                <p className="text-2xl font-bold tracking-wide">{transactionNumber}</p>
                <p className="text-xs mt-2 opacity-90">Use this as payment reference</p>
              </div>

              <p className="text-sm text-gray-600">
                Your sponsorship details have been saved. Please complete the payment to activate your sponsorship.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-900 font-semibold mb-2">Next Steps:</p>
                <ol className="text-sm text-blue-900 space-y-1 list-decimal list-inside">
                  <li>Download the payment instructions below</li>
                  <li>Transfer ${(customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0).toLocaleString()} to our bank account</li>
                  <li>Use transaction number <strong>{transactionNumber}</strong> as reference</li>
                  <li>Send proof of payment to sponsors@ailesglobal.org</li>
                  <li>We'll confirm and match you with a scholar within 24 hours</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={generatePaymentPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Payment Instructions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setShowForm(false);
                    setTransactionNumber("");
                    resetForm();
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
