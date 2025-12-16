'use client';

import { useState } from 'react';

export default function TestPDFPage() {
  const [intakeId, setIntakeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testPDF = async () => {
    if (!intakeId) {
      alert('Please enter an intake ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching PDF for ID:', intakeId);
      const response = await fetch(`/api/student-intake/${intakeId}/pdf`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student-intake-${intakeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      alert('Failed to generate PDF: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test PDF Generation</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Intake ID
            </label>
            <input
              type="text"
              value={intakeId}
              onChange={(e) => setIntakeId(e.target.value)}
              placeholder="Enter intake ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={testPDF}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating PDF...' : 'Generate & Download PDF'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>How to get an Intake ID:</strong>
            </p>
            <ol className="text-sm text-gray-600 mt-2 list-decimal list-inside space-y-1">
              <li>Submit a form at /student-intake</li>
              <li>Check the success page for the ID</li>
              <li>Or check the admin dashboard at /admin/student-intakes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
