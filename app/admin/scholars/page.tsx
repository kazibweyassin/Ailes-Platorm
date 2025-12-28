"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Users,
} from "lucide-react";

export default function AdminScholarsPage() {
  const router = useRouter();
  const [scholars, setScholars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session || !session.user || session.user.role !== 'ADMIN') {
          router.push('/auth/signin?callbackUrl=/admin/scholars');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/admin/scholars');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated === false) return;
    if (isAuthenticated === null) return;

    async function fetchScholars() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholars');
        if (!res.ok) throw new Error('Failed to fetch scholars');
        
        const data = await res.json();
        setScholars(data.scholars || []);
      } catch (err) {
        console.error('Error fetching scholars:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScholars();
  }, [isAuthenticated]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const filteredScholars = scholars.filter(s => {
    const matchesSearch = 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fieldOfStudy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: scholars.length,
    applied: scholars.filter(s => s.status === "APPLIED").length,
    matched: scholars.filter(s => s.status === "MATCHED").length,
    inProgress: scholars.filter(s => s.status === "IN_PROGRESS").length,
    completed: scholars.filter(s => s.status === "COMPLETED").length,
  };

  if (loading) {
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
              <h1 className="text-2xl font-bold text-gray-900">Scholar Management</h1>
              <p className="text-gray-600">Manage scholar applications and matches</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push('/scholar-apply')} variant="outline">
                View Application Form
              </Button>
              <Button onClick={() => router.push('/admin')}>Back to Admin</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Applied</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.applied}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Matched</p>
                  <p className="text-2xl font-bold text-green-600">{stats.matched}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "APPLIED" ? "default" : "outline"}
                  onClick={() => setStatusFilter("APPLIED")}
                  size="sm"
                >
                  Applied
                </Button>
                <Button
                  variant={statusFilter === "MATCHED" ? "default" : "outline"}
                  onClick={() => setStatusFilter("MATCHED")}
                  size="sm"
                >
                  Matched
                </Button>
                <Button
                  variant={statusFilter === "IN_PROGRESS" ? "default" : "outline"}
                  onClick={() => setStatusFilter("IN_PROGRESS")}
                  size="sm"
                >
                  In Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scholars List */}
        <div className="space-y-4">
          {filteredScholars.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No scholars found</p>
              </CardContent>
            </Card>
          ) : (
            filteredScholars.map((scholar) => (
              <Card key={scholar.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {scholar.firstName} {scholar.lastName}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {scholar.nationality}, {scholar.currentCountry}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {scholar.fieldOfStudy}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        scholar.status === "APPLIED" ? "bg-orange-100 text-orange-700" :
                        scholar.status === "MATCHED" ? "bg-green-100 text-green-700" :
                        scholar.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                        scholar.status === "COMPLETED" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {scholar.status}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{scholar.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{scholar.phone}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Current:</span> {scholar.currentDegree} at {scholar.university}
                    </div>
                    <div>
                      <span className="font-medium">GPA:</span> {scholar.gpa}
                    </div>
                    <div>
                      <span className="font-medium">Target:</span> {scholar.targetDegree} in {scholar.targetFields}
                    </div>
                    <div>
                      <span className="font-medium">Countries:</span> {scholar.targetCountries}
                    </div>
                  </div>

                  {scholar.personalStory && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-4">
                      <strong>Story:</strong> {scholar.personalStory.substring(0, 200)}...
                    </div>
                  )}

                  {scholar.sponsorships && scholar.sponsorships.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-green-900 mb-2">Matched Sponsors:</p>
                      {scholar.sponsorships.map((sponsorship: any) => (
                        <div key={sponsorship.id} className="text-sm text-green-800">
                          <strong>{sponsorship.sponsor.name}</strong> - {sponsorship.sponsor.tierName} (${sponsorship.sponsor.amount.toLocaleString()})
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    {scholar.status === "APPLIED" && (
                      <Button
                        size="sm"
                        onClick={() => router.push(`/admin/sponsors/match?scholar=${scholar.id}`)}
                      >
                        Match with Sponsor
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `mailto:${scholar.email}`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // View full details - could create a detail page
                        alert(`Full details for ${scholar.firstName} ${scholar.lastName}\n\nEmail: ${scholar.email}\nPhone: ${scholar.phone}\nField: ${scholar.fieldOfStudy}\nStatus: ${scholar.status}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>

                  <div className="text-xs text-gray-400 mt-4">
                    Applied: {new Date(scholar.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

