"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, CheckCircle2, Calendar, Star } from "lucide-react";

interface ConsultingCTAProps {
  variant?: "inline" | "banner" | "sidebar";
  title?: string;
  description?: string;
}

export function ConsultingCTAInline() {
  return (
    <Card className="my-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="bg-primary/10 rounded-full p-3">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Need Help With Your Application?
            </h3>
            <p className="text-gray-600 text-sm">
              Get personalized guidance from scholarship experts. Essay review, mock interviews, and application strategy.
            </p>
          </div>
          <Link href="/consulting">
            <Button className="whitespace-nowrap">
              Book Consultation
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsultingCTABanner() {
  return (
    <Card className="my-12 border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
              <span className="text-sm font-semibold uppercase tracking-wide">Expert Help</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Struggling With Your Application?
            </h3>
            <p className="text-white/90 mb-4">
              Our scholarship experts have helped 500+ students win fully-funded scholarships. 
              Get personalized essay reviews, mock interviews, and step-by-step guidance.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Essay Review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Mock Interviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Application Strategy</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href="/consulting">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Session - From $50
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsultingCTASidebar() {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-white sticky top-24">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Need Expert Help?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Get 1-on-1 guidance from scholarship winners
          </p>
          <ul className="text-left text-sm space-y-2 mb-4">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Essay review & feedback</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Mock interviews</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Application strategy</span>
            </li>
          </ul>
          <Link href="/consulting" className="block">
            <Button className="w-full">
              Book Consultation
            </Button>
          </Link>
          <p className="text-xs text-gray-500 mt-2">Starting from $50</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsultingCTACompact() {
  return (
    <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            <strong>Feeling overwhelmed?</strong> Our experts can review your essays and boost your chances.{" "}
            <Link href="/consulting" className="text-primary font-semibold hover:underline">
              Book a consultation →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConsultingCTA({ variant = "inline" }: ConsultingCTAProps) {
  switch (variant) {
    case "banner":
      return <ConsultingCTABanner />;
    case "sidebar":
      return <ConsultingCTASidebar />;
    default:
      return <ConsultingCTAInline />;
  }
}
