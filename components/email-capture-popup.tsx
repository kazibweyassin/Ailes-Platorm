"use client";

import { useState, useEffect } from "react";
import { X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailCapturePopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen/submitted this popup in this session
    const hasSeenPopup = sessionStorage.getItem("email-capture-shown");
    if (hasSeenPopup) {
      return;
    }

    // Show popup after 40 seconds
    const timer = setTimeout(() => {
      setShow(true);
      setHasShown(true);
      sessionStorage.setItem("email-capture-shown", "true");
    }, 40000); // 40 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShow(false);
        }, 2000);
      } else {
        throw new Error("Failed to submit email");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      // Still close the popup even if there's an error
      setSubmitted(true);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("email-capture-shown", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="relative shadow-2xl border-2 border-primary/20">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>

              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-dark mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600">
                      We'll send you the full scholarship list shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-dark mb-2">
                        Want the full list of scholarships?
                      </h3>
                      <p className="text-gray-600">
                        Enter your email to get access to our complete database
                        of 1000+ scholarships.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full"
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={loading || !email}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Get Full List"
                        )}
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}




