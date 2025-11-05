'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrashAlt, FaCode, FaSave } from 'react-icons/fa';

// Component name changed from ModernizationEdit to OncallEdit
const OncallEdit = ({ id }) => {
  const router = useRouter();
  
  // Base API path
  const API_BASE_PATH = '/api/oncall';

  // ---------------- STATE (No functional changes, just names for context) ----------------
  const [loading, setLoading] = useState(true);
  const [workPeriods, setWorkPeriods] = useState([]);
  const [liftDatas, setLiftDatas] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [details, setDetails] = useState([]);

  const [form, setForm] = useState({
    id,
    quotationNo: '',
    quotationDate: '',
    enquiryId: '',
    workPeriodId: '',
    jobId: '',
    note: '',
    warranty: '',
    amount: 0,
    amountWithGst: 0,
    gstApplicable: 'yes',
    gstPercentage: 18,
    subtotal: 0,
    gstAmount: 0,
    hsnSacCode: '',
  });

  // ... (HELPERS: inputStyle, readOnlyStyle, calculateTotals remain the same) ...
  const inputStyle =
    'w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-sm';
  const readOnlyStyle = `${inputStyle} bg-gray-100 cursor-not-allowed`;

  const calculateTotals = useCallback((items, gstPercent, gstApplicable) => {
    const subtotal = items.reduce(
        (sum, d) => sum + (parseFloat(d.amount) || 0),
        0
    );
    const gstAmount =
        gstApplicable === 'yes' ? (subtotal * (gstPercent || 0)) / 100 : 0;
    const amountWithGst = subtotal + gstAmount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        amountWithGst: Number(amountWithGst.toFixed(2)),
    };
  }, []);

  // ---------------- EFFECTS (API calls updated to 'oncall') ----------------
  // Fetch data
  useEffect(() => {
    if (!id) {
      setLoading(false);
      toast.error('Quotation ID missing!');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. GET OnCall Quotation by ID API call
        const { data } = await axiosInstance.get(
          `${API_BASE_PATH}/getOnCallQuotationById/${id}` // API path updated
        );

        // 🛑 CRITICAL CORRECTION: Access data via 'oncallDto'
        const oncallQuotation = data.oncallDto || {}; 
        const combinedEnquiryId = oncallQuotation.combinedEnquiryId;

        setForm((prev) => ({
          ...prev,
          ...oncallQuotation,
          id: oncallQuotation.id,
          // Note: details is the array of OncallDetailDto, which is correct
          hsnSacCode: data.details?.[0]?.hsn || '',
        }));

        setDetails(
          (data.details || []).map((d) => ({
            ...d,
            quantity: Number(d.quantity) || 0,
            rate: Number(d.rate) || 0,
            amount: Number(d.amount) || 0,
          }))
        );

        setCustomerName(oncallQuotation.customerName || 'N/A');
        setSiteName(oncallQuotation.siteName || 'N/A');

        if (combinedEnquiryId) {
          // 2. GET Pre Data for OnCall Quotation creation API call
          const preRes = await axiosInstance.get(
            `${API_BASE_PATH}/preData/${combinedEnquiryId}` // API path updated
          );
          setWorkPeriods(preRes.data.workPeriods || []);
          setLiftDatas(preRes.data.liftDatas || []);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load oncall quotation');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Auto recalc totals remains the same
  useEffect(() => {
    const { subtotal, gstAmount, amountWithGst } = calculateTotals(
      details,
      form.gstPercentage,
      form.gstApplicable
    );

    setForm((prev) => ({
      ...prev,
      subtotal,
      gstAmount,
      amount: subtotal,
      amountWithGst,
    }));
  }, [details, form.gstPercentage, form.gstApplicable, calculateTotals]);

  // ---------------- HANDLERS (Update API call in handleSubmit) ----------------
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    if (name === 'gstPercentage') newValue = parseFloat(value) || 0;

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDetailChange = (i, e) => {
    const { name, value } = e.target;
    setDetails((prev) =>
      prev.map((item, idx) => {
        if (idx !== i) return item;
        const updated = { ...item, [name]: value };

        if (['quantity', 'rate'].includes(name)) {
          const qty = Number(updated.quantity) || 0;
          const rate = Number(updated.rate) || 0;
          updated.amount = Number((qty * rate).toFixed(2));
        }

        return updated;
      })
    );
  };

  const addDetailRow = () =>
    setDetails((prev) => [
      ...prev,
      {
        materialName: '',
        quantity: 1,
        uom: '',
        rate: 0,
        amount: 0,
        guarantee: '',
      },
    ]);

  const removeDetailRow = (i) =>
    setDetails((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id) {
      toast.error('Quotation ID missing');
      return;
    }

    const payload = {
      // 🛑 CRITICAL CORRECTION: Renamed object property to 'oncallDto' for consistency 
      // with the DTO structure if the backend PUT endpoint expects the same structure
      oncallDto: { 
        ...form,
        gstPercentage: Number(form.gstPercentage),
        subtotal: form.subtotal,
        gstAmount: form.gstAmount,
        amount: form.subtotal,
        amountWithGst: form.amountWithGst,
      },
      oncallDetailDtos: details.map((d) => ({
        ...d,
        hsn: String(form.hsnSacCode),
        quantity: Number(d.quantity) || 0,
        rate: Number(d.rate) || 0,
        amount: Number(d.amount) || 0,
      })),
    };
    
    // Note: If your backend PUT endpoint only accepts a simple structure like { oncall: {...}, details: [...] } 
    // despite the GET returning OncallResponseDto, you should revert the payload key to 'oncall'.
    // I'm assuming for API consistency (GET/PUT), it should be 'oncallDto'. If the update fails, 
    // this might be the reason, and you'd revert 'oncallDto' back to 'oncall' in the payload.

    try {
      // 3. UPDATE OnCall Quotation API call
      await axiosInstance.put(`${API_BASE_PATH}/${form.id}`, payload); // API path and payload structure updated
      toast.success('Oncall Quotation updated successfully');
      // Assuming 'onSave' is passed as a prop from OncallList, use it if available
      // router.push('/dashboard/quotations/OncallList'); // Redirect URL updated (Commented out if used in modal)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // ---------------- RENDER (Display text updated for 'Oncall') ----------------
  if (loading)
    return (
      <div className="text-center p-10 text-blue-600 font-semibold">
        Loading Oncall Quotation Data...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-xl p-8 my-8">
      <header className="flex justify-between items-center pb-6 border-b mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Edit Oncall Quotation: {form.quotationNo || '-'} {/* Display text updated */}
          </h2>
          <p className="text-gray-600 mt-2 text-base">
            <span className="font-semibold text-blue-600">Customer:</span>{' '}
            {customerName} &nbsp;|&nbsp;
            <span className="font-semibold text-blue-600">Site:</span>{' '}
            {siteName}
          </p>
        </div>
      </header>

      {/* Form (All internal controls and logic remain the same) */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Work Period & Info */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="quotationNo"
              value={form.quotationNo}
              readOnly
              className={readOnlyStyle}
            />
            <input
              type="date"
              name="quotationDate"
              value={form.quotationDate}
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="jobId"
              value={form.jobId}
              readOnly
              className={readOnlyStyle}
            />
            <select
              name="workPeriodId"
              value={form.workPeriodId}
              onChange={handleChange}
              className={inputStyle}
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
            value={form.note}
            onChange={handleChange}
            placeholder="Note / Terms & Conditions"
            className={`${inputStyle} w-full h-24 mt-4`}
          />
        </section>
        
        {/* HSN/SAC, GST, Warranty Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
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
        </div>
        
        {/* Details */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Itemized Breakdown
            </h3>
            <button
              type="button"
              onClick={addDetailRow}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaPlus className="mr-2" /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="py-3 px-2 text-left">Material</th>
                  <th className="py-3 px-2 text-left">Qty</th>
                  <th className="py-3 px-2 text-left">UOM</th>
                  <th className="py-3 px-2 text-left">Rate</th>
                  <th className="py-3 px-2 text-left">Amount</th>
                  <th className="py-3 px-2 text-left">Warranty</th>
                  <th className="py-3 px-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => (
                  <tr key={i}>
                    <td className="p-2">
                      <input
                        name="materialName"
                        value={d.materialName}
                        onChange={(e) => handleDetailChange(i, e)}
                        className={inputStyle}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        name="quantity"
                        value={d.quantity}
                        min="1"
                        onChange={(e) => handleDetailChange(i, e)}
                        className={inputStyle}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="uom"
                        value={d.uom}
                        onChange={(e) => handleDetailChange(i, e)}
                        className={inputStyle}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        name="rate"
                        value={d.rate}
                        step="0.01"
                        onChange={(e) => handleDetailChange(i, e)}
                        className={inputStyle}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        readOnly
                        name="amount"
                        value={d.amount}
                        className={`${readOnlyStyle} text-right`}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="guarantee"
                        value={d.guarantee}
                        onChange={(e) => handleDetailChange(i, e)}
                        className={inputStyle}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeDetailRow(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals */}
        <section className="flex justify-end">
          <div className="w-full md:w-1/3 p-4 bg-gray-50 border rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <strong>₹ {form.subtotal.toFixed(2)}</strong>
            </div>
            {form.gstApplicable === 'yes' && (
              <>
                <div className="flex justify-between mb-2">
                  <span>GST ({form.gstPercentage}%):</span>
                  <strong className="text-red-600">
                    ₹ {form.gstAmount.toFixed(2)}
                  </strong>
                </div>
              </>
            )}
            <div className="flex justify-between font-bold text-blue-700 border-t pt-2">
              <span>Total:</span>
              <span>₹ {form.amountWithGst.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
          >
            <FaSave className="mr-2" /> Update Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default OncallEdit;