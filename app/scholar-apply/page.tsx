"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, CheckCircle2, Loader2 } from "lucide-react";

export default function ScholarApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Female",
    nationality: "",
    currentCountry: "",
    city: "",
    address: "",
    
    // Academic Background
    currentDegree: "",
    fieldOfStudy: "",
    university: "",
    gpa: "",
    graduationYear: "",
    currentYear: "",
    
    // Test Scores
    hasTestScores: false,
    toeflScore: "",
    ieltsScore: "",
    greScore: "",
    gmatScore: "",
    satScore: "",
    
    // Study Preferences
    targetDegree: "",
    targetCountries: "",
    targetFields: "",
    preferredIntake: "",
    budgetRange: "",
    
    // Financial Information
    financialNeed: "",
    fundingSource: "",
    expectedFunding: "",
    
    // Additional Information
    workExperience: "",
    researchExperience: "",
    publications: "",
    awards: "",
    volunteerWork: "",
    languages: "",
    personalStory: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/scholars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage((err as Error).message || 'Failed to submit application. Please try again.');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Application Received!</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Thank you for applying to our sponsorship program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-6">
            <p className="text-sm sm:text-base text-gray-600 text-center">
              We've received your application and will review it carefully. 
              Our team will contact you within 5-7 business days.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-sm sm:text-base text-blue-900 font-semibold mb-2">What happens next?</p>
              <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>We review your application</li>
                <li>We match you with potential sponsors</li>
                <li>You'll receive an email with next steps</li>
              </ol>
            </div>
            <Button 
              className="w-full text-sm sm:text-base" 
              onClick={() => router.push('/')}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Apply for Sponsorship</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
            Scholar Application Form
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Apply to be matched with a sponsor who will support your scholarship journey. 
            Fill out all sections to complete your application.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1 min-w-0">
                <div className={`flex flex-col items-center flex-1 w-full`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0 ${
                    step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > s ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : s}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center px-0.5 ${step >= s ? 'text-primary font-medium' : 'text-gray-500'} hidden xs:block`}>
                    {s === 1 ? 'Personal' : s === 2 ? 'Academic' : s === 3 ? 'Financial' : 'Additional'}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`h-0.5 sm:h-1 flex-1 mx-1 sm:mx-2 min-w-[8px] ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Personal Information"}
                {step === 2 && "Academic Background"}
                {step === 3 && "Financial Information"}
                {step === 4 && "Additional Information"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Tell us about yourself"}
                {step === 2 && "Your academic achievements and goals"}
                {step === 3 && "Financial need and funding requirements"}
                {step === 4 && "Work experience, achievements, and personal story"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">First Name *</label>
                      <Input
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Last Name *</label>
                      <Input
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Phone *</label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+256 700 000 000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Date of Birth *</label>
                      <Input
                        required
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Gender *</label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Nationality *</label>
                      <Input
                        required
                        value={formData.nationality}
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                        placeholder="Kenyan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Current Country *</label>
                      <Input
                        required
                        value={formData.currentCountry}
                        onChange={(e) => setFormData({...formData, currentCountry: e.target.value})}
                        placeholder="Kenya"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">City *</label>
                      <Input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Nairobi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Address</label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Background */}
              {step === 2 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Current Degree *</label>
                      <select
                        required
                        value={formData.currentDegree}
                        onChange={(e) => setFormData({...formData, currentDegree: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">Select...</option>
                        <option value="High School">High School</option>
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Field of Study *</label>
                      <Input
                        required
                        value={formData.fieldOfStudy}
                        onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">University/Institution *</label>
                      <Input
                        required
                        value={formData.university}
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                        placeholder="University of Nairobi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">GPA/CGPA *</label>
                      <Input
                        required
                        value={formData.gpa}
                        onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                        placeholder="3.5/4.0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Graduation Year *</label>
                      <Input
                        required
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Current Year *</label>
                      <Input
                        required
                        value={formData.currentYear}
                        onChange={(e) => setFormData({...formData, currentYear: e.target.value})}
                        placeholder="3rd Year"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.hasTestScores}
                        onChange={(e) => setFormData({...formData, hasTestScores: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">I have English test scores</span>
                    </label>

                    {formData.hasTestScores && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-4 sm:pl-6 mt-3">
                        <div>
                          <label className="block text-sm font-medium mb-1.5 sm:mb-2">IELTS Score</label>
                          <Input
                            value={formData.ieltsScore}
                            onChange={(e) => setFormData({...formData, ieltsScore: e.target.value})}
                            placeholder="7.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5 sm:mb-2">TOEFL Score</label>
                          <Input
                            value={formData.toeflScore}
                            onChange={(e) => setFormData({...formData, toeflScore: e.target.value})}
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5 sm:mb-2">GRE Score</label>
                          <Input
                            value={formData.greScore}
                            onChange={(e) => setFormData({...formData, greScore: e.target.value})}
                            placeholder="320"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5 sm:mb-2">GMAT Score</label>
                          <Input
                            value={formData.gmatScore}
                            onChange={(e) => setFormData({...formData, gmatScore: e.target.value})}
                            placeholder="650"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Target Degree *</label>
                      <select
                        required
                        value={formData.targetDegree}
                        onChange={(e) => setFormData({...formData, targetDegree: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">Select...</option>
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Target Countries *</label>
                      <Input
                        required
                        value={formData.targetCountries}
                        onChange={(e) => setFormData({...formData, targetCountries: e.target.value})}
                        placeholder="USA, UK, Canada"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Target Fields *</label>
                      <Input
                        required
                        value={formData.targetFields}
                        onChange={(e) => setFormData({...formData, targetFields: e.target.value})}
                        placeholder="Engineering, Medicine"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Preferred Intake *</label>
                      <Input
                        required
                        value={formData.preferredIntake}
                        onChange={(e) => setFormData({...formData, preferredIntake: e.target.value})}
                        placeholder="Fall 2025"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {step === 3 && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2">Financial Need *</label>
                    <textarea
                      required
                      value={formData.financialNeed}
                      onChange={(e) => setFormData({...formData, financialNeed: e.target.value})}
                      className="w-full border rounded-lg p-3 text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                      placeholder="Describe your financial situation and why you need sponsorship..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Current Funding Source *</label>
                      <Input
                        required
                        value={formData.fundingSource}
                        onChange={(e) => setFormData({...formData, fundingSource: e.target.value})}
                        placeholder="Family, Savings, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Expected Funding Needed *</label>
                      <Input
                        required
                        value={formData.expectedFunding}
                        onChange={(e) => setFormData({...formData, expectedFunding: e.target.value})}
                        placeholder="$50,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2">Budget Range *</label>
                    <select
                      required
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select...</option>
                      <option value="Under $20,000">Under $20,000</option>
                      <option value="$20,000 - $50,000">$20,000 - $50,000</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="Over $100,000">Over $100,000</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Information */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2">Work Experience</label>
                    <textarea
                      value={formData.workExperience}
                      onChange={(e) => setFormData({...formData, workExperience: e.target.value})}
                      className="w-full border rounded-lg p-3 min-h-[80px]"
                      placeholder="Describe your work experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2">Research Experience</label>
                    <textarea
                      value={formData.researchExperience}
                      onChange={(e) => setFormData({...formData, researchExperience: e.target.value})}
                      className="w-full border rounded-lg p-3 min-h-[80px]"
                      placeholder="Any research projects or publications..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Awards & Achievements</label>
                      <Input
                        value={formData.awards}
                        onChange={(e) => setFormData({...formData, awards: e.target.value})}
                        placeholder="Academic awards, competitions..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Languages</label>
                      <Input
                        value={formData.languages}
                        onChange={(e) => setFormData({...formData, languages: e.target.value})}
                        placeholder="English, Swahili, French..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2">Volunteer Work</label>
                    <textarea
                      value={formData.volunteerWork}
                      onChange={(e) => setFormData({...formData, volunteerWork: e.target.value})}
                      className="w-full border rounded-lg p-3 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                      placeholder="Community service, volunteer activities..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2">Personal Story *</label>
                    <textarea
                      required
                      value={formData.personalStory}
                      onChange={(e) => setFormData({...formData, personalStory: e.target.value})}
                      className="w-full border rounded-lg p-3 text-sm sm:text-base min-h-[120px] sm:min-h-[150px]"
                      placeholder="Tell us your story. Why do you need sponsorship? What are your goals? How will this opportunity change your life and your community?..."
                    />
                    <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                      This is your chance to make a compelling case. Be authentic and detailed.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Previous
                  </Button>
                ) : (
                  <div className="hidden sm:block" />
                )}
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

