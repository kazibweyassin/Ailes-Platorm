"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, DollarSign, MapPin, ArrowRight, Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  country: string | null;
  amount: number | null;
  currency: string;
  deadline: string | null;
  description: string | null;
  applicationLink: string | null;
  daysUntilDeadline: number | null;
  isUrgent: boolean;
  type: string;
}

interface ScholarshipFeedProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export default function ScholarshipFeed({ 
  limit = 6, 
  showTitle = true,
  className = "" 
}: ScholarshipFeedProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marketSegment, setMarketSegment] = useState<string | null>(null);

  useEffect(() => {
    // Get market segment from cookie
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const segment = getCookie("market_segment");
    setMarketSegment(segment || "international"); // Default to international if not set
  }, []);

  useEffect(() => {
    async function fetchScholarships() {
      if (!marketSegment) return; // Wait for cookie to be read

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("page", "1");

        // Fetch based on market segment
        const response = await fetch(`/api/scholarships/feed?${params}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ marketSegment }),
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch scholarships");
        }

        const data = await response.json();
        setScholarships(data.scholarships || []);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
        setError("Failed to load scholarships. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchScholarships();
  }, [marketSegment, limit]);

  const formatCurrency = (amount: number | null, currency: string) => {
    if (!amount) return "Amount varies";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "Rolling";
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (scholarships.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600">No scholarships available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-dark mb-2">
            {marketSegment === "domestic" 
              ? "Scholarships for US Students" 
              : "International Scholarships"}
          </h2>
          <p className="text-gray-600">
            {marketSegment === "domestic"
              ? "Curated opportunities for students in the United States"
              : "Global opportunities for international students"}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 line-clamp-2">
                      {scholarship.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {scholarship.provider}
                    </CardDescription>
                  </div>
                  <Award className="h-6 w-6 text-primary flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-4 flex-1">
                  {scholarship.amount && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">
                        {formatCurrency(scholarship.amount, scholarship.currency)}
                      </span>
                    </div>
                  )}
                  {scholarship.country && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{scholarship.country}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>
                      {scholarship.deadline
                        ? `Deadline: ${formatDeadline(scholarship.deadline)}`
                        : "Rolling deadline"}
                    </span>
                    {scholarship.isUrgent && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  {scholarship.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {scholarship.description}
                    </p>
                  )}
                </div>
                <Link href={`/scholarships/${scholarship.id}`}>
                  <Button className="w-full" variant="outline">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {scholarships.length >= limit && (
        <div className="mt-8 text-center">
          <Link href="/scholarships">
            <Button size="lg" variant="outline">
              <Globe className="mr-2 h-5 w-5" />
              View All Scholarships
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}


