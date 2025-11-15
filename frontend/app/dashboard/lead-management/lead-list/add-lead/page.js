'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus,
  Mail,
  Phone,
  Building2,
  LocateIcon,
  PlusCircle,
  Trash2
} from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AddLeadPage() {
  const [executives, setExecutives] = useState([]);
  const router = useRouter();

  // Load options (untouched)
  useEffect(() => {
    axiosInstance.get('/api/employees/executives').then((res) => {
      const formatted = res.data.map((emp) => ({
        value: emp.employeeId,
        label: emp.employeeName,
      }));
      setExecutives(formatted);
    });
  }, []);

  const [leadSources, setLeadSources] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [leadStageOptions, setLeadStageOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/leadmanagement/lead-sources').then((res) => {
      setLeadSources(res.data.map((src) => ({ value: src.leadSourceId, label: src.sourceName })));
    });
    axiosInstance.get('/api/enquiry-types').then((res) => {
      setLeadTypes(res.data.map((item) => item.enquiryTypeName));
    });
    axiosInstance.get('/api/leadmanagement/areas').then((res) => {
      setAreaOptions(res.data.map((area) => ({ value: area.areaId, label: area.areaName })));
    });
    axiosInstance.get('/api/leadmanagement/lead-stages').then((res) => {
      setLeadStageOptions(res.data.map((stage) => ({ value: stage.stageId, label: stage.stageName })));
    });
    axiosInstance.get('/api/leadmanagement/designations').then((res) => {
      setDesignationOptions(res.data.map((designation) => ({
        value: designation.designationId,
        label: designation.designationName
      })));
    });
  }, []);

  const [formData, setFormData] = useState({
    leadDate: '',
    executive: '',
    leadSource: '',
    leadType: '',
    customer1Title: 'Mr.',
    customer1Name: '',
    customer1Designation: '',
    customer1Contact: '',
    customer2Title: 'Mr.',
    customer2Name: '',
    customer2Designation: '',
    customer2Contact: '',
    companyName: '',
    siteSame: 'Yes',
    siteName: '',
    email: '',
    email2: '',
    contactCountry: 'India (+91)',
    contactNo: '',
    landlineNo: '',
    companyAddress: '',
    siteSameAddress: 'Yes',
    siteAddress: '',
    area: '',
    leadStage: '',
  });

  const [showCustomer2, setShowCustomer2] = useState(false);
  const [showEmail2, setShowEmail2] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Helper function to check if value is empty
    const isEmpty = (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (typeof value === 'number' && (isNaN(value) || value === 0)) return false; // 0 is valid for IDs
      return false;
    };

    // Required fields validation - strict checking
    if (!formData.leadDate || formData.leadDate === '') {
      newErrors.leadDate = 'Lead date is required';
    }
    
    if (!formData.executive || formData.executive === '' || formData.executive === '0') {
      newErrors.executive = 'Executive is required';
    }
    
    if (!formData.leadSource || formData.leadSource === '' || formData.leadSource === '0') {
      newErrors.leadSource = 'Lead source is required';
    }
    
    if (!formData.leadType || formData.leadType === '' || formData.leadType.trim() === '') {
      newErrors.leadType = 'Lead type is required';
    }
    
    if (isEmpty(formData.customer1Name)) {
      newErrors.customer1Name = 'Customer name is required';
    }
    
    if (!formData.customer1Designation || formData.customer1Designation === '' || formData.customer1Designation === '0') {
      newErrors.customer1Designation = 'Customer designation is required';
    }
    
    if (isEmpty(formData.companyName)) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (isEmpty(formData.contactNo)) {
      newErrors.contactNo = 'Contact number is required';
    }
    
    if (isEmpty(formData.companyAddress)) {
      newErrors.companyAddress = 'Company address is required';
    }
    
    // Conditional required fields
    if (formData.siteSame === 'No' && isEmpty(formData.siteName)) {
      newErrors.siteName = 'Site name is required when different from company';
    }
    
    if (formData.siteSameAddress === 'No' && isEmpty(formData.siteAddress)) {
      newErrors.siteAddress = 'Site address is required when different from company';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    if (!isValid) {
      console.log('Validation failed:', newErrors);
    }
    
    return { isValid, errors: newErrors };
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }

    if(e.target.name === 'companyName'){
       setFormData((prev) => ({ ...prev, ['siteName']: e.target.value }));
    }

    if(e.target.name === 'companyAddress'){
        setFormData((prev) => ({ ...prev, ['siteAddress']: e.target.value }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stop submission if already submitting
    if (isSubmitting) {
      return;
    }
    
    // Validate form
    const { isValid, errors: validationErrors } = validateForm();
    
    if (!isValid) {
      const errorCount = Object.keys(validationErrors).length;
      toast.error(`Please fill in ${errorCount} required field${errorCount > 1 ? 's' : ''}`);
      
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = Object.keys(validationErrors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }
      }, 100);
      return; // IMPORTANT: Exit early to prevent submission
    }
    
    // Double-check critical required fields before proceeding
    if (!formData.leadDate || !formData.executive || !formData.leadSource || !formData.leadType || 
        !formData.customer1Name?.trim() || !formData.customer1Designation || 
        !formData.companyName?.trim() || !formData.contactNo?.trim() || !formData.companyAddress?.trim()) {
      toast.error('Please fill in all required fields');
      console.error('Critical validation failed:', {
        leadDate: formData.leadDate,
        executive: formData.executive,
        leadSource: formData.leadSource,
        leadType: formData.leadType,
        customer1Name: formData.customer1Name,
        customer1Designation: formData.customer1Designation,
        companyName: formData.companyName,
        contactNo: formData.contactNo,
        companyAddress: formData.companyAddress
      });
      return; // Exit to prevent submission
    }

    setIsSubmitting(true);

    // Final validation - ensure all required fields have valid values before creating payload
    const finalValidationErrors = [];
    if (!formData.leadDate || formData.leadDate === '') finalValidationErrors.push('Lead Date');
    if (!formData.executive || formData.executive === '' || formData.executive === '0') finalValidationErrors.push('Executive');
    if (!formData.leadSource || formData.leadSource === '' || formData.leadSource === '0') finalValidationErrors.push('Lead Source');
    if (!formData.leadType || formData.leadType.trim() === '') finalValidationErrors.push('Lead Type');
    if (!formData.customer1Name || formData.customer1Name.trim() === '') finalValidationErrors.push('Customer Name');
    if (!formData.customer1Designation || formData.customer1Designation === '' || formData.customer1Designation === '0') finalValidationErrors.push('Customer Designation');
    if (!formData.companyName || formData.companyName.trim() === '') finalValidationErrors.push('Company Name');
    if (!formData.contactNo || formData.contactNo.trim() === '') finalValidationErrors.push('Contact Number');
    if (!formData.companyAddress || formData.companyAddress.trim() === '') finalValidationErrors.push('Company Address');
    
    if (formData.siteSame === 'No' && (!formData.siteName || formData.siteName.trim() === '')) {
      finalValidationErrors.push('Site Name');
    }
    if (formData.siteSameAddress === 'No' && (!formData.siteAddress || formData.siteAddress.trim() === '')) {
      finalValidationErrors.push('Site Address');
    }
    
    if (finalValidationErrors.length > 0) {
      setIsSubmitting(false);
      toast.error(`Missing required fields: ${finalValidationErrors.join(', ')}`);
      console.error('Final validation failed:', finalValidationErrors);
      return; // Exit to prevent submission
    }

    const payload = {
      leadDate: new Date(formData.leadDate).toISOString(),
      activityById: parseInt(formData.executive),
      leadSourceId: parseInt(formData.leadSource),
      leadType: formData.leadType.trim(),
      salutations: formData.customer1Title,
      customerName: formData.customer1Name.trim(),
      designationId: parseInt(formData.customer1Designation),
      contactNo: formData.contactNo.trim(),
      customer1Contact: formData.customer1Contact?.trim() || null,
      customer2Contact: formData.customer2Contact?.trim() || null,
      landlineNo: formData.landlineNo?.trim() || null,
      salutations2: formData.customer2Title,
      customerName2: formData.customer2Name?.trim() || null,
      designation2Id: formData.customer2Designation ? parseInt(formData.customer2Designation) : null,
      leadCompanyName: formData.companyName.trim(),
      siteName: formData.siteSame === 'Yes' ? formData.companyName.trim() : (formData.siteName?.trim() || formData.companyName.trim()),
      emailId: formData.email?.trim() || null,
      emailId2: formData.email2?.trim() || null,
      countryCode: formData.contactCountry.split('(')[1]?.replace(')', ''),
      address: formData.companyAddress.trim(),
      siteAddress: formData.siteSameAddress === 'Yes' ? formData.companyAddress.trim() : (formData.siteAddress?.trim() || formData.companyAddress.trim()),
      areaId: formData.area ? parseInt(formData.area) : null,
      leadStageId: formData.leadStage ? parseInt(formData.leadStage) : null,
      status: 'Open',
    };

    try {
      await axiosInstance.post("/api/leadmanagement/leads", payload);
      toast.success('Lead added successfully!');
      router.push(`/dashboard/lead-management/lead-list`);
    } catch (error) {
      console.error('Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Payload sent:', payload);
      
      // Handle different error types
      let errorMessage = 'Failed to add lead. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          // Try to extract detailed error message
          if (data?.message) {
            errorMessage = data.message;
          } else if (typeof data === 'string') {
            errorMessage = data;
          } else if (data?.error) {
            errorMessage = data.error;
          } else if (data?.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map(e => e.defaultMessage || e.message || e.field).join(', ');
          } else if (data?.fieldErrors) {
            errorMessage = Object.entries(data.fieldErrors).map(([field, msg]) => `${field}: ${msg}`).join(', ');
          } else {
            errorMessage = 'Invalid data. Please check all required fields are filled correctly.';
          }
        } else if (status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (status === 500) {
          errorMessage = data?.message || 'Server error. Please try again later.';
        } else {
          errorMessage = data?.message || data?.error || `Error (${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Could not connect to server. Please check your internet connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2 flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-neutral-700" /> Add New Lead
          </h1>
          <p className="text-sm text-neutral-600">
            Fill in the details below to create a new lead
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <InputField label="Lead Date *" type="date" name="leadDate" value={formData.leadDate} onChange={handleChange} required error={errors.leadDate} />
            <SelectField label="Select Executive *" name="executive" options={executives} value={formData.executive} onChange={handleChange} error={errors.executive} />
            <SelectField label="Lead Source *" name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} error={errors.leadSource} />
            <SelectField label="Lead Type *" name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} error={errors.leadType} />

            {/* Customer 1 */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <label className="block text-sm font-medium text-neutral-700 mb-3">Customer *</label>
              {(errors.customer1Name || errors.customer1Designation) && (
                <p className="text-xs text-red-600 mb-2">{errors.customer1Name || errors.customer1Designation}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <select name="customer1Title" value={formData.customer1Title} onChange={handleChange} className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
                  <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                </select>
                <input type="text" name="customer1Name" placeholder="Name" value={formData.customer1Name} onChange={handleChange} className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.customer1Name ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-400'}`} />
                <select name="customer1Designation" value={formData.customer1Designation} onChange={handleChange} className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.customer1Designation ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-400'}`}>
                  <option value="">Select Designation</option>
                  {designationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input type="text" name="customer1Contact" placeholder="Contact" value={formData.customer1Contact} onChange={handleChange} className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400" />
                {!showCustomer2 && (
                  <button type="button" onClick={() => setShowCustomer2(true)} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Add</button>
                )}
              </div>
            </div>

            {/* Customer 2 */}
            {showCustomer2 && (
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <label className="block text-sm font-medium text-neutral-700 mb-3">Customer 2 *</label>
                <div className="flex flex-wrap items-center gap-3">
                  <select name="customer2Title" value={formData.customer2Title} onChange={handleChange} className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
                    <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                  </select>
                  <input type="text" name="customer2Name" placeholder="Name 2" value={formData.customer2Name} onChange={handleChange} className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400" />
                  <select name="customer2Designation" value={formData.customer2Designation} onChange={handleChange} className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
                    <option value="">Owner</option><option value="Manager">Chairman</option><option value="Executive">Executive</option>
                  </select>
                  <input type="text" name="customer2Contact" placeholder="Contact" value={formData.customer2Contact} onChange={handleChange} className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400" />
                  <button type="button" onClick={() => setShowCustomer2(false)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            <InputField label="Company Name *" type="text" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
            <RadioGroup label="Site Name same as Company *" name="siteSame" options={['Yes', 'No']} value={formData.siteSame} onChange={handleChange} />
            {formData.siteSame === 'No' && <InputField label="Site Name *" type="text" name="siteName" value={formData.siteName} onChange={handleChange} error={errors.siteName} />}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <InputField icon={<Mail className="w-4 h-4" />} label="Email ID *" type="email" name="email" value={formData.email} onChange={handleChange} />
            {!showEmail2 && (
              <button type="button" onClick={() => setShowEmail2(true)} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                <PlusCircle className="w-4 h-4" /> Add Email
              </button>
            )}
            {showEmail2 && <InputField icon={<Mail className="w-4 h-4" />} label="Email ID 2 *" type="email" name="email2" value={formData.email2} onChange={handleChange} />}

            {/* Contact No */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact No. *</label>
              {errors.contactNo && (
                <p className="text-xs text-red-600 mb-2">{errors.contactNo}</p>
              )}
              <div className="flex gap-2">
                <select name="contactCountry" value={formData.contactCountry} onChange={handleChange} className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
                  <option>India (+91)</option>
                </select>
                <input type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.contactNo ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-400'}`} />
              </div>
            </div>

            <InputField label="Landline No. *" type="text" name="landlineNo" value={formData.landlineNo} onChange={handleChange} />
            <TextAreaField label="Company Address *" icon={<Building2 className="w-4 h-4" />} name="companyAddress" value={formData.companyAddress} onChange={handleChange} error={errors.companyAddress} />
            <RadioGroup label="Site Address same as Company *" name="siteSameAddress" options={['Yes', 'No']} value={formData.siteSameAddress} onChange={handleChange} />
            {formData.siteSameAddress === 'No' && <TextAreaField label="Site Address *" icon={<LocateIcon className="w-4 h-4" />} name="siteAddress" value={formData.siteAddress} onChange={handleChange} error={errors.siteAddress} />}
            <SelectField label="Select Area *" name="area" options={areaOptions} value={formData.area} onChange={handleChange} />
            <SelectField label="Lead Stage *" name="leadStage" options={leadStageOptions} value={formData.leadStage} onChange={handleChange} />
          </div>

          {/* Submit / Cancel */}
          <div className="col-span-1 md:col-span-2 flex justify-center gap-4 pt-6 border-t border-neutral-200 mt-4">
            <button type="submit" disabled={isSubmitting} className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" onClick={() => router.back()} className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </form>

        <p className="text-xs text-neutral-500 mt-6 font-medium">
          <span className="text-red-600">*</span> Fields marked with asterisk are mandatory
        </p>
      </div>
      </div>
    </div>
  );
}

// Reusable Fields
function InputField({ label, name, type, value, onChange, icon, required, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 flex items-center gap-2">
        {icon} {label}
      </label>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required} 
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-400'}`}
      />
    </div>
  );
}

function SelectField({ label, name, options, value, onChange, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <select 
        name={name} 
        value={value} 
        onChange={onChange} 
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-400'}`}
      >
        <option value="">Please Select</option>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, icon, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 flex items-center gap-2">
        {icon} {label}
      </label>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <textarea 
        name={name} 
        rows={2} 
        value={value} 
        onChange={onChange} 
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-400'}`}
      />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <div className="flex gap-6 text-sm text-neutral-700">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name={name} 
              value={opt} 
              checked={value === opt} 
              onChange={onChange} 
              className="text-neutral-900 focus:ring-neutral-400" 
            /> 
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
