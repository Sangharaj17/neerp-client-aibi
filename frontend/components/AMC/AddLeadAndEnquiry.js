'use client';

import React, { useState } from 'react';
import AddLead from '@/components/AMC/AddLead';
import AddEnquiryForm from '@/components/AMC/AddEnquiryForm';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Check, ChevronRight } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance'; // Custom
import StageTwoButton from './StageTwoButton';
import toast from 'react-hot-toast';
import PageHeader from '@/components/UI/PageHeader';

export default function AddLeadAndEnquiry() {
  const router = useRouter();

  const { id } = useParams();


  const [activeStage, setActiveStage] = useState(1);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const [customer1Name, setCustomer1Name] = useState('');
  const [siteName, setSiteName] = useState('');
  const [leadId, setLeadId] = useState(0);

  const handleSetActiveStage = (stage) => setActiveStage(stage);
  const handleSetCustomer1Name = (name) => setCustomer1Name(name);
  const handleSetSiteName = (name) => setSiteName(name);
  const handleSetLeadId = (id) => setLeadId(id);
  const handleSetLeadSumbited = (status) => setLeadSubmitted(status);
  const handleSetSumbmitted = (status) => setSubmitted(status);

  const [enquiryTypeName, setEnquiryTypeName] = useState('');


  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const validateMobileNumber = (value) => {
    if (!value) return true; // Optional field
    return /^\d+$/.test(value);
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


  useEffect(() => {
    setFormData((prev) => ({ ...prev, ['leadType']: enquiryTypeName }));

  }, [enquiryTypeName])


  const [form, setForm] = useState({
    enquiryDate: new Date().toISOString().split('T')[0],
    leadDetail: `${customer1Name} For ${siteName}`,
    noOfLifts: '1',
    lifts: [getEmptyLift()],
  });

  function getEmptyLift() {
    return {
      leadId: leadId,
      liftUsageType: '',
      liftMechanism: '',
      elevatorType: '',
      machineRoomType: '',
      cabinType: '',
      capacityType: '',
      capacityTermId: '',
      personCapacityId: '',
      weightId: '',
      noOfFloors: '',
      floorsDesignation: '',
      noOfStops: '',
      noOfOpenings: '',
      floorSelections: [],

      shaftWidth: '',
      shaftDepth: '',
      pit: '',
      stageOfProject: '',
      buildingType: '',
    };
  }

  const [repeatSettings, setRepeatSettings] = useState({});
  const [enquiryTypeId, setEnquiryTypeId] = useState(0);

  const requiredFields = [
    "leadDate",
    "executive",
    "leadSource",
    "leadType",
    "customer1Name",
    "customer1Designation",
    "customer1Contact",
    "companyName",
    "siteName",
    "email",
    "contactNo",
    "landlineNo",
    "companyAddress",
    "siteAddress",
    "area",
    "leadStage"

  ];


  const [hasAllRequiredFieldsForAddLeadFilled, setHasAllRequiredFieldsForAddLeadFilled] = useState(false);

  const handleCheckHasAllRequiredFieldsForAddLeadFilled = () => {

    const allFieldsFilled = requiredFields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== null && value.toString().trim() !== '';
    }
    );
    setHasAllRequiredFieldsForAddLeadFilled(allFieldsFilled);
    return allFieldsFilled;
  }

  useEffect(() => {
    handleCheckHasAllRequiredFieldsForAddLeadFilled();

  }, [formData]);

  const handleSubmit = async (e) => {
    //   e.preventDefault(); // prevent page reload
    handleSetCustomer1Name(formData.customer1Name);
    handleSetSiteName(formData.siteName);

    // Validate only required fields
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
        setSubmitted(false);
        setIsFinalSubmitLoading(false);

        return;
      }
    }

    // Validate email formats
    if (formData.email && !validateEmail(formData.email)) {
      toast.error('Email ID must be a valid email address ending with .com, .in, .net, etc.');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }
    if (formData.email2 && !validateEmail(formData.email2)) {
      toast.error('Email ID 2 must be a valid email address ending with .com, .in, .net, etc.');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }

    // Validate mobile numbers
    if (formData.contactNo && !validateMobileNumber(formData.contactNo)) {
      toast.error('Contact number can only contain digits');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }
    if (formData.contactNo && formData.contactNo.length !== 10) {
      toast.error('Contact number must be exactly 10 digits');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }
    if (formData.customer1Contact && !validateMobileNumber(formData.customer1Contact)) {
      toast.error('Customer contact can only contain digits');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }
    if (formData.customer1Contact && formData.customer1Contact.length !== 10) {
      toast.error('Customer contact must be exactly 10 digits');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }
    if (formData.customer2Contact && !validateMobileNumber(formData.customer2Contact)) {
      toast.error('Customer 2 contact can only contain digits');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }
    if (formData.customer2Contact && formData.customer2Contact.length !== 10) {
      toast.error('Customer 2 contact must be exactly 10 digits');
      setSubmitted(false);
      setIsFinalSubmitLoading(false);
      return;
    }

    const payload = {
      leadDate: new Date(formData.leadDate).toISOString(), // backend expects ISO format
      activityById: parseInt(formData.executive),
      leadSourceId: parseInt(formData.leadSource),
      leadType: formData.leadType,
      salutations: formData.customer1Title,
      customerName: formData.customer1Name,
      designationId: parseInt(formData.customer1Designation),
      landlineNo: formData.landlineNo,
      customer1Contact: formData.customer1Contact,
      salutations2: formData.customer2Title,
      customerName2: formData.customer2Name,
      designation2Id: parseInt(formData.customer2Designation),
      customer2Contact: formData.customer2Contact,
      leadCompanyName: formData.companyName,
      siteName: formData.siteName,
      emailId: sanitizeEmail(formData.email),
      emailId2: sanitizeEmail(formData.email2),
      countryCode: formData.contactCountry.split('(')[1]?.replace(')', ''), // "+91"
      contactNo: formData.contactNo,
      address: sanitizeAddress(formData.companyAddress),
      siteAddress: sanitizeAddress(formData.siteAddress),
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
    // alert('Form submitted!');

    try {
      const response = await axiosInstance.post(
        "/api/leadmanagement/leads",
        payload // no need to JSON.stringify, Axios does it automatically
      );

      //    if (!response.ok) {
      //      throw new Error('Failed to submit');
      //    }

      //  alert('Form submitted!');

      const data = response.data; // ✅ No .json() needed
      console.log('Lead Created:', data);


      handleSetLeadId(data.leadId);
      //setActiveStage(2);
      handleSetLeadSumbited(true);
      handleSetSumbmitted(false);


    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (submitted === true)
      handleSubmit();
  }, [submitted])




  const transformLift = (lift, index) => {
    const repeatSetting = repeatSettings[index] || {}; // fallback if missing
    return {
      leadId: leadId,
      enquiryId: lift.enquiryId,
      buildTypeId: lift.liftUsageType,
      typeOfLiftId: lift.liftMechanism,
      liftTypeId: lift.elevatorType,
      reqMachineRoomId: lift.machineRoomType,
      cabinTypeId: lift.cabinType,
      capacityTermId: lift.capacityTermId,
      personCapacityId: lift.personCapacityId,
      weightId: lift.weightId,
      noOfFloorsId: lift.noOfFloors,
      floorSelections: lift.floorSelections,
      floorsDesignation: lift.floorsDesignation,
      noOfStops: lift.noOfStops,
      noOfOpenings: lift.noOfOpenings,
      shaftsWidth: lift.shaftWidth,
      shaftsDepth: lift.shaftDepth,
      pit: lift.pit,
      projectStageId: lift.stageOfProject,
      buildingTypeId: lift.buildingType,

      // 👉 Include `checked` and `from` from repeatSettings
      checked: repeatSetting.checked ?? false,
      from: repeatSetting.from ?? "",
    };
  };

  // ✅ Required fields for each lift (excluding floorSelections)
  const requiredLiftFields = [
    "liftUsageType",
    "liftMechanism",
    "elevatorType",
    "machineRoomType",
    "cabinType",
    "capacityType",
    "capacityTermId",
    "personCapacityId",
    "weightId",
    "noOfFloors",
    "floorsDesignation",
    "noOfStops",
    "noOfOpenings",
    "shaftWidth",
    "shaftDepth",
    "pit",
    "stageOfProject",
    "buildingType"
  ];

  const handleSubmitj = async () => {

    //event.preventDefault(); // 🛑 Prevent full page reload

    // ✅ Validate each lift in lifts array
    for (let i = 0; i < form.lifts.length; i++) {
      const lift = form.lifts[i];
      for (let field of requiredLiftFields) {
        //  name={`capacityType-${index}`}
        if (field === 'weightId' && lift['capacityType'] === 'Persons') {
          continue;
        }
        if (field === 'personCapacityId' && lift['capacityType'] === 'Kg') {
          continue;
        }

        if (field === 'shaftWidth' || field === 'shaftDepth' || field === 'pit' || field === 'stageOfProject' || field === 'buildingType') {
          if (enquiryTypeName === 'AMC' || enquiryTypeName === 'On Call' || enquiryTypeName === 'Moderization') {
            continue;
          }
        }

        if (field === 'floorsDesignation' || field === 'noOfStops' || field === 'noOfOpenings') {
          continue;
        }

        if (!lift[field] || lift[field].toString().trim() === "") {

          if (field === 'personCapacityId') {
            toast.error(`Please fill the Select Persons field for Lift ${i + 1}`);
          } else if (field === 'weightId') {
            toast.error(`Please fill the Enter Kg field for Lift ${i + 1}`);

          } else
            toast.error(`Please fill the ${field} field for Lift ${i + 1}`);

          setSubmitted(false);
          setLeadSubmitted(false);
          setIsFinalSubmitLoading(false);
          return;
        }
      }
    }

    //  const leadId = leadId;
    const projectName = "sacwwc";
    const enquiryDate = form.enquiryDate;

    const apiUrl = `/api/combined-enquiry/${leadId}/create-combined-enquiries`;

    // const query = `?projectName=${encodeURIComponent(projectName)}&enquiryTypeId=${enquiryTypeId}`;

    const query = `?projectName=${encodeURIComponent(projectName)}&enquiryTypeId=${enquiryTypeId}&enquiryDate=${enquiryDate}`;


    // 🔁 transform all lifts before sending
    const transformedLifts = form.lifts.map((lift, index) => transformLift(lift, index));

    //alert(transformedLifts[0].capacityTermId);

    //alert("Transformed Lifts: " + JSON.stringify(transformedLifts));


    try {
      const response = await axiosInstance.post(apiUrl + query, transformedLifts);

      handleSetLeadSumbited(false);
      // alert("Success");
      //window.location.href = `/dashboard/lead-management/enquiries/${id}`;
      // ✅ Redirect using props (customer, site, leadId, enquiryTypeName)

      // ✅ Use Next.js router to redirect
      setIsFinalSubmitLoading(false);
      router.push(
        `/dashboard/lead-management/enquiries/${leadId}?customer=${encodeURIComponent(customer1Name)}&site=${encodeURIComponent(siteName)}&enquiryTypeName=${encodeURIComponent(enquiryTypeName)}`
      );

    } catch (err) {
      console.error(err);
      toast.error('Failed to submit enquiry');
    }
  };

  useEffect(() => {

    if (leadSubmitted === true)
      handleSubmitj();

  }, [leadSubmitted])

  const [isFinalSubmitLoading, setIsFinalSubmitLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* PageHeader */}
      <PageHeader
        title="Add Lead and Enquiry"
        description="Complete both stages to create a lead with enquiry details"
      />

      <div className="px-6 py-6">
        {/* Stage Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            {/* Stage 1 */}
            <button
              onClick={() => setActiveStage(1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeStage === 1
                ? 'bg-neutral-900 text-white shadow-sm'
                : hasAllRequiredFieldsForAddLeadFilled
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
            >
              {hasAllRequiredFieldsForAddLeadFilled && activeStage !== 1 ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${activeStage === 1 ? 'bg-white text-neutral-900' : 'bg-neutral-300 text-neutral-700'
                  }`}>1</span>
              )}
              Add Lead
            </button>

            <ChevronRight className="w-5 h-5 text-neutral-400" />

            {/* Stage 2 */}
            <button
              onClick={() => {
                if (hasAllRequiredFieldsForAddLeadFilled) {
                  setActiveStage(2);
                } else {
                  toast.error('Please fill all required lead fields first');
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeStage === 2
                ? 'bg-neutral-900 text-white shadow-sm'
                : hasAllRequiredFieldsForAddLeadFilled
                  ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 cursor-pointer'
                  : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
                }`}
              disabled={!hasAllRequiredFieldsForAddLeadFilled}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${activeStage === 2 ? 'bg-white text-neutral-900' : hasAllRequiredFieldsForAddLeadFilled ? 'bg-neutral-300 text-neutral-700' : 'bg-neutral-200 text-neutral-400'
                }`}>2</span>
              Add Enquiry
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {/* Stage Header */}
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="text-base font-semibold text-neutral-900">
              {activeStage === 1 ? 'Lead Information' : 'Enquiry Details'}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {activeStage === 1
                ? 'Fill in the lead and customer details below'
                : `Adding enquiry for ${customer1Name || 'customer'} at ${siteName || 'site'}`
              }
            </p>
          </div>

          {/* Form Content */}
          {activeStage === 1 && (
            <div className="p-6">
              <AddLead
                handleSetSumbmitted={handleSetSumbmitted}
                handleSetCustomer1Name={handleSetCustomer1Name}
                handleSetSiteName={handleSetSiteName}
                setFormData={setFormData}
                formData={formData}
                setEnquiryTypeName={setEnquiryTypeName}
                setEnquiryTypeId={setEnquiryTypeId}
                handleCheckHasAllRequiredFieldsForAddLeadFilled={handleCheckHasAllRequiredFieldsForAddLeadFilled}
              />
            </div>
          )}

          {activeStage === 2 && (
            <div className="p-6">
              <AddEnquiryForm
                leadSubmitted={leadSubmitted}
                customer={customer1Name}
                site={siteName}
                leadId={leadId}
                form={form}
                setForm={setForm}
                repeatSettings={repeatSettings}
                setRepeatSettings={setRepeatSettings}
                enquiryTypeName={enquiryTypeName}
                enquiryTypeId={enquiryTypeId}
                setEnquiryTypeName={setEnquiryTypeName}
                setEnquiryTypeId={setEnquiryTypeId}
                handleSetLeadSumbited={handleSetLeadSumbited}
              />
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
          <div className="text-sm text-neutral-500">
            {hasAllRequiredFieldsForAddLeadFilled ? (
              <span className="flex items-center gap-1.5 text-green-600">
                <Check className="w-4 h-4" />
                Lead fields complete
              </span>
            ) : (
              <span>Complete all required lead fields to proceed</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeStage === 1 && hasAllRequiredFieldsForAddLeadFilled && (
              <button
                onClick={() => setActiveStage(2)}
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Continue to Enquiry →
              </button>
            )}
            {activeStage === 2 && (
              <button
                disabled={isFinalSubmitLoading}
                onClick={() => {
                  setSubmitted(true);
                  setIsFinalSubmitLoading(true);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isFinalSubmitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isFinalSubmitLoading ? 'Submitting...' : 'Final Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
