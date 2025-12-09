"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, Target, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

interface StepperProps {
  onComplete: () => void;
}

export default function ScholarshipMatcherStepper({ onComplete }: StepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Personal Info
    country: "",
    dateOfBirth: "",
    gender: "",

    // Academic Info
    degreeLevel: "",
    fieldOfStudy: "",
    currentGPA: "",
    graduationYear: "",
    currentInstitution: "",

    // Test Scores
    hasTestScores: "",
    ieltsScore: "",
    toeflScore: "",

    // Preferences
    interestedCountries: [] as string[],
    preferredIntake: "",
  });

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Academic Background", icon: GraduationCap },
    { number: 3, title: "Preferences", icon: Target },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.country && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.degreeLevel && formData.fieldOfStudy && formData.currentGPA;
      case 3:
        return formData.interestedCountries.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setError("");
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      setError("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Update user profile with matching preferences
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          degreeLevel: formData.degreeLevel,
          fieldOfStudy: formData.fieldOfStudy,
          currentGPA: parseFloat(formData.currentGPA),
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
          currentInstitution: formData.currentInstitution,
          ieltsScore: formData.ieltsScore ? parseFloat(formData.ieltsScore) : undefined,
          toeflScore: formData.toeflScore ? parseFloat(formData.toeflScore) : undefined,
          interestedCountries: formData.interestedCountries,
          preferredIntake: formData.preferredIntake,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      onComplete();
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
                  Country <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.country}
                  onChange={(e) => updateFormData("country", e.target.value)}
                  placeholder="e.g., Uganda, Kenya"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
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
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Academic Background</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current/Target Degree Level <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.degreeLevel}
                  onChange={(e) => updateFormData("degreeLevel", e.target.value)}
                >
                  <option value="">Select Level</option>
                  <option value="BACHELOR">Bachelor's</option>
                  <option value="MASTER">Master's</option>
                  <option value="PHD">PhD</option>
                  <option value="DIPLOMA">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.fieldOfStudy}
                  onChange={(e) => updateFormData("fieldOfStudy", e.target.value)}
                  placeholder="e.g., Computer Science, Medicine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current GPA (0-4.0 scale) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.currentGPA}
                  onChange={(e) => updateFormData("currentGPA", e.target.value)}
                  placeholder="e.g., 3.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current/Most Recent Institution
                </label>
                <Input
                  value={formData.currentInstitution}
                  onChange={(e) => updateFormData("currentInstitution", e.target.value)}
                  placeholder="University name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Graduation Year
                </label>
                <Input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => updateFormData("graduationYear", e.target.value)}
                  placeholder="e.g., 2025"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-4">Test Scores (Optional)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IELTS Score
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    value={formData.ieltsScore}
                    onChange={(e) => updateFormData("ieltsScore", e.target.value)}
                    placeholder="e.g., 7.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TOEFL Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.toeflScore}
                    onChange={(e) => updateFormData("toeflScore", e.target.value)}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Study Preferences</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interested Countries <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">Select countries where you'd like to study</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["USA", "UK", "Canada", "Australia", "Germany", "Netherlands", "Sweden", "France", "China", "Japan"].map((country) => (
                  <label key={country} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.interestedCountries.includes(country)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("interestedCountries", [...formData.interestedCountries, country]);
                        } else {
                          updateFormData("interestedCountries", formData.interestedCountries.filter((c) => c !== country));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Intake
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.preferredIntake}
                onChange={(e) => updateFormData("preferredIntake", e.target.value)}
              >
                <option value="">Select Intake</option>
                <option value="Fall">Fall (September)</option>
                <option value="Spring">Spring (January)</option>
                <option value="Summer">Summer (May)</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6 md:p-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? "text-primary font-semibold" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-colors ${
                        currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">{renderStepContent()}</div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1 || loading}>
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={nextStep} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finding Matches...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Find My Matches
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
