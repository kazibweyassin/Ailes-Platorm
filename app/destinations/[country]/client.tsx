"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Globe, MapPin, GraduationCap, 
  DollarSign, Calendar, Users, TrendingUp 
} from "lucide-react";

export function CountryPageClient({ country }: { country: string }) {
  const [countryData, setCountryData] = useState<any>(null);

  useEffect(() => {
    const countryName = country.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    
    const data = {
      "United States": {
        flag: "🇺🇸",
        name: "United States",
        universities: "150+",
        scholarships: "200+",
        avgCost: "$30,000 - $60,000/year",
        language: "English",
        description: "The United States offers world-class education with diverse programs and cutting-edge research opportunities.",
      },
      "United Kingdom": {
        flag: "🇬🇧",
        name: "United Kingdom",
        universities: "80+",
        scholarships: "150+",
        avgCost: "£15,000 - £35,000/year",
        language: "English",
        description: "The UK is home to some of the world's oldest and most prestigious universities with rich academic traditions.",
      },
      "Canada": {
        flag: "🇨🇦",
        name: "Canada",
        universities: "100+",
        scholarships: "180+",
        avgCost: "CAD 20,000 - 35,000/year",
        language: "English/French",
        description: "Canada offers high-quality education in a multicultural environment with excellent post-study work opportunities.",
      },
      "Germany": {
        flag: "🇩🇪",
        name: "Germany",
        universities: "60+",
        scholarships: "120+",
        avgCost: "€0 - €20,000/year",
        language: "German/English",
        description: "Germany offers tuition-free or low-cost education at world-renowned universities with strong research focus.",
      },
      "Australia": {
        flag: "🇦🇺",
        name: "Australia",
        universities: "50+",
        scholarships: "100+",
        avgCost: "AUD 25,000 - 45,000/year",
        language: "English",
        description: "Australia combines quality education with an excellent quality of life and diverse cultural experiences.",
      },
      "Netherlands": {
        flag: "🇳🇱",
        name: "Netherlands",
        universities: "40+",
        scholarships: "80+",
        avgCost: "€8,000 - €20,000/year",
        language: "Dutch/English",
        description: "The Netherlands offers innovative, student-centered education with many English-taught programs.",
      },
    };

    setCountryData(data[countryName as keyof typeof data] || {
      flag: "🌍",
      name: countryName,
      universities: "Available",
      scholarships: "Available",
      avgCost: "Varies",
      language: "Varies",
      description: `Explore educational opportunities in ${countryName}.`,
    });
  }, [country]);

  if (!countryData) return null;

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-primary-light via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{countryData.flag}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Study in {countryData.name}
              </h1>
              <p className="text-gray-600">{countryData.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <GraduationCap className="h-8 w-8 text-primary mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {countryData.universities}
              </div>
              <div className="text-sm text-gray-600">Universities</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-primary mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {countryData.scholarships}
              </div>
              <div className="text-sm text-gray-600">Scholarships</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <div className="text-lg font-bold text-gray-900 mb-1">
                {countryData.avgCost}
              </div>
              <div className="text-sm text-gray-600">Average Cost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Globe className="h-8 w-8 text-primary mb-3" />
              <div className="text-lg font-bold text-gray-900 mb-1">
                {countryData.language}
              </div>
              <div className="text-sm text-gray-600">Language</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Available Scholarships
              </h2>
              <p className="text-gray-600 mb-6">
                Discover scholarship opportunities in {countryData.name} tailored to your profile.
              </p>
              <Link href={`/scholarships?country=${countryData.name}`}>
                <Button size="lg">
                  Browse Scholarships
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find Your Perfect Match
              </h2>
              <p className="text-gray-600 mb-6">
                Use our intelligent matching system to find scholarships and universities that fit your profile.
              </p>
              <Link href="/university-matcher">
                <Button size="lg" variant="outline">
                  Try University Matcher
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
























