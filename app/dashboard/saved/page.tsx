"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, Calendar, DollarSign, MapPin, 
  Loader2, Trash2, ExternalLink, Filter 
} from "lucide-react";

export default function SavedScholarshipsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard/saved");
      return;
    }

    if (status === "authenticated") {
      fetchSavedScholarships();
    }
  }, [status, router]);

  const fetchSavedScholarships = async () => {
    try {
      const res = await fetch("/api/saved/scholarships");
      if (res.ok) {
        const data = await res.json();
        setScholarships(data.scholarships || []);
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (scholarshipId: string) => {
    try {
      const res = await fetch("/api/saved/scholarships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });

      if (res.ok) {
        setScholarships(scholarships.filter((s) => s.id !== scholarshipId));
      }
    } catch (error) {
      console.error("Error removing scholarship:", error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredScholarships = scholarships.filter((s) => {
    if (filter === "all") return true;
    if (filter === "active") return new Date(s.deadline) > new Date();
    if (filter === "expired") return new Date(s.deadline) <= new Date();
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Scholarships
          </h1>
          <p className="text-gray-600">
            You have {scholarships.length} saved scholarship{scholarships.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({scholarships.length})
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            size="sm"
          >
            Active ({scholarships.filter(s => new Date(s.deadline) > new Date()).length})
          </Button>
          <Button
            variant={filter === "expired" ? "default" : "outline"}
            onClick={() => setFilter("expired")}
            size="sm"
          >
            Expired ({scholarships.filter(s => new Date(s.deadline) <= new Date()).length})
          </Button>
        </div>

        {/* Scholarships Grid */}
        {filteredScholarships.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No saved scholarships
              </h3>
              <p className="text-gray-600 mb-6">
                Start browsing scholarships and save your favorites for later.
              </p>
              <Link href="/scholarships">
                <Button>Browse Scholarships</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => {
              const deadline = new Date(scholarship.deadline);
              const isExpired = deadline < new Date();
              const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {scholarship.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsave(scholarship.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{scholarship.country}</span>
                    </div>
                    
                    {scholarship.amount && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{scholarship.currency} {scholarship.amount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className={isExpired ? "text-red-600" : "text-gray-600"}>
                        {isExpired 
                          ? "Expired" 
                          : `${daysLeft} days left`
                        }
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/scholarships/${scholarship.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
