"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, Check, Target, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
          setEmail("");
        }, 5000);
      } else {
        const data = await response.json();
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-0 shadow-xl">      
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Find Scholarships That Match You</CardTitle>
        <CardDescription className="text-white/90 text-base">
          Get matched with scholarships worth up to $50,000
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <div className="space-y-6">
            {/* Benefits Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <Target className="h-6 w-6 mx-auto mb-1" />
                <p className="text-xs font-medium">Your Matches</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <Award className="h-6 w-6 mx-auto mb-1" />
                <p className="text-xs font-medium">$18K Average</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                <p className="text-xs font-medium">85% Success</p>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white text-gray-900 border-0 placeholder:text-gray-500 flex-1 h-12 text-base"
                />
                <Button type="submit" size="lg" variant="secondary" className="whitespace-nowrap h-12 px-6 font-semibold">
                  Get Started
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-white/80">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>No spam. Unsubscribe anytime.</span>
                </div>
                <span className="font-semibold">1,247+ students joined</span>
              </div>
            </form>

            {/* Alternative CTA */}
            <div className="text-center pt-2 border-t border-white/20">
              <p className="text-sm text-white/80 mb-2">Or browse scholarships</p>
              <Link href="/find-scholarships">
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10">
                  Browse All Scholarships
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10" />
            </div>
            <p className="text-2xl font-bold mb-2">You're in! 🎉</p>
            <p className="text-base text-white/90 mb-6">
              Check your email for next steps. We'll send your scholarship matches within 24 hours.
            </p>
            <Link href="/find-scholarships">
              <Button variant="secondary" size="lg">
                Browse Scholarships
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

