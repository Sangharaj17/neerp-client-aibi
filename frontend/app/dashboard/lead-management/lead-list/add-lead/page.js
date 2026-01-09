'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Loader2, PlusCircle, Trash2, X, UserPlus } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PageHeader from '@/components/UI/PageHeader';

// ─────────────────────────────────────────────────────────────
// Validation & Sanitization Helpers (EXACTLY as original)
// ─────────────────────────────────────────────────────────────
const sanitizeText = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').trim();
};

const sanitizeAddress = (address) => {
  if (!address) return '';
  return address.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').replace(/^\.*|\.*$/g, '').trim();
};

const isValidEmail = (email) => {
  if (!email) return true;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|co|io|gov|edu|info|biz|co\.in|org\.in|net\.in|ac\.in)$/i;
  return emailRegex.test(email.trim());
};

const isValidMobileNumber = (number) => {
  if (!number) return false;
  const cleaned = number.replace(/\D/g, '');
  return /^\d{10}$/.test(cleaned);
};

const sanitizeMobileNumber = (number) => {
  if (!number) return '';
  return number.replace(/\D/g, '');
};

const formatCurrentDate = () => new Date().toISOString().split('T')[0];

// ─────────────────────────────────────────────────────────────
// Step Definitions
// ─────────────────────────────────────────────────────────────
const steps = [
  { id: 1, title: 'Lead Info' },
  { id: 2, title: 'Customer & Company' },
  { id: 3, title: 'Contact & Address' }
];

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function AddLeadPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Options from API (same as original)
  const [executives, setExecutives] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [leadStageOptions, setLeadStageOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  // Form Data (EXACTLY as original - all 24 fields)
  const [formData, setFormData] = useState({
    leadDate: formatCurrentDate(),
    executive: '',
    leadSource: '',
    leadType: '',
    customer1Title: 'Mr.',
    customer1Name: '',
    customer1Designation: '',
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

  // Fetch options (same as original)
  useEffect(() => {
    axiosInstance.get('/api/employees/executives').then((res) => {
      setExecutives(res.data.map((emp) => ({ value: emp.employeeId, label: emp.employeeName })));
    });
    axiosInstance.get('/api/leadmanagement/lead-sources').then((res) => {
      setLeadSources(res.data.map((src) => ({ value: src.leadSourceId, label: src.sourceName })));
    });
    axiosInstance.get('/api/enquiry-types').then((res) => {
  setLeadTypes(
    res.data
      .filter(item => item.enquiryTypeName !== "Moderization")
      .map(item => item.enquiryTypeName)
  );
});

    axiosInstance.get('/api/leadmanagement/areas').then((res) => {
      setAreaOptions(res.data.map((area) => ({ value: area.areaId, label: area.areaName })));
    });
    axiosInstance.get('/api/leadmanagement/lead-stages').then((res) => {
      setLeadStageOptions(res.data.map((stage) => ({ value: stage.stageId, label: stage.stageName })));
    });
    axiosInstance.get('/api/leadmanagement/designations').then((res) => {
      setDesignationOptions(res.data.map((d) => ({ value: d.designationId, label: d.designationName })));
    });
  }, []);

  // Handle input change (EXACTLY as original)
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === 'contactNo' || name === 'customer2Contact') {
      sanitizedValue = sanitizeMobileNumber(value).slice(0, 10);
    }
    if (name === 'landlineNo') {
      sanitizedValue = value.replace(/[^0-9-]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });

    if (name === 'companyName') setFormData((prev) => ({ ...prev, siteName: sanitizedValue }));
    if (name === 'companyAddress') setFormData((prev) => ({ ...prev, siteAddress: sanitizedValue }));
  };

  const handleRemoveEmail2 = () => {
    setShowEmail2(false);
    setFormData((prev) => ({ ...prev, email2: '' }));
    if (errors.email2) setErrors((prev) => { const n = { ...prev }; delete n.email2; return n; });
  };

  // ORIGINAL validateForm logic
  const validateForm = () => {
    const newErrors = {};
    const isEmpty = (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      return false;
    };

    if (!formData.leadDate) newErrors.leadDate = 'Lead date is required';
    if (!formData.executive || formData.executive === '0') newErrors.executive = 'Executive is required';
    if (!formData.leadSource || formData.leadSource === '0') newErrors.leadSource = 'Lead source is required';
    if (!formData.leadType?.trim()) newErrors.leadType = 'Lead type is required';
    if (isEmpty(formData.customer1Name)) newErrors.customer1Name = 'Customer name is required';
    if (!formData.customer1Designation || formData.customer1Designation === '0') newErrors.customer1Designation = 'Designation is required';
    if (isEmpty(formData.companyName)) newErrors.companyName = 'Company name is required';

    if (isEmpty(formData.contactNo)) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!isValidMobileNumber(formData.contactNo)) {
      newErrors.contactNo = 'Enter valid 10-digit mobile number';
    }

    if (isEmpty(formData.companyAddress)) newErrors.companyAddress = 'Company address is required';

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Enter valid email (e.g., name@domain.com)';
    }
    if (formData.email2 && !isValidEmail(formData.email2)) {
      newErrors.email2 = 'Enter valid email (e.g., name@domain.com)';
    }

    if (formData.siteSame === 'No' && isEmpty(formData.siteName)) {
      newErrors.siteName = 'Site name is required';
    }
    if (formData.siteSameAddress === 'No' && isEmpty(formData.siteAddress)) {
      newErrors.siteAddress = 'Site address is required';
    }

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  // Step validation (for stepper navigation) - UPDATED: Contact validation moved to Step 2
  const validateStep = (step) => {
    const newErrors = {};
    const isEmpty = (v) => !v || (typeof v === 'string' && !v.trim());

    if (step === 1) {
      if (!formData.leadDate) newErrors.leadDate = 'Required';
      if (!formData.executive) newErrors.executive = 'Required';
      if (!formData.leadSource) newErrors.leadSource = 'Required';
      if (isEmpty(formData.leadType)) newErrors.leadType = 'Required';
    }

    if (step === 2) {
      if (isEmpty(formData.customer1Name)) newErrors.customer1Name = 'Required';
      if (!formData.customer1Designation) newErrors.customer1Designation = 'Required';
      if (isEmpty(formData.contactNo)) {
        newErrors.contactNo = 'Required';
      } else if (!isValidMobileNumber(formData.contactNo)) {
        newErrors.contactNo = '10 digits required';
      }
      if (isEmpty(formData.companyName)) newErrors.companyName = 'Required';
      if (formData.siteSame === 'No' && isEmpty(formData.siteName)) newErrors.siteName = 'Required';
      if (formData.email && !isValidEmail(formData.email)) newErrors.email = 'Invalid email';
      if (formData.email2 && !isValidEmail(formData.email2)) newErrors.email2 = 'Invalid email';
    }

    if (step === 3) {
      if (isEmpty(formData.companyAddress)) newErrors.companyAddress = 'Required';
      if (formData.siteSameAddress === 'No' && isEmpty(formData.siteAddress)) newErrors.siteAddress = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 3));
    }
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // Submit - EXACTLY as original payload
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const { isValid, errors: validationErrors } = validateForm();
    if (!isValid) {
      setErrors(validationErrors);
      toast.error(`Please fix ${Object.keys(validationErrors).length} error(s)`);
      return;
    }

    setIsSubmitting(true);

    // EXACT original payload structure
    const payload = {
      leadDate: new Date(formData.leadDate).toISOString(),
      activityById: parseInt(formData.executive),
      leadSourceId: parseInt(formData.leadSource),
      leadType: sanitizeText(formData.leadType),
      salutations: formData.customer1Title,
      customerName: sanitizeText(formData.customer1Name),
      designationId: parseInt(formData.customer1Designation),
      contactNo: sanitizeMobileNumber(formData.contactNo),
      customer2Contact: formData.customer2Contact ? sanitizeMobileNumber(formData.customer2Contact) : null,
      landlineNo: formData.landlineNo?.trim() || null,
      salutations2: formData.customer2Title,
      customerName2: sanitizeText(formData.customer2Name) || null,
      designation2Id: formData.customer2Designation ? parseInt(formData.customer2Designation) : null,
      leadCompanyName: sanitizeText(formData.companyName),
      siteName: formData.siteSame === 'Yes' ? sanitizeText(formData.companyName) : (sanitizeText(formData.siteName) || sanitizeText(formData.companyName)),
      emailId: formData.email?.trim().toLowerCase() || null,
      emailId2: formData.email2?.trim().toLowerCase() || null,
      countryCode: formData.contactCountry.split('(')[1]?.replace(')', ''),
      address: sanitizeAddress(formData.companyAddress),
      siteAddress: formData.siteSameAddress === 'Yes' ? sanitizeAddress(formData.companyAddress) : (sanitizeAddress(formData.siteAddress) || sanitizeAddress(formData.companyAddress)),
      areaId: formData.area ? parseInt(formData.area) : null,
      leadStageId: formData.leadStage ? parseInt(formData.leadStage) : null,
      status: 'Open',
    };

    try {
      await axiosInstance.post("/api/leadmanagement/leads", payload);
      toast.success('Lead added successfully!');
      router.push(`/dashboard/lead-management/lead-list`);
    } catch (error) {
      let errorMessage = 'Failed to add lead.';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid data. Check all fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login.';
      } else if (!error.response) {
        errorMessage = 'Could not connect to server.';
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title="Add New Lead"
        description="Complete all steps to create a lead"
        showBack
      />

      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all
                    ${currentStep > step.id ? 'bg-emerald-500 border-emerald-500 text-white' : currentStep === step.id ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-300 text-neutral-400'}`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs mt-1 ${currentStep >= step.id ? 'text-neutral-800' : 'text-neutral-400'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 mb-4 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">

          {/* Error Summary Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">Please complete the following required fields:</p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field} className="text-sm text-amber-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 1: Lead Info */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Field label="Lead Date" required error={errors.leadDate}>
                <input type="date" name="leadDate" value={formData.leadDate} onChange={handleChange} className={inputClass(errors.leadDate)} />
              </Field>

              <Field label="Select Executive" required error={errors.executive}>
                <select name="executive" value={formData.executive} onChange={handleChange} className={inputClass(errors.executive)}>
                  <option value="">Please Select</option>
                  {executives.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <Field label="Lead Source" required error={errors.leadSource}>
                <select name="leadSource" value={formData.leadSource} onChange={handleChange} className={inputClass(errors.leadSource)}>
                  <option value="">Please Select</option>
                  {leadSources.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <Field label="Lead Type" required error={errors.leadType}>
                <select name="leadType" value={formData.leadType} onChange={handleChange} className={inputClass(errors.leadType)}>
                  <option value="">Please Select</option>
                  {leadTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 2: Customer & Company */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Customer 1 - UPDATED: Now includes contact number */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <label className="block text-xs font-medium text-neutral-700 mb-3">Customer *</label>
                {(errors.customer1Name || errors.customer1Designation || errors.contactNo) && (
                  <p className="text-xs text-red-500 mb-2">{errors.customer1Name || errors.customer1Designation || errors.contactNo}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <select name="customer1Title" value={formData.customer1Title} onChange={handleChange} className="border border-neutral-300 rounded px-3 py-2 text-sm">
                    <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                  </select>
                  <input type="text" name="customer1Name" placeholder="Name" value={formData.customer1Name} onChange={handleChange}
                    className={`flex-1 min-w-32 border rounded px-3 py-2 text-sm ${errors.customer1Name ? 'border-red-400' : 'border-neutral-300'}`} />
                  <select name="customer1Designation" value={formData.customer1Designation} onChange={handleChange}
                    className={`border rounded px-3 py-2 text-sm ${errors.customer1Designation ? 'border-red-400' : 'border-neutral-300'}`}>
                    <option value="">Select Designation</option>
                    {designationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {!showCustomer2 && (
                    <button type="button" onClick={() => setShowCustomer2(true)} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded text-sm font-medium">Add</button>
                  )}
                </div>
                {/* Contact Number for Customer 1 */}
                <div className="flex gap-2">
                  <select name="contactCountry" value={formData.contactCountry} onChange={handleChange} className="border border-neutral-300 rounded px-3 py-2 text-sm">
                    <option>India (+91)</option>
                  </select>
                  <input type="text" name="contactNo" placeholder="Contact Number (10-digit mobile)" value={formData.contactNo} onChange={handleChange} maxLength={10} className={`flex-1 border rounded px-3 py-2 text-sm ${errors.contactNo ? 'border-red-400' : 'border-neutral-300'}`} />
                </div>
              </div>

              {/* Customer 2 (optional) */}
              {showCustomer2 && (
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-medium text-neutral-700">Customer 2</label>
                    <button type="button" onClick={() => setShowCustomer2(false)} className="text-red-500 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select name="customer2Title" value={formData.customer2Title} onChange={handleChange} className="border border-neutral-300 rounded px-3 py-2 text-sm">
                      <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                    </select>
                    <input type="text" name="customer2Name" placeholder="Name" value={formData.customer2Name} onChange={handleChange} className="flex-1 min-w-32 border border-neutral-300 rounded px-3 py-2 text-sm" />
                    <select name="customer2Designation" value={formData.customer2Designation} onChange={handleChange} className="border border-neutral-300 rounded px-3 py-2 text-sm">
                      <option value="">Select Designation</option>
                      {designationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <input type="text" name="customer2Contact" placeholder="Mobile (10 digits)" value={formData.customer2Contact} onChange={handleChange} maxLength={10} className="border border-neutral-300 rounded px-3 py-2 text-sm w-36" />
                  </div>
                </div>
              )}

              {/* Company Name */}
              <Field label="Company Name" required error={errors.companyName}>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass(errors.companyName)} />
              </Field>

              {/* Site Name same as Company */}
              <Field label="Site Name same as Company" required>
                <div className="flex gap-6">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                      <input type="radio" name="siteSame" value={v} checked={formData.siteSame === v} onChange={handleChange} className="accent-neutral-900" /> {v}
                    </label>
                  ))}
                </div>
              </Field>

              {formData.siteSame === 'No' && (
                <Field label="Site Name" required error={errors.siteName}>
                  <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className={inputClass(errors.siteName)} />
                </Field>
              )}

              {/* Email */}
              <Field label="Email ID" error={errors.email}>
                <input type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} className={inputClass(errors.email)} />
              </Field>

              {/* Add Email 2 */}
              {!showEmail2 ? (
                <button type="button" onClick={() => setShowEmail2(true)} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-sm">
                  <PlusCircle className="w-4 h-4" /> Add Email
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-700">Email ID 2</label>
                    <button type="button" onClick={handleRemoveEmail2} className="text-red-500 hover:text-red-700 p-1"><X className="w-4 h-4" /></button>
                  </div>
                  {errors.email2 && <p className="text-xs text-red-500">{errors.email2}</p>}
                  <input type="email" name="email2" value={formData.email2} onChange={handleChange} className={inputClass(errors.email2)} />
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 3: Contact & Address - UPDATED: Contact No removed */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Landline */}
              <Field label="Landline No.">
                <input type="text" name="landlineNo" value={formData.landlineNo} onChange={handleChange} className={inputClass()} />
              </Field>

              {/* Company Address */}
              <Field label="Company Address" required error={errors.companyAddress}>
                <textarea name="companyAddress" rows={2} value={formData.companyAddress} onChange={handleChange} className={inputClass(errors.companyAddress)} />
              </Field>

              {/* Site Address same as Company */}
              <Field label="Site Address same as Company" required>
                <div className="flex gap-6">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                      <input type="radio" name="siteSameAddress" value={v} checked={formData.siteSameAddress === v} onChange={handleChange} className="accent-neutral-900" /> {v}
                    </label>
                  ))}
                </div>
              </Field>

              {formData.siteSameAddress === 'No' && (
                <Field label="Site Address" required error={errors.siteAddress}>
                  <textarea name="siteAddress" rows={2} value={formData.siteAddress} onChange={handleChange} className={inputClass(errors.siteAddress)} />
                </Field>
              )}

              {/* Area */}
              <Field label="Select Area">
                <select name="area" value={formData.area} onChange={handleChange} className={inputClass()}>
                  <option value="">Please Select</option>
                  {areaOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              {/* Lead Stage */}
              <Field label="Lead Stage">
                <select name="leadStage" value={formData.leadStage} onChange={handleChange} className={inputClass()}>
                  <option value="">Please Select</option>
                  {leadStageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-neutral-100">
            <div>
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-800">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800">
                Cancel
              </button>
              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="flex items-center gap-1 px-4 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800 disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-4"><span className="text-red-500">*</span> Mandatory fields</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────
const inputClass = (error) =>
  `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${error ? 'border-red-400' : 'border-neutral-300'}`;

function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className={`block text-xs font-medium ${error ? 'text-red-600' : 'text-neutral-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
        {error && <span className="ml-2 text-xs font-normal text-red-500">({error})</span>}
      </label>
      {children}
    </div>
  );
}