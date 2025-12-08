"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Award,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
  Calendar,
  Globe,
  X,
} from "lucide-react";

export default function AdminScholarshipsPage() {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    description: "",
    amount: "",
    currency: "USD",
    type: "FULL",
    deadline: "",
    applicationUrl: "",
    country: "",
    forWomen: false,
    forAfrican: false,
    fieldOfStudy: "",
    degreeLevel: "",
    minGPA: "",
    requiresIELTS: false,
    minIELTS: "",
    requiresTOEFL: false,
    minTOEFL: "",
    requiresGRE: false,
    requiresGMAT: false,
    minAge: "",
    maxAge: "",
    targetCountries: "",
  });

  // Check if user is admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session || !session.user || session.user.role !== 'ADMIN') {
          router.push('/auth/signin?callbackUrl=/admin/scholarships');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/admin/scholarships');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  // Fetch scholarships
  useEffect(() => {
    if (isAuthenticated === false) return;
    if (isAuthenticated === null) return;

    async function fetchScholarships() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships?limit=1000');
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
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        minGPA: formData.minGPA ? parseFloat(formData.minGPA) : null,
        minIELTS: formData.minIELTS ? parseFloat(formData.minIELTS) : null,
        minTOEFL: formData.minTOEFL ? parseInt(formData.minTOEFL) : null,
        minAge: formData.minAge ? parseInt(formData.minAge) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
        fieldOfStudy: formData.fieldOfStudy.split(',').map(f => f.trim()).filter(Boolean),
        degreeLevel: formData.degreeLevel.split(',').map(d => d.trim()).filter(Boolean),
        targetCountries: formData.targetCountries.split(',').map(c => c.trim()).filter(Boolean),
      };

      const url = editingId 
        ? `/api/scholarships/${editingId}`
        : '/api/scholarships';
      
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save scholarship');

      // Refresh scholarships
      const refreshRes = await fetch('/api/scholarships?limit=1000');
      const refreshData = await refreshRes.json();
      setScholarships(refreshData.scholarships || []);

      // Reset form
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        provider: "",
        description: "",
        amount: "",
        currency: "USD",
        type: "FULL",
        deadline: "",
        applicationUrl: "",
        country: "",
        forWomen: false,
        forAfrican: false,
        fieldOfStudy: "",
        degreeLevel: "",
        minGPA: "",
        requiresIELTS: false,
        minIELTS: "",
        requiresTOEFL: false,
        minTOEFL: "",
        requiresGRE: false,
        requiresGMAT: false,
        minAge: "",
        maxAge: "",
        targetCountries: "",
      });
    } catch (err) {
      alert('Failed to save scholarship');
    }
  };

  const handleEdit = (scholarship: any) => {
    setFormData({
      name: scholarship.name || "",
      provider: scholarship.provider || "",
      description: scholarship.description || "",
      amount: scholarship.amount?.toString() || "",
      currency: scholarship.currency || "USD",
      type: scholarship.type || "FULL",
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
      applicationUrl: scholarship.applicationUrl || "",
      country: scholarship.country || "",
      forWomen: scholarship.forWomen || false,
      forAfrican: scholarship.forAfrican || false,
      fieldOfStudy: scholarship.fieldOfStudy?.join(', ') || "",
      degreeLevel: scholarship.degreeLevel?.join(', ') || "",
      minGPA: scholarship.minGPA?.toString() || "",
      requiresIELTS: scholarship.requiresIELTS || false,
      minIELTS: scholarship.minIELTS?.toString() || "",
      requiresTOEFL: scholarship.requiresTOEFL || false,
      minTOEFL: scholarship.minTOEFL?.toString() || "",
      requiresGRE: scholarship.requiresGRE || false,
      requiresGMAT: scholarship.requiresGMAT || false,
      minAge: scholarship.minAge?.toString() || "",
      maxAge: scholarship.maxAge?.toString() || "",
      targetCountries: scholarship.targetCountries?.join(', ') || "",
    });
    setEditingId(scholarship.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;

    try {
      const res = await fetch(`/api/scholarships/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete scholarship');

      setScholarships(scholarships.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete scholarship');
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

  const filteredScholarships = scholarships.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-gray-900">Scholarship Management</h1>
              <p className="text-gray-600">Add, edit, and manage scholarship listings</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/admin')}>
                Back to Admin
              </Button>
              <Button onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Scholarship
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Scholarships</p>
                  <p className="text-2xl font-bold text-gray-900">{scholarships.length}</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Full Funding</p>
                  <p className="text-2xl font-bold text-green-600">
                    {scholarships.filter(s => s.type === 'FULL').length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">For Women</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {scholarships.filter(s => s.forWomen).length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Deadlines</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {scholarships.filter(s => new Date(s.deadline) > new Date()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingId ? 'Edit' : 'Add'} Scholarship</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Scholarship Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Mastercard Foundation Scholars"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Provider *</label>
                    <Input
                      required
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="e.g., Mastercard Foundation"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                      placeholder="Describe the scholarship program..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Amount *</label>
                    <Input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="FULL">Full Scholarship</option>
                      <option value="PARTIAL">Partial Scholarship</option>
                      <option value="TUITION">Tuition Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Deadline *</label>
                    <Input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Application URL</label>
                    <Input
                      type="url"
                      value={formData.applicationUrl}
                      onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="USA, UK, Canada..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Field of Study (comma-separated)</label>
                    <Input
                      value={formData.fieldOfStudy}
                      onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                      placeholder="Computer Science, Engineering, Business"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Degree Levels (comma-separated)</label>
                    <Input
                      value={formData.degreeLevel}
                      onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                      placeholder="BACHELOR, MASTER, PHD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Target Countries (comma-separated)</label>
                    <Input
                      value={formData.targetCountries}
                      onChange={(e) => setFormData({ ...formData, targetCountries: e.target.value })}
                      placeholder="Nigeria, Kenya, Ghana..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum GPA</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.minGPA}
                      onChange={(e) => setFormData({ ...formData, minGPA: e.target.value })}
                      placeholder="3.0"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.forWomen}
                        onChange={(e) => setFormData({ ...formData, forWomen: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">For Women Only</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.forAfrican}
                        onChange={(e) => setFormData({ ...formData, forAfrican: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">For African Students</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Update' : 'Create'} Scholarship
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Scholarships List */}
        <div className="space-y-4">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{scholarship.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        scholarship.type === 'FULL' ? 'bg-green-100 text-green-700' :
                        scholarship.type === 'PARTIAL' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {scholarship.type}
                      </span>
                      {scholarship.forWomen && (
                        <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                          Women Only
                        </span>
                      )}
                      {scholarship.forAfrican && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                          African Students
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{scholarship.provider}</p>
                    <p className="text-sm text-gray-700 mb-3">{scholarship.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{scholarship.currency} {scholarship.amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
                      </div>
                      {scholarship.country && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>{scholarship.country}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(scholarship)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(scholarship.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredScholarships.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No scholarships found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
