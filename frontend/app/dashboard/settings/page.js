'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

export default function CompanySettings() {
  const initialRef = 'COMPANY_SETTINGS_1';

  const [formData, setFormData] = useState({
    refName: initialRef,
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
    logo: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  // Check if profile is complete
  const checkProfileComplete = (data) => {
    const requiredFields = [
      'companyName',
      'companyOwnerName',
      'companyMail',
      'officeAddressLine1',
      'officeNumber',
    ];
    
    const isComplete = requiredFields.every(field => {
      const value = data[field];
      return value && value.trim() !== '';
    });
    
    setProfileIncomplete(!isComplete);
    return isComplete;
  };

  // Fetch settings once on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/settings/${initialRef}`);
        const data = res?.data;
        if (data) {
          // set all fields present in response, keep defaults for missing
          setFormData((prev) => ({ ...prev, ...data }));

          // Check if profile is complete
          checkProfileComplete(data);

          // Decide preview URL:
          // - if backend returns full data URL (starts with 'data:')
          // - if backend returns plain base64, prefix it
          if (data.logo) {
            const logoStr = data.logo;
            if (logoStr.startsWith('data:')) {
              setPreviewUrl(logoStr);
            } else {
              // assume raw base64, default to PNG
              setPreviewUrl(`data:image/png;base64,${logoStr}`);
            }
          } else {
            setPreviewUrl(null);
          }
        } else {
          // No data returned - profile is incomplete
          setProfileIncomplete(true);
        }
      } catch (err) {
        // Only show error if it's not a 404 (settings might not exist yet)
        if (err.response?.status !== 404) {
          toast.error('Failed to load company settings.');
        } else {
          // Settings don't exist yet - profile is incomplete
          setProfileIncomplete(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Check profile completeness when key fields change
      if (['companyName', 'companyOwnerName', 'companyMail', 'officeAddressLine1', 'officeNumber'].includes(name)) {
        checkProfileComplete(updated);
      }
      return updated;
    });
  };

  // Handle image selection: convert to data URL and set into formData.logo
  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Optional: small client-side validation (size/type)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result is full data URL like: data:image/png;base64,AAA...
      const dataUrl = reader.result;
      setPreviewUrl(dataUrl);
      // Save full data URL to formData.logo (service will accept full data URL)
      setFormData((prev) => ({ ...prev, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // Save settings — send JSON with logo (data URL or raw base64)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (saving) return; // Prevent double submission
    
    setSaving(true);
    
    try {
      // Prepare payload: ensure we send plain JS object (no File/FormData)
      const payload = { ...formData };

      // If logo exists and is a data URL, you may choose to send full data URL or strip prefix.
      // Our backend service normalizes both forms. We'll send as full data URL.
      await axiosInstance.post('/api/v1/settings', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Settings saved successfully!');
      
      // Check if profile is now complete
      checkProfileComplete(payload);
      
      // fetch latest saved DTO back to update any normalization server did
      try {
        const res = await axiosInstance.get(`/api/v1/settings/${formData.refName}`);
        if (res?.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
          if (res.data.logo) {
            setPreviewUrl(res.data.logo.startsWith('data:') ? res.data.logo : `data:image/png;base64,${res.data.logo}`);
          }
        }
      } catch (fetchErr) {
        // Silently handle fetch error - settings were saved successfully
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save settings.';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-4">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your company information, bank details, and GST settings.
        </p>
      </div>

      {profileIncomplete && (
        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Profile Incomplete</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please complete your company profile by filling in the required fields: Company Name, Owner Name, Company Email, Office Address, and Office Number.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Logo Section */}
          <div className="flex flex-col items-center py-4 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Company Logo"
                className="w-32 h-32 object-contain border border-gray-300 rounded-md mb-3"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded-md mb-3 text-gray-400 text-sm">
                No Logo
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Reference Name" name="refName" value={formData.refName} onChange={handleChange} readOnly />
              <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              <Input label="Owner Name" name="companyOwnerName" value={formData.companyOwnerName} onChange={handleChange} required />
              <Input label="Owner Number" name="ownerNumber" value={formData.ownerNumber} onChange={handleChange} />
              <Input label="Company Mail" name="companyMail" value={formData.companyMail} onChange={handleChange} required type="email" />
              <Input label="BCC Mail" name="bccMail" value={formData.bccMail} onChange={handleChange} type="email" />
              <Input label="Company GST" name="companyGst" value={formData.companyGst} onChange={handleChange} />
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
              <Input label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} />
              <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
              <Input label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            </div>
          </div>

          {/* Office Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Address Line 1" name="officeAddressLine1" value={formData.officeAddressLine1} onChange={handleChange} required />
              <Input label="Address Line 2" name="officeAddressLine2" value={formData.officeAddressLine2} onChange={handleChange} />
              <Input label="Office Mail" name="officeMail" value={formData.officeMail} onChange={handleChange} type="email" />
              <Input label="Office Number" name="officeNumber" value={formData.officeNumber} onChange={handleChange} required />
              <Input label="Toll Free Number" name="tollFreeNumber" value={formData.tollFreeNumber} onChange={handleChange} />
            </div>
          </div>

          {/* GST / HSN / SAC Codes */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GST / HSN / SAC Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="SAC Code - AMC" name="sacCodeAmc" value={formData.sacCodeAmc} onChange={handleChange} />
              <Input label="SAC Code - New Installation" name="sacCodeNewInstallation" value={formData.sacCodeNewInstallation} onChange={handleChange} />
              <Input label="SAC Code - On Call" name="sacCodeOnCall" value={formData.sacCodeOnCall} onChange={handleChange} />
              <Input label="SAC Code - Modernization" name="sacCodeModernization" value={formData.sacCodeModernization} onChange={handleChange} />
              <Input label="SAC Code - Material Repair/Labor" name="sacCodeMaterialRepairLabor" value={formData.sacCodeMaterialRepairLabor} onChange={handleChange} />
              <Input label="HSN Code - Common Repair Material" name="hsnCodeCommonRepairMaterial" value={formData.hsnCodeCommonRepairMaterial} onChange={handleChange} />
            </div>
          </div>

          {/* GST Rates */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="GST Rate (AMC %)" name="gstRateAmcTotalPercentage" value={formData.gstRateAmcTotalPercentage} onChange={handleChange} type="number" />
              <Input label="GST Rate (New Installation %)" name="gstRateNewInstallationTotalPercentage" value={formData.gstRateNewInstallationTotalPercentage} onChange={handleChange} type="number" />
              <Input label="GST Rate (Repair %)" name="gstRateRepairTotalPercentage" value={formData.gstRateRepairTotalPercentage} onChange={handleChange} type="number" />
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-colors"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Input component
function Input({ label, name, value, onChange, readOnly = false, type = 'text', required = false }) {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          readOnly ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white'
        }`}
      />
    </div>
  );
}
