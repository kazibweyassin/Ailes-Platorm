"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthSignin":
        return "Error in constructing an authorization URL.";
      case "OAuthCallback":
        return "Error in handling the response from an OAuth provider.";
      case "OAuthCreateAccount":
        return "Could not create OAuth account in the database.";
      case "EmailCreateAccount":
        return "Could not create email account in the database.";
      case "Callback":
        return "Error in the OAuth callback handler route.";
      case "OAuthAccountNotLinked":
        return "An account with this email already exists. Please sign in with your original method.";
      case "EmailSignin":
        return "Sending the e-mail with the sign in token failed.";
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return error || "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
            <CardDescription className="text-center">
              {getErrorMessage(error)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                {error === "OAuthAccountNotLinked" && (
                  <>
                    An account with this email already exists. If you previously signed up with email/password,
                    please use that method to sign in, or contact support to link your accounts.
                  </>
                )}
                {error === "CredentialsSignin" && (
                  <>
                    The email or password you entered is incorrect. Please check your credentials and try again.
                  </>
                )}
                {!error || (error !== "OAuthAccountNotLinked" && error !== "CredentialsSignin") && (
                  <>
                    We encountered an issue while trying to sign you in. Please try again or contact support if the problem persists.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/auth/signin">
                <Button className="w-full" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </Link>
            </div>

            {error && (
              <div className="text-xs text-gray-500 text-center mt-4">
                Error code: <code className="bg-gray-100 px-2 py-1 rounded">{error}</code>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-light flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}

