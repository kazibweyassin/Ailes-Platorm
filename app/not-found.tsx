"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home, ArrowRight, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  // Auto-redirect after 3 seconds (optional - can be removed if you prefer manual redirect)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/find-scholarships");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-primary" />
              </div>
            </motion.div>

            <h1 className="text-6xl font-bold text-gray-dark mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-dark mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist. But don't worry - 
              we can help you find the perfect scholarship instead!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/find-scholarships">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Award className="mr-2 h-5 w-5" />
                  Find Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Redirecting to scholarship finder in 3 seconds...
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Or explore these popular pages:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/scholarships">
                  <Button variant="ghost" size="sm">
                    Browse Scholarships
                  </Button>
                </Link>
                <Link href="/scholarships/match">
                  <Button variant="ghost" size="sm">
                    AI Matching
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="ghost" size="sm">
                    Blog
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

