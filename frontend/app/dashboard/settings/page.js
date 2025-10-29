'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

export default function CompanySettings() {
  const [formData, setFormData] = useState({
    refName: 'SMASH',
    companyOwnerName: '',
    companyName: '',
    ownerNumber: '',
    companyMail: '',
    bccMail: '',
    companyGst: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
    officeAddressLine1: '',
    officeAddressLine2: '',
    officeMail: '',
    officeNumber: '',
    tollFreeNumber: '',
    sacCodeAmc: '',
    sacCodeNewInstallation: '',
    sacCodeOnCall: '',
    sacCodeModernization: '',
    sacCodeMaterialRepairLabor: '',
    hsnCodeCommonRepairMaterial: '',
    gstRateAmcTotalPercentage: '',
    gstRateNewInstallationTotalPercentage: '',
    gstRateRepairTotalPercentage: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch company settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/settings/${formData.refName}`);
        if (response.data) {
          setFormData(response.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        toast.error('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/v1/settings', formData);
      toast.success('Settings saved successfully!');
      setFormData(response.data);
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings.');
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">🏢 Company Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Reference Name" name="refName" value={formData.refName} onChange={handleChange} readOnly />
          <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
          <Input label="Owner Name" name="companyOwnerName" value={formData.companyOwnerName} onChange={handleChange} />
          <Input label="Owner Number" name="ownerNumber" value={formData.ownerNumber} onChange={handleChange} />
          <Input label="Company Mail" name="companyMail" value={formData.companyMail} onChange={handleChange} />
          <Input label="BCC Mail" name="bccMail" value={formData.bccMail} onChange={handleChange} />
          <Input label="Company GST" name="companyGst" value={formData.companyGst} onChange={handleChange} />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">🏦 Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
          <Input label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} />
          <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
          <Input label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">🏢 Office Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Address Line 1" name="officeAddressLine1" value={formData.officeAddressLine1} onChange={handleChange} />
          <Input label="Address Line 2" name="officeAddressLine2" value={formData.officeAddressLine2} onChange={handleChange} />
          <Input label="Office Mail" name="officeMail" value={formData.officeMail} onChange={handleChange} />
          <Input label="Office Number" name="officeNumber" value={formData.officeNumber} onChange={handleChange} />
          <Input label="Toll Free Number" name="tollFreeNumber" value={formData.tollFreeNumber} onChange={handleChange} />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">💰 GST / HSN / SAC Codes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="SAC Code - AMC" name="sacCodeAmc" value={formData.sacCodeAmc} onChange={handleChange} />
          <Input label="SAC Code - New Installation" name="sacCodeNewInstallation" value={formData.sacCodeNewInstallation} onChange={handleChange} />
          <Input label="SAC Code - On Call" name="sacCodeOnCall" value={formData.sacCodeOnCall} onChange={handleChange} />
          <Input label="SAC Code - Modernization" name="sacCodeModernization" value={formData.sacCodeModernization} onChange={handleChange} />
          <Input label="SAC Code - Material Repair/Labor" name="sacCodeMaterialRepairLabor" value={formData.sacCodeMaterialRepairLabor} onChange={handleChange} />
          <Input label="HSN Code - Common Repair Material" name="hsnCodeCommonRepairMaterial" value={formData.hsnCodeCommonRepairMaterial} onChange={handleChange} />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">📊 GST Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="GST Rate (AMC %)" name="gstRateAmcTotalPercentage" value={formData.gstRateAmcTotalPercentage} onChange={handleChange} />
          <Input label="GST Rate (New Installation %)" name="gstRateNewInstallationTotalPercentage" value={formData.gstRateNewInstallationTotalPercentage} onChange={handleChange} />
          <Input label="GST Rate (Repair %)" name="gstRateRepairTotalPercentage" value={formData.gstRateRepairTotalPercentage} onChange={handleChange} />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            💾 Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input component
function Input({ label, name, value, onChange, readOnly = false }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value ?? ''}
        onChange={onChange}
        readOnly={readOnly}
        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
