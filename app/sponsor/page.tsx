"use client";

import { useState } from "react";
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
  TrendingUp,
  Users,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";

export default function SponsorPage() {
  const [sponsorType, setSponsorType] = useState<"individual" | "corporate">("individual");
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
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

  const sponsorshipTiers = [
    {
      name: "Application Support",
      amount: 500,
      icon: Award,
      benefits: [
        "Cover application fees for 5 universities",
        "English test preparation materials",
        "Document translation services",
        "Email support throughout process",
      ],
      impact: "Help a student apply to their dream schools",
    },
    {
      name: "Full Journey",
      amount: 2000,
      icon: GraduationCap,
      benefits: [
        "Everything in Application Support",
        "Premium consultation package",
        "SOP/Essay editing (unlimited rounds)",
        "Visa application assistance",
        "Pre-departure orientation",
      ],
      impact: "Fully support a student from search to departure",
      popular: true,
    },
    {
      name: "Multi-Scholar",
      amount: 5000,
      icon: Users,
      benefits: [
        "Sponsor 3 complete student journeys",
        "Recognition on our website",
        "Annual impact report",
        "Direct communication with scholars",
        "Corporate social responsibility certificate",
      ],
      impact: "Change multiple lives, build your legacy",
    },
  ];

  const successStories = [
    {
      name: "Grace Okonkwo",
      field: "Computer Science",
      sponsor: "Tech Corp Ltd",
      university: "MIT, USA",
      scholarship: "$200,000 Full Scholarship",
      image: "👩‍💻",
    },
    {
      name: "Amina Hassan",
      field: "Engineering",
      sponsor: "John Smith",
      anonymous: true,
      university: "Cambridge, UK",
      scholarship: "£120,000 Gates Cambridge",
      image: "👩‍🔬",
    },
    {
      name: "Fatima Diallo",
      field: "Medicine",
      sponsor: "Global Health Foundation",
      university: "Johns Hopkins, USA",
      scholarship: "$180,000 Full Funding",
      image: "👩‍⚕️",
    },
  ];

  const displaySponsorName = (sponsor: string | undefined, anonymous?: boolean) => {
    if (anonymous) return "Anonymous";
    return sponsor || "Anonymous";
  };

  const corporatePartners = [
    { name: "Tech Corp", scholars: 15 },
    { name: "Global Bank", scholars: 12 },
    { name: "Energy Solutions", scholars: 8 },
    { name: "Pharma International", scholars: 6 },
  ];

  const handleSelectTier = (tier: any) => {
    setSelectedTier(tier);
    setShowForm(true);
  };

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
    if (selectedTier) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Sponsorship Tier: ${selectedTier.name}`, 20, currentY);
      doc.text(`Amount: $${selectedTier.amount.toLocaleString()}`, 20, currentY + 10);
      
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
      const payload = {
        ...formData,
        sponsorType,
        tierName: selectedTier.name,
        amount: selectedTier.amount,
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
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit sponsorship. Please try again. Error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Change a Life Today</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Sponsor a <span className="text-primary">Female Scholar</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Help a talented African woman access world-class education. 100% of your
              sponsorship goes directly to supporting her scholarship journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base">
                <Heart className="mr-2 h-5 w-5" />
                Sponsor Now
              </Button>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-base">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">127</p>
              <p className="text-sm md:text-base opacity-90">Female Scholars Sponsored</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">$2.5M+</p>
              <p className="text-sm md:text-base opacity-90">In Scholarships Secured</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">45</p>
              <p className="text-sm md:text-base opacity-90">Corporate Partners</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">92%</p>
              <p className="text-sm md:text-base opacity-90">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Type Toggle */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto mb-12">
            <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
              <button
                onClick={() => setSponsorType("individual")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                  sponsorType === "individual"
                    ? "bg-white shadow-sm text-primary"
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
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building2 className="h-4 w-4 inline mr-2" />
                Corporate
              </button>
            </div>
          </div>

          {/* Sponsorship Tiers */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Choose Your Impact Level
              </h2>
              <p className="text-base text-gray-600">
                {sponsorType === "corporate"
                  ? "Corporate sponsorships include tax benefits and public recognition"
                  : "Every contribution makes a real difference in a young woman's life"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {sponsorshipTiers.map((tier, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    tier.popular ? "border-2 border-primary shadow-lg" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <tier.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary mb-2">
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
                      Select ${tier.amount.toLocaleString()}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

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

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                How Sponsorship Works
              </h2>
              <p className="text-base text-gray-600">
                Transparent, direct, and impactful - see exactly where your contribution goes
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Choose Your Sponsorship",
                  description:
                    "Select a sponsorship tier that fits your budget and impact goals. One-time or recurring options available.",
                },
                {
                  step: "2",
                  title: "We Match You With a Scholar",
                  description:
                    "Based on your preferences, we connect you with a talented female student who needs support. You'll receive her profile and story.",
                },
                {
                  step: "3",
                  title: "Direct Support & Updates",
                  description:
                    "100% of your sponsorship goes to her scholarship journey. You'll receive regular updates on her progress and success.",
                },
                {
                  step: "4",
                  title: "Celebrate Success Together",
                  description:
                    "When she secures her scholarship and admission, you'll be the first to know. Many sponsors form lasting mentorship relationships.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Sponsored Scholar Success Stories
            </h2>
            <p className="text-base text-gray-600">
              Real students, real sponsors, real impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{story.image}</div>
                    <CardTitle className="text-lg mb-1">{story.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {story.field}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sponsored by:</span>
                    <span className="font-medium">{displaySponsorName(story.sponsor, (story as any).anonymous)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">University:</span>
                    <span className="font-medium">{story.university}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-green-600">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {story.scholarship}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Partners */}
      {sponsorType === "corporate" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Our Corporate Partners
              </h2>
              <p className="text-base text-gray-600">
                Leading companies investing in Africa's future
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {corporatePartners.map((partner, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="font-semibold mb-1">{partner.name}</h3>
                    <p className="text-sm text-gray-600">
                      {partner.scholars} scholars sponsored
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Change a Life?
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Your sponsorship doesn't just support education - it creates role models,
            builds communities, and transforms futures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base">
              <Heart className="mr-2 h-5 w-5" />
              Sponsor a Scholar Now
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-base border-white text-white hover:bg-white/20"
              >
                Ask Questions First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsorship Form Modal */}
      {showForm && !submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Complete Your Sponsorship</CardTitle>
                  <CardDescription>
                    {selectedTier?.name} - ${selectedTier?.amount.toLocaleString()}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal/Company Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Your Information</h3>
                  
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

                  <div className="grid md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Website</label>
                      <Input
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                  )}
                </div>

                {/* Scholar Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Scholar Preferences (Optional)</h3>
                  
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <textarea
                      className="w-full border rounded-lg p-3 min-h-[100px]"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Share your motivation for sponsoring..."
                    />
                  </div>
                </div>

                {/* Anonymity Option */}
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

                {/* Bank Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-blue-600" />
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
                        ${selectedTier?.amount.toLocaleString()}
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

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Proceed with Sponsorship"}
                  </Button>
                </div>
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
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg p-4">
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
                  <li>Transfer ${selectedTier?.amount.toLocaleString()} to our bank account</li>
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
