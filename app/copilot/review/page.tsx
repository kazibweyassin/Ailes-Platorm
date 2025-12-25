"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, FileText, Download } from "lucide-react";
import Link from "next/link";

async function patchConsentAndSubmit(copilotRequest: any) {
  // 1. Mark consent in backend
  const consentResponse = await fetch("/api/copilot/requests", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: copilotRequest.id, consentGiven: true }),
  });

  if (!consentResponse.ok) {
    throw new Error("Failed to update consent");
  }

  // 2. Trigger submission (dry-run) if mapping exists
  if (copilotRequest.mapping) {
    const submitResponse = await fetch("/api/copilot/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        copilotRequestId: copilotRequest.id,
        targetUrl: copilotRequest.finderData?.targetUrl || "https://example.com",
        mapping: copilotRequest.mapping,
      }),
    });

    if (!submitResponse.ok) {
      throw new Error("Failed to submit application");
    }
  }
}

// Review and consent page for Copilot applications
export default function CopilotReviewPage() {
  const router = useRouter();
  const [copilotRequest, setCopilotRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    async function fetchCopilotRequest() {
      try {
        // Try to get from localStorage first (for immediate redirect)
        const localRequest = localStorage.getItem("copilotRequest");
        const requestId = localStorage.getItem("copilotRequestId");

        if (localRequest) {
          setCopilotRequest(JSON.parse(localRequest));
          setLoading(false);
          
          // Also fetch from API to get latest status
          if (requestId) {
            const response = await fetch(`/api/copilot/requests`);
            if (response.ok) {
              const requests = await response.json();
              const latest = requests.find((r: any) => r.id === requestId);
              if (latest) {
                setCopilotRequest(latest);
                localStorage.setItem("copilotRequest", JSON.stringify(latest));
              }
            }
          }
        } else {
          // Try to fetch from API
          const response = await fetch("/api/copilot/requests");
          if (response.ok) {
            const requests = await response.json();
            if (requests.length > 0) {
              const latest = requests[0];
              setCopilotRequest(latest);
              localStorage.setItem("copilotRequest", JSON.stringify(latest));
              localStorage.setItem("copilotRequestId", latest.id);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching copilot request:", err);
        setError("Failed to load copilot request");
      } finally {
        setLoading(false);
      }
    }

    fetchCopilotRequest();
  }, []);

  const handleApprove = async () => {
    if (!copilotRequest) return;
    
    setIsSubmitting(true);
    setError("");
    try {
      await patchConsentAndSubmit(copilotRequest);
      setApproved(true);
      
      // Update local state
      const updated = { ...copilotRequest, consentGiven: true, status: "processing" };
      setCopilotRequest(updated);
      localStorage.setItem("copilotRequest", JSON.stringify(updated));
    } catch (e: any) {
      setError(e.message || "Failed to approve");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p>Loading your application...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!copilotRequest) {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Copilot Request Found</h2>
            <p className="text-gray-600 mb-6">Please start by activating Copilot first.</p>
            <Link href="/copilot/activate">
              <Button>Go to Activation Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-2xl border-2 border-blue-500">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Review & Consent</h2>
            
            {approved ? (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-600">Consent Given Successfully!</h3>
                <p className="text-gray-700 mb-6">
                  Your application package is being processed. You'll receive an email at <strong>{copilotRequest.paymentEmail}</strong> once it's ready.
                </p>
                <div className="space-y-3">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Status Badge */}
                <div className="mb-6 text-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    copilotRequest.status === "processing" ? "bg-blue-100 text-blue-800" :
                    copilotRequest.status === "completed" ? "bg-green-100 text-green-800" :
                    "bg-primary/10 text-primary"
                  }`}>
                    Status: {copilotRequest.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>

                {/* Application Preview */}
                <div className="mb-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Your Application Package
                    </h3>
                    {copilotRequest.documents ? (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(copilotRequest.documents, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          Your documents are being generated. This may take up to 24 hours.
                        </p>
                      </div>
                    )}
                  </div>

                  {copilotRequest.mapping && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">AI Form Mapping</h4>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(copilotRequest.mapping, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Profile Summary */}
                  {copilotRequest.finderData && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Your Profile</h4>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          {copilotRequest.finderData.nationality && (
                            <div>
                              <span className="text-gray-600">From:</span>{" "}
                              <span className="font-semibold">{copilotRequest.finderData.nationality}</span>
                            </div>
                          )}
                          {copilotRequest.finderData.destination && (
                            <div>
                              <span className="text-gray-600">Destination:</span>{" "}
                              <span className="font-semibold">{copilotRequest.finderData.destination}</span>
                            </div>
                          )}
                          {copilotRequest.finderData.fieldOfStudy && (
                            <div>
                              <span className="text-gray-600">Field:</span>{" "}
                              <span className="font-semibold">{copilotRequest.finderData.fieldOfStudy}</span>
                            </div>
                          )}
                          {copilotRequest.finderData.degreeLevel && (
                            <div>
                              <span className="text-gray-600">Degree:</span>{" "}
                              <span className="font-semibold">{copilotRequest.finderData.degreeLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="inline-flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1" 
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      required 
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        I have reviewed my application and consent to automated submission.
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        By checking this box, you agree to allow AI Copilot to automatically fill and submit scholarship applications on your behalf based on the information you provided.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleApprove} 
                  disabled={approved || isSubmitting || !consentChecked} 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : approved ? (
                    "Consent Given"
                  ) : (
                    "Approve & Submit"
                  )}
                </Button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
