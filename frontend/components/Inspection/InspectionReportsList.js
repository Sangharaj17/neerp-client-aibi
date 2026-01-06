'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Edit, Plus, Loader2, FileDown, ArrowLeft, Building2, MapPin } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { generateInspectionPDF } from './generateInspectionPDF';

const InspectionReportsList = ({
  combinedEnquiryId,
  onSelectReport,
  customer,
  site,
}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (combinedEnquiryId) {
      fetchReports();
    }
  }, [combinedEnquiryId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/inspection-report/list/${combinedEnquiryId}`
      );

      const data = response.data || [];
      setReports(data);
      console.log('Fetched reports:', data);
    } catch (err) {
      toast.error('Failed to fetch reports: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header Section with Customer Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Customer & Site Info */}
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Inspection Reports
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg px-4 py-3 flex-1">
                  <Building2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 uppercase tracking-wide mb-1">
                      Customer
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {customer || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 rounded-lg px-4 py-3 flex-1">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-emerald-900 uppercase tracking-wide mb-1">
                      Site
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {site || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Button */}
            <button
              onClick={() => onSelectReport(null, 'create')}
              className="lg:self-start flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Report
            </button>
          </div>
        </div>

        {/* Reports Section */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileDown className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Reports Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first inspection report for this enquiry.
              </p>
              <button
                onClick={() => onSelectReport(null, 'create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create First Report
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Report Edition
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((report, index) => (
                    <tr 
                      key={report.id} 
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            #{index + 1}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {report.reportEdition}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onSelectReport(report.id, 'view')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                            title="View Report"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          <button
                            onClick={() => onSelectReport(report.id, 'edit')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                            title="Edit Report"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => generateInspectionPDF(report.id, customer, site)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all"
                            title="Download PDF"
                          >
                            <FileDown className="w-4 h-4" />
                            <span className="hidden sm:inline">PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {reports.map((report, index) => (
                <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Report Edition
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {report.reportEdition}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectReport(report.id, 'view')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onSelectReport(report.id, 'edit')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => generateInspectionPDF(report.id, customer, site)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg"
                    >
                      <FileDown className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with count */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{reports.length}</span> {reports.length === 1 ? 'report' : 'reports'} found
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionReportsList;