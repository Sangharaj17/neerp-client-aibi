'use client';

import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrashAlt, FaCode, FaSave } from 'react-icons/fa'; 

import { useRouter } from "next/navigation";

// --- The component now receives the 'id' of the quotation to be edited ---
const ModernizationEdit = ({ id }) => {
     const router = useRouter();

  const [workPeriods, setWorkPeriods] = useState([]);
  const [liftDatas, setLiftDatas] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  // State to hold customer/site names from the fetched data (for display)
  const [customerName, setCustomerName] = useState('...');
  const [siteName, setSiteName] = useState('...');
  
  const [form, setForm] = useState({
    id: id, // ID is essential for the PUT request
    quotationNo: '',
    quotationDate: '',
    enquiryId: '',
    workPeriodId: '',
    jobId: '',
    note: '',
    warranty: '',
    amount: 0, // Total amount (Subtotal)
    amountWithGst: 0, // Total amount with GST
    isFinal: false,
    quotationFinalDate: '',
    gstApplicable: 'yes',
    gstPercentage: 18,
    subtotal: 0,
    gstAmount: 0,
    hsnSacCode: '', // Global HSN/SAC Code state
  });

  const [details, setDetails] = useState([]);
  
  // --- Calculate Totals Logic (REUSED) ---
  const calculateTotals = useCallback((currentDetails, gstPercent, gstApplicable) => {
    const subtotalValue = currentDetails.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0);

    let gstAmountValue = 0;
    if (gstApplicable === 'yes') {
        const gstRate = parseFloat(gstPercent) / 100 || 0;
        gstAmountValue = subtotalValue * gstRate;
    }

    const amountWithGstValue = subtotalValue + gstAmountValue;

    return {
      subtotal: parseFloat(subtotalValue.toFixed(2)),
      gstAmount: parseFloat(gstAmountValue.toFixed(2)),
      amountWithGst: parseFloat(amountWithGstValue.toFixed(2)),
    };
  }, []);


  // --- Recalculate Totals Effect (REUSED) ---
  useEffect(() => {
    const { subtotal, gstAmount, amountWithGst } = calculateTotals(details, form.gstPercentage, form.gstApplicable);

    setForm(prevForm => ({
      ...prevForm,
      subtotal,
      gstAmount,
      amount: subtotal, 
      amountWithGst,
    }));
  }, [details, form.gstPercentage, form.gstApplicable, calculateTotals]);


  // --- Fetch EXISTING modernization data (NEW LOGIC) ---
  useEffect(() => {
    if (!id) {
            setLoading(false);
            toast.error('Quotation ID is missing. Cannot edit.');
            return;
        }

    const fetchExistingData = async () => {
      setLoading(true);
      try {
        // 1. Fetch the existing quotation data (using the View API)
        const res = await axiosInstance.get(`/api/modernization/getModernizationQuotationById/${id}`);
        const data = res.data;
        
        const m = data.modernization;
        const combinedEnquiryId = m.combinedEnquiryId; 

        setForm({
          // Map existing data to the form state
          id: m.id,
          quotationNo: m.quotationNo || '',
          quotationDate: m.quotationDate || '',
          enquiryId: m.enquiryId || '',
          workPeriodId: m.workPeriodId || '',
          jobId: m.jobId || '',
          note: m.note || '',
          warranty: m.warranty || '',
          amount: m.amount || 0,
          amountWithGst: m.amountWithGst || 0,
          isFinal: m.isFinal || false,
          quotationFinalDate: m.quotationFinalDate || '',
          gstApplicable: m.gstApplicable || 'yes',
          gstPercentage: m.gstPercentage || 18,
          subtotal: m.subtotal || 0,
          gstAmount: m.gstAmount || 0,
          // Take HSN from the first detail item for the global state
          hsnSacCode: data.details[0]?.hsn || '', 
        });
        
        // Map detail data, ensuring numeric fields are numbers for calculations
        setDetails(data.details.map(d => ({
          ...d,
          quantity: parseFloat(d.quantity) || 0,
          rate: parseFloat(d.rate) || 0,
          amount: parseFloat(d.amount) || 0,
        })));

        setCustomerName(m.customerName || 'N/A');
        setSiteName(m.siteName || 'N/A');


        // 2. Fetch Pre-data (Work Periods, etc.) using the extracted enquiry ID
        if (combinedEnquiryId) {
          const preDataRes = await axiosInstance.get(`/api/modernization/pre-data/${combinedEnquiryId}`);
          setWorkPeriods(preDataRes.data.workPeriods || []);
          setLiftDatas(preDataRes.data.liftDatas || []);
        }

      } catch (err) {
        console.error('Failed to load existing modernization data:', err);
        toast.error('Failed to load quotation for editing.');
        // Optionally redirect on failure
        // router.push('/dashboard/quotations/ModernizationList'); 
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [id, router]);
  
  // Handlers (REUSED)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const updatedValue = type === 'checkbox' ? checked : value;
    
    let finalValue = updatedValue;
    if (['gstPercentage'].includes(name) && type === 'number') {
      finalValue = parseFloat(value) || 0;
    }

    setForm({ ...form, [name]: finalValue });
  }

  const handleDetailChange = (index, e) => {
    const updated = [...details];
    
    let value = e.target.value;
    if (['quantity', 'rate'].includes(e.target.name)) {
      value = value === '' ? '' : (parseFloat(value) || 0);
    }
    
    updated[index][e.target.name] = value;

    if (e.target.name === 'rate' || e.target.name === 'quantity') {
      const rate = parseFloat(updated[index].rate || 0);
      const qty = parseFloat(updated[index].quantity || 0);
      updated[index].amount = (rate * qty).toFixed(2);
    }
    
    setDetails(updated);
  };
  
  const addDetailRow = () =>
  setDetails([
    ...details,
    { materialName: '', quantity: 1, uom: '', rate: 0, amount: 0, guarantee: '' },
  ]);
  
  const removeDetailRow = (index) => {
    const updated = details.filter((_, i) => i !== index);
    setDetails(updated);
  };

  // --- Handle Submit (UPDATED for PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id) {
      toast.error('Quotation ID is missing. Cannot update.');
      return;
    }

    const payload = {
      modernization: {
        ...form,
        id: form.id, 
        isFinal: Boolean(form.isFinal),
        gstPercentage: parseFloat(form.gstPercentage || 0),
        subtotal: form.subtotal,
        gstAmount: form.gstAmount,
        amount: form.subtotal, 
        amountWithGst: form.amountWithGst,
      },
      details: details.map((d) => ({
        ...d,
        // Inject the global HSN/SAC code into the 'hsn' property of each detail item
        hsn: String(form.hsnSacCode), 
        quantity: parseFloat(d.quantity || 0), 
        rate: parseFloat(d.rate || 0),
        amount: parseFloat(d.amount || 0),
      })),
    };

    try {
      // Use PUT request for updating the existing resource
      await axiosInstance.put(`/api/modernization/update/${form.id}`, payload);
      toast.success('Modernization quotation updated successfully!');
      router.push('/dashboard/quotations/ModernizationList');
    } catch (error) {
      console.error('Update Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update modernization quotation';
      toast.error(errorMessage);
    }
  };

  // Helper for input styling for reusability (REUSED)
  const inputStyle = "w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-sm";
  const readOnlyStyle = `${inputStyle} bg-gray-100 cursor-not-allowed`;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 my-8 text-center text-xl text-blue-600 font-semibold">
        <svg className="animate-spin h-8 w-8 mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading Quotation Data...
      </div>
    );
  }
    
  return (
    <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-xl p-8 my-8">
      <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-6">
        <div>
          {/* Header Text Change */}
          <h2 className="text-3xl font-extrabold text-gray-900">Edit Quotation: {form.quotationNo} ✏️</h2>
          <p className="text-gray-600 mt-2 text-base">
            <span className="font-semibold text-blue-600">Customer:</span> {customerName} &nbsp; | &nbsp;
            <span className="font-semibold text-blue-600">Site:</span> {siteName}
          </p>
        </div>
      </header>

      {/* Lift Info */}
      {liftDatas.length > 0 && (
        <section className="border border-blue-200 rounded-xl p-5 mb-6 bg-blue-50 shadow-sm">
          <h3 className="text-xl font-bold mb-3 text-blue-800">Lift Information ({liftDatas.length} Lift{liftDatas.length > 1 ? 's' : ''}) </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liftDatas.map((lift, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <p className="text-sm"><strong>Name:</strong> <span className="text-gray-700">{lift.liftName}</span></p>
                <p className="text-sm"><strong>Type:</strong> <span className="text-gray-700">{lift.typeOfElevators}</span></p>
                <p className="text-sm"><strong>Capacity:</strong> <span className="text-gray-700">{lift.capacityValue}</span></p>
                <p className="text-sm"><strong>Floors:</strong> <span className="text-gray-700">{lift.noOfFloors}</span></p>
              </div>
            ))}
            </div>
        </section>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quotation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    name="quotationNo"
                    placeholder="Quotation No"
                    value={form.quotationNo}
                    onChange={handleChange}
                    className={readOnlyStyle}
                    readOnly
                />
                <input
                    type="date"
                    name="quotationDate"
                    placeholder="Quotation Date"
                    value={form.quotationDate}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                />
                <input
                    name="jobId"
                    placeholder="Job ID"
                    value={form.jobId}
                    onChange={handleChange}
                    className={readOnlyStyle}
                    readOnly
                />
                <select
                    name="workPeriodId"
                    value={form.workPeriodId}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                >
                    <option value="">Select Work Period</option>
                    {workPeriods.map((wp) => (
                    <option key={wp.workPeriodId} value={wp.workPeriodId}>
                        {wp.name}
                    </option>
                    ))}
                </select>
            </div>
            
            <textarea
                name="note"
                placeholder="Note / Terms & Conditions"
                value={form.note}
                onChange={handleChange}
                className={`${inputStyle} w-full h-24 mt-4`}
            />
            
             <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 items-end">
                {/* Global HSN/SAC Code Input */}
                <div className="relative col-span-1">
                    <label className="text-xs text-gray-500 block mb-1">Global HSN/SAC Code</label>
                    <div className="flex items-center">
                         <input
                            type="text"
                            name="hsnSacCode"
                            placeholder="HSN/SAC Code"
                            value={form.hsnSacCode}
                            onChange={handleChange}
                            className={`${inputStyle} pl-8`}
                            required
                        />
                        <FaCode className="absolute left-2.5 text-gray-400 h-4 w-4" />
                    </div>
                </div>

                {/* GST Applicable Select */}
                <div className="col-span-1">
                     <label className="text-xs text-gray-500 block mb-1">GST Applicable</label>
                    <select
                        name="gstApplicable"
                        value={form.gstApplicable}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                
                {/* GST Percentage Input */}
                <div className="relative col-span-1">
                    <label className="text-xs text-gray-500 block mb-1">GST Percentage</label>
                    <input
                        type="number"
                        name="gstPercentage"
                        placeholder="GST %"
                        value={form.gstPercentage}
                        onChange={handleChange}
                        className={inputStyle}
                        readOnly={form.gstApplicable === 'no'}
                        disabled={form.gstApplicable === 'no'}
                        min="0"
                        step="0.01"
                    />
                    <span className="absolute right-3 top-[34px] transform -translate-y-1/2 text-gray-500 font-semibold">%</span>
                </div>

                {/* Warranty Input */}
                <div className="col-span-1">
                    <label className="text-xs text-gray-500 block mb-1">Warranty Period</label>
                    <input
                        name="warranty"
                        placeholder="Warranty Period"
                        value={form.warranty}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>
                
                {/* Is Final Checkbox */}
                <div className="flex items-center space-x-2 p-2 col-span-1 h-full">
                    <input
                        type="checkbox"
                        id="isFinal"
                        name="isFinal"
                        checked={form.isFinal}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFinal" className="text-sm font-medium text-gray-700">Mark as Final</label>
                    
                    {form.isFinal && (
                        <input
                            type="date"
                            name="quotationFinalDate"
                            placeholder="Final Date"
                            value={form.quotationFinalDate}
                            onChange={handleChange}
                            className={inputStyle}
                            required={form.isFinal}
                        />
                    )}
                </div>
            </div>
        </section>

        {/* Details Table */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Itemized Breakdown</h3>
            <button 
              type="button" 
              onClick={addDetailRow} 
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 text-sm font-medium"
            >
              <FaPlus className="mr-2 h-3 w-3" /> Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-4/12">Material Name</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/12">Qty</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/12">UOM</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/12">Rate</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-2/12">Amount</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-2/12">Guarantee</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/12"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {details.map((d, i) => (
                  <tr key={i}>
                    <td className="py-2 px-3">
                      <input name="materialName" value={d.materialName} onChange={(e) => handleDetailChange(i, e)} className={inputStyle} placeholder="Material" />
                    </td>
                    <td className="py-2 px-3">
                      <input type="number" name="quantity" value={d.quantity} onChange={(e) => handleDetailChange(i, e)} className={inputStyle} placeholder="Qty" min="1" />
                    </td>
                    <td className="py-2 px-3">
                      <input name="uom" value={d.uom} onChange={(e) => handleDetailChange(i, e)} className={inputStyle} placeholder="UOM" />
                    </td>
                    <td className="py-2 px-3">
                      <input type="number" name="rate" value={d.rate} onChange={(e) => handleDetailChange(i, e)} className={inputStyle} placeholder="Rate" min="0" step="0.01" />
                    </td>
                    <td className="py-2 px-3">
                      <input name="amount" value={d.amount} readOnly className={`${readOnlyStyle} text-right font-medium`} placeholder="0.00" />
                    </td>
                    <td className="py-2 px-3">
                      <input name="guarantee" value={d.guarantee} onChange={(e) => handleDetailChange(i, e)} className={inputStyle} placeholder="Warranty" />
                    </td>
                     <td className="py-2 px-3 text-center">
                        <button 
                            type="button" 
                            onClick={() => removeDetailRow(i)} 
                            className="text-red-500 hover:text-red-700 transition"
                        >
                            <FaTrashAlt className="h-4 w-4" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Totals Summary */}
        <section className="flex justify-end mt-8">
            <div className="w-full md:w-1/3 space-y-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center text-gray-700 text-lg border-b border-gray-200 pb-2">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-gray-900">₹ {form.subtotal.toFixed(2)}</span>
                </div>
                {form.gstApplicable === 'yes' ? (
                    <>
                        <div className="flex justify-between items-center text-gray-700 text-lg pt-1">
                            <span>GST ({form.gstPercentage}%):</span>
                            <span className="font-semibold text-red-600">₹ {form.gstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-blue-700 pt-3 border-t-2 border-blue-400">
                            <span>Total (incl. GST):</span>
                            <span>₹ {form.amountWithGst.toFixed(2)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-between items-center text-xl font-bold text-blue-700 pt-3 border-t-2 border-blue-400">
                        <span>Total Amount:</span>
                        <span>₹ {form.subtotal.toFixed(2)}</span>
                    </div>
                )}
            </div>
        </section>


        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition duration-150 ease-in-out font-semibold text-lg shadow-lg flex items-center"
          >
            <FaSave className="mr-2 h-5 w-5" /> Update Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModernizationEdit;