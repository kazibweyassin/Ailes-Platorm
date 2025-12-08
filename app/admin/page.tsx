"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, GraduationCap, TrendingUp, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session || !session.user || session.user.role !== 'ADMIN') {
          router.push('/auth/signin?callbackUrl=/admin');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/admin');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  if (isAuthenticated === null || isAuthenticated === false || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
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
