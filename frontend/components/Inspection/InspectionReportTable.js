import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileDown,
  User,
  MapPin
} from 'lucide-react';
import { generateInspectionPDF } from './generateInspectionPDF';

const InspectionReportTable = ({ reportId, customer, site }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReportData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/api/inspection-report/${reportId}/view-pdf-data`
        );

        console.log('API Success:', response.data);
        setData(response.data || []);
        setError(null);

      } catch (err) {
        console.error('API Error Full:', err);
        console.error('Backend Error:', err?.response?.data);
        console.error('Status Code:', err?.response?.status);

        setError(
          err?.response?.data || 'Failed to load inspection data.'
        );

      } finally {
        setLoading(false);
      }
    };

    if (reportId) getReportData();
  }, [reportId]);

  const getStatusBadge = status => {
    const s = status?.toLowerCase();
    const base = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border';

    if (s === 'ok' || s === 'safe' || s === 'pass') {
      return (
        <span className={`${base} bg-green-50 text-green-700 border-green-200`}>
          <CheckCircle size={14} /> {status.toUpperCase()}
        </span>
      );
    }
    if (s === 'fail' || s === 'unsafe' || s === 'critical') {
      return (
        <span className={`${base} bg-red-50 text-red-700 border-red-200`}>
          <XCircle size={14} /> {status.toUpperCase()}
        </span>
      );
    }
    return (
      <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
        <AlertCircle size={14} /> {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading inspection report...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden m-4">
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-3 rounded-lg text-white shadow-blue-200 shadow-lg">
              <ClipboardList size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">
                INSPECTION LOG
              </h2>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-sm text-gray-600">
                <span className="font-mono font-bold text-blue-600">#{reportId}</span>
                <span className="flex items-center gap-1"><User size={14}/> {customer}</span>
                <span className="flex items-center gap-1"><MapPin size={14}/> {site}</span>
              </div>
            </div>
          </div>

          {/* ✅ PDF BUTTON - CALLS UTILITY FUNCTION */}
          <button
            onClick={() => generateInspectionPDF(reportId, customer, site)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95"
          >
            <FileDown size={20} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold border-b text-center">Sr. No</th>
              <th className="px-6 py-4 font-bold border-b">Category</th>
              <th className="px-6 py-4 font-bold border-b">Lift Name</th>
              <th className="px-6 py-4 font-bold border-b">Inspection Point</th>
              <th className="px-6 py-4 font-bold border-b text-center">Status</th>
              <th className="px-6 py-4 font-bold border-b">Technical Remarks</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-6 py-4 text-center font-semibold text-gray-600">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-black uppercase">
                    {row.categoryName}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 font-semibold">{row.liftname}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{row.checkPointName}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">{getStatusBadge(row.checkPointStatus)}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">{row.remark || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionReportTable;