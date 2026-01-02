"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  Download,
  FileText,
  DollarSign,
  User,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type CopilotRequest = {
  id: string;
  paymentName: string;
  paymentEmail: string;
  paymentPhone: string;
  paymentWhatsapp: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents: any;
  finderData: any;
};

export default function AdminCopilotPage() {
  const [requests, setRequests] = useState<CopilotRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "processing" | "completed" | "failed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/copilot");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching copilot requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const response = await fetch("/api/admin/copilot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: requestId,
          paymentStatus: "confirmed",
          paymentTimestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchRequests();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleProcessRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const response = await fetch("/api/copilot/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copilotRequestId: requestId }),
      });

      if (response.ok) {
        await fetchRequests();
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      completed: "default",
      failed: "destructive",
    };

    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        Payment: {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      req.paymentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.paymentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.paymentPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    processing: requests.filter((r) => r.status === "processing").length,
    completed: requests.filter((r) => r.status === "completed").length,
    pendingPayment: requests.filter((r) => r.paymentStatus === "pending").length,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Copilot Requests Management</h1>
        <p className="text-gray-600">Manage and process scholarship copilot requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayment}</div>
            <div className="text-sm text-gray-600">Pending Payment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "processing", "completed", "failed"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                  size="sm"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No copilot requests found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          {request.paymentName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getStatusBadge(request.status)}
                          {getPaymentBadge(request.paymentStatus)}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {request.paymentEmail}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {request.paymentPhone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        Payment: {request.paymentMethod.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {request.finderData && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-600 mb-1">Profile:</p>
                        <div className="text-sm text-gray-700">
                          {request.finderData.fieldOfStudy && (
                            <span className="mr-3">
                              <strong>Field:</strong> {request.finderData.fieldOfStudy}
                            </span>
                          )}
                          {request.finderData.degreeLevel && (
                            <span className="mr-3">
                              <strong>Degree:</strong> {request.finderData.degreeLevel}
                            </span>
                          )}
                          {request.finderData.destination && (
                            <span>
                              <strong>Destination:</strong> {request.finderData.destination}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {request.documents && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileText className="h-4 w-4" />
                        Documents generated
                        {(request.documents as any)?.zipGenerated && (
                          <span className="text-xs bg-green-100 px-2 py-1 rounded">ZIP Ready</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {request.paymentStatus === "pending" && (
                      <Button
                        onClick={() => handleProcessPayment(request.id)}
                        disabled={processingId === request.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Payment
                          </>
                        )}
                      </Button>
                    )}

                    {request.paymentStatus === "confirmed" && request.status === "pending" && (
                      <Button
                        onClick={() => handleProcessRequest(request.id)}
                        disabled={processingId === request.id}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        {processingId === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Documents
                          </>
                        )}
                      </Button>
                    )}

                    {request.documents && (request.documents as any)?.zipGenerated && (
                      <a
                        href={`/api/copilot/download?requestId=${request.id}`}
                        download
                        className="block"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download ZIP
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

