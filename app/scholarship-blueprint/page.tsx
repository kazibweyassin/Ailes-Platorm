"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  X,
  Star,
  Download,
  Clock,
  Target,
  FileText,
  Bell,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

export default function ScholarshipBlueprintPage() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    paymentMethod: "mtn",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollToPayment = () => {
    setShowPaymentForm(true);
    setTimeout(() => {
      document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Limited Time Offer - Only 100 Spots Left!</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Scholarship
              <br />
              <span className="text-yellow-300">In Just 5 Minutes</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl mb-4 text-blue-100 max-w-3xl mx-auto">
              Stop wasting months searching. Get a personalized AI-powered blueprint with 
              <span className="font-bold text-white"> 50 perfect-match scholarships</span> worth up to $2.5M
            </p>

            {/* Price Highlight */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-2xl line-through text-blue-200">$49</span>
              <span className="text-5xl font-bold text-yellow-300">$20</span>
              <span className="text-lg text-blue-100">one-time payment</span>
            </div>

            {/* CTA Button */}
            <Button
              onClick={scrollToPayment}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-all"
            >
              Get My Scholarship Blueprint Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>500+ Students Helped</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Are You <span className="text-red-600">Wasting Time</span> Searching for Scholarships?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Spending hours on Google finding the same scholarships everyone knows",
              "Missing deadlines because you didn't know about hidden opportunities",
              "Applying to scholarships you're not even qualified for",
              "Getting rejected because your application wasn't competitive enough",
            ].map((problem, index) => (
              <Card key={index} className="border-red-200 bg-white">
                <CardContent className="p-6 flex items-start gap-3">
                  <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 font-semibold">
              What if you could skip all that and get a <span className="text-primary">personalized roadmap</span> in 5 minutes?
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Here's What You Get for Just $20
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to win scholarships in one complete package
            </p>
          </div>

          <div className="space-y-6">
            {/* Item 1 */}
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">
                      1. Personal Scholarship Blueprint (PDF Report)
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Top 50 scholarships ranked by YOUR match score (90%+ compatibility)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Exact application timeline with all deadlines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Required documents checklist for each scholarship</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Step-by-step application strategy</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">Worth: $49</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item 2 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">
                      2. Pre-Written Application Templates
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>10 customizable motivation letter templates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>5 personal statement frameworks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Email templates for contacting universities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Recommendation letter request templates</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">Worth: $29</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item 3 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">
                      3. Exclusive Scholarship Database Access (6 Months)
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>500+ scholarships NOT found on Google</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Weekly new scholarship alerts via WhatsApp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Hidden deadlines and opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>African-specific scholarships (70% less competition)</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">Worth: $99</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item 4 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Bell className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">
                      4. Application Tracker & Reminder System
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Automated deadline reminders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Track all applications in one place</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Success probability calculator</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Interview preparation checklist</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">Worth: $39</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item 5 - BONUS */}
            <Card className="shadow-lg border-2 border-yellow-400 bg-yellow-50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-3 rounded-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                      🎁 BONUS
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      5. Monthly Group Consultation (1 Hour)
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Live Q&A with scholarship experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Application review sessions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Success stories from scholarship winners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Network with other serious applicants</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">Worth: $97/month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Value */}
          <div className="mt-12 text-center bg-primary text-white rounded-2xl p-8">
            <p className="text-lg mb-2">Total Value:</p>
            <p className="text-4xl font-bold line-through opacity-70">$313</p>
            <p className="text-2xl mt-4 mb-2">Your Investment Today:</p>
            <p className="text-6xl font-bold text-yellow-300">$20</p>
            <p className="text-xl mt-4 opacity-90">That's a 93% discount - Same price as lunch!</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Students Are Saying
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                location: "Uganda",
                text: "I got accepted to 3 scholarships from the list! The templates saved me weeks of work. Best $20 I ever spent!",
                amount: "$45,000",
              },
              {
                name: "David K.",
                location: "Kenya",
                text: "Found scholarships I never knew existed. The WhatsApp alerts are gold - I applied before the deadline rush.",
                amount: "$25,000",
              },
              {
                name: "Grace N.",
                location: "Nigeria",
                text: "The application strategy was spot-on. I knew exactly what to do and when. Now studying in Canada!",
                amount: "$60,000",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <p className="text-primary font-bold mt-2">Won: {testimonial.amount}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="payment-section" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          {!submitted ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get Your Scholarship Blueprint Now
                </h2>
                <p className="text-xl text-gray-600">
                  Join 500+ students who found their perfect scholarships
                </p>
                
                {/* Urgency Banner */}
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock className="h-5 w-5" />
                    <span className="font-bold">Only 47 spots left at this price!</span>
                  </div>
                </div>
              </div>

              <Card className="shadow-2xl border-2 border-primary">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your blueprint will be sent to this email
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+256 786 367460"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        WhatsApp Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+256 786 367460"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        required
                        className="text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        For weekly scholarship alerts
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Choose Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: "mtn" })}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            formData.paymentMethod === "mtn"
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <div className="font-bold text-yellow-500">MTN</div>
                          <div className="text-xs text-gray-600">Mobile Money</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: "airtel" })}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            formData.paymentMethod === "airtel"
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <div className="font-bold text-red-600">Airtel</div>
                          <div className="text-xs text-gray-600">Mobile Money</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: "bank" })}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            formData.paymentMethod === "bank"
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <div className="font-bold text-blue-600">Bank</div>
                          <div className="text-xs text-gray-600">Transfer</div>
                        </button>
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Payment Instructions
                      </h3>
                      
                      {formData.paymentMethod === "mtn" && (
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Send UGX 75,000 ($20) to:</p>
                          <p className="text-lg font-bold text-primary">+256 786 367460</p>
                          <p className="text-gray-600">Account Name: Ailes Global</p>
                        </div>
                      )}

                      {formData.paymentMethod === "airtel" && (
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Send UGX 75,000 ($20) to:</p>
                          <p className="text-lg font-bold text-primary">+256 750 123 456</p>
                          <p className="text-gray-600">Account Name: Ailes Global</p>
                        </div>
                      )}

                      {formData.paymentMethod === "bank" && (
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Bank Transfer Details:</p>
                          <p><strong>Bank:</strong> Equity Bank Uganda</p>
                          <p><strong>Account:</strong> 1001234567890</p>
                          <p><strong>Name:</strong> Ailes Global</p>
                          <p><strong>Amount:</strong> UGX 75,000 ($20)</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-600 mt-4">
                        After payment, click the button below. We'll verify and send your blueprint within 2 hours.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6"
                    >
                      I've Sent Payment - Get My Blueprint
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    {/* Guarantee */}
                    <div className="text-center pt-4 border-t">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span>
                          <strong>100% Money-Back Guarantee</strong> - If you don't find at least 10 perfect matches
                        </span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-2xl border-2 border-green-500">
              <CardContent className="p-12 text-center">
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Payment Request Received! 🎉</h2>
                <p className="text-xl text-gray-700 mb-6">
                  Thank you <strong>{formData.name}</strong>!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-bold mb-3">What happens next:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        1
                      </div>
                      <p className="text-gray-700">
                        We'll verify your payment within <strong>2 hours</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        2
                      </div>
                      <p className="text-gray-700">
                        Your personalized Scholarship Blueprint will be sent to <strong>{formData.email}</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        3
                      </div>
                      <p className="text-gray-700">
                        You'll be added to our exclusive WhatsApp group at <strong>{formData.whatsapp}</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        4
                      </div>
                      <p className="text-gray-700">
                        You'll receive an invite to our next monthly consultation
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Need faster verification?</strong> WhatsApp your payment screenshot to{" "}
                    <span className="text-primary font-bold">+256 786 367460</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How is this different from free scholarship websites?",
                a: "Free websites show you thousands of random scholarships. We give you a PERSONALIZED list of 50 scholarships that match YOUR profile, plus templates and a complete strategy. It's like having a personal scholarship consultant for $20.",
              },
              {
                q: "When will I receive my blueprint?",
                a: "Within 2 hours of payment verification! We work 7 days a week. For fastest service, WhatsApp your payment screenshot to +256 786 367460.",
              },
              {
                q: "What if I don't find any good scholarships?",
                a: "If you don't find at least 10 perfect-match scholarships worth applying to, we'll refund your $20. No questions asked.",
              },
              {
                q: "Is this a one-time payment?",
                a: "Yes! Pay once, get lifetime access to your blueprint and 6 months of database access + weekly alerts.",
              },
              {
                q: "Can I get help with my applications?",
                a: "Yes! You get access to our monthly group consultation where we review applications and answer questions. Plus all the templates you need.",
              },
              {
                q: "What countries are the scholarships for?",
                a: "USA, UK, Canada, Germany, Australia, Netherlands, Sweden, and many more. We focus on scholarships for African students.",
              },
            ].map((faq, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Scholarship?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop wasting time. Get your personalized blueprint in 5 minutes.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 inline-block">
            <p className="text-2xl mb-4">Limited Time Offer</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl line-through opacity-70">$49</span>
              <span className="text-6xl font-bold text-yellow-300">$20</span>
            </div>
            <p className="text-lg mt-4 opacity-90">Same price as lunch, but could change your life</p>
          </div>

          <Button
            onClick={scrollToPayment}
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xl px-10 py-7 rounded-full shadow-2xl hover:scale-105 transition-all"
          >
            Get My Scholarship Blueprint Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>500+ Happy Students</span>
            </div>
          </div>

          <p className="text-sm mt-8 opacity-70">
            Only 47 spots left at this price. Price increases to $49 after 100 sales.
          </p>
        </div>
      </section>

      {/* Footer Note */}
      <div className="bg-gray-900 text-white py-8 px-4 text-center">
        <p className="text-sm opacity-75">
          © 2025 Ailes Global. All rights reserved. |{" "}
          <Link href="/" className="underline hover:opacity-100">
            Back to Main Site
          </Link>
        </p>
      </div>
    </div>
  );
}
