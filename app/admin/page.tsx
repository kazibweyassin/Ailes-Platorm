"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, GraduationCap, TrendingUp, Loader2, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading
    }

    if (status === "unauthenticated") {
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    if (status === "authenticated") {
      if (session?.user?.role !== 'ADMIN') {
        setLoading(false);
        return; // Show error message
      }
      setLoading(false);
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have admin privileges. If you were recently granted admin access, please sign out and sign back in to refresh your session.
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push('/')} className="w-full">
              Go to Home
            </Button>
            <Button 
              onClick={() => router.push('/auth/signin?callbackUrl=/admin')} 
              variant="outline" 
              className="w-full"
            >
              Sign In Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your scholarship platform</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/sponsors')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Sponsors</CardTitle>
              <CardDescription>
                Manage sponsor applications, confirm payments, and assign scholars
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/scholarships')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Scholarships</CardTitle>
              <CardDescription>
                Manage scholarship listings, deadlines, and requirements
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/users')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-purple-600" />
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Users</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and reset passwords
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <Button size="sm" variant="outline" disabled>Coming Soon</Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Analytics</CardTitle>
              <CardDescription>
                View platform statistics, engagement metrics, and reports
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
