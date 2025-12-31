"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      {/* Hero Section - Main CTA */}
      <section className="relative bg-primary-light py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Change a Life Today</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-gray-dark">
              Sponsor a <span className="text-primary">Top-Performing Scholar</span>
            </h1>
            <p className="text-base md:text-lg mb-2 text-gray-soft max-w-3xl mx-auto">
              Help high-achieving African students who cannot afford tuition access world-class education
            </p>
            <p className="text-sm md:text-base mb-6 text-gray-soft max-w-2xl mx-auto">
              100% of your sponsorship goes directly to funding tuition for talented students who lack financial means
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-primary text-white hover:bg-primary/90 font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => {
                  const tiers = document.querySelector('[data-tiers]');
                  if (tiers) {
                    tiers.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Heart className="mr-2 h-6 w-6" />
                Start Sponsoring Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/scholar-apply">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-7 border-2 border-primary text-primary bg-white hover:bg-primary-light transition-all"
                >
                  <GraduationCap className="mr-2 h-6 w-6" />
                  Apply as a Scholar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Stats with Visual Progress */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-primary/20">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-primary">
                  {stats.sponsoredScholars !== null ? animatedStats.sponsoredScholars : '...'}
                </div>
                <div className="text-sm text-gray-soft mb-3">Scholars Sponsored</div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: stats.sponsoredScholars !== null 
                        ? `${Math.min((animatedStats.sponsoredScholars / Math.max(stats.sponsoredScholars, 1)) * 100, 100)}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-primary">
                  {stats.successRate !== null ? `${animatedStats.successRate}%` : '...'}
                </div>
                <div className="text-sm text-gray-soft mb-3">Success Rate</div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: stats.successRate !== null 
                        ? `${animatedStats.successRate}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-primary">
                  {stats.totalFunding !== null ? formatStatsCurrency(animatedStats.totalFunding) : '...'}
                </div>
                <div className="text-sm text-gray-soft mb-3">Scholarships Secured</div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: stats.totalFunding !== null 
                        ? `${Math.min((animatedStats.totalFunding / Math.max(stats.totalFunding, 1)) * 100, 100)}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
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
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-slate-700 text-white px-4 py-1 rounded-full text-xs font-medium">
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
              <Card className="mt-8 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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

      {/* Visual Journey Section */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5"></div>
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
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-500 to-primary"></div>
              
              <div className="grid md:grid-cols-4 gap-4">
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
                    color: "bg-blue-500",
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

            <div className="grid md:grid-cols-2 gap-2">
              {[
                {
                  step: "1",
                  title: "Create Your Scholarship",
                  description:
                    "Choose an amount to fund a university scholarship. Your donation directly pays for a scholar's university tuition and education expenses.",
                },
                {
                  step: "2",
                  title: "We Match You With a Scholar",
                  description:
                    "Based on your preferences, we connect you with a top-performing student who has demonstrated academic excellence but cannot afford tuition. You'll receive their profile, academic achievements, and university goals.",
                },
                {
                  step: "3",
                  title: "Fund Their University Education",
                  description:
                    "100% of your donation goes directly to funding their university tuition. You'll receive regular updates on their academic progress and achievements.",
                },
                {
                  step: "4",
                  title: "Celebrate Their Success",
                  description:
                    "Watch them thrive at university! You'll receive updates on their achievements, graduation, and the lasting impact your scholarship made.",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 border-2 cursor-pointer h-full ${
                    expandedStep === index
                      ? "border-slate-700 shadow-lg"
                      : "border-gray-200 hover:border-slate-300"
                  }`}
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <CardTitle className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </CardTitle>
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
                      <p className="text-xs text-gray-600 pl-11">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
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

      {/* Visual Progress & Impact Section */}
      <section className="py-12 bg-gradient-to-b from-primary-light/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">Real Impact, Real Progress</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                See Your Impact Grow
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Every sponsorship creates a ripple effect. Watch how your contribution transforms lives and builds futures.
              </p>
            </div>

            {/* Visual Progress Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Progress Card 1: Scholars Helped */}
              <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-16 w-16 text-primary mx-auto mb-2" />
                      <div className="text-4xl font-bold text-primary">
                        {stats.sponsoredScholars !== null ? animatedStats.sponsoredScholars : '...'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Lives Changed</div>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Scholars Sponsored</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress to Goal</span>
                      <span className="font-medium text-primary">
                        {stats.sponsoredScholars !== null 
                          ? `${Math.min(Math.floor((animatedStats.sponsoredScholars / 200) * 100), 100)}%`
                          : '...'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: stats.sponsoredScholars !== null 
                            ? `${Math.min((animatedStats.sponsoredScholars / 200) * 100, 100)}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Each scholar represents a dream realized and a future secured
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Card 2: Funding Impact */}
              <Card className="border-2 border-green-500/20 shadow-lg overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-green-500/20 to-green-500/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <DollarSign className="h-16 w-16 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">
                        {stats.totalFunding !== null ? formatStatsCurrency(animatedStats.totalFunding) : '...'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Scholarships Funded</div>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Financial Impact</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Goal</span>
                      <span className="font-medium text-green-600">
                        {stats.totalFunding !== null 
                          ? `${Math.min(Math.floor((animatedStats.totalFunding / 5000000) * 100), 100)}%`
                          : '...'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: stats.totalFunding !== null 
                            ? `${Math.min((animatedStats.totalFunding / 5000000) * 100, 100)}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      100% goes directly to tuition - no overhead, no intermediaries
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Impact Milestones */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Our Impact Milestones
                </h3>
                <p className="text-gray-600">
                  Together, we're building a brighter future for talented students
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: GraduationCap, label: "Graduates", value: "50+", color: "text-blue-600" },
                  { icon: Award, label: "Countries", value: "15+", color: "text-purple-600" },
                  { icon: TrendingUp, label: "Success Rate", value: stats.successRate !== null ? `${stats.successRate}%` : '...', color: "text-green-600" },
                  { icon: Heart, label: "Active Sponsors", value: "100+", color: "text-red-600" },
                ].map((milestone, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-16 h-16 ${milestone.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                      <milestone.icon className={`h-8 w-8 ${milestone.color}`} />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${milestone.color}`}>
                      {milestone.value}
                    </div>
                    <div className="text-sm text-gray-600">{milestone.label}</div>
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
            <div className="bg-primary-light rounded-2xl p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Success Stories
                </h3>
                <p className="text-gray-600">
                  Real impact from sponsors like you
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                          <GraduationCap className="h-16 w-16 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2 text-lg">Nakato from Uganda</h4>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          "Thanks to my sponsor, I'm now studying Computer Science at a top university. Without this scholarship, I couldn't have afforded tuition."
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Sponsored: 2023 • Currently: Year 2</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-primary">75% Complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gradient-to-br from-green-500/20 to-green-500/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <Award className="h-16 w-16 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2 text-lg">Namukasa from Uganda</h4>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          "My sponsor's support changed everything. I'm maintaining a 3.8 GPA in Medicine and on track to graduate next year."
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Sponsored: 2022 • Currently: Year 3</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-green-600">90% Complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                      </div>
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
                  answer: "After you submit your sponsorship application, you'll receive bank details and a transaction number. Transfer your donation amount to our bank account using the transaction number as reference. Once we receive and verify your payment (usually within 1-2 business days), we'll match you with a scholar and send confirmation."
                },
                {
                  question: "How are scholars matched with sponsors?",
                  answer: "We match sponsors with scholars based on your preferences (field of study, country, etc.) and the scholar's needs. Our team reviews applications to ensure we match top-performing students who genuinely cannot afford tuition. You'll receive the scholar's profile, academic achievements, and story before the match is finalized."
                },
                {
                  question: "Is my donation tax-deductible?",
                  answer: "Yes, for corporate sponsors, donations are typically tax-deductible as CSR contributions. Individual sponsors should consult their tax advisor. We provide official receipts and documentation for all donations. Corporate sponsors receive additional documentation for their records."
                },
                {
                  question: "What percentage of my donation goes to the scholar?",
                  answer: "100% of your donation goes directly to funding the scholar's university tuition. We cover operational costs separately and maintain full transparency. You'll receive receipts and university confirmations showing exactly how your funds were used."
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
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Bridge the Gap?
          </h2>
          <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto opacity-90">
            Help top-performing students overcome financial barriers. Your sponsorship transforms academic excellence into opportunity.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-base"
            onClick={() => {
              const tiers = document.querySelector('[data-tiers]');
              if (tiers) {
                tiers.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Heart className="mr-2 h-5 w-5" />
            Sponsor a Scholar Now
          </Button>
        </div>
      </section>

      {/* Sponsorship Form Modal */}
      {showForm && !submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
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
