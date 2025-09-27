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
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AddLeadPage() {
  const [executives, setExecutives] = useState([]);
  const { tenant } = useParams();
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if(e.target.name === 'companyName'){
       setFormData((prev) => ({ ...prev, ['siteName']: e.target.value }));
    }

    if(e.target.name === 'companyAddress'){
        setFormData((prev) => ({ ...prev, ['siteAddress']: e.target.value }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      leadDate: new Date(formData.leadDate).toISOString(),
      activityById: parseInt(formData.executive),
      leadSourceId: parseInt(formData.leadSource),
      leadType: formData.leadType,
      salutations: formData.customer1Title,
      customerName: formData.customer1Name,
      designationId: parseInt(formData.customer1Designation),
      contactNo: formData.contactNo,
      customer1Contact: formData.customer1Contact,
      customer2Contact: formData.customer2Contact,
      landlineNo: formData.landlineNo,
      salutations2: formData.customer2Title,
      customerName2: formData.customer2Name,
      designation2Id: parseInt(formData.customer2Designation),
      leadCompanyName: formData.companyName,
      siteName: formData.siteName,
      emailId: formData.email,
      emailId2: formData.email2,
      countryCode: formData.contactCountry.split('(')[1]?.replace(')', ''),
      address: formData.companyAddress,
      siteAddress: formData.siteAddress,
      areaId: parseInt(formData.area),
      leadStageId: parseInt(formData.leadStage),
      status: 'Open',
    };

    try {
      await axiosInstance.post("/api/leadmanagement/leads", payload);
      toast.success('Lead added successfully!');
      router.push(`/dashboard/lead-management/lead-list`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 border-b pb-3">
          <UserPlus className="w-6 h-6 text-blue-600" /> Add New Lead
        </h2>
      </div>

      <div className="bg-white border rounded-xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <InputField label="Lead Date *" type="date" name="leadDate" value={formData.leadDate} onChange={handleChange} required />
            <SelectField label="Select Executive *" name="executive" options={executives} value={formData.executive} onChange={handleChange} />
            <SelectField label="Lead Source" name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
            <SelectField label="Lead Type *" name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />

            {/* Customer 1 */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Customer *</label>
              <div className="flex flex-wrap items-center gap-3">
                <select name="customer1Title" value={formData.customer1Title} onChange={handleChange} className="border rounded-md px-2 py-2 text-sm">
                  <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                </select>
                <input type="text" name="customer1Name" placeholder="Name" value={formData.customer1Name} onChange={handleChange} className="border rounded-md px-3 py-2 text-sm" />
                <select name="customer1Designation" value={formData.customer1Designation} onChange={handleChange} className="border rounded-md px-2 py-2 text-sm">
                  <option value="">Select Designation</option>
                  {designationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input type="text" name="customer1Contact" placeholder="Contact" value={formData.customer1Contact} onChange={handleChange} className="border rounded-md px-3 py-2 text-sm" />
                {!showCustomer2 && (
                  <button type="button" onClick={() => setShowCustomer2(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm">Add</button>
                )}
              </div>
            </div>

            {/* Customer 2 */}
            {showCustomer2 && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Customer 2 *</label>
                <div className="flex flex-wrap items-center gap-3">
                  <select name="customer2Title" value={formData.customer2Title} onChange={handleChange} className="border rounded-md px-2 py-2 text-sm">
                    <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                  </select>
                  <input type="text" name="customer2Name" placeholder="Name 2" value={formData.customer2Name} onChange={handleChange} className="border rounded-md px-3 py-2 text-sm" />
                  <select name="customer2Designation" value={formData.customer2Designation} onChange={handleChange} className="border rounded-md px-2 py-2 text-sm">
                    <option value="">Owner</option><option value="Manager">Chairman</option><option value="Executive">Executive</option>
                  </select>
                  <input type="text" name="customer2Contact" placeholder="Contact" value={formData.customer2Contact} onChange={handleChange} className="border rounded-md px-3 py-2 text-sm" />
                  <button type="button" onClick={() => setShowCustomer2(false)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm flex items-center"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            <InputField label="Company Name *" type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
            <RadioGroup label="Site Name same as Company" name="siteSame" options={['Yes', 'No']} value={formData.siteSame} onChange={handleChange} />
            {formData.siteSame === 'No' && <InputField label="Site Name" type="text" name="siteName" value={formData.siteName} onChange={handleChange} />}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <InputField icon={<Mail className="w-4 h-4" />} label="Email ID" type="email" name="email" value={formData.email} onChange={handleChange} />
            {!showEmail2 && (
              <button type="button" onClick={() => setShowEmail2(true)} className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                <PlusCircle className="w-4 h-4" /> Add Email
              </button>
            )}
            {showEmail2 && <InputField icon={<Mail className="w-4 h-4" />} label="Email ID 2" type="email" name="email2" value={formData.email2} onChange={handleChange} />}

            {/* Contact No */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact No. *</label>
              <div className="flex gap-2">
                <select name="contactCountry" value={formData.contactCountry} onChange={handleChange} className="border rounded-md px-3 py-2 text-sm">
                  <option>India (+91)</option>
                </select>
                <input type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} className="flex-1 border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <InputField label="Landline No." type="text" name="landlineNo" value={formData.landlineNo} onChange={handleChange} />
            <TextAreaField label="Company Address *" icon={<Building2 className="w-4 h-4" />} name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
            <RadioGroup label="Site Address same as Company" name="siteSameAddress" options={['Yes', 'No']} value={formData.siteSameAddress} onChange={handleChange} />
            {formData.siteSameAddress === 'No' && <TextAreaField label="Site Address *" icon={<LocateIcon className="w-4 h-4" />} name="siteAddress" value={formData.siteAddress} onChange={handleChange} />}
            <SelectField label="Select Area" name="area" options={areaOptions} value={formData.area} onChange={handleChange} />
            <SelectField label="Lead Stage" name="leadStage" options={leadStageOptions} value={formData.leadStage} onChange={handleChange} />
          </div>

          {/* Submit / Cancel */}
          <div className="col-span-1 md:col-span-2 flex justify-center gap-6 pt-6 border-t mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow">
              Submit
            </button>
            <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-sm font-semibold">
              Cancel
            </button>
          </div>
        </form>

        <p className="text-xs text-red-500 mt-5 font-medium">
          <b>Note:</b> Fields marked with * are mandatory
        </p>
      </div>
    </div>
  );
}

// Reusable Fields
function InputField({ label, name, type, value, onChange, icon, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">{icon} {label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>
  );
}

function SelectField({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select name={name} value={value} onChange={onChange} required className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
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

function TextAreaField({ label, name, value, onChange, icon }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">{icon} {label}</label>
      <textarea name={name} rows={2} value={value} onChange={onChange} className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-6 text-sm text-gray-700">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} className="text-blue-500" /> {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
