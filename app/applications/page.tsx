"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentVault from "@/components/document-vault";
import ApplicationTracker from "@/components/application-tracker";
import { FileText, Target } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">
          Manage your scholarship applications and documents all in one place
        </p>
      </div>

      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Application Tracker
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Vault
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="mt-6">
          <ApplicationTracker />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentVault />
        </TabsContent>
      </Tabs>
    </div>
  );
}
