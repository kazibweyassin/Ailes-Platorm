'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateStudentApplicationPDF } from '@/lib/pdf-generator';
import { Download, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  currentCountry: string;
  city: string;
  address: string;
  
  // Academic Background
  currentDegree: string;
  fieldOfStudy: string;
  university: string;
  gpa: string;
  graduationYear: string;
  currentYear: string;
  
  // Test Scores
  hasTestScores: string;
  toeflScore: string;
  ieltsScore: string;
  greScore: string;
  gmatScore: string;
  satScore: string;
  
  // Study Preferences
  targetDegree: string;
  targetCountries: string;
  targetFields: string;
  preferredIntake: string;
  budgetRange: string;
  
  // Financial Information
  financialNeed: string;
  fundingSource: string;
  expectedFunding: string;
  
  // Additional Information
  workExperience: string;
  researchExperience: string;
  publications: string;
  awards: string;
  volunteerWork: string;
  languages: string;
  additionalInfo: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export default function ApplicationFormClient() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    currentCountry: '',
    city: '',
    address: '',
    currentDegree: '',
    fieldOfStudy: '',
    university: '',
    gpa: '',
    graduationYear: '',
    currentYear: '',
    hasTestScores: 'no',
    toeflScore: '',
    ieltsScore: '',
    greScore: '',
    gmatScore: '',
    satScore: '',
    targetDegree: '',
    targetCountries: '',
    targetFields: '',
    preferredIntake: '',
    budgetRange: '',
    financialNeed: '',
    fundingSource: '',
    expectedFunding: '',
    workExperience: '',
    researchExperience: '',
    publications: '',
    awards: '',
    volunteerWork: '',
    languages: '',
    additionalInfo: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.currentDegree) newErrors.currentDegree = 'Current degree is required';
    if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
    if (!formData.university.trim()) newErrors.university = 'University is required';
    if (!formData.gpa.trim()) newErrors.gpa = 'GPA is required';
    if (!formData.graduationYear.trim()) newErrors.graduationYear = 'Graduation year is required';
    if (!formData.targetDegree) newErrors.targetDegree = 'Target degree is required';
    if (!formData.targetCountries.trim()) newErrors.targetCountries = 'Target countries are required';
    if (!formData.targetFields.trim()) newErrors.targetFields = 'Target fields are required';
    if (!formData.financialNeed) newErrors.financialNeed = 'Financial need is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownloadPDF = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsGenerating(true);
    setSuccess(false);

    try {
      // Map form data to PDF generator interface
      const pdfData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        currentCountry: formData.currentCountry,
        city: formData.city,
        address: formData.address,
        currentDegree: formData.currentDegree,
        fieldOfStudy: formData.fieldOfStudy,
        university: formData.university,
        gpa: formData.gpa,
        graduationYear: formData.graduationYear,
        currentYear: formData.currentYear,
        hasTestScores: formData.hasTestScores,
        toeflScore: formData.toeflScore,
        ieltsScore: formData.ieltsScore,
        greScore: formData.greScore,
        gmatScore: formData.gmatScore,
        satScore: formData.satScore,
        targetDegree: formData.targetDegree,
        targetCountries: formData.targetCountries,
        targetFields: formData.targetFields,
        preferredIntake: formData.preferredIntake,
        budgetRange: formData.budgetRange,
        financialNeed: formData.financialNeed,
        fundingSource: formData.fundingSource,
        expectedFunding: formData.expectedFunding,
        workExperience: formData.workExperience,
        researchExperience: formData.researchExperience,
        publications: formData.publications,
        awards: formData.awards,
        volunteerWork: formData.volunteerWork,
        languages: formData.languages,
        additionalInfo: formData.additionalInfo,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyContactRelation: formData.emergencyContactRelation,
      };

      generateStudentApplicationPDF(pdfData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrors({ additionalInfo: 'Failed to generate PDF. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-800">PDF downloaded successfully!</p>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium mb-1">Please fix the following errors:</p>
            <ul className="text-red-700 text-sm list-disc list-inside">
              {Object.values(errors).map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>1. Personal Information</CardTitle>
          <CardDescription>Basic details about yourself</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth *</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className={errors.dateOfBirth ? 'border-red-500' : ''}
              />
              {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.gender ? 'border-red-500' : ''}`}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nationality *</label>
              <Input
                value={formData.nationality}
                onChange={(e) => updateField('nationality', e.target.value)}
                className={errors.nationality ? 'border-red-500' : ''}
              />
              {errors.nationality && <p className="text-sm text-red-600 mt-1">{errors.nationality}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Country</label>
              <Input
                value={formData.currentCountry}
                onChange={(e) => updateField('currentCountry', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Input
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Textarea
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Academic Background</CardTitle>
          <CardDescription>Your current educational status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Degree Level *</label>
              <select
                value={formData.currentDegree}
                onChange={(e) => updateField('currentDegree', e.target.value)}
                className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.currentDegree ? 'border-red-500' : ''}`}
              >
                <option value="">Select...</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
              {errors.currentDegree && <p className="text-sm text-red-600 mt-1">{errors.currentDegree}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Field of Study *</label>
              <Input
                value={formData.fieldOfStudy}
                onChange={(e) => updateField('fieldOfStudy', e.target.value)}
                className={errors.fieldOfStudy ? 'border-red-500' : ''}
              />
              {errors.fieldOfStudy && <p className="text-sm text-red-600 mt-1">{errors.fieldOfStudy}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">University/Institution *</label>
              <Input
                value={formData.university}
                onChange={(e) => updateField('university', e.target.value)}
                className={errors.university ? 'border-red-500' : ''}
              />
              {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current GPA *</label>
              <Input
                type="text"
                placeholder="e.g., 3.5 or 85%"
                value={formData.gpa}
                onChange={(e) => updateField('gpa', e.target.value)}
                className={errors.gpa ? 'border-red-500' : ''}
              />
              {errors.gpa && <p className="text-sm text-red-600 mt-1">{errors.gpa}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Year</label>
              <Input
                value={formData.currentYear}
                onChange={(e) => updateField('currentYear', e.target.value)}
                placeholder="e.g., Year 2, Year 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expected Graduation Year *</label>
              <Input
                type="text"
                value={formData.graduationYear}
                onChange={(e) => updateField('graduationYear', e.target.value)}
                className={errors.graduationYear ? 'border-red-500' : ''}
              />
              {errors.graduationYear && <p className="text-sm text-red-600 mt-1">{errors.graduationYear}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Standardized Test Scores</CardTitle>
          <CardDescription>If you have taken any standardized tests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Do you have test scores?</label>
            <select
              value={formData.hasTestScores}
              onChange={(e) => updateField('hasTestScores', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {formData.hasTestScores === 'yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">TOEFL Score</label>
                <Input
                  value={formData.toeflScore}
                  onChange={(e) => updateField('toeflScore', e.target.value)}
                  placeholder="e.g., 95"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IELTS Score</label>
                <Input
                  value={formData.ieltsScore}
                  onChange={(e) => updateField('ieltsScore', e.target.value)}
                  placeholder="e.g., 7.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GRE Score</label>
                <Input
                  value={formData.greScore}
                  onChange={(e) => updateField('greScore', e.target.value)}
                  placeholder="e.g., 320"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GMAT Score</label>
                <Input
                  value={formData.gmatScore}
                  onChange={(e) => updateField('gmatScore', e.target.value)}
                  placeholder="e.g., 650"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SAT Score</label>
                <Input
                  value={formData.satScore}
                  onChange={(e) => updateField('satScore', e.target.value)}
                  placeholder="e.g., 1400"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Study Preferences</CardTitle>
          <CardDescription>Your study abroad goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Degree Level *</label>
              <select
                value={formData.targetDegree}
                onChange={(e) => updateField('targetDegree', e.target.value)}
                className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.targetDegree ? 'border-red-500' : ''}`}
              >
                <option value="">Select...</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Diploma/Certificate">Diploma/Certificate</option>
              </select>
              {errors.targetDegree && <p className="text-sm text-red-600 mt-1">{errors.targetDegree}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Intake</label>
              <select
                value={formData.preferredIntake}
                onChange={(e) => updateField('preferredIntake', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Countries *</label>
            <Input
              value={formData.targetCountries}
              onChange={(e) => updateField('targetCountries', e.target.value)}
              placeholder="e.g., USA, Canada, UK"
              className={errors.targetCountries ? 'border-red-500' : ''}
            />
            {errors.targetCountries && <p className="text-sm text-red-600 mt-1">{errors.targetCountries}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Fields of Study *</label>
            <Input
              value={formData.targetFields}
              onChange={(e) => updateField('targetFields', e.target.value)}
              placeholder="e.g., Computer Science, Business Administration"
              className={errors.targetFields ? 'border-red-500' : ''}
            />
            {errors.targetFields && <p className="text-sm text-red-600 mt-1">{errors.targetFields}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <select
              value={formData.budgetRange}
              onChange={(e) => updateField('budgetRange', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              <option value="Under $10,000">Under $10,000</option>
              <option value="$10,000 - $25,000">$10,000 - $25,000</option>
              <option value="$25,000 - $50,000">$25,000 - $50,000</option>
              <option value="$50,000 - $100,000">$50,000 - $100,000</option>
              <option value="Over $100,000">Over $100,000</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Financial Information</CardTitle>
          <CardDescription>Your financial situation and needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Financial Need *</label>
            <select
              value={formData.financialNeed}
              onChange={(e) => updateField('financialNeed', e.target.value)}
              className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.financialNeed ? 'border-red-500' : ''}`}
            >
              <option value="">Select...</option>
              <option value="Full Scholarship Required">Full Scholarship Required</option>
              <option value="Partial Scholarship">Partial Scholarship</option>
              <option value="Self-Funded">Self-Funded</option>
              <option value="Loan Required">Loan Required</option>
            </select>
            {errors.financialNeed && <p className="text-sm text-red-600 mt-1">{errors.financialNeed}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Funding Source</label>
              <Input
                value={formData.fundingSource}
                onChange={(e) => updateField('fundingSource', e.target.value)}
                placeholder="e.g., Family, Savings, Employer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expected Funding Amount</label>
              <Input
                value={formData.expectedFunding}
                onChange={(e) => updateField('expectedFunding', e.target.value)}
                placeholder="e.g., $50,000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Additional Information</CardTitle>
          <CardDescription>Work experience, achievements, and other details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Work Experience</label>
            <Textarea
              value={formData.workExperience}
              onChange={(e) => updateField('workExperience', e.target.value)}
              rows={3}
              placeholder="Describe your work experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Research Experience</label>
            <Textarea
              value={formData.researchExperience}
              onChange={(e) => updateField('researchExperience', e.target.value)}
              rows={3}
              placeholder="Describe your research experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Publications</label>
            <Textarea
              value={formData.publications}
              onChange={(e) => updateField('publications', e.target.value)}
              rows={2}
              placeholder="List any publications..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Awards & Honors</label>
            <Textarea
              value={formData.awards}
              onChange={(e) => updateField('awards', e.target.value)}
              rows={2}
              placeholder="List any awards or honors..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Volunteer Work</label>
            <Textarea
              value={formData.volunteerWork}
              onChange={(e) => updateField('volunteerWork', e.target.value)}
              rows={2}
              placeholder="Describe your volunteer work..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Languages Spoken</label>
            <Input
              value={formData.languages}
              onChange={(e) => updateField('languages', e.target.value)}
              placeholder="e.g., English, French, Swahili"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Information</label>
            <Textarea
              value={formData.additionalInfo}
              onChange={(e) => updateField('additionalInfo', e.target.value)}
              rows={4}
              placeholder="Any additional information you'd like to share..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Emergency Contact</CardTitle>
          <CardDescription>Contact information for emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Name</label>
              <Input
                value={formData.emergencyContactName}
                onChange={(e) => updateField('emergencyContactName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <Input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Relationship</label>
            <Input
              value={formData.emergencyContactRelation}
              onChange={(e) => updateField('emergencyContactRelation', e.target.value)}
              placeholder="e.g., Parent, Sibling, Friend"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 pt-6 pb-12">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          size="lg"
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <Save className="mr-2 h-5 w-5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download as PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

