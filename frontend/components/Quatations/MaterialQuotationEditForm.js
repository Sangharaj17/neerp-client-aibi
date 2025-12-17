'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { PlusCircle, Trash2, Save, XCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast

export default function MaterialQuotationEditForm({ quotationData, onClose, onRefresh }) {
  const [quotationDate, setQuotationDate] = useState(quotationData.quatationDate || '');
  const [note, setNote] = useState(quotationData.note || '');
  const [gst, setGst] = useState(quotationData.gstPercentage || 0);
  const [workPeriods, setWorkPeriods] = useState(quotationData.workPeriods || []);
  const [selectedWorkPeriod, setSelectedWorkPeriod] = useState(quotationData.workPeriod || '');
  const [isFinal, setIsFinal] = useState(quotationData.isFinal === 1);
  const [quotFinalDate, setQuotFinalDate] = useState(quotationData.quotFinalDate || '');
  const [staticHsnCode, setStaticHsnCode] = useState(quotationData.staticHsnCode || 'NA');
  const [isSaving, setIsSaving] = useState(false);

  const [details, setDetails] = useState(
    quotationData.details.map(d => ({
      modQuotDetailId: d.modQuotDetailId,
      materialName: d.materialName,
      hsn: d.hsn,
      quantity: d.quantity,
      rate: d.rate,
      amount: d.amount,
      guarantee: d.guarantee
    }))
  );

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;

    if (field === 'rate' || field === 'quantity') {
      const qty = parseFloat(newDetails[index].quantity || 0);
      const rate = parseFloat(newDetails[index].rate || 0);
      newDetails[index].amount = (qty * rate).toFixed(2);
    }
    setDetails(newDetails);
  };

  const addRow = () =>
    setDetails([...details, { materialName: '', hsn: staticHsnCode, quantity: 1, rate: '', amount: 0, guarantee: '' }]);

  const removeRow = (index) => setDetails(details.filter((_, i) => i !== index));

  const subtotal = details.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2);
  const gstAmount = ((parseFloat(subtotal) * gst) / 100).toFixed(2);
  const totalAmount = (parseFloat(subtotal) + parseFloat(gstAmount)).toFixed(2);

  const handleUpdate = async () => {
    const workPeriodObj = workPeriods.find(wp => wp.name === selectedWorkPeriod);
    if (!workPeriodObj) {
      toast.error("Please select a valid Work Period");
      return;
    }

    const payload = {
      modQuotId: quotationData.modQuotId,
      quatationDate: quotationDate,
      note: note,
      gst: gst,
      workPeriodId: workPeriodObj.workPeriodId,
      isFinal: isFinal ? 1 : 0,
      quotFinalDate: isFinal ? quotFinalDate : null,
      subTotal: parseFloat(subtotal),
      gstAmt: parseFloat(gstAmount),
      grandTotal: parseFloat(totalAmount),
      details: details.map(d => ({
        modQuotDetailId: d.modQuotDetailId,
        materialName: d.materialName,
        hsn: d.hsn,
        quantity: d.quantity,
        rate: d.rate,
        amount: d.amount,
        guarantee: d.guarantee
      }))
    };

    try {
      setIsSaving(true);
      const response = await axiosInstance.put(`/api/amc/material-quotation/update/${quotationData.modQuotId}`, payload);
      
      // Use professional toast
      toast.success(`Quotation ${response.data.quatationNo} updated successfully!`);

      onRefresh(); 
      onClose();   
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update quotation. Please check your network.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-2">
      {/* ... (Same UI as before) ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 border rounded-lg border-blue-100">
        <div>
          <label className="text-[10px] font-bold text-blue-600 uppercase">Quotation No</label>
          <p className="text-sm font-bold text-gray-800">{quotationData.quatationNo}</p>
        </div>
        <div>
          <label className="text-[10px] font-bold text-blue-600 uppercase">Customer</label>
          <p className="text-sm font-medium">{quotationData.customerName}</p>
        </div>
        <div>
          <label className="text-[10px] font-bold text-blue-600 uppercase">Site</label>
          <p className="text-sm font-medium">{quotationData.siteName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Quotation Date</label>
          <input
            type="date"
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={quotationDate}
            onChange={(e) => setQuotationDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Work Period</label>
          <select
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedWorkPeriod}
            onChange={(e) => setSelectedWorkPeriod(e.target.value)}
          >
            <option value="">Select Work Period</option>
            {workPeriods.map((wp) => (
              <option key={wp.workPeriodId} value={wp.name}>
                {wp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">GST (%)</label>
          <input 
            type="number" 
            className="w-full border rounded p-2 text-sm bg-gray-100 font-mono" 
            value={gst} 
            readOnly
          />
        </div>

        <div className="flex flex-col">
            <div className="flex items-center pt-5 gap-2">
            <input
                id="edit-is-final"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={isFinal}
                onChange={(e) => setIsFinal(e.target.checked)}
            />
            <label htmlFor="edit-is-final" className="text-xs font-bold text-gray-700">Mark as Final</label>
            </div>
            {isFinal && (
                <input
                    type="date"
                    className="mt-2 w-full border rounded p-1 text-xs outline-none"
                    value={quotFinalDate}
                    onChange={(e) => setQuotFinalDate(e.target.value)}
                />
            )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden mb-4 shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b">
            <tr>
              <th className="px-3 py-2">Material Description</th>
              <th className="px-3 py-2 w-24">HSN</th>
              <th className="px-3 py-2 w-20 text-center">Qty</th>
              <th className="px-3 py-2 w-28 text-right">Rate</th>
              <th className="px-3 py-2 w-28 text-right">Amount</th>
              <th className="px-3 py-2 w-32">Guarantee</th>
              <th className="px-3 py-2 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {details.map((d, i) => (
              <tr key={i} className="hover:bg-blue-50/30">
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full p-1.5 border border-transparent focus:border-blue-300 rounded outline-none bg-transparent"
                    value={d.materialName}
                    onChange={(e) => handleDetailChange(i, 'materialName', e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full p-1.5 border border-transparent focus:border-blue-300 rounded outline-none font-mono"
                    value={d.hsn}
                    onChange={(e) => handleDetailChange(i, 'hsn', e.target.value)}
                  />
                </td>
                <td className="p-1 text-center">
                  <input
                    type="number"
                    className="w-16 p-1.5 border border-transparent focus:border-blue-300 rounded outline-none text-center"
                    value={d.quantity}
                    onChange={(e) => handleDetailChange(i, 'quantity', e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    className="w-full p-1.5 border border-transparent focus:border-blue-300 rounded outline-none text-right font-mono"
                    value={d.rate}
                    onChange={(e) => handleDetailChange(i, 'rate', e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 text-right font-bold text-gray-700 bg-gray-50/50">
                   {Number(d.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full p-1.5 border border-transparent focus:border-blue-300 rounded outline-none text-gray-600 italic"
                    value={d.guarantee}
                    placeholder="e.g. 1 Year"
                    onChange={(e) => handleDetailChange(i, 'guarantee', e.target.value)}
                  />
                </td>
                <td className="p-1 text-center">
                  <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={addRow}
        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 mb-6 bg-blue-50 px-3 py-1.5 rounded-full"
      >
        <PlusCircle size={14} /> Add Row
      </button>

      <div className="flex flex-col md:flex-row gap-6 border-t pt-6">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-600 mb-1">Notes / Terms</label>
          <textarea
            rows="3"
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-80 space-y-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sub-Total:</span>
            <span className="font-mono">₹ {parseFloat(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">GST ({gst}%):</span>
            <span className="font-mono">₹ {parseFloat(gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-bold text-gray-800">Grand Total:</span>
            <span className="text-lg font-black text-blue-700 font-mono">₹ {parseFloat(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 border-t pt-4">
        <button 
          onClick={onClose}
          disabled={isSaving}
          className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          <XCircle size={18} /> Cancel
        </button>
        <button 
          onClick={handleUpdate}
          disabled={isSaving}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white rounded shadow-md ${isSaving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Save size={18} /> {isSaving ? 'Updating...' : 'Update Quotation'}
        </button>
      </div>
    </div>
  );
}