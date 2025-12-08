"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminSponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session || !session.user || session.user.role !== 'ADMIN') {
          router.push('/auth/signin?callbackUrl=/admin/sponsors');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/admin/sponsors');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  // Fetch sponsors
  useEffect(() => {
    if (isAuthenticated === false) return;
    if (isAuthenticated === null) return;

    async function fetchSponsors() {
      try {
        setLoading(true);
        const res = await fetch('/api/sponsors');
        if (!res.ok) throw new Error('Failed to fetch sponsors');
        
        const data = await res.json();
        setSponsors(data.sponsors || []);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsors();
  }, [isAuthenticated]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Refresh sponsors
      const updatedSponsors = sponsors.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      );
      setSponsors(updatedSponsors);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const filteredSponsors = sponsors.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sponsors.length,
    pending: sponsors.filter(s => s.status === "PENDING").length,
    confirmed: sponsors.filter(s => s.status === "CONFIRMED").length,
    totalAmount: sponsors.reduce((sum, s) => sum + s.amount, 0),
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sponsor Management</h1>
              <p className="text-gray-600">Manage sponsorship applications and payments</p>
            </div>
            <Button onClick={() => router.push('/admin')}>Back to Admin</Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sponsors</p>
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
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">${stats.totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "PENDING" ? "default" : "outline"}
                  onClick={() => setStatusFilter("PENDING")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "CONFIRMED" ? "default" : "outline"}
                  onClick={() => setStatusFilter("CONFIRMED")}
                  size="sm"
                >
                  Confirmed
                </Button>
                <Button
                  variant={statusFilter === "ACTIVE" ? "default" : "outline"}
                  onClick={() => setStatusFilter("ACTIVE")}
                  size="sm"
                >
                  Active
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsors List */}
        <div className="space-y-4">
          {filteredSponsors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sponsors found</p>
              </CardContent>
            </Card>
          ) : (
            filteredSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {sponsor.type === "CORPORATE" ? (
                          <Building2 className="h-6 w-6 text-primary" />
                        ) : (
                          <Users className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                        <CardDescription>
                          {sponsor.type === "CORPORATE" && sponsor.companyName && (
                            <span className="block">{sponsor.companyName}</span>
                          )}
                          <span className="block">{sponsor.tierName}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${sponsor.amount.toLocaleString()}
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                        sponsor.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                        sponsor.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                        sponsor.status === "ACTIVE" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {sponsor.status}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{sponsor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{sponsor.phone}</span>
                    </div>
                  </div>

                  {sponsor.preferredField && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Preferred Field:</strong> {sponsor.preferredField}
                    </div>
                  )}
                  {sponsor.preferredCountry && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Preferred Country:</strong> {sponsor.preferredCountry}
                    </div>
                  )}
                  {sponsor.message && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-4">
                      <strong>Message:</strong> {sponsor.message}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    {sponsor.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(sponsor.id, "CONFIRMED")}
                      >
                        Confirm Payment
                      </Button>
                    )}
                    {sponsor.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(sponsor.id, "ACTIVE")}
                      >
                        Assign Scholar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `mailto:${sponsor.email}`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  <div className="text-xs text-gray-400 mt-4">
                    Applied: {new Date(sponsor.createdAt).toLocaleDateString()}
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
