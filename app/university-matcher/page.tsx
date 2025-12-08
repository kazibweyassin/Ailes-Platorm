"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, TrendingUp, DollarSign, MapPin, Award, Bookmark, ExternalLink, Loader2 } from "lucide-react";

export default function UniversityMatcher() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gpa: "",
    degreeLevel: "",
    fieldOfStudy: "",
    budget: "",
    preferredCountries: [] as string[],
    careerGoals: "",
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [savedUniversities, setSavedUniversities] = useState<Set<string>>(new Set());

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryToggle = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCountries: prev.preferredCountries.includes(country)
        ? prev.preferredCountries.filter((c) => c !== country)
        : [...prev.preferredCountries, country],
    }));
  };

  const findMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/universities/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMatches(data.matches);
        setStep(3);
      } else {
        console.error('Failed to fetch matches:', data.error);
        // Show mock data as fallback
        setMatches([]);
        setStep(3);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveUniversity = async (universityId: string) => {
    if (!session) {
      alert('Please sign in to save universities');
      return;
    }

    try {
      const res = await fetch(`/api/universities/${universityId}/save`, {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        if (data.saved) {
          setSavedUniversities(prev => new Set(prev).add(universityId));
        } else {
          setSavedUniversities(prev => {
            const newSet = new Set(prev);
            newSet.delete(universityId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Error saving university:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-4">
            AI-Powered University Matcher
          </h1>
          <p className="text-lg text-gray-soft max-w-2xl mx-auto">
            Tell us about yourself, and we'll match you with the perfect universities
            and programs worldwide.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s ? "bg-primary text-white" : "bg-gray-200 text-gray-soft"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Profile Form */}
        {step === 1 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
              <CardDescription>
                Help us understand your academic background and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">GPA / Academic Score</label>
                <Input
                  type="text"
                  placeholder="e.g., 3.5 or 85%"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Degree Level</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={formData.degreeLevel}
                  onChange={(e) => handleInputChange("degreeLevel", e.target.value)}
                >
                  <option value="">Select degree level</option>
                  <option value="bachelors">Bachelor's</option>
                  <option value="masters">Master's</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Field of Study</label>
                <Input
                  type="text"
                  placeholder="e.g., Computer Science, Business, Engineering"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget Range (per year)</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                >
                  <option value="">Select budget range</option>
                  <option value="0-10000">$0 - $10,000</option>
                  <option value="10000-25000">$10,000 - $25,000</option>
                  <option value="25000-50000">$25,000 - $50,000</option>
                  <option value="50000+">$50,000+</option>
                  <option value="scholarship">Scholarship Required</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Countries</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {["United States", "United Kingdom", "Canada", "Germany", "Australia", "Netherlands"].map(
                    (country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountryToggle(country)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.preferredCountries.includes(country)
                            ? "border-primary bg-primary-light"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        {country}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Career Goals</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Tell us about your career aspirations..."
                  value={formData.careerGoals}
                  onChange={(e) => handleInputChange("careerGoals", e.target.value)}
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!formData.gpa || !formData.degreeLevel || !formData.fieldOfStudy}
              >
                Continue to Review
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Review Your Profile</CardTitle>
              <CardDescription>Confirm your information before we find matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-soft">GPA</p>
                  <p className="font-semibold">{formData.gpa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-soft">Degree Level</p>
                  <p className="font-semibold capitalize">{formData.degreeLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-soft">Field of Study</p>
                  <p className="font-semibold">{formData.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-soft">Budget</p>
                  <p className="font-semibold">{formData.budget || "Not specified"}</p>
                </div>
              </div>
              {formData.preferredCountries.length > 0 && (
                <div>
                  <p className="text-sm text-gray-soft mb-2">Preferred Countries</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredCountries.map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={findMatches} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    <>
                      Find Matches
                      <Search className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="max-w-6xl mx-auto">
            {matches.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-dark mb-2">
                    We Found {matches.length} Perfect Matches!
                  </h2>
                  <p className="text-gray-soft">
                    Based on your profile, here are universities that align with your goals
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.map((match) => (
                    <Card key={match.id} className="hover:shadow-lg transition-shadow relative">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{match.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {match.city ? `${match.city}, ${match.country}` : match.country}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{match.matchScore}%</div>
                            <div className="text-xs text-gray-soft">Match</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {match.programs.length > 0 && (
                          <div className="flex items-center text-sm">
                            <GraduationCap className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                            <span className="truncate">{match.programs[0].name}</span>
                          </div>
                        )}
                        {match.tuitionMin && (
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                            <span>
                              {match.currency === 'USD' ? '$' : match.currency}{' '}
                              {match.tuitionMin.toLocaleString()}
                              {match.tuitionMax && ` - ${match.tuitionMax.toLocaleString()}`}
                              /year
                            </span>
                          </div>
                        )}
                        {match.ranking && (
                          <div className="flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                            <span>Ranked #{match.ranking} globally</span>
                          </div>
                        )}
                        {match.minGPA && (
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 mr-2 text-success flex-shrink-0" />
                            <span>Min GPA: {match.minGPA}</span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSaveUniversity(match.id)}
                          >
                            <Bookmark
                              className={`h-4 w-4 mr-1 ${
                                savedUniversities.has(match.id) ? 'fill-current' : ''
                              }`}
                            />
                            {savedUniversities.has(match.id) ? 'Saved' : 'Save'}
                          </Button>
                          {match.website && (
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => window.open(match.website, '_blank')}
                            >
                              Visit
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-400 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-dark mb-2">No Matches Found</h3>
                <p className="text-gray-soft mb-6">
                  We couldn't find universities matching your criteria. Try adjusting your preferences.
                </p>
                <Button onClick={() => setStep(1)}>
                  Update Search Criteria
                </Button>
              </div>
            )}
            {matches.length > 0 && (
              <div className="text-center mt-8">
                <Button onClick={() => { setStep(1); setMatches([]); }} variant="outline">
                  Start New Search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




