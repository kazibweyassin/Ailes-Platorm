"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  Settings,
  Target,
  TrendingUp,
  User,
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react";

interface DashboardStats {
  savedScholarships: number;
  applications: number;
  upcomingDeadlines: number;
  matchScore: number;
}

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  currency: string;
  deadline: string;
  matchScore?: number;
}

interface Application {
  id: string;
  scholarshipId: string;
  status: string;
  appliedAt: string;
  scholarship?: Scholarship;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<DashboardStats>({
    savedScholarships: 0,
    applications: 0,
    upcomingDeadlines: 0,
    matchScore: 0,
  });
  
  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Wait for session check
    if (status === "unauthenticated") {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return; // Wait for auth
    
    fetchDashboardData();
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [savedRes, deadlinesRes, matchRes, applicationsRes] = await Promise.all([
        fetch('/api/saved/scholarships').catch(() => null),
        fetch('/api/scholarships/deadlines').catch(() => null),
        fetch('/api/scholarships/match').catch(() => null),
        fetch('/api/applications').catch(() => null),
      ]);

      // Process saved scholarships
      if (savedRes?.ok) {
        const savedData = await savedRes.json();
        setSavedScholarships(savedData.scholarships || []);
      }

      // Process deadlines
      if (deadlinesRes?.ok) {
        const deadlinesData = await deadlinesRes.json();
        const upcoming = (deadlinesData.scholarships || [])
          .filter((s: any) => {
            const daysLeft = Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return daysLeft > 0 && daysLeft <= 90;
          })
          .map((s: any) => {
            const daysLeft = Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return {
              id: s.id,
              scholarship: s.name,
              deadline: s.deadline,
              daysLeft,
              status: daysLeft <= 30 ? 'urgent' : daysLeft <= 60 ? 'soon' : 'normal',
            };
          })
          .sort((a: any, b: any) => a.daysLeft - b.daysLeft)
          .slice(0, 3);
        setUpcomingDeadlines(upcoming);
      }

      // Process match data
      let matchScore = 0;
      if (matchRes?.ok) {
        const matchData = await matchRes.json();
        if (matchData.matches && matchData.matches.length > 0) {
          matchScore = Math.round(
            matchData.matches.reduce((sum: number, m: any) => sum + m.matchScore, 0) / 
            matchData.matches.length
          );
        }
      }

      // Process applications
      if (applicationsRes?.ok) {
        const appsData = await applicationsRes.json();
        setApplications(appsData.applications || []);
      }

      // Update stats
      setStats({
        savedScholarships: savedScholarships.length || 0,
        applications: applications.length || 0,
        upcomingDeadlines: upcomingDeadlines.length || 0,
        matchScore: matchScore || 85,
      });

      // Generate recent activity
      const activity = [];
      if (savedScholarships.length > 0) {
        activity.push({
          id: 1,
          type: "saved",
          title: savedScholarships[0].name,
          date: "Recently",
          icon: Heart,
        });
      }
      if (applications.length > 0) {
        activity.push({
          id: 2,
          type: "applied",
          title: applications[0].scholarship?.name || "Application submitted",
          date: new Date(applications[0].appliedAt).toLocaleDateString(),
          icon: CheckCircle2,
        });
      }
      if (upcomingDeadlines.length > 0) {
        activity.push({
          id: 3,
          type: "deadline",
          title: `${upcomingDeadlines[0].scholarship} deadline in ${upcomingDeadlines[0].daysLeft} days`,
          date: "Upcoming",
          icon: Clock,
        });
      }
      setRecentActivity(activity);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, Student! 👋
          </h1>
          <p className="text-sm text-gray-600">
            Your scholarship-first dashboard - Find funding, then find your university
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Saved Scholarships
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.savedScholarships}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Applications
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.applications}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Upcoming Deadlines
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.upcomingDeadlines}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Match Score
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.matchScore}%
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                        <CardDescription>
                          Don't miss these opportunities
                        </CardDescription>
                      </div>
                      <Link href="/scholarships/deadlines">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {upcomingDeadlines.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingDeadlines.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {item.scholarship}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                Deadline: {new Date(item.deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-base font-bold ${
                                  item.status === "urgent"
                                    ? "text-red-600"
                                    : item.status === "soon"
                                    ? "text-orange-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {item.daysLeft} days
                              </p>
                              <p className="text-xs text-gray-500">remaining</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No upcoming deadlines</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Saved Scholarships */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Saved Scholarships</CardTitle>
                        <CardDescription>
                          Your bookmarked opportunities
                        </CardDescription>
                      </div>
                      <Link href="/dashboard/saved">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {savedScholarships.length > 0 ? (
                      <div className="space-y-4">
                        {savedScholarships.slice(0, 2).map((scholarship) => (
                          <div
                            key={scholarship.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {scholarship.name}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {scholarship.provider}
                                </p>
                              </div>
                              {scholarship.matchScore && (
                                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                  <Target className="h-3 w-3" />
                                  {scholarship.matchScore}% match
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="font-semibold text-primary">
                                  {scholarship.currency} ${scholarship.amount.toLocaleString()}
                                </span>
                                <span>
                                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                </span>
                              </div>
                              <Link href={`/scholarships/${scholarship.id}`}>
                                <Button size="sm">View Details</Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No saved scholarships yet</p>
                        <Link href="/scholarships">
                          <Button size="sm" className="mt-4">
                            Browse Scholarships
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/scholarships/match">
                      <Button className="w-full justify-start bg-primary text-white hover:bg-primary/90">
                        <Target className="mr-2 h-4 w-4" />
                        AI Scholarship Match
                      </Button>
                    </Link>
                    <Link href="/scholarships/deadlines">
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Deadline Calendar
                      </Button>
                    </Link>
                    <Link href="/scholarships/compare">
                      <Button className="w-full justify-start" variant="outline">
                        <Award className="mr-2 h-4 w-4" />
                        Compare Scholarships
                      </Button>
                    </Link>
                    <Link href="/scholarships">
                      <Button className="w-full justify-start" variant="outline">
                        <Award className="mr-2 h-4 w-4" />
                        Browse 500+ Scholarships
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity) => {
                          const Icon = activity.icon;
                          return (
                            <div key={activity.id} className="flex items-start gap-3">
                              <div className="h-8 w-8 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {activity.date}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Completion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Completion</CardTitle>
                    <CardDescription>
                      Complete your profile to get better matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">60% Complete</span>
                          <span className="text-xs text-gray-500">4/7 sections</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: "60%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Basic Information</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Education Background</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Test Scores</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Documents</span>
                        </div>
                      </div>
                      <Link href="/profile">
                        <Button className="w-full" size="sm">
                          Complete Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
