import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';

const AddSiteExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [amcJobs, setAmcJobs] = useState([]);
  const [amcRenewalJobs, setAmcRenewalJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    expenseType: '',
    amount: '',
    expenseDate: '',
    paymentMethod: '',
    narration: '',
    expenseHandoverToEmployeeId: '',
    amcJobId: '',
    amcRenewalJobId: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      // Fetch employees
      const empResponse = await axiosInstance.get('/api/employees');
      setEmployees(empResponse.data || []);
      
      // Fetch AMC Jobs
      const amcResponse = await axiosInstance.get('/api/site-expenses/getAllActiveJobs');
      setAmcJobs(amcResponse.data || []);
      
      // Fetch AMC Renewal Jobs
      const amcRenewalResponse = await axiosInstance.get('/api/site-expenses/getAllActiveRenewalJobs');
      setAmcRenewalJobs(amcRenewalResponse.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        employeeId: parseInt(formData.employeeId),
        expenseType: formData.expenseType,
        amount: parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        paymentMethod: formData.paymentMethod,
      };

      if (formData.narration) submitData.narration = formData.narration;
      if (formData.expenseHandoverToEmployeeId) submitData.expenseHandoverToEmployeeId = parseInt(formData.expenseHandoverToEmployeeId);
      if (formData.amcJobId) submitData.amcJobId = parseInt(formData.amcJobId);
      if (formData.amcRenewalJobId) submitData.amcRenewalJobId = parseInt(formData.amcRenewalJobId);

      await axiosInstance.post('/api/site-expenses', submitData);
      
      // Reset form
      setFormData({
        employeeId: '',
        expenseType: '',
        amount: '',
        expenseDate: '',
        paymentMethod: '',
        narration: '',
        expenseHandoverToEmployeeId: '',
        amcJobId: '',
        amcRenewalJobId: ''
      });
      
      alert('Site Expense created successfully!');
      onSuccess(); // Callback to refresh dashboard
      onClose(); // Close modal
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Error creating expense: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      employeeId: '',
      expenseType: '',
      amount: '',
      expenseDate: '',
      paymentMethod: '',
      narration: '',
      expenseHandoverToEmployeeId: '',
      amcJobId: '',
      amcRenewalJobId: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Backdrop and Centering (from ActionModal)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={handleClose} // Clicking backdrop closes the modal
    >
      {/* Modal Content Box (from ActionModal) */}
      <div
        className="bg-white w-full max-w-xl rounded-xl shadow-lg animate-fadeIn overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-800">Add New Site Expense</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Employee (Claimant) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee (Claimant) <span className="text-red-500">*</span>
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.employeeName} (ID: {emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Type <span className="text-red-500">*</span>
              </label>
              <select
                name="expenseType"
                value={formData.expenseType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Expense Type</option>
                <option value="TRAVEL">Travel</option>
                <option value="MATERIAL_PURCHASE">Material Purchase</option>
                <option value="LABOUR_CHARGE">Labour Charge</option>
                <option value="FOOD_MISC">Food & Miscellaneous</option>
                <option value="EXTRA_SERVICE_VISIT">Extra Service Visit</option>
                <option value="EMERGENCY_VISIT">Emergency Visit</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
              />
            </div>

            {/* Expense Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Payment Method */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Payment Method</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Card (Credit/Debit)</option>
                <option value="PETTY_CASH">Petty Cash</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Narration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Narration / Description
            </label>
            <textarea
              name="narration"
              value={formData.narration}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter expense description, purpose, or additional notes..."
            />
          </div>

          {/* Optional Fields */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-base font-semibold text-gray-700 mb-3">Optional Linking</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Expense Handover To Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Handover To
                </label>
                <select
                  name="expenseHandoverToEmployeeId"
                  value={formData.expenseHandoverToEmployeeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Employee (Optional)</option>
                  {employees.map(emp => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName} (ID: {emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Related AMC Job */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related AMC Job
                </label>
                <select
                  name="amcJobId"
                  value={formData.amcJobId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select AMC Job (Optional)</option>
                  {amcJobs.map(job => (
                    <option key={job.jobId} value={job.jobId}>
                      Job #{job.jobId} - {job.siteName || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Related AMC Renewal Job */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related AMC Renewal Job
                </label>
                <select
                  name="amcRenewalJobId"
                  value={formData.amcRenewalJobId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select AMC Renewal Job (Optional)</option>
                  {amcRenewalJobs.map(job => (
                    <option key={job.renewalJobId} value={job.renewalJobId}>
                      Job #{job.renewalJobId} - {job.siteName || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions (Footer) */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteExpenseModal;