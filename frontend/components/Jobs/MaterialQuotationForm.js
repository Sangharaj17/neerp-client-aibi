'use client';

import { useState, useEffect } from 'react';
// Assuming '@/utils/axiosInstance' is correctly configured
import axiosInstance from '@/utils/axiosInstance';
import { PlusCircle, Trash2, Save, XCircle } from 'lucide-react'; // Importing icons for a cleaner look

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
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial data

  // 🔹 Load initial GST, HSN, Work Periods
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await axiosInstance.get('/api/amc/material-quotation/getMaterialQuotationRequestGetData');
        const data = res.data;
        setGst(data.gst);
        setHsnCode(data.hsnCode);
        setWorkPeriods(data.workPeriods);
        // Set HSN code for the initial detail row
        setDetails([{ materialName: '', hsn: data.hsnCode, quantity: 1, rate: '', amount: '', guarantee: '' }]);
      } catch (error) {
        console.error('Failed to load quotation setup data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequestData();
  }, []);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;

    // Auto calculate amount
    if (field === 'rate' || field === 'quantity') {
      // Ensure quantity is at least 1 for proper calculation and validation later
      const qty = parseFloat(newDetails[index].quantity || 0) || 0;
      const rate = parseFloat(newDetails[index].rate || 0) || 0;
      newDetails[index].amount = (qty * rate).toFixed(2);
    }

    setDetails(newDetails);
  };

  const addRow = () =>
    setDetails([...details, { materialName: '', hsn: hsnCode, quantity: 1, rate: '', amount: '', guarantee: '' }]);
  const removeRow = (index) => setDetails(details.filter((_, i) => i !== index));

  // Calculate Subtotal for display
  const subtotal = details.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2);
  const gstAmount = ((parseFloat(subtotal) * gst) / 100).toFixed(2);
  const totalAmount = (parseFloat(subtotal) + parseFloat(gstAmount)).toFixed(2);

  const handleSubmit = async () => {
    if (!quotationDate || !selectedWorkPeriodId) {
      alert('Please fill in the Quotation Date and select a Work Period.');
      return;
    }

    // Basic validation for material details
    const hasInvalidDetail = details.some(d => !d.materialName || parseFloat(d.quantity) <= 0 || parseFloat(d.rate) <= 0);
    if (hasInvalidDetail) {
      alert('Please ensure all Material Name, Quantity ( > 0) and Rate ( > 0) fields are filled correctly.');
      return;
    }
    
    if (isFinal && !quotFinalDate) {
        alert('Please select a Final Date if "Is Final" is checked.');
        return;
    }

    const payload = {
      quatationDate: quotationDate,
      jobId,
      jobRenewlId: jobRenewalId,
      note,
      gst,
      subTotal : subtotal,
      gstAmt : gstAmount,
      grandTotal : totalAmount,
      workPeriodId: selectedWorkPeriodId,
      isFinal,
      quotFinalDate: isFinal ? quotFinalDate : null, // Send only if isFinal is true
      details,
    };

    try {
      const res = await axiosInstance.post('/api/amc/material-quotation/save', payload);
      alert(`Quotation saved successfully! Quotation No: ${res.data.quatationNo}`);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save quotation. Check the console for details.');
    }
  };
  
  // Display a loading state while fetching initial data
  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading initial data...</p>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">
        🛠️ Material Repair Quotation
      </h2>

      {/* --- Customer and Site Info (Read-only) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-indigo-50/50">
        <div>
          <label className="block text-xs font-medium text-indigo-600 uppercase">Customer Name</label>
          <p className="font-semibold text-gray-800 border-b border-indigo-200 py-1">{customerName}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-indigo-600 uppercase">Site Name</label>
          <p className="font-semibold text-gray-800 border-b border-indigo-200 py-1">{siteName}</p>
        </div>
      </div>

      {/* --- Basic Fields --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            value={quotationDate}
            onChange={(e) => setQuotationDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Period <span className="text-red-500">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={selectedWorkPeriodId}
            onChange={(e) => setSelectedWorkPeriodId(e.target.value)}
            required
          >
            <option value="">Select Period</option>
            {workPeriods.map((p) => (
              <option key={p.workPeriodId} value={p.workPeriodId}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST (%)</label>
          <input type="number" className="w-full border rounded-md p-2 bg-gray-100 text-gray-600" value={gst} readOnly />
        </div>
        
        <div className='flex flex-col justify-end'>
          <div className="flex items-center space-x-2 pb-2">
            <input 
                id="is-final-checkbox"
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={isFinal} 
                onChange={(e) => setIsFinal(e.target.checked)} 
            />
            <label htmlFor="is-final-checkbox" className="text-sm font-medium text-gray-700 select-none">Is Final Quotation</label>
          </div>
        </div>

      </div>

      {/* Final Date - Only show if isFinal is checked */}
      {isFinal && (
          <div className="w-1/4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Final Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={quotFinalDate}
              onChange={(e) => setQuotFinalDate(e.target.value)}
              required={isFinal}
            />
          </div>
      )}


      {/* --- Material Details Table --- */}
      <h3 className="text-lg font-bold mb-3 text-gray-700">📋 Material Details</h3>
      <div className="overflow-x-auto shadow-md rounded-lg mb-6">
        <table className="w-full min-w-max text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-3 py-3">Material Name <span className="text-red-500">*</span></th>
              <th scope="col" className="px-3 py-3 w-20">HSN</th>
              <th scope="col" className="px-3 py-3 w-20 text-right">Qty <span className="text-red-500">*</span></th>
              <th scope="col" className="px-3 py-3 w-24 text-right">Rate <span className="text-red-500">*</span></th>
              <th scope="col" className="px-3 py-3 w-28 text-right">Amount</th>
              <th scope="col" className="px-3 py-3 w-28">Guarantee</th>
              <th scope="col" className="px-3 py-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {details.map((d, i) => (
              <tr key={i} className="bg-white border-b hover:bg-gray-50 transition duration-100">
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full p-1 border-none focus:ring-0 text-gray-900"
                    value={d.materialName}
                    onChange={(e) => handleDetailChange(i, 'materialName', e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full p-1 border-none focus:ring-0 text-gray-900"
                    value={d.hsn}
                    onChange={(e) => handleDetailChange(i, 'hsn', e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    min="1"
                    className="w-full p-1 border-none focus:ring-0 text-right text-gray-900"
                    value={d.quantity}
                    onChange={(e) => handleDetailChange(i, 'quantity', e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full p-1 border-none focus:ring-0 text-right text-gray-900"
                    value={d.rate}
                    onChange={(e) => handleDetailChange(i, 'rate', e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 text-right font-medium text-gray-900 bg-gray-50/50">
                  {d.amount}
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full p-1 border-none focus:ring-0 text-gray-900"
                    value={d.guarantee}
                    onChange={(e) => handleDetailChange(i, 'guarantee', e.target.value)}
                  />
                </td>
                <td className="p-1 text-center">
                  <button 
                    onClick={() => removeRow(i)} 
                    className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded hover:bg-red-50"
                    title="Remove Row"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={addRow} 
        className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 text-sm font-medium shadow-md"
      >
        <PlusCircle size={18} />
        <span>Add Material</span>
      </button>
      
      {/* --- Totals and Notes --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note / Terms & Conditions</label>
          <textarea
            rows="4"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any specific notes or terms here..."
          />
        </div>

        <div className="md:col-span-1 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-bold text-md text-gray-800 mb-2">Summary</h4>
          <div className="space-y-1 text-sm">
              <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-800">₹ {subtotal}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">GST ({gst}%):</span>
                  <span className="font-medium text-gray-800">₹ {gstAmount}</span>
              </div>
              <div className="flex justify-between pt-2">
                  <span className="text-lg font-bold text-indigo-700">Total Amount:</span>
                  <span className="text-lg font-bold text-indigo-700">₹ {totalAmount}</span>
              </div>
          </div>
        </div>
      </div>


      {/* --- Buttons --- */}
      <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150 font-medium"
        >
            <XCircle size={20} />
            <span>Cancel</span>
        </button>
        <button 
          onClick={handleSubmit} 
          className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 font-medium shadow-lg shadow-green-200/50"
        >
            <Save size={20} />
            <span>Save Quotation</span>
        </button>
      </div>
    </div>
  );
}