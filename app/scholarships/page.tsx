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
  ArrowUpDown,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

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
  
  // Additional filters
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState("all");
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState("all");
  const [coversTuition, setCoversTuition] = useState(false);
  const [coversLiving, setCoversLiving] = useState(false);
  const [noTestRequired, setNoTestRequired] = useState(false);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("deadline"); // deadline, amount, name, views
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [allCountries, setAllCountries] = useState<string[]>([]);

  // Fetch saved scholarships and all filter options on mount
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
    
    async function fetchFilterOptions() {
      try {
        // Fetch all scholarships to get unique filter values
        const res = await fetch('/api/scholarships?limit=1000');
        if (res.ok) {
          const data = await res.json();
          const allScholarships = data.scholarships || [];
          const uniqueCountries = Array.from(new Set(allScholarships.map((s: any) => s.country).filter(Boolean))) as string[];
          setAllCountries(uniqueCountries.sort());
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    }
    
    fetchSavedScholarships();
    fetchFilterOptions();
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
        if (selectedFieldOfStudy !== 'all') params.append('fieldOfStudy', selectedFieldOfStudy);
        if (selectedDegreeLevel !== 'all') params.append('degreeLevel', selectedDegreeLevel);
        if (minAmount) params.append('minAmount', minAmount);
        if (maxAmount) params.append('maxAmount', maxAmount);
        if (selectedDeadline !== 'all') params.append('deadline', selectedDeadline);
        if (coversTuition) params.append('coversTuition', 'true');
        if (coversLiving) params.append('coversLiving', 'true');
        if (noTestRequired) params.append('noTestRequired', 'true');
        params.append('page', currentPage.toString());
        params.append('limit', '12'); // 12 per page
        
        const res = await fetch(`/api/scholarships?${params}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch scholarships');
        
        const data = await res.json();
        setScholarships(data.scholarships || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalResults(data.pagination?.total || 0);
        setError("");
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError("Failed to load scholarships. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchScholarships();
  }, [searchTerm, selectedCountry, selectedType, forWomenOnly, forAfricanOnly, selectedFieldOfStudy, selectedDegreeLevel, minAmount, maxAmount, selectedDeadline, coversTuition, coversLiving, noTestRequired, currentPage]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedType, forWomenOnly, forAfricanOnly, selectedFieldOfStudy, selectedDegreeLevel, minAmount, maxAmount, selectedDeadline, coversTuition, coversLiving, noTestRequired]);

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

  // Sort scholarships client-side (or could be done server-side)
  const sortedScholarships = [...scholarships].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return (b.amount || 0) - (a.amount || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'deadline':
      default:
        const aDays = a.daysUntilDeadline ?? Infinity;
        const bDays = b.daysUntilDeadline ?? Infinity;
        return aDays - bDays;
    }
  });
  
  const filteredScholarships = sortedScholarships;
  
  const exportToCSV = () => {
    const headers = ['Name', 'Provider', 'Amount', 'Currency', 'Country', 'Deadline', 'Type', 'Link'];
    const rows = filteredScholarships.map(s => [
      s.name,
      s.provider,
      s.amount,
      s.currency,
      s.country,
      new Date(s.deadline).toLocaleDateString(),
      s.type,
      `${typeof window !== 'undefined' ? window.location.origin : ''}/scholarships/${s.id}`
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholarships-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const shareResults = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Scholarships on AILES Global',
          text: `Found ${totalResults} scholarships matching my criteria!`,
          url: url
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Countries list is now fetched on mount and stored in allCountries state

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDeadlineColor = (days: number) => {
    if (days <= 30) return "text-red-600";
    if (days <= 60) return "text-orange-600";
    return "text-gray-600";
  };

  const activeFiltersCount = [
    selectedCountry !== 'all',
    selectedType !== 'all',
    selectedDegreeLevel !== 'all',
    selectedFieldOfStudy !== 'all',
    selectedDeadline !== 'all',
    forWomenOnly,
    forAfricanOnly,
    coversTuition,
    coversLiving,
    noTestRequired,
    Boolean(minAmount),
    Boolean(maxAmount)
  ].filter(Boolean).length;

  const filtersContent = (
    <div className="bg-white rounded-lg p-6 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCountry("all");
            setSelectedType("all");
            setSelectedDegreeLevel("all");
            setSelectedFieldOfStudy("all");
            setSelectedDeadline("all");
            setForWomenOnly(false);
            setForAfricanOnly(false);
            setCoversTuition(false);
            setCoversLiving(false);
            setNoTestRequired(false);
            setMinAmount("");
            setMaxAmount("");
            setSearchTerm("");
          }}
          className="text-xs"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-5">
        {/* Country */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
          >
            <option value="all">All Countries</option>
            {allCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
            <Award className="h-4 w-4 mr-2 text-primary" />
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="FULL">Full Scholarship</option>
            <option value="PARTIAL">Partial Scholarship</option>
          </select>
        </div>

        {/* Degree Level */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
            <GraduationCap className="h-4 w-4 mr-2 text-primary" />
            Degree Level
          </label>
          <select
            value={selectedDegreeLevel}
            onChange={(e) => setSelectedDegreeLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
          >
            <option value="all">All Levels</option>
            <option value="BACHELOR">Bachelor's</option>
            <option value="MASTER">Master's</option>
            <option value="PHD">PhD</option>
            <option value="DIPLOMA">Diploma</option>
          </select>
        </div>

        {/* Field of Study */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Field of Study</label>
          <select
            value={selectedFieldOfStudy}
            onChange={(e) => setSelectedFieldOfStudy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
          >
            <option value="all">All Fields</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Business">Business</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Law">Law</option>
            <option value="Arts">Arts</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Education">Education</option>
            <option value="Science">Science</option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Deadline
          </label>
          <select
            value={selectedDeadline}
            onChange={(e) => setSelectedDeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
          >
            <option value="all">All Deadlines</option>
            <option value="upcoming">Upcoming (Open)</option>
            <option value="thisMonth">This Month</option>
            <option value="nextMonth">Next Month</option>
          </select>
        </div>

        {/* Amount Range */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            Amount Range (USD)
          </label>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Special Filters</h3>

          {/* Target Audience */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={forWomenOnly}
                onChange={(e) => setForWomenOnly(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2 text-gray-700">For Women Only</span>
            </label>
            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={forAfricanOnly}
                onChange={(e) => setForAfricanOnly(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2 text-gray-700">For Africans Only</span>
            </label>
          </div>

          {/* Coverage Benefits */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={coversTuition}
                onChange={(e) => setCoversTuition(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700">Covers Tuition</span>
            </label>
            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={coversLiving}
                onChange={(e) => setCoversLiving(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700">Covers Living</span>
            </label>
          </div>

          {/* Test Requirements */}
          <div className="space-y-2">
            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={noTestRequired}
                onChange={(e) => setNoTestRequired(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">No IELTS/TOEFL/GRE</span>
            </label>
          </div>
        </div>

        {/* Active Filters Count */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ✓ Filters Applied
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="bg-primary-light py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Browse 800+ Scholarships for African Students
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

      {/* Main Content with Sidebar */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:col-span-1"
            >
              {filtersContent}
            </motion.div>

            {/* Right Content Area */}
            <div className="lg:col-span-3">
              {/* Mobile Filters Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="w-full flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </span>
                  <span className="text-xs text-gray-500">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} applied` : "None"}
                  </span>
                </Button>

                {showFilters && (
                  <div className="mt-4">
                    {filtersContent}
                  </div>
                )}
              </div>
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {totalResults} Scholarships Found
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {loading ? "Loading..." : "Ready to explore"}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="deadline">Sort by Deadline</option>
                      <option value="amount">Sort by Amount</option>
                      <option value="name">Sort by Name</option>
                      <option value="views">Sort by Popularity</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareResults}
                  title="Share results"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link href="/scholarships/match">
                  <Button size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    AI Match
                  </Button>
                </Link>
              </div>

              {/* Scholarship Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredScholarships.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No scholarships found matching your filters.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap">
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
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
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
                            {scholarship.currency} {scholarship.amount ? scholarship.amount.toLocaleString() : 'N/A'}
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
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Award className="h-3 w-3 text-primary" />
                          <span className="font-medium">{scholarship.numberOfAwards || 'Multiple'} awards</span>
                          {scholarship.degreeLevel && scholarship.degreeLevel.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{scholarship.degreeLevel.slice(0, 2).join(', ')}</span>
                            </>
                          )}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-600 ml-4">
                Page {currentPage} of {totalPages}
              </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
      <EmailCapturePopup />
    </div>
  );
}



