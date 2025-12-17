'use client';

import { useState, useEffect } from 'react';
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
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

export default function AddLead({ submitted, handleSetLeadId, handleSetCustomer1Name, handleSetSiteName,
  handleSetLeadSumbited, setFormData, formData, handleSetSumbmitted, setActiveStage,
  setEnquiryTypeName, setEnquiryTypeId
}) {


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
  const [enquiryTypes, setEnquiryTypes] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/enquiry-types')
      .then((res) => {
        const names = res.data.map((item) => item.enquiryTypeName);
        setLeadTypes(names); // ['New Installation', 'AMC']
        setEnquiryTypes(res.data);
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



  // 👇 whenever formData changes, send it to parent
  //   useEffect(() => {
  //     handleSetFormData(formData);
  //   }, [formData, handleSetFormData]);


  const [showCustomer2, setShowCustomer2] = useState(false);

  const [showEmail2, setShowEmail2] = useState(false);

  // Helper functions for validation and sanitization
  const sanitizeEmail = (email) => {
    if (!email) return '';
    return email.trim().toLowerCase();
  };

  const sanitizeAddress = (address) => {
    if (!address) return '';
    return address
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ['.com', '.in', '.net', '.org', '.co', '.edu', '.gov'];
    if (!emailRegex.test(email)) return false;
    return validDomains.some(domain => email.toLowerCase().endsWith(domain));
  };

  // Fields that should be automatically converted to uppercase
  const uppercaseFields = [
    'customer1Name', 'customer2Name', 'companyName', 'siteName',
    'companyAddress', 'siteAddress'
  ];

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
      processedValue = sanitizeAddress(value).toUpperCase();
    } else if (uppercaseFields.includes(name)) {
      // Convert to uppercase for name fields
      processedValue = value.toUpperCase();
    } else {
      processedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (name === 'companyAddress') {
      setFormData((prev) => ({ ...prev, siteAddress: processedValue }));
    }
    if (name === 'customer1Name') {
      handleSetCustomer1Name(processedValue);
    }
    if (name === 'companyName') {
      handleSetSiteName(processedValue);
      setFormData((prev) => ({ ...prev, siteName: processedValue }));
    }

    if (name === 'leadType') {
      updateEnquiryType(processedValue);
    }
  };

  const updateEnquiryType = (enquiryTypeName) => {
    const matchedType = enquiryTypes.find(
      (type) => type.enquiryTypeName === enquiryTypeName
    );

    if (matchedType) {
      setEnquiryTypeName(matchedType.enquiryTypeName);
      setEnquiryTypeId(matchedType.enquiryTypeId);
    }
  };




  return (
    <div>
      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          {/* Customer 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <div className="grid grid-cols-12 gap-2 mb-2">
              <select
                name="customer1Title"
                value={formData.customer1Title}
                onChange={handleChange}
                className="col-span-2 border px-2 py-2 rounded-md text-sm"
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
                className="col-span-3 border px-3 py-2 rounded-md text-sm"
              />

              <select
                name="customer1Designation"
                value={formData.customer1Designation}
                onChange={handleChange}
                className="col-span-3 border px-2 py-2 rounded-md text-sm"
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
                className="col-span-3 border px-3 py-2 rounded-md text-sm"
              />

              {!showCustomer2 && (
                <button
                  type="button"
                  onClick={() => setShowCustomer2(true)}
                  className="col-span-1 bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded text-sm flex items-center justify-center"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Customer 2 (conditionally rendered) */}
          {showCustomer2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Customer 2
              </label>
              <div className="grid grid-cols-12 gap-2 mb-2">
                <select
                  name="customer2Title"
                  value={formData.customer2Title}
                  onChange={handleChange}
                  className="col-span-2 border border-gray-300 px-2 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  className="col-span-3 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <select
                  name="customer2Designation"
                  value={formData.customer2Designation}
                  onChange={handleChange}
                  className="col-span-3 border border-gray-300 px-2 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  name="customer2Contact"
                  placeholder="Contact"
                  value={formData.customer2Contact}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="col-span-3 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowCustomer2(false)}
                  className="col-span-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm flex items-center justify-center"
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-4 h-4" /> Contact No. *
            </label>
            <div className="flex gap-2">
              <select
                name="contactCountry"
                value={formData.contactCountry}
                onChange={handleChange}
                className="w-36 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        {/* <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-6">
            <button
              onSubmit={handleSubmit}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm flex items-center gap-2"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
          </div> */}
      </form>

      <p className="text-xs text-red-600 mt-6">
        <b>Note: Fields marked with * are mandatory</b>
      </p>
    </div>
  );
}

// Reusable components
function InputField({ label, name, type, value, onChange, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
        {icon} {label}
      </label>
      <textarea
        name={name}
        rows={2}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex gap-6 text-sm text-gray-700">
        {options.map((opt) => (
          <label key={opt} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="mr-2 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
