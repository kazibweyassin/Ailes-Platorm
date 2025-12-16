'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileDown, Eye, Pencil, Search, Filter } from 'lucide-react';

interface StudentIntake {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  nationality: string;
  targetDegree: string;
  targetCountries: string;
  preferredIntake: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminStudentIntakesPage() {
  const [intakes, setIntakes] = useState<StudentIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(true); // Temporary bypass - TODO: Add proper authentication
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIntake, setSelectedIntake] = useState<StudentIntake | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchIntakes();
  }, [currentPage, filterStatus]);

  const fetchIntakes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await fetch(`/api/student-intake?${params}`);
      const result = await response.json();

      if (result.success) {
        setIntakes(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching intakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (id: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch(`/api/student-intake/${id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student-intake-${firstName}-${lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/student-intake/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchIntakes();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredIntakes = intakes.filter(intake => {
    const searchLower = searchTerm.toLowerCase();
    return (
      intake.firstName.toLowerCase().includes(searchLower) ||
      intake.lastName.toLowerCase().includes(searchLower) ||
      intake.email.toLowerCase().includes(searchLower) ||
      intake.nationality.toLowerCase().includes(searchLower)
    );
  });

  const statusColors: Record<string, string> = {
    NEW: 'bg-green-100 text-green-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    CONTACTED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Intake Forms
          </h1>
          <p className="text-gray-600">
            Manage and review student intake form submissions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or nationality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              Total: <span className="font-semibold ml-1">{intakes.length}</span> submissions
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading intakes...</p>
            </div>
          ) : filteredIntakes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No intake forms found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIntakes.map((intake) => (
                    <tr key={intake.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {intake.firstName} {intake.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {intake.nationality}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{intake.email}</div>
                        <div className="text-sm text-gray-500">{intake.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{intake.targetDegree}</div>
                        <div className="text-sm text-gray-500">{intake.targetCountries}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={intake.status}
                          onChange={(e) => updateStatus(intake.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            statusColors[intake.status] || 'bg-gray-100 text-gray-800'
                          } border-0 cursor-pointer`}
                        >
                          <option value="NEW">New</option>
                          <option value="IN_REVIEW">In Review</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(intake.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedIntake(intake);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => downloadPDF(intake.id, intake.firstName, intake.lastName)}
                            className="text-green-600 hover:text-green-900"
                            title="Download PDF"
                          >
                            <FileDown className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Details Modal - Basic implementation */}
      {showDetailsModal && selectedIntake && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedIntake.firstName} {selectedIntake.lastName}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <strong>Email:</strong> {selectedIntake.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedIntake.phone}
                </div>
                <div>
                  <strong>Nationality:</strong> {selectedIntake.nationality}
                </div>
                <div>
                  <strong>Target Degree:</strong> {selectedIntake.targetDegree}
                </div>
                <div>
                  <strong>Target Countries:</strong> {selectedIntake.targetCountries}
                </div>
                <div>
                  <strong>Preferred Intake:</strong> {selectedIntake.preferredIntake}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[selectedIntake.status] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedIntake.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => downloadPDF(selectedIntake.id, selectedIntake.firstName, selectedIntake.lastName)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
