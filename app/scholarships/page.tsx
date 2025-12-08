"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  DollarSign,
  Globe,
  GraduationCap,
  Heart,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Mock scholarship data
const mockScholarships = [
  {
    id: "1",
    name: "Mastercard Foundation Scholars Program",
    provider: "Mastercard Foundation",
    amount: 100000,
    currency: "USD",
    type: "FULL",
    deadline: "2025-03-31",
    country: "USA",
    description: "Full scholarship for African students pursuing undergraduate or postgraduate studies in the US.",
    forWomen: true,
    forAfrican: true,
    fieldOfStudy: ["Computer Science", "Engineering", "Business"],
    degreeLevel: ["MASTER", "PHD"],
    minGPA: 3.5,
    featured: true,
    views: 15420,
    applications: 342,
  },
  {
    id: "2",
    name: "Chevening Scholarships",
    provider: "UK Government",
    amount: 45000,
    currency: "GBP",
    type: "FULL",
    deadline: "2025-11-02",
    country: "UK",
    description: "UK government's international awards program for future leaders to pursue one-year master's degrees.",
    forWomen: false,
    forAfrican: false,
    fieldOfStudy: ["Any"],
    degreeLevel: ["MASTER"],
    minGPA: 3.0,
    featured: true,
    views: 23150,
    applications: 567,
  },
  {
    id: "3",
    name: "DAAD Scholarships",
    provider: "German Academic Exchange Service",
    amount: 30000,
    currency: "EUR",
    type: "FULL",
    deadline: "2025-04-30",
    country: "Germany",
    description: "Support for international students to pursue postgraduate studies in Germany.",
    forWomen: false,
    forAfrican: false,
    fieldOfStudy: ["Engineering", "Science", "Technology"],
    degreeLevel: ["MASTER", "PHD"],
    minGPA: 3.2,
    featured: false,
    views: 18700,
    applications: 423,
  },
  {
    id: "4",
    name: "African Women in STEM Scholarship",
    provider: "Google.org",
    amount: 50000,
    currency: "USD",
    type: "PARTIAL",
    deadline: "2025-02-15",
    country: "USA",
    description: "Supporting African women pursuing degrees in Science, Technology, Engineering, and Mathematics.",
    forWomen: true,
    forAfrican: true,
    fieldOfStudy: ["Computer Science", "Engineering", "Mathematics", "Physics"],
    degreeLevel: ["BACHELOR", "MASTER"],
    minGPA: 3.3,
    featured: true,
    views: 12340,
    applications: 289,
  },
  {
    id: "5",
    name: "Mandela Rhodes Scholarships",
    provider: "Mandela Rhodes Foundation",
    amount: 25000,
    currency: "USD",
    type: "FULL",
    deadline: "2025-03-01",
    country: "South Africa",
    description: "For African students demonstrating leadership and academic excellence.",
    forWomen: false,
    forAfrican: true,
    fieldOfStudy: ["Any"],
    degreeLevel: ["BACHELOR", "MASTER"],
    minGPA: 3.5,
    featured: false,
    views: 9870,
    applications: 156,
  },
  {
    id: "6",
    name: "Gates Cambridge Scholarship",
    provider: "Bill & Melinda Gates Foundation",
    amount: 60000,
    currency: "GBP",
    type: "FULL",
    deadline: "2025-12-05",
    country: "UK",
    description: "For outstanding applicants from outside the UK to pursue postgraduate study at Cambridge.",
    forWomen: false,
    forAfrican: false,
    fieldOfStudy: ["Any"],
    degreeLevel: ["MASTER", "PHD"],
    minGPA: 3.7,
    featured: true,
    views: 28900,
    applications: 634,
  },
  {
    id: "7",
    name: "Fulbright Foreign Student Program",
    provider: "US Government",
    amount: 55000,
    currency: "USD",
    type: "FULL",
    deadline: "2025-05-15",
    country: "USA",
    description: "Enables graduate students from abroad to study and conduct research in the United States.",
    forWomen: false,
    forAfrican: false,
    fieldOfStudy: ["Any"],
    degreeLevel: ["MASTER", "PHD"],
    minGPA: 3.4,
    featured: true,
    views: 31200,
    applications: 721,
  },
  {
    id: "8",
    name: "Commonwealth Scholarships",
    provider: "Commonwealth Scholarship Commission",
    amount: 40000,
    currency: "GBP",
    type: "FULL",
    deadline: "2025-12-15",
    country: "UK",
    description: "For students from low and middle-income Commonwealth countries to pursue Master's and PhD studies.",
    forWomen: false,
    forAfrican: false,
    fieldOfStudy: ["Any"],
    degreeLevel: ["MASTER", "PHD"],
    minGPA: 3.0,
    featured: false,
    views: 19400,
    applications: 445,
  },
];

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [forWomenOnly, setForWomenOnly] = useState(false);
  const [forAfricanOnly, setForAfricanOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);

  // Fetch saved scholarships on mount
  useEffect(() => {
    async function fetchSavedScholarships() {
      try {
        const res = await fetch('/api/saved/scholarships');
        if (res.ok) {
          const data = await res.json();
          const ids = new Set<string>(data.scholarships?.map((s: any) => s.id) || []);
          setSavedScholarshipIds(ids);
        }
      } catch (err) {
        // Silently fail - user might not be logged in
      }
    }
    fetchSavedScholarships();
  }, []);

  useEffect(() => {
    async function fetchScholarships() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCountry !== 'all') params.append('country', selectedCountry);
        if (selectedType !== 'all') params.append('type', selectedType);
        if (forWomenOnly) params.append('forWomen', 'true');
        if (forAfricanOnly) params.append('forAfrican', 'true');
        
        const res = await fetch(`/api/scholarships?${params}`);
        if (!res.ok) throw new Error('Failed to fetch scholarships');
        
        const data = await res.json();
        setScholarships(data.scholarships || []);
        setError("");
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError("Failed to load scholarships. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchScholarships();
  }, [searchTerm, selectedCountry, selectedType, forWomenOnly, forAfricanOnly]);

  const toggleSave = async (scholarshipId: string) => {
    try {
      setSavingId(scholarshipId);
      const isSaved = savedScholarshipIds.has(scholarshipId);
      
      const res = await fetch('/api/saved/scholarships', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/auth/signin?callbackUrl=/scholarships';
          return;
        }
        throw new Error('Failed to save scholarship');
      }

      // Update local state
      const newSaved = new Set(savedScholarshipIds);
      if (isSaved) {
        newSaved.delete(scholarshipId);
      } else {
        newSaved.add(scholarshipId);
      }
      setSavedScholarshipIds(newSaved);
    } catch (err) {
      console.error('Error saving scholarship:', err);
    } finally {
      setSavingId(null);
    }
  };

  const filteredScholarships = scholarships;

  const countries = Array.from(new Set(scholarships.map((s) => s.country).filter(Boolean)));

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDeadlineColor = (days: number) => {
    if (days <= 30) return "text-red-600";
    if (days <= 60) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Browse 500+ Scholarships
            </h1>
            <p className="text-base text-gray-600 mb-6">
              Find fully-funded opportunities for your study abroad journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search scholarships by name or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredScholarships.length} Scholarships Found
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <Link href="/scholarships/match">
              <Button>
                <Award className="h-4 w-4 mr-2" />
                AI Match Me
              </Button>
            </Link>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="FULL">Full Scholarship</option>
                    <option value="PARTIAL">Partial Scholarship</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Special Filters
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={forWomenOnly}
                        onChange={(e) => setForWomenOnly(e.target.checked)}
                        className="mr-2"
                      />
                      For Women Only
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={forAfricanOnly}
                        onChange={(e) => setForAfricanOnly(e.target.checked)}
                        className="mr-2"
                      />
                      For Africans Only
                    </label>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCountry("all");
                      setSelectedType("all");
                      setForWomenOnly(false);
                      setForAfricanOnly(false);
                      setSearchTerm("");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scholarship Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship, index) => {
              const daysLeft = getDaysUntilDeadline(scholarship.deadline);
              const deadlineColor = getDeadlineColor(daysLeft);

              return (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg leading-tight">
                          {scholarship.name}
                        </CardTitle>
                        {scholarship.featured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap">
                            Featured
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {scholarship.provider}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {scholarship.forWomen && (
                          <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                            Women
                          </span>
                        )}
                        {scholarship.forAfrican && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            African
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {scholarship.type}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {scholarship.description}
                      </p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-bold text-primary">
                            {scholarship.currency} ${scholarship.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{scholarship.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className={`h-4 w-4 ${deadlineColor}`} />
                          <span className={deadlineColor}>
                            {daysLeft} days left
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{scholarship.views.toLocaleString()} views</span>
                          <span>•</span>
                          <span>{scholarship.applications} applications</span>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => toggleSave(scholarship.id)}
                          disabled={savingId === scholarship.id}
                        >
                          <Heart 
                            className={`h-4 w-4 mr-1 ${savedScholarshipIds.has(scholarship.id) ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                          {savedScholarshipIds.has(scholarship.id) ? 'Saved' : 'Save'}
                        </Button>
                        <Link href={`/scholarships/${scholarship.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            View
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredScholarships.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No scholarships found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search term
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCountry("all");
                  setSelectedType("all");
                  setForWomenOnly(false);
                  setForAfricanOnly(false);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Let AI Find Your Best Matches
          </h2>
          <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Our AI analyzes your profile and matches you with scholarships you're most likely to win
          </p>
          <Link href="/scholarships/match">
            <Button size="lg">
              <Award className="h-5 w-5 mr-2" />
              Get AI-Matched Scholarships
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}


