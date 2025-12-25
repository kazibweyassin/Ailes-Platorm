"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  DollarSign,
  GraduationCap,
  MapPin,
  Search,
  X,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  TrendingUp,
  Clock,
  AlertCircle,
  Target,
  Globe,
  Loader2,
} from "lucide-react";

export default function ComparePage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchScholarships() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships');
        if (!res.ok) throw new Error('Failed to fetch scholarships');
        
        const data = await res.json();
        setScholarships(data.scholarships || []);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScholarships();
  }, []);

  const availableScholarships = scholarships.filter(
    (s) => !selectedScholarships.includes(s.id)
  );

  const filteredAvailable = availableScholarships.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const compareScholarships = scholarships.filter((s) =>
    selectedScholarships.includes(s.id)
  );

  const addScholarship = (id: string) => {
    if (selectedScholarships.length < 5) {
      setSelectedScholarships([...selectedScholarships, id]);
    }
  };

  const removeScholarship = (id: string) => {
    setSelectedScholarships(selectedScholarships.filter((s) => s !== id));
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getWinner = () => {
    if (compareScholarships.length === 0) return null;
    
    // Calculate scores based on multiple factors
    const scores = compareScholarships.map((s) => {
      let score = 0;
      score += s.totalValue / 1000; // Value in thousands
      score += s.successRate * 5; // Success rate weight
      score += s.coversTuition ? 10 : 0;
      score += s.coversAccommodation ? 8 : 0;
      score += s.coversTravel ? 5 : 0;
      score += s.monthlyStipend / 100;
      score -= (100 - getDaysUntilDeadline(s.deadline)) / 30; // Time pressure
      return { id: s.id, score, scholarship: s };
    });
    
    scores.sort((a, b) => b.score - a.score);
    return scores[0];
  };

  const winner = getWinner();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert("Export to PDF/CSV feature will be implemented. This will download a comparison report.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-light py-12 print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-4">
              <Target className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Compare Scholarships
            </h1>
            <p className="text-base text-gray-600 mb-6">
              Compare up to 5 scholarships side-by-side to find the best match for you
            </p>

            {/* Selected Count */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm text-gray-600">
                Selected: {selectedScholarships.length}/5
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Select Section */}
      {selectedScholarships.length < 5 && (
        <section className="py-8 bg-white border-b print:hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add Scholarships to Compare
              </h2>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Available Scholarships */}
              <div className="grid md:grid-cols-3 gap-4">
                {filteredAvailable.slice(0, 6).map((scholarship) => (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm leading-tight">
                        {scholarship.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {scholarship.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-primary" />
                          <span className="font-bold text-primary">
                            {scholarship.currency} ${scholarship.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600">{scholarship.country}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => addScholarship(scholarship.id)}
                      >
                        Add to Compare
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {compareScholarships.length > 0 ? (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
                <h2 className="text-xl font-bold text-gray-900">
                  Comparison Results
                </h2>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Winner Banner */}
              {winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6"
                >
                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            Best Overall Match
                          </h3>
                          <p className="text-sm text-gray-700">
                            {winner.scholarship.name} - {winner.scholarship.provider}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b w-48">
                        Criteria
                      </th>
                      {compareScholarships.map((scholarship) => (
                        <th
                          key={scholarship.id}
                          className="p-4 text-left border-b border-l relative"
                        >
                          <div className="pr-8">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1">
                              {scholarship.name}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {scholarship.provider}
                            </p>
                            {winner?.id === scholarship.id && (
                              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full mt-2">
                                <Award className="h-3 w-3" />
                                Best Match
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeScholarship(scholarship.id)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded print:hidden"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Funding */}
                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          Award Amount
                        </div>
                      </td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          <span className="font-bold text-primary">
                            {s.currency} ${s.amount.toLocaleString()}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Type</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            s.type === 'FULL' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {s.type}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Location */}
                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Country
                        </div>
                      </td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.country}
                        </td>
                      ))}
                    </tr>

                    {/* Deadline */}
                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Deadline
                        </div>
                      </td>
                      {compareScholarships.map((s) => {
                        const days = getDaysUntilDeadline(s.deadline);
                        return (
                          <td key={s.id} className="p-4 border-l text-sm">
                            <div>
                              <div className="font-medium">
                                {new Date(s.deadline).toLocaleDateString()}
                              </div>
                              <div className={`text-xs ${
                                days <= 30 ? 'text-red-600' : days <= 60 ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {days} days left
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Academic Requirements */}
                    <tr className="border-b bg-gray-50">
                      <td colSpan={compareScholarships.length + 1} className="p-3 font-bold text-sm">
                        Academic Requirements
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          Degree Level
                        </div>
                      </td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.degreeLevel.join(", ")}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Minimum GPA</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.minGPA}/4.0
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Work Experience</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.workExperience}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Age Limit</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.ageLimit ? `${s.ageLimit} years` : "No limit"}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Language Test</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.languageTest}
                        </td>
                      ))}
                    </tr>

                    {/* Coverage */}
                    <tr className="border-b bg-gray-50">
                      <td colSpan={compareScholarships.length + 1} className="p-3 font-bold text-sm">
                        What's Covered
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Tuition Fees</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.coversTuition ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Accommodation</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.coversAccommodation ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Meals/Food</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.coversMeals ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Travel/Flights</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.coversTravel ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">Monthly Stipend</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.monthlyStipend > 0 ? (
                            <span className="font-semibold text-primary">
                              ${s.monthlyStipend}
                            </span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Success Stats */}
                    <tr className="border-b bg-gray-50">
                      <td colSpan={compareScholarships.length + 1} className="p-3 font-bold text-sm">
                        Success Statistics
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Success Rate
                        </div>
                      </td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          <span className={`font-bold ${
                            s.successRate >= 10 ? 'text-green-600' : s.successRate >= 5 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {s.successRate}%
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Processing Time
                        </div>
                      </td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.avgProcessingTime}
                        </td>
                      ))}
                    </tr>

                    {/* Special Eligibility */}
                    <tr className="border-b bg-gray-50">
                      <td colSpan={compareScholarships.length + 1} className="p-3 font-bold text-sm">
                        Special Eligibility
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">For Women</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.forWomen ? (
                            <CheckCircle2 className="h-5 w-5 text-pink-500" />
                          ) : (
                            <span className="text-gray-400">All</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-sm bg-gray-50">For Africans</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l text-sm">
                          {s.forAfrican ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-gray-400">All</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Actions */}
                    <tr>
                      <td className="p-4 font-medium text-sm bg-gray-50">Actions</td>
                      {compareScholarships.map((s) => (
                        <td key={s.id} className="p-4 border-l">
                          <div className="space-y-2">
                            <Link href={`/scholarships/${s.id}`} className="block">
                              <Button size="sm" className="w-full">
                                View Details
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="w-full print:hidden">
                              Apply Now
                            </Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Clear All */}
              <div className="mt-6 text-center print:hidden">
                <Button
                  variant="outline"
                  onClick={() => setSelectedScholarships([])}
                >
                  Clear All & Start Over
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Empty State */
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Target className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Scholarships Selected
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Select at least 2 scholarships from the list above to start comparing
            </p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-primary-light print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Need Help Choosing?
          </h2>
          <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Our AI can analyze your profile and recommend the best scholarships for you
          </p>
          <Link href="/scholarships/match">
            <Button size="lg">
              <Award className="h-5 w-5 mr-2" />
              Get AI Recommendations
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
