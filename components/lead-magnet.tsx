"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, Check } from "lucide-react";

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
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6" />
          <CardTitle className="text-2xl">Get Free Scholarship Alerts</CardTitle>
        </div>
        <CardDescription className="text-white/90">
          Join 1,000+ students getting weekly scholarship opportunities delivered to their inbox
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1"
              />
              <Button type="submit" variant="secondary" className="whitespace-nowrap">
                <Mail className="mr-2 h-4 w-4" />
                Get Alerts
              </Button>
            </div>
            <div className="flex items-start gap-2 text-xs text-white/80">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Free. No spam. Unsubscribe anytime.</span>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold mb-2">You're in! 🎉</p>
            <p className="text-sm text-white/90">
              Check your email for confirmation. We'll send you the best scholarships every week.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

