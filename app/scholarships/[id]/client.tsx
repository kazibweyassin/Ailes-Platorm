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

export function ScholarshipDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [similarScholarships, setSimilarScholarships] = useState<any[]>([]);

  useEffect(() => {
    async function fetchScholarship() {
      try {
        setLoading(true);
        // Use absolute URL in production to avoid routing issues
        const baseUrl = typeof window !== 'undefined' 
          ? window.location.origin 
          : '';
        const apiUrl = `${baseUrl}/api/scholarships/${encodeURIComponent(id)}`;
        
        const res = await fetch(apiUrl, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          // Ensure we don't follow redirects that might return HTML
          redirect: 'error'
        });
        
        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response received:");
          console.error("Status:", res.status);
          console.error("Status Text:", res.statusText);
          console.error("Response Preview:", text.substring(0, 500));
          console.error("Full URL:", res.url);
          throw new Error(`Invalid response format. Expected JSON but got ${contentType || 'unknown'}. Status: ${res.status}`);
        }
        
        if (!res.ok) {
          let errorData;
          try {
            const text = await res.text();
            console.error("Error response text:", text);
            errorData = JSON.parse(text);
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            errorData = { error: `Request failed with status ${res.status}: ${res.statusText}` };
          }
          console.error("Error data:", errorData);
          throw new Error(errorData.error || `Scholarship not found (${res.status})`);
        }
        
        const data = await res.json();
        
        if (!data || !data.scholarship) {
          throw new Error('Scholarship data not found in response');
        }
        
        setScholarship(data.scholarship);
        setError(""); // Clear any previous errors

        // Fetch similar scholarships (same country or field) - don't block on this
        fetch(`${baseUrl}/api/scholarships?country=${encodeURIComponent(data.scholarship.country || '')}&limit=3`)
          .then(res => res.ok ? res.json() : null)
          .then(similarData => {
            if (similarData?.scholarships) {
              const filtered = similarData.scholarships.filter((s: any) => s.id !== id).slice(0, 3);
              setSimilarScholarships(filtered);
            }
          })
          .catch(err => console.warn('Failed to fetch similar scholarships:', err));

        // Check if already saved - don't block on this, handle HTML responses
        fetch(`${baseUrl}/api/saved/scholarships`, {
          headers: {
            'Accept': 'application/json',
          }
        })
          .then(async res => {
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              // Not authenticated or error - silently fail
              return null;
            }
            return res.ok ? res.json() : null;
          })
          .then(savedData => {
            if (savedData?.scholarships) {
              const saved = savedData.scholarships.some((s: any) => s.id === id);
              setIsSaved(saved);
            }
          })
          .catch(() => {
            // Silently fail - user might not be logged in
          });
      } catch (err: any) {
        console.error('Error in fetchScholarship:', err);
        setError(err.message || 'Failed to load scholarship');
        setScholarship(null);
      } finally {
        setLoading(false);
        console.log('Loading set to false, scholarship:', scholarship ? scholarship.name : 'null');
      }
    }
    fetchScholarship();
  }, [id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/saved/scholarships', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth/signin?callbackUrl=/scholarships/${id}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Scholarship</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/scholarships">
            <Button>Browse Scholarships</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-600 mb-6">This scholarship does not exist.</p>
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
                    {scholarship.currency} ${scholarship.amount?.toLocaleString()}
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
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs font-medium">Country</span>
                  </div>
                  <p className="text-lg font-bold">{scholarship.country}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-xs font-medium">Degree Level</span>
                  </div>
                  <p className="text-lg font-bold">{scholarship.degreeLevel?.join(", ") || "All"}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6">
                {scholarship.applicationLink && (
                  <Button size="lg" className="flex-1 md:flex-none" asChild>
                    <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </a>
                  </Button>
                )}
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
                {scholarship.website && (
                  <Button size="lg" variant="outline" asChild>
                    <a href={scholarship.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
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
                    <p className="text-gray-700 leading-relaxed">{scholarship.description}</p>
                    {scholarship.eligibility && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Eligibility</h4>
                        <p className="text-gray-700">{scholarship.eligibility}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Coverage Details */}
              {(scholarship.coversTuition || scholarship.coversLiving || scholarship.coversTravel || scholarship.coversBooks) && (
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
                        {scholarship.coversTuition && (
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Tuition Fees</p>
                              <p className="text-sm text-gray-600">Full or partial coverage</p>
                            </div>
                          </div>
                        )}
                        {scholarship.coversLiving && (
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Living Expenses</p>
                              <p className="text-sm text-gray-600">Monthly stipend included</p>
                            </div>
                          </div>
                        )}
                        {scholarship.coversTravel && (
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Travel Costs</p>
                              <p className="text-sm text-gray-600">Flight tickets covered</p>
                            </div>
                          </div>
                        )}
                        {scholarship.coversBooks && (
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Books & Materials</p>
                              <p className="text-sm text-gray-600">Study materials provided</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scholarship.minGPA && (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">
                            Minimum GPA: {scholarship.minGPA}/4.0
                          </p>
                        </div>
                      )}
                      {scholarship.requiresIELTS && scholarship.minIELTS && (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">
                            IELTS: Minimum {scholarship.minIELTS}
                          </p>
                        </div>
                      )}
                      {scholarship.requiresTOEFL && scholarship.minTOEFL && (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">
                            TOEFL: Minimum {scholarship.minTOEFL}
                          </p>
                        </div>
                      )}
                      {scholarship.maxAge && (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">
                            Maximum Age: {scholarship.maxAge} years
                          </p>
                        </div>
                      )}
                    </div>
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
                    {scholarship.applicationLink && (
                      <Button className="w-full" size="lg" asChild>
                        <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </a>
                      </Button>
                    )}
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
                      <p className="text-gray-900">{scholarship.degreeLevel?.join(", ") || "All"}</p>
                    </div>
                    {scholarship.fieldOfStudy && scholarship.fieldOfStudy.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <BookOpen className="h-4 w-4" />
                          <span className="font-medium">Fields of Study</span>
                        </div>
                        <p className="text-gray-900">{scholarship.fieldOfStudy.join(", ")}</p>
                      </div>
                    )}
                    {scholarship.minGPA && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-medium">Minimum GPA</span>
                        </div>
                        <p className="text-gray-900">{scholarship.minGPA}/4.0</p>
                      </div>
                    )}
                    {scholarship.website && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">Website</span>
                        </div>
                        <a href={scholarship.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Visit Official Site
                        </a>
                      </div>
                    )}
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
                          <span className="font-bold">{sim.currency} ${sim.amount?.toLocaleString()}</span>
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
