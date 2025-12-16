import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const intakeId = searchParams.id;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>

        <p className="text-gray-600 mb-6">
          Your student intake form has been successfully submitted. Our team will review your information and get back to you within 24-48 hours.
        </p>

        {intakeId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              Your Reference ID:
            </p>
            <p className="font-mono text-sm font-semibold text-blue-900">
              {intakeId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            In the meantime, you can:
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/scholarships"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Scholarships
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Return to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Check your email for a confirmation and next steps. If you don't receive an email within 24 hours, please contact us at support@ailesglobal.com
          </p>
        </div>
      </div>
    </div>
  );
}
