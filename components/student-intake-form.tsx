'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  currentCountry: z.string().min(1, 'Current country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  
  // Academic Background
  currentDegree: z.string().min(1, 'Current degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  university: z.string().min(1, 'University is required'),
  gpa: z.string().min(1, 'GPA is required'),
  graduationYear: z.string().min(1, 'Graduation year is required'),
  currentYear: z.string().min(1, 'Current year is required'),
  
  // Test Scores
  hasTestScores: z.boolean(),
  toeflScore: z.string().optional(),
  ieltsScore: z.string().optional(),
  greScore: z.string().optional(),
  gmatScore: z.string().optional(),
  satScore: z.string().optional(),
  
  // Study Preferences
  targetDegree: z.string().min(1, 'Target degree is required'),
  targetCountries: z.string().min(1, 'Target countries are required'),
  targetFields: z.string().min(1, 'Target fields are required'),
  preferredIntake: z.string().min(1, 'Preferred intake is required'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  
  // Financial Information
  financialNeed: z.string().min(1, 'Financial need is required'),
  fundingSource: z.string().min(1, 'Funding source is required'),
  expectedFunding: z.string().min(1, 'Expected funding is required'),
  
  // Additional Information
  workExperience: z.string().optional(),
  researchExperience: z.string().optional(),
  publications: z.string().optional(),
  awards: z.string().optional(),
  volunteerWork: z.string().optional(),
  languages: z.string().optional(),
  additionalInfo: z.string().optional(),
  
  // Consent
  consentDataUsage: z.boolean().refine(val => val === true, {
    message: 'You must consent to data usage'
  }),
  marketingEmails: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function StudentIntakeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasTestScores: false,
      consentDataUsage: false,
      marketingEmails: false,
    },
  });

  const hasTestScores = watch('hasTestScores');
  const totalSteps = 6;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/student-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit form');
      }

      // Redirect to success page or show confirmation
      router.push(`/student-intake/success?id=${result.id}`);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality *
                </label>
                <input
                  type="text"
                  {...register('nationality')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationality.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Country *
                </label>
                <input
                  type="text"
                  {...register('currentCountry')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.currentCountry && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentCountry.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Background */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Academic Background</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Degree Level *
                </label>
                <select
                  {...register('currentDegree')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Degree</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
                {errors.currentDegree && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentDegree.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  {...register('fieldOfStudy')}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.fieldOfStudy && (
                  <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University/Institution *
                </label>
                <input
                  type="text"
                  {...register('university')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.university && (
                  <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA/Grade *
                </label>
                <input
                  type="text"
                  {...register('gpa')}
                  placeholder="e.g., 3.5/4.0 or 70%"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.gpa && (
                  <p className="mt-1 text-sm text-red-600">{errors.gpa.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Graduation Year *
                </label>
                <input
                  type="text"
                  {...register('graduationYear')}
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Year of Study *
                </label>
                <select
                  {...register('currentYear')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
                {errors.currentYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentYear.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Test Scores */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Test Scores</h2>
            
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('hasTestScores')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I have standardized test scores to report
                </span>
              </label>
            </div>

            {hasTestScores && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TOEFL Score
                  </label>
                  <input
                    type="text"
                    {...register('toeflScore')}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IELTS Score
                  </label>
                  <input
                    type="text"
                    {...register('ieltsScore')}
                    placeholder="e.g., 7.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GRE Score
                  </label>
                  <input
                    type="text"
                    {...register('greScore')}
                    placeholder="e.g., 320"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GMAT Score
                  </label>
                  <input
                    type="text"
                    {...register('gmatScore')}
                    placeholder="e.g., 700"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SAT Score
                  </label>
                  <input
                    type="text"
                    {...register('satScore')}
                    placeholder="e.g., 1400"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Study Preferences */}
        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Study Preferences</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Degree Level *
                </label>
                <select
                  {...register('targetDegree')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Degree</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                </select>
                {errors.targetDegree && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetDegree.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Countries *
                </label>
                <input
                  type="text"
                  {...register('targetCountries')}
                  placeholder="e.g., USA, UK, Canada"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.targetCountries && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetCountries.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Fields of Study *
                </label>
                <input
                  type="text"
                  {...register('targetFields')}
                  placeholder="e.g., Engineering, Business"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.targetFields && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetFields.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Intake *
                </label>
                <select
                  {...register('preferredIntake')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Intake</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Spring 2026">Spring 2026</option>
                  <option value="Fall 2026">Fall 2026</option>
                  <option value="Spring 2027">Spring 2027</option>
                  <option value="Flexible">Flexible</option>
                </select>
                {errors.preferredIntake && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredIntake.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Budget Range *
                </label>
                <select
                  {...register('budgetRange')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Budget Range</option>
                  <option value="Less than $10,000">Less than $10,000</option>
                  <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                  <option value="$20,000 - $30,000">$20,000 - $30,000</option>
                  <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                  <option value="More than $50,000">More than $50,000</option>
                </select>
                {errors.budgetRange && (
                  <p className="mt-1 text-sm text-red-600">{errors.budgetRange.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Financial & Additional Information */}
        {currentStep === 5 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Financial & Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Financial Need Level *
                </label>
                <select
                  {...register('financialNeed')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  <option value="Full Funding Required">Full Funding Required</option>
                  <option value="Partial Funding Needed">Partial Funding Needed</option>
                  <option value="Self-Funded">Self-Funded</option>
                </select>
                {errors.financialNeed && (
                  <p className="mt-1 text-sm text-red-600">{errors.financialNeed.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potential Funding Sources *
                </label>
                <input
                  type="text"
                  {...register('fundingSource')}
                  placeholder="e.g., Scholarships, Family, Savings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.fundingSource && (
                  <p className="mt-1 text-sm text-red-600">{errors.fundingSource.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Funding Amount *
                </label>
                <input
                  type="text"
                  {...register('expectedFunding')}
                  placeholder="e.g., $20,000 per year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.expectedFunding && (
                  <p className="mt-1 text-sm text-red-600">{errors.expectedFunding.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Experience (Optional)
                </label>
                <textarea
                  {...register('workExperience')}
                  rows={3}
                  placeholder="Describe your work experience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Experience (Optional)
                </label>
                <textarea
                  {...register('researchExperience')}
                  rows={3}
                  placeholder="Describe your research experience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publications (Optional)
                </label>
                <textarea
                  {...register('publications')}
                  rows={2}
                  placeholder="List any publications..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Awards & Honors (Optional)
                </label>
                <textarea
                  {...register('awards')}
                  rows={2}
                  placeholder="List any awards or honors..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteer Work (Optional)
                </label>
                <textarea
                  {...register('volunteerWork')}
                  rows={2}
                  placeholder="Describe volunteer work..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken (Optional)
                </label>
                <input
                  type="text"
                  {...register('languages')}
                  placeholder="e.g., English (Fluent), Spanish (Intermediate)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Consent */}
        {currentStep === 6 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Additional Information & Consent</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  {...register('additionalInfo')}
                  rows={4}
                  placeholder="Any additional information you'd like to share..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      {...register('consentDataUsage')}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to Ailes Global processing my personal data for the purpose of educational consultation and scholarship matching. I understand my data will be handled according to the privacy policy. *
                    </span>
                  </label>
                  {errors.consentDataUsage && (
                    <p className="mt-1 text-sm text-red-600">{errors.consentDataUsage.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      {...register('marketingEmails')}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      I would like to receive updates about scholarship opportunities and educational resources via email.
                    </span>
                  </label>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
