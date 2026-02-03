"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  Zap,
  TrendingUp,
  Gem,
  Calendar,
  DollarSign,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  Heart,
  BarChart3,
} from "lucide-react";

interface RecommendationMatch {
  scholarshipId: string;
  overallScore: number;
  scoreBreakdown: {
    gpaMatch: number;
    testScoreMatch: number;
    fieldMatch: number;
    degreeMatch: number;
    locationMatch: number;
    demographicMatch: number;
    deadline: number;
  };
  reasoning: string[];
  isGoodMatch: boolean;
  scholarship: {
    id: string;
    name: string;
    provider: string;
    country: string;
    amount: number;
    type: string;
    description: string;
    deadline: string;
    views: number;
    isSaved: boolean;
  };
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendationMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"top" | "gems" | "trending">("top");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?redirectTo=/recommendations");
    }
  }, [status, router]);

  // Fetch recommendations
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchRecommendations() {
      try {
        setLoading(true);
        const res = await fetch(`/api/recommendations?type=${activeTab}&limit=20`);

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/signin");
            return;
          }
          throw new Error("Failed to fetch recommendations");
        }

        const data = await res.json();
        setRecommendations(data.recommendations || []);
        setSavedIds(new Set(data.recommendations
          .filter((r: RecommendationMatch) => r.scholarship.isSaved)
          .map((r: RecommendationMatch) => r.scholarshipId)
        ));
        setError("");
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [status, activeTab, router]);

  const toggleSave = async (scholarshipId: string) => {
    try {
      setSavingId(scholarshipId);
      const isSaved = savedIds.has(scholarshipId);

      const res = await fetch("/api/saved/scholarships", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });

      if (res.ok) {
        const newSavedIds = new Set(savedIds);
        if (isSaved) {
          newSavedIds.delete(scholarshipId);
        } else {
          newSavedIds.add(scholarshipId);
        }
        setSavedIds(newSavedIds);
      }
    } catch (err) {
      console.error("Error saving scholarship:", err);
    } finally {
      setSavingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-blue-100 text-blue-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-light to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900">Your Perfect Matches</h1>
            </div>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Based on your profile, test scores, and preferences, we've found scholarships that are just right for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("top")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "top"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Matches
              </div>
            </button>
            <button
              onClick={() => setActiveTab("gems")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "gems"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5" />
                Hidden Gems
              </div>
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "trending"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations yet</h3>
              <p className="text-gray-600 mb-6">
                Complete your profile to get personalized recommendations
              </p>
              <Link href="/dashboard/profile">
                <Button>Complete Profile</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {recommendations.map((match, index) => (
                <motion.div
                  key={match.scholarshipId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {match.scholarship.name}
                          </CardTitle>
                          <CardDescription>{match.scholarship.provider}</CardDescription>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-center font-bold text-lg ${getScoreBadgeStyle(match.overallScore)}`}>
                          {match.overallScore}%
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Scholarship Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Amount</p>
                          <p className="text-lg font-bold text-primary">
                            ${match.scholarship.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Type</p>
                          <p className="text-lg font-bold">{match.scholarship.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Location</p>
                          <p className="text-lg font-bold">{match.scholarship.country}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Interest</p>
                          <p className="text-lg font-bold">{match.scholarship.views} views</p>
                        </div>
                      </div>

                      {/* Match Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Match Breakdown
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="text-sm">
                            <p className="text-gray-600">GPA Match</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${match.scoreBreakdown.gpaMatch}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Test Scores</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${match.scoreBreakdown.testScoreMatch}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Field Match</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${match.scoreBreakdown.fieldMatch}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Degree Level</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${match.scoreBreakdown.degreeMatch}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Location</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${match.scoreBreakdown.locationMatch}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Demographics</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${match.scoreBreakdown.demographicMatch}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        {match.reasoning.map((reason, i) => (
                          <div key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => toggleSave(match.scholarshipId)}
                          disabled={savingId === match.scholarshipId}
                        >
                          <Heart
                            className={`h-4 w-4 mr-2 ${
                              savedIds.has(match.scholarshipId)
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                          {savedIds.has(match.scholarshipId) ? "Saved" : "Save"}
                        </Button>
                        <Link href={`/scholarships/${match.scholarshipId}`} className="flex-1">
                          <Button className="w-full">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
