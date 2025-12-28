"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  GraduationCap,
  Search,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  DollarSign,
} from "lucide-react";

export default function MatchSponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [scholars, setScholars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session || !session.user || session.user.role !== 'ADMIN') {
          router.push('/auth/signin?callbackUrl=/admin/sponsors/match');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/admin/sponsors/match');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated === false) return;
    if (isAuthenticated === null) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [sponsorsRes, scholarsRes] = await Promise.all([
          fetch('/api/sponsors'),
          fetch('/api/scholars?matched=false'),
        ]);

        if (!sponsorsRes.ok || !scholarsRes.ok) throw new Error('Failed to fetch data');
        
        const sponsorsData = await sponsorsRes.json();
        const scholarsData = await scholarsRes.json();
        
        // Only show confirmed sponsors ready for matching
        const confirmedSponsors = (sponsorsData.sponsors || []).filter(
          (s: any) => s.status === "CONFIRMED" || s.status === "ACTIVE"
        );
        
        setSponsors(confirmedSponsors);
        setScholars(scholarsData.scholars || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  const handleMatch = async (sponsorId: string, scholarId: string) => {
    if (!confirm(`Are you sure you want to match this sponsor with this scholar?`)) {
      return;
    }

    setMatching(`${sponsorId}-${scholarId}`);

    try {
      const res = await fetch('/api/sponsors/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsorId, scholarId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create match');
      }

      // Remove matched scholar from list
      setScholars(scholars.filter(s => s.id !== scholarId));
      // Update sponsor status
      setSponsors(sponsors.map(s => 
        s.id === sponsorId ? { ...s, status: 'ACTIVE' } : s
      ));
      
      alert('Match created successfully!');
      setSelectedSponsor(null);
    } catch (err: any) {
      alert('Failed to create match: ' + err.message);
    } finally {
      setMatching(null);
    }
  };

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const availableSponsors = sponsors.filter(s => 
    s.status === "CONFIRMED" || s.status === "ACTIVE"
  );

  const availableScholars = scholars.filter(s => 
    !s.assignedSponsorId && 
    (searchTerm === "" || 
     `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.fieldOfStudy.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.nationality.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMatchingScore = (sponsor: any, scholar: any) => {
    let score = 0;
    
    // Field match
    if (sponsor.preferredField && scholar.fieldOfStudy) {
      if (sponsor.preferredField.toLowerCase() === scholar.fieldOfStudy.toLowerCase()) {
        score += 40;
      } else if (scholar.fieldOfStudy.toLowerCase().includes(sponsor.preferredField.toLowerCase()) ||
                 sponsor.preferredField.toLowerCase().includes(scholar.fieldOfStudy.toLowerCase())) {
        score += 20;
      }
    }
    
    // Country match
    if (sponsor.preferredCountry && scholar.nationality) {
      if (sponsor.preferredCountry.toLowerCase() === scholar.nationality.toLowerCase()) {
        score += 30;
      }
    }
    
    // Financial need match (always add some points)
    score += 30;
    
    return Math.min(100, score);
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
              <h1 className="text-2xl font-bold text-gray-900">Match Sponsors & Scholars</h1>
              <p className="text-gray-600">Match confirmed sponsors with scholar applicants</p>
            </div>
            <Button onClick={() => router.push('/admin/sponsors')}>Back to Sponsors</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sponsors Column */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Available Sponsors ({availableSponsors.length})
                </CardTitle>
                <CardDescription>
                  Select a sponsor to see matching scholars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {availableSponsors.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No sponsors available for matching</p>
                  ) : (
                    availableSponsors.map((sponsor) => (
                      <Card
                        key={sponsor.id}
                        className={`cursor-pointer transition-all ${
                          selectedSponsor === sponsor.id
                            ? 'border-2 border-primary shadow-md'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedSponsor(
                          selectedSponsor === sponsor.id ? null : sponsor.id
                        )}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{sponsor.name}</h3>
                              {sponsor.companyName && (
                                <p className="text-sm text-gray-600">{sponsor.companyName}</p>
                              )}
                              <div className="mt-2 space-y-1">
                                <p className="text-sm">
                                  <span className="font-medium">Tier:</span> {sponsor.tierName}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Amount:</span> ${sponsor.amount.toLocaleString()}
                                </p>
                                {sponsor.preferredField && (
                                  <p className="text-sm">
                                    <span className="font-medium">Prefers:</span> {sponsor.preferredField}
                                  </p>
                                )}
                                {sponsor.preferredCountry && (
                                  <p className="text-sm">
                                    <span className="font-medium">Country:</span> {sponsor.preferredCountry}
                                  </p>
                                )}
                              </div>
                            </div>
                            {selectedSponsor === sponsor.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scholars Column */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Available Scholars ({availableScholars.length})
                </CardTitle>
                <CardDescription>
                  {selectedSponsor 
                    ? "Scholars sorted by match score with selected sponsor"
                    : "Select a sponsor to see matching scholars"}
                </CardDescription>
                {selectedSponsor && (
                  <div className="mt-4">
                    <Input
                      placeholder="Search scholars..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {!selectedSponsor ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a sponsor from the left to see matching scholars</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {availableScholars.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No scholars available</p>
                    ) : (
                      (() => {
                        const sponsor = sponsors.find(s => s.id === selectedSponsor);
                        if (!sponsor) return null;
                        
                        const sortedScholars = [...availableScholars].sort((a, b) => {
                          const scoreA = getMatchingScore(sponsor, a);
                          const scoreB = getMatchingScore(sponsor, b);
                          return scoreB - scoreA;
                        });

                        return sortedScholars.map((scholar) => {
                          const matchScore = getMatchingScore(sponsor, scholar);
                          const matchKey = `${sponsor.id}-${scholar.id}`;
                          
                          return (
                            <Card key={scholar.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                      {scholar.firstName} {scholar.lastName}
                                    </h3>
                                    <div className="mt-2 space-y-1 text-sm">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{scholar.nationality}, {scholar.currentCountry}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                        <span>{scholar.fieldOfStudy} - {scholar.currentDegree}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                        <span>Target: {scholar.targetDegree} in {scholar.targetFields}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      matchScore >= 70 ? 'bg-green-100 text-green-700' :
                                      matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {matchScore}% Match
                                    </div>
                                  </div>
                                </div>

                                {scholar.personalStory && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {scholar.personalStory.substring(0, 150)}...
                                  </p>
                                )}

                                <div className="flex gap-2 pt-3 border-t">
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleMatch(sponsor.id, scholar.id)}
                                    disabled={matching === matchKey}
                                  >
                                    {matching === matchKey ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Matching...
                                      </>
                                    ) : (
                                      "Match"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/admin/scholars/${scholar.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        });
                      })()
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

