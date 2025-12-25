"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  User, GraduationCap, FileText, CheckCircle, 
  ArrowRight, ArrowLeft, Upload, AlertCircle 
} from "lucide-react";

interface ApplicationFormProps {
  scholarshipId?: string;
  scholarshipTitle?: string;
}

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  
  // Education
  currentLevel: string;
  institution: string;
  fieldOfStudy: string;
  gpa: string;
  graduationYear: string;
  
  // Test Scores (conditional)
  hasTestScores: string;
  testType: string;
  testScore: string;
  
  // Documents
  transcriptUrl: string;
  cvUrl: string;
  essayUrl: string;
  recommendationUrl: string;
  
  // Additional (conditional based on scholarship type)
  financialNeed: string;
  workExperience: string;
  researchInterest: string;
}

export default function ScholarshipApplicationForm({ scholarshipId, scholarshipTitle }: ApplicationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    currentLevel: "",
    institution: "",
    fieldOfStudy: "",
    gpa: "",
    graduationYear: "",
    hasTestScores: "",
    testType: "",
    testScore: "",
    transcriptUrl: "",
    cvUrl: "",
    essayUrl: "",
    recommendationUrl: "",
    financialNeed: "",
    workExperience: "",
    researchInterest: "",
  });

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Education", icon: GraduationCap },
    { number: 3, title: "Documents", icon: FileText },
    { number: 4, title: "Review", icon: CheckCircle },
  ];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dateOfBirth &&
          formData.gender &&
          formData.nationality
        );
      case 2:
        return !!(
          formData.currentLevel &&
          formData.institution &&
          formData.fieldOfStudy &&
          formData.gpa &&
          formData.graduationYear
        );
      case 3:
        return !!(
          formData.transcriptUrl &&
          formData.cvUrl &&
          formData.essayUrl
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError("");
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      setError("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(scholarshipId ? { scholarshipId } : {}),
          ...formData,
          status: "SUBMITTED",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      router.push(`/dashboard?application=success`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+256 700 000000"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.gender}
                  onChange={(e) => updateFormData("gender", e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nationality}
                onChange={(e) => updateFormData("nationality", e.target.value)}
                placeholder="e.g., Ugandan"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Education Background</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Education Level <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.currentLevel}
                onChange={(e) => updateFormData("currentLevel", e.target.value)}
                required
              >
                <option value="">Select Level</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate (Masters)</option>
                <option value="Doctoral">Doctoral (PhD)</option>
                <option value="Postdoctoral">Postdoctoral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current/Most Recent Institution <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.institution}
                onChange={(e) => updateFormData("institution", e.target.value)}
                placeholder="e.g., Makerere University"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.fieldOfStudy}
                onChange={(e) => updateFormData("fieldOfStudy", e.target.value)}
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA / Academic Performance <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.gpa}
                  onChange={(e) => updateFormData("gpa", e.target.value)}
                  placeholder="e.g., 3.8/4.0 or 85%"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Graduation Year <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => updateFormData("graduationYear", e.target.value)}
                  placeholder="2026"
                  min="2024"
                  max="2030"
                  required
                />
              </div>
            </div>

            {/* Conditional: Test Scores */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have standardized test scores? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasTestScores"
                    value="yes"
                    checked={formData.hasTestScores === "yes"}
                    onChange={(e) => updateFormData("hasTestScores", e.target.value)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasTestScores"
                    value="no"
                    checked={formData.hasTestScores === "no"}
                    onChange={(e) => updateFormData("hasTestScores", e.target.value)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Conditional fields based on test scores */}
            {formData.hasTestScores === "yes" && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.testType}
                    onChange={(e) => updateFormData("testType", e.target.value)}
                  >
                    <option value="">Select Test</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="SAT">SAT</option>
                    <option value="GRE">GRE</option>
                    <option value="GMAT">GMAT</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Score
                  </label>
                  <Input
                    value={formData.testScore}
                    onChange={(e) => updateFormData("testScore", e.target.value)}
                    placeholder="e.g., 7.5 or 1450"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Required Documents</h3>
            <p className="text-sm text-gray-600">
              Upload or provide links to your required documents
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Transcript <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.transcriptUrl}
                    onChange={(e) => updateFormData("transcriptUrl", e.target.value)}
                    placeholder="Paste document URL or upload"
                    required
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV / Resume <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.cvUrl}
                    onChange={(e) => updateFormData("cvUrl", e.target.value)}
                    placeholder="Paste document URL or upload"
                    required
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Statement / Essay <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.essayUrl}
                    onChange={(e) => updateFormData("essayUrl", e.target.value)}
                    placeholder="Paste document URL or upload"
                    required
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letter of Recommendation (Optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.recommendationUrl}
                    onChange={(e) => updateFormData("recommendationUrl", e.target.value)}
                    placeholder="Paste document URL or upload"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> For now, please upload your documents to Google Drive 
                or Dropbox and paste the shareable links above. File upload will be available soon.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review Your Application</h3>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {formData.gender}</p>
                    <p><strong>Nationality:</strong> {formData.nationality}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Level:</strong> {formData.currentLevel}</p>
                    <p><strong>Institution:</strong> {formData.institution}</p>
                    <p><strong>Field:</strong> {formData.fieldOfStudy}</p>
                    <p><strong>GPA:</strong> {formData.gpa}</p>
                    <p><strong>Graduation:</strong> {formData.graduationYear}</p>
                    {formData.hasTestScores === "yes" && (
                      <p><strong>Test Score:</strong> {formData.testType} - {formData.testScore}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>✓ Academic Transcript</p>
                    <p>✓ CV / Resume</p>
                    <p>✓ Personal Statement</p>
                    {formData.recommendationUrl && <p>✓ Letter of Recommendation</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                By submitting this application, you confirm that all information provided is 
                accurate and complete. You may be asked to verify documents later.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step.number ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} disabled={loading}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
