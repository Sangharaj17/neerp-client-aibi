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
import axiosInstance from '@/utils/axiosInstance'; 

export default function AddLead({submitted,handleSetLeadId,handleSetCustomer1Name,handleSetSiteName,
    handleSetLeadSumbited , setFormData , formData , handleSetSumbmitted , setActiveStage ,
    setEnquiryTypeName,setEnquiryTypeId 
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
const [enquiryTypes,setEnquiryTypes] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));


    if(name === 'companyAddress'){
        setFormData((prev) => ({...prev, siteAddress: value }));
    }
    if(name === 'customer1Name') {
      handleSetCustomer1Name(value);
    }
    if(name === 'companyName') {
      handleSetSiteName(value);
      setFormData((prev) => ({...prev, siteName: value }));
    }

    if(name === 'leadType') {
      updateEnquiryType(value);
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
        <form  className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <InputField
                icon={<Mail className="w-4 h-4" />}
                label="Email ID 2"
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
              />
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
                  className="flex-1 border px-3 py-2 rounded-md text-sm"
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
