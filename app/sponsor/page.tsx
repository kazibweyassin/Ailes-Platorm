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
  Share2,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { jsPDF } from "jspdf";

export default function SponsorPage() {
  const [sponsorType, setSponsorType] = useState<"individual" | "corporate">("individual");
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
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
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sponsorshipTiers = [
    {
      name: "Partial Scholarship",
      amount: 500,
      icon: Award,
      description: "Help with tuition costs for one semester",
      impact: "Cover essential semester expenses",
    },
    {
      name: "Full Year Scholarship",
      amount: 2000,
      icon: GraduationCap,
      description: "Fund a complete year of university education",
      impact: "Fund complete academic year",
      popular: true,
    },
    {
      name: "Complete Degree Scholarship",
      amount: 5000,
      icon: Users,
      description: "Fund an entire university degree program",
      impact: "Transform a scholar's future",
    },
  ];

  const faqs = [
    {
      question: "What is the Ailes Sponsor Program and how can I apply?",
      answer: "The Ailes Sponsor Program enables individuals and corporations to directly fund university scholarships for high-achieving African students who lack financial resources. Simply choose your sponsorship tier, complete the form, and make your donation.",
    },
    {
      question: "Does Ailes support master's degrees and PhD/doctoral students?",
      answer: "Yes, we support undergraduate, master's, and PhD students. We work with partner institutions across Africa to identify and support talented students at all levels.",
    },
    {
      question: "Where are Ailes programs and partner institutions located?",
      answer: "Our partner institutions are spread across Africa, including Kenya, Uganda, Ghana, South Africa, Nigeria, and more. We have relationships with over 50 universities across the continent.",
    },
    {
      question: "Does Ailes offer financial support for students outside of the program?",
      answer: "Our primary focus is on our scholarship recipients. However, we work with institutions to identify additional funding opportunities for deserving students.",
    },
    {
      question: "What does the scholarship cover?",
      answer: "Scholarships typically cover tuition fees. Some may include allowances for books, accommodation, and living expenses depending on the program and funding level.",
    },
    {
      question: "Does Ailes provide scholarships from non-partner universities?",
      answer: "We primarily work with partner institutions, but we're always looking to expand. Contact us if you have a recommendation for a university we should partner with.",
    },
    {
      question: "How can organizations partner with Ailes Scholars Program?",
      answer: "Organizations can partner with us through our corporate sponsorship program, mentorship initiatives, or internship opportunities. Contact our partnerships team for more information.",
    },
    {
      question: "What support is available for applicants who cannot afford the application fees?",
      answer: "Application fees are waived for financial hardship cases. Contact us directly if cost is a barrier to your application.",
    },
  ];

  const handleSelectTier = (tier: any) => {
    setSelectedTier(tier);
    setCustomAmount("");
    setFormStep(1);
    setErrorMessage(null);
    setShowForm(true);
  };

  const handleCustomAmount = () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }
    setSelectedTier(null);
    setFormStep(1);
    setErrorMessage(null);
    setShowForm(true);
  };

  const nextStep = () => {
    if (formStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setErrorMessage("Please fill in all required fields");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("Please enter a valid email address");
        return;
      }
    }
    setErrorMessage(null);
    setFormStep(formStep + 1);
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedTier?.amount;

      if (!amount || amount <= 0) {
        throw new Error("Please select a tier or enter a custom amount");
      }

      const payload = {
        ...formData,
        sponsorType,
        tierName: customAmount ? "Custom Amount" : selectedTier.name,
        amount: amount,
      };

      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit");
      }

      const data = await res.json();
      const txnNumber = `AILES-${data.sponsor.id.substring(0, 8).toUpperCase()}`;
      setTransactionNumber(txnNumber);
      setSubmitted(true);
      setShowForm(false);
    } catch (err) {
      setErrorMessage("Failed to submit sponsorship. Please try again. " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Ailes Global", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Payment Instructions", 105, 30, { align: "center" });

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Sponsorship Payment Details", 20, 60);

    let currentY = 70;
    if (formData.name) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Sponsor:", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(formData.name, 50, currentY);
      currentY += 7;

      if (sponsorType === "corporate" && formData.companyName) {
        doc.setFont("helvetica", "bold");
        doc.text("Company:", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(formData.companyName, 50, currentY);
        currentY += 7;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 10;
    }

    if (transactionNumber) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setFillColor(255, 243, 205);
      doc.rect(20, currentY, 170, 15, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Transaction Number:", 25, currentY + 8);
      doc.setFont("helvetica", "normal");
      doc.text(transactionNumber, 85, currentY + 8);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 18, 190, currentY + 18);
      currentY += 25;
    }

    const donationAmount = customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0;
    const tierName = customAmount ? "Custom Amount" : selectedTier?.name || "Donation";

    if (donationAmount > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Sponsorship Type: ${tierName}`, 20, currentY);
      doc.text(`Amount: $${donationAmount.toLocaleString()}`, 20, currentY + 10);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 17, 190, currentY + 17);
      currentY += 25;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bank Account Details", 20, currentY);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const bankDetails = [
      ["Bank Name:", "Equity Bank Kenya"],
      ["Account Number:", "1001103192251"],
      ["SWIFT Code:", "EQBLKENA"],
      ["Branch:", "Kampala Road Branch"],
      ["Currency:", "USD"],
    ];

    let yPos = currentY + 10;
    bankDetails.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 25, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, yPos);
      yPos += 8;
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Important: Payment Reference", 20, yPos);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Please use this transaction number: ${transactionNumber || "Your email address"}`, 20, yPos + 8);
    doc.text("This helps us match your payment quickly.", 20, yPos + 15);

    yPos += 30;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Instructions", 20, yPos);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const instructions = [
      "1. Transfer the sponsorship amount to the bank account above",
      `2. Use this transaction number as payment reference: ${transactionNumber || "N/A"}`,
      "3. Keep your payment receipt/confirmation",
      "4. Send proof of payment to sponsors@ailesglobal.org",
      "5. We will confirm your payment within 1-2 business days",
      "6. You will receive a confirmation email once verified",
    ];

    yPos += 10;
    instructions.forEach((instruction) => {
      doc.text(instruction, 25, yPos);
      yPos += 7;
    });

    const fileName = transactionNumber
      ? `AILES_Payment_${transactionNumber}.pdf`
      : selectedTier
      ? `AILES_Payment_Instructions_${selectedTier.name.replace(/\s+/g, "_")}.pdf`
      : "AILES_Payment_Instructions.pdf";
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-orange-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Create Transformative Impact
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Sponsor the Next Generation of African Leaders
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Enable talented, underserved young Africans to access world-class higher education and become transformative leaders in their communities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base"
                  onClick={() => {
                    const tiers = document.querySelector("[data-tiers]");
                    if (tiers) tiers.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Become a Sponsor
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-gray-900 border-gray-300 hover:bg-gray-50 font-bold text-base"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">95% to Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Tax Deductible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Direct Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Regular Updates</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 md:h-full min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1620969910995-4bbe4eaa32c1?q=80&w=996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="African female student with books"
                fill
                className="object-cover rounded-3xl"
                priority
              />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500 rounded-full opacity-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative h-96 rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?w=600&h=600&fit=crop"
                  alt="African scholars and community"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block text-orange-600 font-bold text-sm mb-4 border-b-4 border-orange-400 pb-2">
                About the Program
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About the Ailes Scholars Program
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Ailes Scholars Program partners with leading African universities to identify and support the continent's brightest young minds. We remove financial barriers to enable talented students to pursue higher education and develop into transformative leaders.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What role will you play towards a better continent?
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We envision a transformative network of young people and institutions driving inclusive and equitable socio-economic change in Africa. By sponsoring a scholar, you become part of this global movement of leaders committed to building a better future.
              </p>

              <ul className="space-y-3">
                {["Education institutions", "NGOs & civil society", "Scholars & Alumni communities"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-block text-orange-600 font-bold text-sm mb-4 border-b-4 border-orange-400 pb-2">
                Our Approach
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How We Create Impact
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Ailes Scholars Program forges powerful partnerships with higher education institutions to deliver robust support to individual scholars, particularly during their academic journeys and transitions into work.
              </p>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-orange-600">💧</span> The Ripple Effect of Your Support
                </h4>
                <p className="text-gray-700">
                  When you sponsor one student, you create a ripple effect that extends far beyond the classroom. Each scholar goes on to uplift their family, mentor others in their community, and create opportunities for future generations. One scholarship today can impact hundreds of lives tomorrow.
                </p>
              </div>
              
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
                Our Programs <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1610210144022-8e9303fece35?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="African classroom mentorship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-orange-600 font-bold text-sm mb-4 border-b-4 border-orange-400 pb-2">
              Target Impact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Creating Real Change Across Africa
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Target className="h-12 w-12 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Target</h3>
                <p className="text-gray-600">
                  The Ailes Scholars Program has committed over 57,000 scholarships for young African leaders. By 2030, we aim to double our impact by enabling 100,000 young people to access higher education.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <TrendingUp className="h-12 w-12 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  We envision a transformative network of young people and institutions driving inclusive and equitable socio-economic change in Africa through quality education and leadership development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Program Goals */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sponsor Program Goals by 2030
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              With your support, here's the impact we aim to achieve together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="text-5xl font-bold text-orange-600 mb-2">10,000+</div>
                <CardTitle className="text-gray-600 font-normal">
                  Students directly funded through sponsor contributions
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="text-5xl font-bold text-cyan-600 mb-2">$5M</div>
                <CardTitle className="text-gray-600 font-normal">
                  Total scholarships disbursed through the fund
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="text-5xl font-bold text-orange-600 mb-2">50+</div>
                <CardTitle className="text-gray-600 font-normal">
                  Partner universities across Africa
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="text-5xl font-bold text-slate-700 mb-2">70%</div>
                <CardTitle className="text-gray-600 font-normal">
                  Priority for young women and underrepresented groups
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg bg-yellow-50">
              <CardHeader className="pb-4">
                <div className="text-5xl font-bold text-yellow-600 mb-2">100%</div>
                <CardTitle className="text-gray-600 font-normal">
                  Transparency - every dollar tracked and reported
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="text-5xl font-bold text-orange-600 mb-2">24/7</div>
                <CardTitle className="text-gray-600 font-normal">
                  Student support and mentorship access
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Fund Contribution Section */}
      <section className="py-16 md:py-24 bg-white" data-tiers>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-orange-600 font-bold text-sm mb-4 border-b-4 border-orange-400 pb-2">
              Make a Difference
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Contribute to the Scholars Fund
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every contribution matters. Whether you can give $5 or $5,000, your generosity directly funds scholarships and transforms lives. Join thousands of supporters building a better future for African youth.
            </p>
          </div>

          {/* Type Toggle */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex gap-2 p-2 bg-gray-100 rounded-lg">
              <button
                onClick={() => setSponsorType("individual")}
                className={`py-3 px-6 rounded-md font-medium transition-all ${
                  sponsorType === "individual"
                    ? "bg-white shadow-md text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Individual
              </button>
              <button
                onClick={() => setSponsorType("corporate")}
                className={`py-3 px-6 rounded-md font-medium transition-all ${
                  sponsorType === "corporate"
                    ? "bg-white shadow-md text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building2 className="h-4 w-4 inline mr-2" />
                Corporate
              </button>
            </div>
          </div>

          {/* Quick Contribution Options */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-center text-gray-700 font-semibold mb-6">Popular contribution amounts:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { amount: 5, label: "Small Contribution" },
                { amount: 10, label: "Student Lunch" },
                { amount: 50, label: "Monthly Book Stipend" },
                { amount: 100, label: "Week of Tuition" },
                { amount: 500, label: "Semester Support" },
              ].map((option) => (
                <button
                  key={option.amount}
                  onClick={() => {
                    setCustomAmount(option.amount.toString());
                    setSelectedTier(null);
                    setFormStep(1);
                    setErrorMessage(null);
                    setShowForm(true);
                  }}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group cursor-pointer"
                >
                  <div className="text-2xl font-bold text-orange-600 group-hover:text-orange-700">
                    ${option.amount}
                  </div>
                  <div className="text-xs text-gray-600 group-hover:text-gray-900 mt-1">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount Section */}
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="pt-8">
                <p className="text-center text-gray-700 font-semibold mb-4">Or contribute any amount you choose:</p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-8"
                      min="1"
                      step="0.01"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                    onClick={handleCustomAmount}
                  >
                    Contribute
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Examples */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">$5 - $50</h4>
                    <p className="text-sm text-gray-700">
                      Provides learning materials, meal support, or internet access for a student
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">$100 - $500</h4>
                    <p className="text-sm text-gray-700">
                      Covers partial to full semester tuition and academic fees
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">$1,000+</h4>
                    <p className="text-sm text-gray-700">
                      Fully funds a year of university education or multiple students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why Contribute Box */}
          <Card className="mt-16 border-0 shadow-lg">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Join Our Fund?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Direct Impact</h4>
                    <p className="text-gray-600 text-sm">95% of your contribution goes directly to student scholarships</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tax Deductible</h4>
                    <p className="text-gray-600 text-sm">Receive tax receipt for your contribution</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Regular Updates</h4>
                    <p className="text-gray-600 text-sm">Receive impact reports and student stories throughout the year</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Flexible Giving</h4>
                    <p className="text-gray-600 text-sm">Contribute any amount, anytime. Even small gifts make a big difference</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Learn More About the Ailes Scholars Program
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => window.open('https://youtube.com/@ailesglobal', '_blank')}
            >
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
                alt="African youth leadership"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <PlayCircle className="h-20 w-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Ailes Scholars Program is more than a scholarship program. It is a community. Watch this video to find out what young people are saying about being part of it.
              </p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => window.open('https://youtube.com/@ailesglobal', '_blank')}
              >
                <Video className="mr-2 h-5 w-5" />
                Find us on YouTube
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stories of Impact */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Stories of Impact</h2>
            <Button 
              variant="link" 
              className="text-orange-600 hover:text-orange-700"
              onClick={() => window.location.href = '/success-stories'}
            >
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Nakamya Grace", story: "Medical Student at KYU - Breaking Barriers in Healthcare", img: "https://images.unsplash.com/photo-1719606545091-13251ce1fa2d?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Ssemanda Joseph", story: "Information Technology at ISBAT - Building Uganda's Digital Future", img: "https://images.unsplash.com/photo-1763673404801-549d63cfc5f5?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Namukwaya Susan", story: "Computer Science Graduate - Tech Leader in Kampala", img: "https://images.unsplash.com/photo-1645262856440-0474975043ad?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Kyagaba Emmanuel", story: "Business Administration - Entrepreneur & Job Creator", img: "https://images.unsplash.com/photo-1631131426255-90290157af71?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            ].map((scholar, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                  <Image
                    src={scholar.img}
                    alt={scholar.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-6">
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    Scholar Story
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2">{scholar.name}</h3>
                  <p className="text-sm text-gray-600">{scholar.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            FAQs
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedFAQ === idx ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                </CardHeader>
                {expandedFAQ === idx && (
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <CardTitle>Complete Your Sponsorship</CardTitle>
              <CardDescription>
                Step {formStep} of 3: {formStep === 1 ? "Your Information" : formStep === 2 ? "Sponsorship Details" : "Review & Confirm"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Phone *
                        </label>
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {sponsorType === "corporate" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Company Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Your company"
                            value={formData.companyName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                companyName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Company Website
                          </label>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            value={formData.companyWebsite}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                companyWebsite: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Message
                      </label>
                      <textarea
                        placeholder="Tell us why you want to sponsor a scholar..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={4}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Preferred Field
                        </label>
                        <select
                          value={formData.preferredField}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredField: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select field</option>
                          <option value="medicine">Medicine</option>
                          <option value="engineering">Engineering</option>
                          <option value="business">Business</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Preferred Country
                        </label>
                        <select
                          value={formData.preferredCountry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredCountry: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select country</option>
                          <option value="kenya">Kenya</option>
                          <option value="uganda">Uganda</option>
                          <option value="ghana">Ghana</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Sponsorship Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sponsor Name:</span>
                          <span className="font-medium text-gray-900">
                            {formData.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-gray-900">
                            ${(customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-900">
                            {customAmount ? "Custom Amount" : selectedTier?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <p className="text-sm text-blue-900">
                        95% of your donation goes directly to the student. 5% covers operations and support.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  {formStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={prevStep}
                    >
                      <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                      Back
                    </Button>
                  )}
                  {formStep < 3 ? (
                    <Button
                      type="button"
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={nextStep}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Complete Sponsorship"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Sponsorship Registered!</CardTitle>
              <CardDescription>Thank you for your generosity</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-slate-700 text-white rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Your Transaction Number</p>
                <p className="text-2xl font-bold tracking-wide">{transactionNumber}</p>
              </div>

              <p className="text-sm text-gray-600">
                Please complete the payment to activate your sponsorship.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-900 font-semibold mb-2">Next Steps:</p>
                <ol className="text-sm text-blue-900 space-y-1 list-decimal list-inside">
                  <li>Download payment instructions</li>
                  <li>Transfer ${(customAmount ? parseFloat(customAmount || "0") : selectedTier?.amount || 0).toLocaleString()}</li>
                  <li>Use transaction number as reference</li>
                  <li>Send proof of payment to sponsors@ailesglobal.org</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={generatePaymentPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Instructions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setShowForm(false);
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
