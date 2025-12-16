"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Zap,
  Download,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";

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

  useEffect(() => {
    // Get scholarship finder data from localStorage
    const data = localStorage.getItem("scholarshipFinderData");
    if (data) {
      setFinderData(JSON.parse(data));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store payment request
    const copilotRequest = {
      ...formData,
      finderData,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    
    localStorage.setItem("copilotRequest", JSON.stringify(copilotRequest));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-2 border-green-500">
          <CardContent className="p-12 text-center">
            <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Payment Request Received! 🎉</h2>
            <p className="text-xl text-gray-700 mb-6">
              Welcome to Scholarship Copilot, <strong>{formData.name}</strong>!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold mb-4 text-lg">What happens next:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Verify Payment (2 hours)</p>
                    <p className="text-sm text-gray-600">We'll confirm your {formData.paymentMethod.toUpperCase()} payment</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI Generates Your Applications (24 hours)</p>
                    <p className="text-sm text-gray-600">
                      Copilot will create 25+ custom motivation letters and pre-filled forms based on:
                    </p>
                    {finderData && (
                      <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
                        <li>• From: <strong>{finderData.nationality}</strong></li>
                        <li>• Studying: <strong>{finderData.fieldOfStudy}</strong></li>
                        <li>• Degree: <strong>{finderData.degreeLevel}</strong></li>
                        <li>• Destination: <strong>{finderData.destination}</strong></li>
                        <li>• Funding: <strong>{finderData.fundingType}</strong></li>
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Download Your Package</p>
                    <p className="text-sm text-gray-600">
                      Get ZIP file with all applications sent to <strong>{formData.email}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Join WhatsApp Group</p>
                    <p className="text-sm text-gray-600">
                      Get deadline reminders and support at <strong>{formData.whatsapp}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>⚡ Want faster processing?</strong><br />
                WhatsApp your payment screenshot to{" "}
                <span className="text-primary font-bold">+256 700 123 456</span>
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button size="lg" className="w-full">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Activate Scholarship Copilot</h1>
          <p className="text-xl text-gray-600">
            Let AI handle the hard work while you focus on winning scholarships
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: What You Get */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Profile Summary */}
            {finderData && (
              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Scholarship Profile
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">From</p>
                      <p className="font-semibold">{finderData.nationality}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Destination</p>
                      <p className="font-semibold">{finderData.destination}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Field of Study</p>
                      <p className="font-semibold">{finderData.fieldOfStudy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Degree Level</p>
                      <p className="font-semibold">{finderData.degreeLevel}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Funding Type</p>
                      <p className="font-semibold">{finderData.fundingType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What Copilot Does */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">What Copilot Will Generate:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">25+ Custom Motivation Letters</p>
                      <p className="text-sm text-gray-600">Each letter tailored to specific scholarship requirements</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Pre-Filled Application Forms</p>
                      <p className="text-sm text-gray-600">All your information organized and ready to submit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <Download className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Complete Document Package</p>
                      <p className="text-sm text-gray-600">ZIP file with everything organized and labeled</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Deadline Tracker</p>
                      <p className="text-sm text-gray-600">Reminders so you never miss a deadline</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment Form */}
          <div>
            <Card className="sticky top-4 shadow-xl border-2 border-primary">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-primary/10 to-purple-100 rounded-lg p-4 mb-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">One-time payment</p>
                  <p className="text-4xl font-bold text-primary mb-1">$20</p>
                  <p className="text-xs text-gray-600">UGX 75,000</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Applications will be sent here</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <Input
                      type="tel"
                      placeholder="+256 700 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp *</label>
                    <Input
                      type="tel"
                      placeholder="+256 700 123 456"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["mtn", "airtel", "bank"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method })}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            formData.paymentMethod === method
                              ? "border-primary bg-primary/5"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="font-bold text-sm">
                            {method === "mtn" && <span className="text-yellow-500">MTN</span>}
                            {method === "airtel" && <span className="text-red-600">Airtel</span>}
                            {method === "bank" && <span className="text-blue-600">Bank</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="font-semibold mb-2">Payment Instructions:</p>
                    {formData.paymentMethod === "mtn" && (
                      <div>
                        <p>Send <strong>UGX 75,000</strong> to:</p>
                        <p className="text-lg font-bold text-primary">+256 700 123 456</p>
                        <p className="text-gray-600">Name: Ailes Global</p>
                      </div>
                    )}
                    {formData.paymentMethod === "airtel" && (
                      <div>
                        <p>Send <strong>UGX 75,000</strong> to:</p>
                        <p className="text-lg font-bold text-primary">+256 750 123 456</p>
                        <p className="text-gray-600">Name: Ailes Global</p>
                      </div>
                    )}
                    {formData.paymentMethod === "bank" && (
                      <div className="space-y-1">
                        <p><strong>Bank:</strong> Equity Bank</p>
                        <p><strong>Account:</strong> 1001234567890</p>
                        <p><strong>Name:</strong> Ailes Global</p>
                        <p><strong>Amount:</strong> UGX 75,000</p>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold py-6">
                    <Zap className="mr-2 h-5 w-5" />
                    I've Sent Payment
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>100% Money-back guarantee</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
