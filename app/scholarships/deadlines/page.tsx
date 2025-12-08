"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Bell,
  Filter,
  Clock,
  DollarSign,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Award,
  ArrowRight,
  Eye,
  Heart,
  Loader2,
} from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DeadlinesPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    async function fetchScholarships() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships/deadlines?days=365');
        if (!res.ok) throw new Error('Failed to fetch deadlines');
        
        const data = await res.json();
        setScholarships(data.scholarships || []);
      } catch (err) {
        console.error('Error fetching deadlines:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships;

  // Group scholarships by month
  const groupedByMonth = filteredScholarships.reduce((acc: any, scholarship) => {
    const date = new Date(scholarship.deadline);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(scholarship);
    return acc;
  }, {});

  // Sort by month
  const sortedMonths = Object.keys(groupedByMonth).sort();

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500" };
    if (days <= 60) return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "text-orange-500" };
    return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "text-green-500" };
  };

  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const exportToIcal = () => {
    alert("iCal export feature will be implemented. This will download a .ics file with all scholarship deadlines.");
  };

  const enableReminders = () => {
    alert("Email reminder feature will be implemented. You'll receive notifications 30, 14, and 7 days before each deadline.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading deadlines...</p>
        </div>
      </div>
    );
  }

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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Scholarship Deadlines
            </h1>
            <p className="text-base text-gray-600 mb-6">
              Never miss an application deadline. Track and manage all your scholarship timelines in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={exportToIcal}>
                <Download className="h-4 w-4 mr-2" />
                Export to Calendar
              </Button>
              <Button variant="outline" onClick={enableReminders}>
                <Bell className="h-4 w-4 mr-2" />
                Enable Email Reminders
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {filteredScholarships.length}
                </div>
                <div className="text-xs text-gray-600">Total Deadlines</div>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {filteredScholarships.filter(s => getDaysUntilDeadline(s.deadline) <= 30).length}
                </div>
                <div className="text-xs text-gray-600">Urgent (≤30 days)</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {filteredScholarships.filter(s => {
                    const days = getDaysUntilDeadline(s.deadline);
                    return days > 30 && days <= 60;
                  }).length}
                </div>
                <div className="text-xs text-gray-600">Soon (31-60 days)</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {filteredScholarships.filter(s => s.saved).length}
                </div>
                <div className="text-xs text-gray-600">Saved</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filter & View Controls */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant={view === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("calendar")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("list")}
              >
                <Filter className="h-4 w-4 mr-2" />
                List View
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showSavedOnly}
                  onChange={(e) => setShowSavedOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Show Saved Only</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar/List View */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {view === "calendar" ? (
              // Calendar View - Grouped by Month
              sortedMonths.map((monthYear, index) => {
                const scholarshipsInMonth = groupedByMonth[monthYear];
                return (
                  <motion.div
                    key={monthYear}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {getMonthName(monthYear)}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {scholarshipsInMonth.length} deadline{scholarshipsInMonth.length !== 1 ? 's' : ''} this month
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {scholarshipsInMonth
                        .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                        .map((scholarship: any) => {
                          const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                          const colors = getUrgencyColor(daysLeft);
                          
                          return (
                            <Card 
                              key={scholarship.id} 
                              className={`${colors.border} border-l-4 hover:shadow-lg transition-shadow`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <CardTitle className="text-base leading-tight">
                                    {scholarship.name}
                                  </CardTitle>
                                  <div className="flex gap-1">
                                    {scholarship.saved && (
                                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                    )}
                                    {scholarship.applied && (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                                <CardDescription className="text-sm">
                                  {scholarship.provider}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${colors.bg}`}>
                                  <Clock className={`h-5 w-5 ${colors.icon}`} />
                                  <div>
                                    <p className={`text-sm font-bold ${colors.text}`}>
                                      {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft} days left`}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-primary">
                                      {scholarship.currency} ${scholarship.amount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">{scholarship.country}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Link href={`/scholarships/${scholarship.id}`} className="flex-1">
                                    <Button size="sm" className="w-full" variant={scholarship.applied ? "outline" : "default"}>
                                      {scholarship.applied ? (
                                        <>
                                          <Eye className="h-4 w-4 mr-1" />
                                          View
                                        </>
                                      ) : (
                                        <>
                                          Apply Now
                                          <ArrowRight className="h-4 w-4 ml-1" />
                                        </>
                                      )}
                                    </Button>
                                  </Link>
                                  {!scholarship.applied && (
                                    <Button size="sm" variant="outline">
                                      <Bell className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // List View - All scholarships sorted by deadline
              <div className="space-y-3">
                {filteredScholarships
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .map((scholarship, index) => {
                    const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                    const colors = getUrgencyColor(daysLeft);
                    
                    return (
                      <motion.div
                        key={scholarship.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`${colors.border} border-l-4 hover:shadow-lg transition-shadow`}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              {/* Deadline */}
                              <div className={`p-3 rounded-lg ${colors.bg} text-center min-w-[120px]`}>
                                <div className={`text-2xl font-bold ${colors.text}`}>
                                  {new Date(scholarship.deadline).getDate()}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {months[new Date(scholarship.deadline).getMonth()].slice(0, 3)} {new Date(scholarship.deadline).getFullYear()}
                                </div>
                                <div className={`text-xs font-medium ${colors.text} mt-1`}>
                                  {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft} days`}
                                </div>
                              </div>

                              {/* Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 text-base">
                                    {scholarship.name}
                                  </h3>
                                  <div className="flex gap-1">
                                    {scholarship.saved && (
                                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                    )}
                                    {scholarship.applied && (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{scholarship.provider}</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-primary">
                                      {scholarship.currency} ${scholarship.amount.toLocaleString()}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    {scholarship.country}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex md:flex-col gap-2">
                                <Link href={`/scholarships/${scholarship.id}`}>
                                  <Button size="sm" variant={scholarship.applied ? "outline" : "default"}>
                                    {scholarship.applied ? (
                                      <>
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                      </>
                                    ) : (
                                      'Apply'
                                    )}
                                  </Button>
                                </Link>
                                {!scholarship.applied && (
                                  <Button size="sm" variant="outline">
                                    <Bell className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
              </div>
            )}

            {/* Empty State */}
            {filteredScholarships.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No deadlines found
                </h3>
                <p className="text-gray-600 mb-6">
                  {showSavedOnly 
                    ? "You haven't saved any scholarships yet. Browse scholarships and save the ones you're interested in."
                    : "No scholarships available at the moment."}
                </p>
                {showSavedOnly && (
                  <Button onClick={() => setShowSavedOnly(false)}>
                    Show All Deadlines
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Get Personalized Deadline Reminders
          </h2>
          <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Never miss a scholarship deadline again. Set up custom email reminders for all your applications.
          </p>
          <Button size="lg" onClick={enableReminders}>
            <Bell className="h-5 w-5 mr-2" />
            Enable Smart Reminders
          </Button>
        </div>
      </section>
    </div>
  );
}
