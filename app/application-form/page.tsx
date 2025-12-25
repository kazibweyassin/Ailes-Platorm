import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import ApplicationFormClient from './client';

export const metadata: Metadata = generateSEO({
  title: 'Student Application Form - AILES Global',
  description: 'Fill out our comprehensive student application form and download it as a PDF to start your study abroad journey.',
  canonicalUrl: '/application-form',
});

export default function ApplicationFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Application Form
          </h1>
          <p className="text-lg text-gray-600">
            Fill out this form to start your study abroad journey. Once completed, you can download it as a PDF to use for your application process.
          </p>
        </div>
        <ApplicationFormClient />
      </div>
    </div>
  );
}

