"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session || !session.user || session.user.role !== 'ADMIN') {
          router.push('/auth/signin?callbackUrl=/admin/reports');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/admin/reports');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated === false) return;
    if (isAuthenticated === null) return;

    async function fetchStats() {
      try {
        setLoading(true);
        const [sponsorsRes, scholarsRes, matchesRes] = await Promise.all([
          fetch('/api/sponsors'),
          fetch('/api/scholars'),
          fetch('/api/sponsors/match'),
        ]);

        const sponsorsData = await sponsorsRes.json();
        const scholarsData = await scholarsRes.json();
        const matchesData = await matchesRes.json();

        const sponsors = sponsorsData.sponsors || [];
        const scholars = scholarsData.scholars || [];
        const matches = matchesData.matches || [];

        const totalRevenue = sponsors
          .filter((s: any) => s.paymentConfirmed)
          .reduce((sum: number, s: any) => sum + s.amount, 0);

        const pendingRevenue = sponsors
          .filter((s: any) => s.status === "PENDING")
          .reduce((sum: number, s: any) => sum + s.amount, 0);

        setStats({
          totalSponsors: sponsors.length,
          confirmedSponsors: sponsors.filter((s: any) => s.status === "CONFIRMED" || s.status === "ACTIVE").length,
          totalScholars: scholars.length,
          matchedScholars: scholars.filter((s: any) => s.status === "MATCHED" || s.status === "IN_PROGRESS").length,
          totalMatches: matches.length,
          activeMatches: matches.filter((m: any) => m.status === "ACTIVE" || m.status === "MATCHED").length,
          totalRevenue,
          pendingRevenue,
          averageSponsorship: sponsors.length > 0 
            ? sponsors.reduce((sum: number, s: any) => sum + s.amount, 0) / sponsors.length 
            : 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [isAuthenticated]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sponsor Program Reports</h1>
              <p className="text-gray-600">Overview of sponsorship program performance</p>
            </div>
            <Button onClick={() => router.push('/admin')}>Back to Admin</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingRevenue > 0 && `+$${stats.pendingRevenue.toLocaleString()} pending`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sponsors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSponsors}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.confirmedSponsors} confirmed/active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Scholars</CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScholars}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.matchedScholars} matched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMatches}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalMatches} total matches
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Sponsorship Amount</span>
                <span className="text-lg font-semibold">${Math.round(stats.averageSponsorship).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Match Rate</span>
                <span className="text-lg font-semibold">
                  {stats.totalScholars > 0 
                    ? Math.round((stats.matchedScholars / stats.totalScholars) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sponsor Conversion Rate</span>
                <span className="text-lg font-semibold">
                  {stats.totalSponsors > 0 
                    ? Math.round((stats.confirmedSponsors / stats.totalSponsors) * 100) 
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/sponsors')}
              >
                Manage Sponsors
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/scholars')}
              >
                Manage Scholars
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/sponsors/match')}
              >
                Match Sponsors & Scholars
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

