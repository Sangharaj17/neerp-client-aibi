import React from 'react';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaBriefcase, FaInfoCircle } from 'react-icons/fa';

const MaterialQuotationDetails = ({ quotation }) => {
  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val || 0);

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* 1. Top Banner / Status */}
      <div className="flex justify-between items-start border-b pb-4 mb-6">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900">{quotation.quatationNo}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <FaCalendarAlt className="text-blue-500" /> Issued on: {quotation.quatationDate || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            quotation.isFinal 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            {quotation.isFinal ? '● Finalized' : '○ Draft Mode'}
          </span>
          {quotation.quotFinalDate && (
            <p className="text-[10px] text-gray-400 mt-1 italic">Approved: {quotation.quotFinalDate}</p>
          )}
        </div>
      </div>

      {/* 2. Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Client & Site Card */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
            <FaUser className="text-blue-600" />
            <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Client Details</h4>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between"><span className="text-gray-500">Customer:</span> <span className="font-semibold text-gray-900">{quotation.customerName}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">Site Name:</span> <span className="font-semibold text-gray-900">{quotation.siteName}</span></p>
            <p className="flex justify-between text-xs pt-1"><span className="text-gray-500 italic flex items-center gap-1"><FaMapMarkerAlt size={10}/> Location:</span> <span>On-Site Service</span></p>
          </div>
        </div>

        {/* Project/Work Card */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
            <FaBriefcase className="text-indigo-600" />
            <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Project Reference</h4>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between"><span className="text-gray-500">Job Number:</span> <span className="font-mono font-bold text-blue-700">{quotation.jobNo || 'N/A'}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">Work Period:</span> <span className="font-semibold">{quotation.workPeriod || 'Not Specified'}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">Renewal Ref:</span> <span>{quotation.renewalJobNo || '-'}</span></p>
          </div>
        </div>
      </div>

      {/* 3. Materials Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
            <h4 className="font-bold text-gray-800 text-sm italic">Itemized Material Breakdown</h4>
            <div className="flex-1 border-b border-dashed border-gray-300"></div>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-[11px] uppercase tracking-wider text-gray-600">
                <th className="px-4 py-3 text-left font-bold">Material Description</th>
                <th className="px-4 py-3 text-center font-bold">HSN</th>
                <th className="px-4 py-3 text-center font-bold">Qty</th>
                <th className="px-4 py-3 text-right font-bold">Rate</th>
                <th className="px-4 py-3 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {quotation.details?.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.materialName}</div>
                    {item.guarantee && <div className="text-[10px] text-green-600 font-semibold mt-1">★ Guarantee: {item.guarantee}</div>}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500 font-mono text-xs">{item.hsn || '-'}</td>
                  <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bottom Section: Notes & Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Notes Column */}
        <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
          <h5 className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase mb-2">
            <FaInfoCircle /> Important Notes
          </h5>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            {quotation.note || "No specific terms or notes provided for this quotation."}
          </p>
        </div>

        {/* Totals Column */}
        <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-transform">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Sub-Total</span>
              <span className="font-mono">{formatCurrency(quotation.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>GST ({quotation.gstPercentage}%)</span>
              <span className="font-mono">{(formatCurrency(quotation.gstAmount))}</span>
            </div>
            <div className="border-t border-gray-700 my-2 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold">Grand Total</span>
              <span className="text-2xl font-black text-blue-400 tracking-tighter font-mono">
                {formatCurrency(quotation.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialQuotationDetails;