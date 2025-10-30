'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function MaterialQuotationForm({ customerName, siteName, jobId, jobRenewalId, onClose }) {
  const [quotationDate, setQuotationDate] = useState('');
  const [note, setNote] = useState('');
  const [gst, setGst] = useState(0);
  const [workPeriods, setWorkPeriods] = useState([]);
  const [selectedWorkPeriodId, setSelectedWorkPeriodId] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  const [quotFinalDate, setQuotFinalDate] = useState('');
  const [details, setDetails] = useState([
    { materialName: '', hsn: '', quantity: 1, rate: '', amount: '', guarantee: '' },
  ]);

  // 🔹 Load initial GST, HSN, Work Periods
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await axiosInstance.get('/api/amc/material-quotation/getMaterialQuotationRequestGetData');
        const data = res.data;
        setGst(data.gst);
        setHsnCode(data.hsnCode);
        setWorkPeriods(data.workPeriods);
      } catch (error) {
        console.error('Failed to load quotation setup data:', error);
      }
    };
    fetchRequestData();
  }, []);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;

    // Auto calculate amount
    if (field === 'rate' || field === 'quantity') {
      const qty = parseFloat(newDetails[index].quantity || 0);
      const rate = parseFloat(newDetails[index].rate || 0);
      newDetails[index].amount = (qty * rate).toFixed(2);
    }

    setDetails(newDetails);
  };

  const addRow = () =>
    setDetails([...details, { materialName: '', hsn: hsnCode, quantity: 1, rate: '', amount: '', guarantee: '' }]);
  const removeRow = (index) => setDetails(details.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const payload = {
      quatationDate: quotationDate,
      jobId,
      jobRenewlId: jobRenewalId,
      note,
      gst,
      workPeriodId: selectedWorkPeriodId,
      isFinal,
      quotFinalDate,
      details,
    };

    try {
      const res = await axiosInstance.post('/api/amc/material-quotation/save', payload);
      alert(`Quotation saved successfully! Quotation No: ${res.data.quatationNo}`);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save quotation');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Material Repair Quotation</h2>

      {/* Top Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Customer Name</label>
          <input type="text" value={customerName} readOnly className="w-full border rounded p-2 bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Site Name</label>
          <input type="text" value={siteName} readOnly className="w-full border rounded p-2 bg-gray-100" />
        </div>
      </div>

      {/* Basic Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Quotation Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={quotationDate}
            onChange={(e) => setQuotationDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Work Period</label>
          <select
            className="w-full border rounded p-2"
            value={selectedWorkPeriodId}
            onChange={(e) => setSelectedWorkPeriodId(e.target.value)}
          >
            <option value="">Select Work Period</option>
            {workPeriods.map((p) => (
              <option key={p.workPeriodId} value={p.workPeriodId}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">GST (%)</label>
          <input type="number" className="w-full border rounded p-2" value={gst} readOnly />
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <input type="checkbox" checked={isFinal} onChange={(e) => setIsFinal(e.target.checked)} />
          <label className="text-sm font-medium text-gray-600">Is Final</label>
        </div>
      </div>

      {/* Material Details Table */}
      <h3 className="font-semibold mb-2">Material Details</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Material Name</th>
            <th className="border p-2">HSN</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Guarantee</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {details.map((d, i) => (
            <tr key={i}>
              <td className="border p-1">
                <input
                  type="text"
                  className="w-full p-1"
                  value={d.materialName}
                  onChange={(e) => handleDetailChange(i, 'materialName', e.target.value)}
                />
              </td>
              <td className="border p-1">
                <input
                  type="text"
                  className="w-full p-1"
                  value={d.hsn}
                  onChange={(e) => handleDetailChange(i, 'hsn', e.target.value)}
                />
              </td>
              <td className="border p-1">
                <input
                  type="number"
                  className="w-full p-1"
                  value={d.quantity}
                  onChange={(e) => handleDetailChange(i, 'quantity', e.target.value)}
                />
              </td>
              <td className="border p-1">
                <input
                  type="number"
                  className="w-full p-1"
                  value={d.rate}
                  onChange={(e) => handleDetailChange(i, 'rate', e.target.value)}
                />
              </td>
              <td className="border p-1 text-right">{d.amount}</td>
              <td className="border p-1">
                <input
                  type="text"
                  className="w-full p-1"
                  value={d.guarantee}
                  onChange={(e) => handleDetailChange(i, 'guarantee', e.target.value)}
                />
              </td>
              <td className="border p-1 text-center">
                <button onClick={() => removeRow(i)} className="text-red-500">
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">
        + Add Material
      </button>

      {/* Notes */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600">Note</label>
        <textarea
          className="w-full border rounded p-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
          Cancel
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
          Save Quotation
        </button>
      </div>
    </div>
  );
}
