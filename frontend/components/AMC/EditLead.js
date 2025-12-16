'use client';

import { useState , useEffect} from 'react';
import {
  UserPlus,
  Mail,
  Phone,
  Building2,
  LocateIcon,
  PlusCircle,
} from 'lucide-react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function EditLead({leadData , action, closeEditModal}) {

  const [executives, setExecutives] = useState([]);

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

useEffect(() => {
  axiosInstance.get('/api/leadmanagement/lead-sources')
    .then((res) => {
      const formatted = res.data.map((src) => ({
        value: src.leadSourceId,
        label: src.sourceName,
      }));
      setLeadSources(formatted);
    })
    .catch((err) => {
      console.error('Failed to fetch lead sources:', err);
    });
}, []);

const [leadTypes, setLeadTypes] = useState([]);

useEffect(() => {
  axiosInstance.get('/api/enquiry-types')
    .then((res) => {
      const names = res.data.map((item) => item.enquiryTypeName);
      setLeadTypes(names); // ['New Installation', 'AMC']
    })
    .catch((err) => {
      console.error('Failed to fetch lead types:', err);
    });
}, []);

const [areaOptions, setAreaOptions] = useState([]);

useEffect(() => {
  axiosInstance.get('/api/leadmanagement/areas')
    .then((res) => {
      const formatted = res.data.map((area) => ({
        value: area.areaId,
        label: area.areaName,
      }));
      setAreaOptions(formatted);
    })
    .catch((err) => {
      console.error("Failed to load areas:", err);
    });
}, []);

const [leadStageOptions, setLeadStageOptions] = useState([]);

useEffect(() => {
  axiosInstance.get('/api/leadmanagement/lead-stages').then((res) => {
    const formatted = res.data.map((stage) => ({
      value: stage.stageId,
      label: stage.stageName,
    }));
    setLeadStageOptions(formatted);
  });
}, []);

const [designationOptions, setDesignationOptions] = useState([]);

useEffect(() => {
  axiosInstance.get('/api/leadmanagement/designations')
    .then((res) => {
      const formatted = res.data.map((designation) => ({
        value: designation.designationId,
        label: designation.designationName,
      }));
      setDesignationOptions(formatted);
    })
    .catch((err) => {
      console.error("Failed to load designations:", err);
    });
}, []);


  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to sanitize email
  const sanitizeEmail = (email) => {
    if (!email) return '';
    return email.trim().toLowerCase();
  };

  // Helper function to sanitize address
  const sanitizeAddress = (address) => {
    if (!address) return '';
    return address
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const [formData, setFormData] = useState({
    leadDate: getCurrentDate(), // Set current date as default
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

  const[leadId , setLeadId] = useState(null);

   useEffect(() => {
    console.log('Lead Data:', leadData);
    if (leadData) {

        setLeadId(leadData.leadId);

        console.log('Setting form data from leadData:', leadData);
      
      // Fix date issue - handle timezone properly
      let leadDateValue = '';
      if (leadData.leadDate) {
        const date = new Date(leadData.leadDate);
        // Get local date string to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        leadDateValue = `${year}-${month}-${day}`;
      } else {
        // Set current date as default
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        leadDateValue = `${year}-${month}-${day}`;
      }

      setFormData({
    leadDate: leadDateValue,
        executive: leadData.activityBy?.employeeId || '',
        leadSource: leadData.leadSource?.leadSourceId || '',
        leadType: leadData.leadType || '',

        customer1Title: leadData.salutations || 'Mr.',
        customer1Name: leadData.customerName || '',
        customer1Designation: leadData.designation?.designationId || '',
        contactNo: leadData.contactNo || '',
        customer1Contact: leadData.customer1Contact || '', // 
        landlineNo: leadData.landlineNo || '',
        customer2Title: leadData.salutations2 || 'Mr.',
        customer2Name: leadData.customerName2 || '',
        customer2Designation: leadData.designation2?.designationId || '',
        customer2Contact: leadData.customer2Contact || '',

        companyName: leadData.leadCompanyName || '',
        siteSame: 'Yes', // Assuming this is not saved in backend
        siteName: leadData.siteName || '',
        email: leadData.emailId ? sanitizeEmail(leadData.emailId) : '',
        email2: leadData.emailId2 ? sanitizeEmail(leadData.emailId2) : '',

        contactCountry: leadData.countryCode || 'India (+91)',
        //contactNo: leadData.contactNo || '',

        companyAddress: leadData.address ? sanitizeAddress(leadData.address) : '',
        siteSameAddress: 'Yes', // Assuming same as company
        siteAddress: leadData.siteAddress ? sanitizeAddress(leadData.siteAddress) : '',

        area: leadData.area?.areaId || '',
        leadStage: leadData.leadStage?.stageId || '',
      });
    }
  }, [leadData]);


const [showCustomer2, setShowCustomer2] = useState(false);

  const [showEmail2, setShowEmail2] = useState(false);

  // Initialize showEmail2 based on leadData
  useEffect(() => {
    if (leadData && leadData.emailId2) {
      setShowEmail2(true);
    }
  }, [leadData]);

  // Validation functions
  const validateEmail = (email) => {
    if (!email || email.trim() === '') return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ['.com', '.in', '.net', '.org', '.co', '.edu', '.gov'];
    if (!emailRegex.test(email)) return false;
    return validDomains.some(domain => email.toLowerCase().endsWith(domain));
  };

  const validateMobileNumber = (value) => {
    if (!value) return true; // Optional field
    return /^\d+$/.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Apply validations and sanitizations
    if (name === 'email' || name === 'email2') {
      processedValue = sanitizeEmail(value);
    } else if (name === 'contactNo' || name === 'customer1Contact' || name === 'customer2Contact') {
      // Only allow numbers for mobile numbers
      if (value && !/^\d*$/.test(value)) {
        toast.error('Mobile number can only contain digits');
        return;
      }
      processedValue = value;
    } else if (name === 'companyAddress' || name === 'siteAddress') {
      processedValue = sanitizeAddress(value);
    } else {
      processedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };


  // Required fields validation
  const requiredFields = [
    "leadDate",
    "executive",
    "leadType",
    "customer1Name",
    "customer1Designation",
    "customer1Contact",
    "companyName",
    "contactNo",
    "companyAddress",
    "area",
    "leadStage"
  ];

  // Conditional required fields
  const getConditionalRequiredFields = () => {
    const fields = [];
    if (formData.siteSame === 'No' && !formData.siteName) {
      fields.push('siteName');
    }
    if (formData.siteSameAddress === 'No' && !formData.siteAddress) {
      fields.push('siteAddress');
    }
    if (showCustomer2) {
      if (!formData.customer2Name) fields.push('customer2Name');
      if (!formData.customer2Designation) fields.push('customer2Designation');
      if (!formData.customer2Contact) fields.push('customer2Contact');
    }
    return fields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    
    // Validate required fields
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        const fieldName = field === 'customer1Name' ? 'customer name' : 
                         field === 'customer1Contact' ? 'customer contact' :
                         field === 'customer1Designation' ? 'customer designation' :
                         field === 'companyAddress' ? 'company address' :
                         field === 'contactNo' ? 'contact number' :
                         field === 'leadDate' ? 'lead date' :
                         field === 'executive' ? 'executive' :
                         field === 'leadType' ? 'lead type' :
                         field === 'companyName' ? 'company name' :
                         field === 'area' ? 'area' :
                         field === 'leadStage' ? 'lead stage' : field;
        toast.error(`Please fill the ${fieldName} field`);
        return;
      }
    }

    // Validate conditional required fields
    const conditionalFields = getConditionalRequiredFields();
    for (let field of conditionalFields) {
      const fieldName = field === 'siteName' ? 'site name' :
                       field === 'siteAddress' ? 'site address' :
                       field === 'customer2Name' ? 'customer 2 name' :
                       field === 'customer2Designation' ? 'customer 2 designation' :
                       field === 'customer2Contact' ? 'customer 2 contact' : field;
      toast.error(`Please fill the ${fieldName} field`);
      return;
    }

    // Validate email formats
    if (formData.email && !validateEmail(formData.email)) {
      toast.error('Email ID must be a valid email address ending with .com, .in, .net, etc.');
      return;
    }
    if (formData.email2 && !validateEmail(formData.email2)) {
      toast.error('Email ID 2 must be a valid email address ending with .com, .in, .net, etc.');
      return;
    }

    // Validate mobile numbers
    if (formData.contactNo && !validateMobileNumber(formData.contactNo)) {
      toast.error('Contact number can only contain digits');
      return;
    }
    if (formData.customer1Contact && !validateMobileNumber(formData.customer1Contact)) {
      toast.error('Customer contact can only contain digits');
      return;
    }
    if (formData.customer2Contact && !validateMobileNumber(formData.customer2Contact)) {
      toast.error('Customer 2 contact can only contain digits');
      return;
    }

    // Sanitize addresses before submission
    const sanitizedCompanyAddress = sanitizeAddress(formData.companyAddress);
    const sanitizedSiteAddress = sanitizeAddress(formData.siteAddress);

    const payload = {
    leadDate: new Date(formData.leadDate).toISOString(), // backend expects ISO format
    activityById: parseInt(formData.executive),
    leadSourceId: parseInt(formData.leadSource),
    leadType: formData.leadType,
    salutations: formData.customer1Title,
    customerName: formData.customer1Name,
    designationId: parseInt(formData.customer1Designation),
    contactNo: formData.contactNo,
    customer1Contact: formData.customer1Contact, // 
    customer2Contact: formData.customer2Contact,
    landlineNo: formData.landlineNo,
    salutations2: formData.customer2Title,
    customerName2: formData.customer2Name,
    designation2Id: parseInt(formData.customer2Designation),
    leadCompanyName: formData.companyName,
    siteName: formData.siteName,
    emailId: sanitizeEmail(formData.email),
    emailId2: sanitizeEmail(formData.email2),
    countryCode: formData.contactCountry.split('(')[1]?.replace(')', ''), // "+91"
    address: sanitizedCompanyAddress,
    siteAddress: sanitizedSiteAddress,
    areaId: parseInt(formData.area),
    leadStageId: parseInt(formData.leadStage),

    // Optional backend fields (not in formData)
    status: 'Open',
    reason: null,
    isSendQuotation: 0,
    quatationId: null,
    amcQuatationId: null,
    modQuotId: null,
    oncallQuotId: null,
    expiryDate: null,
    makeOfElevator: null,
    noOfElevator: 0,
    gstPercentage: 0,
    amountOrdinary: 0,
    gstOrdinary: 0,
    totalAmountOrdinary: 0,
    amountComp: 0,
    gstComp: 0,
    totalAmountComp: 0,
    contractId: null
  };
  //alert('Form submitted!');

    try {
    const response = await axiosInstance.put(
      `/api/leadmanagement/leads/${leadId}`, // Make sure `leadId` is defined
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (closeEditModal) {
      closeEditModal();
    }
    toast.success('Lead updated successfully!');
    console.log('Lead Updated:', response.data);
    // Refresh the page or trigger a refresh
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    toast.error(
      error.response?.data?.message || 'Failed to update lead. Please try again.'
    );
  }

};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-gray-600" />
          Add New Lead
        </h2>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* Lead Date */}
            <InputField
              label="Lead Date *"
              type="date"
              name="leadDate"
              value={formData.leadDate}
              onChange={handleChange}
            />

            {/* Select Executive */}
            {/* <SelectField
              label="Select Executive *"
              name="executive"
              options={['Sunil', 'Rahul', 'Bharat AMC', 'Balkrishna Mohite']}
              value={formData.executive}
              onChange={handleChange}
            /> */}

            <SelectField
  label="Select Executive *"
  name="executive"
  options={executives} // [{ value: 1, label: "Sunil" }, ...]
  value={formData.executive}
  onChange={handleChange}
/>

            {/* Lead Source */}
          <SelectField
  label="Lead Source"
  name="leadSource"
  options={leadSources}
  value={formData.leadSource}
  onChange={handleChange}
/>


            {/* Lead Type */}
          <SelectField
  label="Lead Type *"
  name="leadType"
  options={leadTypes} // just ['New Installation', 'AMC']
  value={formData.leadType}
  onChange={handleChange}
/>


            {/* Customer Name */}
            {/* Customer Name - Updated */}
{/* Customer 1 */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Customer *
  </label>
  <div className="flex items-center gap-2 mb-2">
    <select
      name="customer1Title"
      value={formData.customer1Title}
      onChange={handleChange}
      className="w-20 border px-2 py-2 rounded-md text-sm"
    >
      <option>Mr.</option>
      <option>Ms.</option>
      <option>Mrs.</option>
    </select>

    <input
      type="text"
      name="customer1Name"
      placeholder="Name"
      value={formData.customer1Name}
      onChange={handleChange}
      className="w-32 border px-3 py-2 rounded-md text-sm"
    />

   <select
  name="customer1Designation"
  value={formData.customer1Designation}
  onChange={handleChange}
  className="w-32 border px-2 py-2 rounded-md text-sm"
>
  <option value="">Select Designation</option>
  {designationOptions.map((opt) => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
</select>


    <input
      type="text"
      name="customer1Contact"
      placeholder="Contact"
      value={formData.customer1Contact}
      onChange={handleChange}
      maxLength={10}
      pattern="[0-9]*"
      inputMode="numeric"
      className="w-32 border px-3 py-2 rounded-md text-sm"
    />

    {!showCustomer2 && (
      <button
        type="button"
        onClick={() => setShowCustomer2(true)}
        className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded text-sm"
      >
        Add
      </button>
    )}
  </div>
</div>

{/* Customer 2 (conditionally rendered) */}
{showCustomer2 && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Customer 2 *
    </label>
    <div className="flex items-center gap-2 mb-2">
      <select
        name="customer2Title"
        value={formData.customer2Title}
        onChange={handleChange}
        className="w-20 border px-2 py-2 rounded-md text-sm"
      >
        <option>Mr.</option>
        <option>Ms.</option>
        <option>Mrs.</option>
      </select>

      <input
        type="text"
        name="customer2Name"
        placeholder="Name 2"
        value={formData.customer2Name}
        onChange={handleChange}
        className="w-32 border px-3 py-2 rounded-md text-sm"
      />

      <select
        name="customer2Designation"
        value={formData.customer2Designation}
        onChange={handleChange}
        className="w-32 border px-2 py-2 rounded-md text-sm"
      >
        <option value="">Owner</option>
        <option value="Manager">Chairman</option>
        <option value="Executive">Executive</option>
      </select>

      <input
        type="text"
        name="customer2Contact"
        placeholder="Contact"
        value={formData.customer2Contact}
        onChange={handleChange}
        maxLength={10}
        pattern="[0-9]*"
        inputMode="numeric"
        className="w-32 border px-3 py-2 rounded-md text-sm"
      />

      <button
        type="button"
        onClick={() => setShowCustomer2(false)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
)}


            {/* Company Name */}
            <InputField
              label="Company Name *"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />

            {/* Site Same as Company */}
            <RadioGroup
              label="Site Name same as Company"
              name="siteSame"
              options={['Yes', 'No']}
              value={formData.siteSame}
              onChange={handleChange}
            />

            {/* Site Name - only show if 'No' */}
            {formData.siteSame === 'No' && (
              <InputField
                label="Site Name"
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
              />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Email */}
            <InputField
              icon={<Mail className="w-4 h-4" />}
              label="Email ID"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Add Email ID 2 Button */}
            {!showEmail2 && (
              <button
                type="button"
                onClick={() => setShowEmail2(true)}
                className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
              >
                <PlusCircle className="w-4 h-4" />
                Add
              </button>
            )}

            {/* Email ID 2 */}
            {showEmail2 && (
              <div className="relative">
                <InputField
                  icon={<Mail className="w-4 h-4" />}
                  label="Email ID 2"
                  type="email"
                  name="email2"
                  value={formData.email2}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowEmail2(false);
                    setFormData((prev) => ({ ...prev, email2: '' }));
                  }}
                  className="absolute right-2 top-8 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Hide
                </button>
              </div>
            )}

            {/* Contact No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" /> Contact No. *
              </label>
              <div className="flex gap-2">
                <select
                  name="contactCountry"
                  value={formData.contactCountry}
                  onChange={handleChange}
                  className="w-36 border px-3 py-2 rounded-md text-sm"
                >
                  <option>India (+91)</option>
                </select>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="flex-1 border px-3 py-2 rounded-md text-sm"
                  placeholder="Enter 10 digit mobile number"
                />
              </div>
            </div>

            {/* Landline No. */}
            <InputField
              label="Landline No."
              type="text"
              name="landlineNo"
              value={formData.landlineNo}
              onChange={handleChange}
            />

            {/* Company Address */}
            <TextAreaField
              label="Company Address *"
              icon={<Building2 className="w-4 h-4" />}
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
            />

            {/* Site Address Same */}
            <RadioGroup
              label="Site Address same as Company"
              name="siteSameAddress"
              options={['Yes', 'No']}
              value={formData.siteSameAddress}
              onChange={handleChange}
            />

            {/* Site Address - only show if 'No' */}
            {formData.siteSameAddress === 'No' && (
              <TextAreaField
                label="Site Address *"
                icon={<LocateIcon className="w-4 h-4" />}
                name="siteAddress"
                value={formData.siteAddress}
                onChange={handleChange}
              />
            )}

            {/* Area */}
            {/* Select Area */}
         <SelectField
  label="Select Area"
  name="area"
  options={areaOptions}  // this will be populated using useEffect
  value={formData.area || ''}
  onChange={handleChange}
/>


          {/* Lead Stage */}
<SelectField
  label="Lead Stage"
  name="leadStage"
  value={formData.leadStage || ''}
  onChange={handleChange}
  options={leadStageOptions}
/>


           
          </div>

          {/* Submit + Cancel */}
          <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-6">

            {
                action === 'Edit' ? ( <button
                onSubmit={handleSubmit}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm flex items-center gap-2"
                >
                Submit
                </button> ) : null
            }
                

            <button
              type="button"
              onClick={() => {
                if (closeEditModal) {
                  closeEditModal();
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="text-xs text-red-500 mt-4">
          <b>Note: Fields marked with * are mandatory</b>
        </p>
      </div>
    </div>
  );
}

// Reusable components
function InputField({ label, name, type, value, onChange, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded-md text-sm"
      />
    </div>
  );
}

function SelectField({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded-md text-sm"
      >
        <option value="">Please Select</option>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;

          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}



function TextAreaField({ label, name, value, onChange, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {icon} {label}
      </label>
      <textarea
        name={name}
        rows={2}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded-md text-sm"
      />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-6 text-sm text-gray-700">
        {options.map((opt) => (
          <label key={opt}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="mr-1"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
