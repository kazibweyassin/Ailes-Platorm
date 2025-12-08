"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  DollarSign,
  Globe,
  GraduationCap,
  Heart,
  MapPin,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Info,
  Loader2,
} from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ScholarshipDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [similarScholarships, setSimilarScholarships] = useState<any[]>([]);

  useEffect(() => {
    async function fetchScholarship() {
      try {
        setLoading(true);
        const res = await fetch(`/api/scholarships/${params.id}`);
        if (!res.ok) throw new Error('Scholarship not found');
        
        const data = await res.json();
        setScholarship(data.scholarship);

        // Fetch similar scholarships (same country or field)
        const similarRes = await fetch(`/api/scholarships?country=${data.scholarship.country}&limit=3`);
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          const filtered = (similarData.scholarships || []).filter((s: any) => s.id !== params.id).slice(0, 3);
          setSimilarScholarships(filtered);
        }

        // Check if already saved
        const savedRes = await fetch('/api/saved/scholarships');
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          const saved = savedData.scholarships?.some((s: any) => s.id === params.id);
          setIsSaved(saved);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchScholarship();
  }, [params.id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/saved/scholarships', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: params.id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth/signin?callbackUrl=/scholarships/${params.id}`);
          return;
        }
        throw new Error('Failed to save scholarship');
      }

      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error saving scholarship:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scholarshipId: params.id,
          status: 'IN_PROGRESS'
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth/signin?callbackUrl=/scholarships/${params.id}`);
          return;
        }
        const data = await res.json();
        if (data.error === 'Application already exists') {
          alert('You have already started an application for this scholarship');
          return;
        }
        throw new Error('Failed to create application');
      }

      alert('Application started! Track your progress in the dashboard.');
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating application:', err);
      alert('Failed to start application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This scholarship does not exist.'}</p>
          <Link href="/scholarships">
            <Button>Browse Scholarships</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = getDaysUntilDeadline(scholarship.deadline);

  const getDeadlineColor = () => {
    if (daysLeft <= 30) return "text-red-600 bg-red-50";
    if (daysLeft <= 60) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getEligibilityProgress = () => {
    const met = scholarship.eligibilityRequirements.filter((req: any) => req.met).length;
    const total = scholarship.eligibilityRequirements.length;
    return Math.round((met / total) * 100);
  };

  const eligibilityProgress = getEligibilityProgress();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/scholarships" className="hover:text-primary">
                Scholarships
              </Link>
              <span>/</span>
              <span className="text-gray-900">{scholarship.name}</span>
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scholarship.featured && (
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        Featured
                      </span>
                    )}
                    {scholarship.forWomen && (
                      <span className="text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
                        For Women
                      </span>
                    )}
                    {scholarship.forAfrican && (
                      <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                        For Africans
                      </span>
                    )}
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {scholarship.type} Scholarship
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {scholarship.name}
                  </h1>
                  <p className="text-base text-gray-600 mb-4">{scholarship.provider}</p>
                  <p className="text-sm text-gray-700">{scholarship.description}</p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs font-medium">Award Amount</span>
                  </div>
                  <p className="text-lg font-bold">
                    {scholarship.currency} ${scholarship.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs font-medium">Deadline</span>
                  </div>
                  <p className="text-lg font-bold">{daysLeft} days</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Users className="h-5 w-5" />
                    <span className="text-xs font-medium">Applicants</span>
                  </div>
                  <p className="text-lg font-bold">{scholarship.applications}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-xs font-medium">Success Rate</span>
                  </div>
                  <p className="text-lg font-bold">{scholarship.successRate}%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6">
                <Button 
                  size="lg" 
                  className="flex-1 md:flex-none"
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting Application...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 md:flex-none"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                  )}
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Deadline Alert */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className={`border-l-4 ${daysLeft <= 30 ? 'border-l-red-500' : daysLeft <= 60 ? 'border-l-orange-500' : 'border-l-green-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getDeadlineColor()}`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Application Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {daysLeft <= 30 ? '⚠️ Urgent: ' : daysLeft <= 60 ? '⏰ Soon: ' : '✅ Time remaining: '}
                          Only {daysLeft} days left to submit your application
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* About Scholarship */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      About This Scholarship
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">{scholarship.longDescription}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Coverage Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      What's Covered
                    </CardTitle>
                    <CardDescription>This scholarship includes the following benefits:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(scholarship.coverageDetails).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm text-gray-600">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Eligibility Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Eligibility Requirements
                    </CardTitle>
                    <CardDescription>
                      Your profile matches {eligibilityProgress}% of requirements
                    </CardDescription>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${eligibilityProgress >= 80 ? 'bg-green-500' : eligibilityProgress >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${eligibilityProgress}%` }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scholarship.eligibilityRequirements.map((req: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          {req.met ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          )}
                          <p className={`text-sm ${req.met ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                            {req.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Application Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Required Documents
                    </CardTitle>
                    <CardDescription>Prepare these documents for your application:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {scholarship.applicationRequirements.map((req: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{req}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Application Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Application Process
                    </CardTitle>
                    <CardDescription>Step-by-step guide to applying:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scholarship.applicationProcess.map((step: any, index: number) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                              {step.step}
                            </div>
                            {index < scholarship.applicationProcess.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                            <p className="text-xs text-primary font-medium">Deadline: {step.deadline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Award className="h-5 w-5" />
                      Pro Tips for Success
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scholarship.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-700">💡</span>
                          </div>
                          <p className="text-sm text-gray-800">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" size="lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Info PDF
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/scholarships/compare">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Compare Scholarships
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Key Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Country</span>
                      </div>
                      <p className="text-gray-900">{scholarship.country}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <GraduationCap className="h-4 w-4" />
                        <span className="font-medium">Degree Level</span>
                      </div>
                      <p className="text-gray-900">{scholarship.degreeLevel.join(", ")}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium">Fields of Study</span>
                      </div>
                      <p className="text-gray-900">{scholarship.fieldOfStudy.join(", ")}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">Minimum GPA</span>
                      </div>
                      <p className="text-gray-900">{scholarship.minGPA}/4.0</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">Views</span>
                      </div>
                      <p className="text-gray-900">{scholarship.views.toLocaleString()} students viewed</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Partner Universities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Partner Universities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {scholarship.partnerUniversities.map((uni: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-gray-700">{uni}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Scholarships */}
      {similarScholarships.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Scholarships</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {similarScholarships.map((sim: any) => (
                  <Card key={sim.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base leading-tight">{sim.name}</CardTitle>
                      <CardDescription className="text-sm">{sim.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-bold">{sim.currency} ${sim.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{getDaysUntilDeadline(sim.deadline)} days left</span>
                        </div>
                      </div>
                      <Link href={`/scholarships/${sim.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Need Help With Your Application?
          </h2>
          <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Our expert team can help you craft a winning scholarship application
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/services">
              <Button size="lg">
                View Our Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
