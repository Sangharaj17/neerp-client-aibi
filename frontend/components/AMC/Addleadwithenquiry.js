'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Loader2, PlusCircle, Trash2, X, Building2, ListChecks } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PageHeader from '@/components/UI/PageHeader';

import { UserPlus } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// VALIDATION & SANITIZATION HELPERS
// ═════════════════════════════════════════════════════════════════════════════
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

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function AddLeadWithEnquiry() {
  const router = useRouter();
  
  // Main stage control: 'lead' or 'enquiry'
  const [mainStage, setMainStage] = useState('lead');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdLeadId, setCreatedLeadId] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAD FORM DATA & OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const [executives, setExecutives] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [leadStageOptions, setLeadStageOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  const [leadFormData, setLeadFormData] = useState({
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

  // ═══════════════════════════════════════════════════════════════════════════
  // ENQUIRY FORM DATA & OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const [enquiryTypeId, setEnquiryTypeId] = useState('');
  const [enquiryTypeName, setEnquiryTypeName] = useState('');
  const [enquiryTypes, setEnquiryTypes] = useState([]);
  const [repeatSettings, setRepeatSettings] = useState({});
  const [floorOptions, setFloorOptions] = useState([]);
  const [stopsOptions, setStopsOptions] = useState([]);
  const [openingOptions, setOpeningOptions] = useState([]);
  const [floorLabels, setFloorLabels] = useState({});
  const [floorOption, setFloorOption] = useState([]);
  const [personOptions, setPersonOptions] = useState([]);
  const [kgOptions, setKgOptions] = useState([]);
  const [machineRoomOptions, setMachineRoomOptions] = useState([]);
  const [cabinTypeOptions, setCabinTypeOptions] = useState([]);
  const [elevatorTypeOptions, setElevatorTypeOptions] = useState([]);
  const [liftMechanismOptions, setLiftMechanismOptions] = useState([]);
  const [liftUsageTypeOptions, setLiftUsageTypeOptions] = useState([]);
  const [capacityTypeOptions, setCapacityTypeOptions] = useState([]);
  const [projectStages, setProjectStages] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [liftQuantities, setLiftQuantities] = useState([]);

  const [enquiryForm, setEnquiryForm] = useState({
    enquiryDate: formatCurrentDate(),
    leadDetail: '',
    noOfLifts: '1',
    lifts: [getEmptyLift()],
  });

  function getEmptyLift() {
    return {
      leadId: createdLeadId,
      liftUsageType: '',
      liftMechanism: '',
      elevatorType: '',
      machineRoomType: '',
      cabinType: '',
      capacityType: capacityTypeOptions[0]?.value || '',
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

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH OPTIONS FOR LEAD FORM
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchLeadOptions = async () => {
      try {
        const [execRes, sourceRes, typeRes, areaRes, stageRes, desigRes] = await Promise.all([
          axiosInstance.get('/api/employees/executives'),
          axiosInstance.get('/api/leadmanagement/lead-sources'),
          axiosInstance.get('/api/enquiry-types'),
          axiosInstance.get('/api/leadmanagement/areas'),
          axiosInstance.get('/api/leadmanagement/lead-stages'),
          axiosInstance.get('/api/leadmanagement/designations'),
        ]);

        setExecutives(execRes.data.map((emp) => ({ value: emp.employeeId, label: emp.employeeName })));
        setLeadSources(sourceRes.data.map((src) => ({ value: src.leadSourceId, label: src.sourceName })));
        setLeadTypes(typeRes.data.map((item) => item.enquiryTypeName));
        setEnquiryTypes(typeRes.data);
        setAreaOptions(areaRes.data.map((area) => ({ value: area.areaId, label: area.areaName })));
        setLeadStageOptions(stageRes.data.map((stage) => ({ value: stage.stageId, label: stage.stageName })));
        setDesignationOptions(desigRes.data.map((d) => ({ value: d.designationId, label: d.designationName })));
      } catch (err) {
        console.error('Failed to fetch lead options', err);
      }
    };

    fetchLeadOptions();
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH OPTIONS FOR ENQUIRY FORM
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchEnquiryOptions = async () => {
      try {
        const [
          floorsRes, additionalRes, personsRes, weightsRes, machineRes,
          cabinRes, elevatorRes, liftMechRes, liftUsageRes, capacityRes,
          projectStagesRes, buildingTypesRes, liftQuantitiesRes
        ] = await Promise.all([
          axiosInstance.get('/api/floors'),
          axiosInstance.get('/api/additional-floors'),
          axiosInstance.get('/api/personCapacity'),
          axiosInstance.get('/api/weights'),
          axiosInstance.get('/api/machine-rooms'),
          axiosInstance.get('/api/cabinType'),
          axiosInstance.get('/api/operator-elevator'),
          axiosInstance.get('/api/type-of-lift'),
          axiosInstance.get('/api/leadmanagement/build-types'),
          axiosInstance.get('/api/capacityTypes'),
          axiosInstance.get('/api/leadmanagement/project-stages'),
          axiosInstance.get('/api/leadmanagement/building-types'),
          axiosInstance.get('/api/leadmanagement/lift-quantities'),
        ]);

        // Process floors
        const mainFloors = Array.isArray(floorsRes.data.data) ? floorsRes.data.data : [];
        const formattedMainFloors = mainFloors.map(f => ({ id: f.id, name: f.floorName || f.id }));
        setFloorOption(formattedMainFloors);

        const additionalFloors = Array.isArray(additionalRes.data) ? additionalRes.data : [];
        const additionalFloorCodes = additionalFloors.map(f => f.code);
        const labels = {};
        additionalFloors.forEach(f => { labels[f.code] = f.label; });
        setFloorOptions(additionalFloorCodes);
        setFloorLabels(labels);

        const totalFloorsCount = formattedMainFloors.length + additionalFloorCodes.length;
        setStopsOptions(Array.from({ length: totalFloorsCount }, (_, i) => i + 1));
        setOpeningOptions(Array.from({ length: totalFloorsCount * 2 }, (_, i) => i + 1));

        // Person capacity
        const formattedPersons = personsRes.data.data.map((p) => ({
          id: p.id,
          displayName: p.displayName,
          convertedString: `${String(p.personCount).padStart(2, '0')} Person${p.personCount > 1 ? 's' : ''}/${p.weight}Kg`
        }));
        setPersonOptions(formattedPersons);

        // Weights
        const formattedWeights = weightsRes.data.data.map((w) => ({
          id: w.id,
          display: `${w.weightValue} ${w.unit || 'Kg'}`
        }));
        setKgOptions(formattedWeights);

        // Machine rooms
        setMachineRoomOptions(machineRes.data.data.map((room) => ({ id: room.id, name: room.machineRoomName })));

        // Cabin types
        setCabinTypeOptions(cabinRes.data.map((type) => ({ id: type.id, name: type.cabinType })));

        // Elevator types
        setElevatorTypeOptions(elevatorRes.data.data.map((item) => ({ id: item.id, name: item.name })));

        // Lift mechanisms
        setLiftMechanismOptions(liftMechRes.data.data.map((item) => ({ id: item.id, name: item.liftTypeName })));

        // Lift usage types
        setLiftUsageTypeOptions(liftUsageRes.data.map((item) => ({ id: item.id, name: item.name })));

        // Capacity types
        const capacityOpts = capacityRes.data.data.map(item => ({ id: item.id, label: item.type, value: item.type }));
        setCapacityTypeOptions(capacityOpts);

        // Project stages & building types
        setProjectStages(projectStagesRes.data);
        setBuildingTypes(buildingTypesRes.data);
        setLiftQuantities(liftQuantitiesRes.data);

      } catch (err) {
        console.error('Failed to fetch enquiry options', err);
      }
    };

    fetchEnquiryOptions();
  }, []);

  // Set default capacity type when options load
  useEffect(() => {
    if (capacityTypeOptions.length > 0 && enquiryForm.lifts[0].capacityType === '') {
      setEnquiryForm((prevForm) => {
        const updatedLifts = [...prevForm.lifts];
        updatedLifts[0].capacityType = capacityTypeOptions[0].value;
        updatedLifts[0].capacityTermId = capacityTypeOptions[0].id;
        return { ...prevForm, lifts: updatedLifts };
      });
    }
  }, [capacityTypeOptions]);

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAD FORM HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  const handleLeadChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === 'contactNo' || name === 'customer2Contact') {
      sanitizedValue = sanitizeMobileNumber(value).slice(0, 10);
    }
    if (name === 'landlineNo') {
      sanitizedValue = value.replace(/[^0-9-]/g, '');
    }

    setLeadFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });

    if (name === 'companyName') setLeadFormData((prev) => ({ ...prev, siteName: sanitizedValue }));
    if (name === 'companyAddress') setLeadFormData((prev) => ({ ...prev, siteAddress: sanitizedValue }));
  };

  const handleRemoveEmail2 = () => {
    setShowEmail2(false);
    setLeadFormData((prev) => ({ ...prev, email2: '' }));
    if (errors.email2) setErrors((prev) => { const n = { ...prev }; delete n.email2; return n; });
  };

  const validateLeadForm = () => {
    const newErrors = {};
    const isEmpty = (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      return false;
    };

    if (!leadFormData.leadDate) newErrors.leadDate = 'Lead date is required';
    if (!leadFormData.executive || leadFormData.executive === '0') newErrors.executive = 'Executive is required';
    if (!leadFormData.leadSource || leadFormData.leadSource === '0') newErrors.leadSource = 'Lead source is required';
    if (!leadFormData.leadType?.trim()) newErrors.leadType = 'Lead type is required';
    if (isEmpty(leadFormData.customer1Name)) newErrors.customer1Name = 'Customer name is required';
    if (!leadFormData.customer1Designation || leadFormData.customer1Designation === '0') newErrors.customer1Designation = 'Designation is required';
    if (isEmpty(leadFormData.companyName)) newErrors.companyName = 'Company name is required';

    if (isEmpty(leadFormData.contactNo)) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!isValidMobileNumber(leadFormData.contactNo)) {
      newErrors.contactNo = 'Enter valid 10-digit mobile number';
    }

    if (isEmpty(leadFormData.companyAddress)) newErrors.companyAddress = 'Company address is required';

    if (leadFormData.email && !isValidEmail(leadFormData.email)) {
      newErrors.email = 'Enter valid email (e.g., name@domain.com)';
    }
    if (leadFormData.email2 && !isValidEmail(leadFormData.email2)) {
      newErrors.email2 = 'Enter valid email (e.g., name@domain.com)';
    }

    if (leadFormData.siteSame === 'No' && isEmpty(leadFormData.siteName)) {
      newErrors.siteName = 'Site name is required';
    }
    if (leadFormData.siteSameAddress === 'No' && isEmpty(leadFormData.siteAddress)) {
      newErrors.siteAddress = 'Site address is required';
    }

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const validateLeadStep = (step) => {
    const newErrors = {};
    const isEmpty = (v) => !v || (typeof v === 'string' && !v.trim());

    if (step === 1) {
      if (!leadFormData.leadDate) newErrors.leadDate = 'Required';
      if (!leadFormData.executive) newErrors.executive = 'Required';
      if (!leadFormData.leadSource) newErrors.leadSource = 'Required';
      if (isEmpty(leadFormData.leadType)) newErrors.leadType = 'Required';
    }

    if (step === 2) {
      if (isEmpty(leadFormData.customer1Name)) newErrors.customer1Name = 'Required';
      if (!leadFormData.customer1Designation) newErrors.customer1Designation = 'Required';
      if (isEmpty(leadFormData.companyName)) newErrors.companyName = 'Required';
      if (leadFormData.siteSame === 'No' && isEmpty(leadFormData.siteName)) newErrors.siteName = 'Required';
      if (leadFormData.email && !isValidEmail(leadFormData.email)) newErrors.email = 'Invalid email';
      if (leadFormData.email2 && !isValidEmail(leadFormData.email2)) newErrors.email2 = 'Invalid email';
    }

    if (step === 3) {
      if (isEmpty(leadFormData.contactNo)) {
        newErrors.contactNo = 'Required';
      } else if (!isValidMobileNumber(leadFormData.contactNo)) {
        newErrors.contactNo = '10 digits required';
      }
      if (isEmpty(leadFormData.companyAddress)) newErrors.companyAddress = 'Required';
      if (leadFormData.siteSameAddress === 'No' && isEmpty(leadFormData.siteAddress)) newErrors.siteAddress = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeadNext = () => {
    if (validateLeadStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 3));
    }
  };

  const handleLeadBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleLeadSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const { isValid, errors: validationErrors } = validateLeadForm();
    if (!isValid) {
      setErrors(validationErrors);
      toast.error(`Please fix ${Object.keys(validationErrors).length} error(s)`);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      leadDate: new Date(leadFormData.leadDate).toISOString(),
      activityById: parseInt(leadFormData.executive),
      leadSourceId: parseInt(leadFormData.leadSource),
      leadType: sanitizeText(leadFormData.leadType),
      salutations: leadFormData.customer1Title,
      customerName: sanitizeText(leadFormData.customer1Name),
      designationId: parseInt(leadFormData.customer1Designation),
      contactNo: sanitizeMobileNumber(leadFormData.contactNo),
      customer2Contact: leadFormData.customer2Contact ? sanitizeMobileNumber(leadFormData.customer2Contact) : null,
      landlineNo: leadFormData.landlineNo?.trim() || null,
      salutations2: leadFormData.customer2Title,
      customerName2: sanitizeText(leadFormData.customer2Name) || null,
      designation2Id: leadFormData.customer2Designation ? parseInt(leadFormData.customer2Designation) : null,
      leadCompanyName: sanitizeText(leadFormData.companyName),
      siteName: leadFormData.siteSame === 'Yes' ? sanitizeText(leadFormData.companyName) : (sanitizeText(leadFormData.siteName) || sanitizeText(leadFormData.companyName)),
      emailId: leadFormData.email?.trim().toLowerCase() || null,
      emailId2: leadFormData.email2?.trim().toLowerCase() || null,
      countryCode: leadFormData.contactCountry.split('(')[1]?.replace(')', ''),
      address: sanitizeAddress(leadFormData.companyAddress),
      siteAddress: leadFormData.siteSameAddress === 'Yes' ? sanitizeAddress(leadFormData.companyAddress) : (sanitizeAddress(leadFormData.siteAddress) || sanitizeAddress(leadFormData.companyAddress)),
      areaId: leadFormData.area ? parseInt(leadFormData.area) : null,
      leadStageId: leadFormData.leadStage ? parseInt(leadFormData.leadStage) : null,
      status: 'Open',
    };

    try {
      const response = await axiosInstance.post("/api/leadmanagement/leads", payload);
      const newLeadId = response.data.leadId;
      setCreatedLeadId(newLeadId);
      
      // Find selected enquiry type
      const selectedEnquiryType = enquiryTypes.find(et => et.enquiryTypeName === leadFormData.leadType);
      if (selectedEnquiryType) {
        setEnquiryTypeId(selectedEnquiryType.enquiryTypeId);
        setEnquiryTypeName(selectedEnquiryType.enquiryTypeName);
      }

      // Set enquiry lead detail
      const customer = leadFormData.customer1Name;
      const site = leadFormData.siteSame === 'Yes' ? leadFormData.companyName : leadFormData.siteName;
      setEnquiryForm(prev => ({
        ...prev,
        leadDetail: `${customer} For ${site}`,
        lifts: [{ ...getEmptyLift(), leadId: newLeadId }]
      }));

      toast.success('Lead created successfully! Now add lift requirements.');
      setMainStage('enquiry');
      setCurrentStep(1);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // ENQUIRY FORM HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm({ ...enquiryForm, [name]: value });
  };

  const handleNoOfLiftsChange = (e) => {
    const value = e.target.value;
    const num = parseInt(value, 10) || 0;
    const liftsArray = Array.from({ length: num }, (_, i) => enquiryForm.lifts[i] || getEmptyLift());

    const updatedRepeatSettings = {};
    for (let i = 0; i < num; i++) {
      if (repeatSettings[i]) updatedRepeatSettings[i] = repeatSettings[i];
    }

    setEnquiryForm((prev) => ({ ...prev, noOfLifts: value, lifts: liftsArray }));
    setRepeatSettings(updatedRepeatSettings);
  };

  const handleLiftChange = (index, field, value) => {
    setEnquiryForm((prevForm) => {
      const updatedLifts = [...prevForm.lifts];
      updatedLifts[index][field] = value;
      const currentLift = updatedLifts[index];

      if (field === 'noOfFloors') {
        const selectedFloor = floorOption.find(opt => {
          if (!value) return false;
          const floorNumber = parseInt(value, 10);
          if (isNaN(floorNumber)) return false;
          const originalFloorName = `G+${floorNumber - 1}`;
          return opt.name === originalFloorName;
        });

        if (selectedFloor) {
          const selectedAdditionalFloors = updatedLifts[index]["floorSelections"] || [];
          currentLift.noOfStops = Number(value) + selectedAdditionalFloors.length;
          currentLift.noOfOpenings = Number(value) + selectedAdditionalFloors.length;
          currentLift.floorsDesignation = selectedFloor.name;
        } else {
          currentLift.noOfStops = 0;
          currentLift.noOfOpenings = 0;
          currentLift.floorsDesignation = '';
        }
      }

      if (field === "floorSelections") {
        const newSelections = value;
        currentLift.floorSelections = newSelections;
        const stopNo = (Number(currentLift.noOfFloors) || 0) + newSelections.length;
        currentLift.noOfStops = stopNo;
        currentLift.noOfOpenings = stopNo;
        const updatedLifts = [...prevForm.lifts];
        updatedLifts[index] = { ...currentLift };
      }

      const syncDependents = (sourceIndex) => {
        Object.entries(repeatSettings).forEach(([repeatIndexStr, settings]) => {
          const repeatIndex = parseInt(repeatIndexStr, 10);
          if (settings.checked && parseInt(settings.from, 10) - 1 === sourceIndex) {
            updatedLifts[repeatIndex] = { ...updatedLifts[sourceIndex] };
            syncDependents(repeatIndex);
          }
        });
      };

      syncDependents(index);
      return { ...prevForm, lifts: updatedLifts };
    });
  };

  const handleRepeatChange = (index, field, value) => {
    setRepeatSettings((prev) => {
      const updated = { ...prev };
      if (field === 'checked' && !value) {
        updated[index] = { checked: false, from: '' };
        setEnquiryForm((prevForm) => {
          const updatedLifts = [...prevForm.lifts];
          updatedLifts[index] = getEmptyLift();
          return { ...prevForm, lifts: updatedLifts };
        });
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleRepeat = (index) => {
    const repeatFrom = parseInt(repeatSettings[index]?.from || '', 10) - 1;
    if (isNaN(repeatFrom) || repeatFrom < 0 || repeatFrom >= index) {
      toast.error(`Invalid lift number to repeat from for Lift ${index + 1}`);
      return;
    }

    setEnquiryForm((prevForm) => {
      const updatedLifts = [...prevForm.lifts];
      updatedLifts[index] = { ...updatedLifts[repeatFrom] };
      return { ...prevForm, lifts: updatedLifts };
    });

    handleLiftChange(repeatFrom, '__dummy__', '__noop__');
  };

  const transformLift = (lift, index) => {
    const repeatSetting = repeatSettings[index] || {};
    const selectedFloor = floorOption.find(opt => {
      const floorNumber = parseInt(lift.noOfFloors, 10);
      if (isNaN(floorNumber)) return false;
      return opt.name === `G+${floorNumber - 1}`;
    });
    let floorId = selectedFloor ? selectedFloor.id : null;

    return {
      leadId: lift.leadId,
      enquiryId: lift.enquiryId,
      buildTypeId: lift.liftUsageType,
      liftName: `Lift ${index + 1}`,
      typeOfLiftId: lift.liftMechanism,
      liftTypeId: lift.elevatorType,
      reqMachineRoomId: lift.machineRoomType,
      cabinTypeId: lift.cabinType,
      capacityTermId: lift.capacityTermId,
      personCapacityId: lift.personCapacityId,
      weightId: lift.weightId,
      noOfFloorsId: floorId,
      floorSelections: lift.floorSelections,
      floorsDesignation: lift.floorsDesignation,
      noOfStops: lift.noOfStops,
      noOfOpenings: lift.noOfOpenings,
      shaftsWidth: lift.shaftWidth,
      shaftsDepth: lift.shaftDepth,
      pit: lift.pit,
      projectStageId: lift.stageOfProject,
      buildingTypeId: lift.buildingType,
      checked: repeatSetting.checked ?? false,
      from: repeatSetting.from ?? "",
    };
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const projectName = leadFormData.companyName;
    const siteName = leadFormData.siteSame === 'Yes' ? leadFormData.companyName : leadFormData.siteName;
    const enquiryDate = enquiryForm.enquiryDate;

    const apiUrl = `/api/combined-enquiry/${createdLeadId}/create-combined-enquiries`;
    const query = `?projectName=${encodeURIComponent(projectName)}&siteName=${encodeURIComponent(siteName)}&enquiryTypeId=${enquiryTypeId}&enquiryDate=${enquiryDate}`;

    const transformedLifts = enquiryForm.lifts.map((lift, index) => transformLift(lift, index));

    setIsSubmitting(true);
    try {
      await axiosInstance.post(apiUrl + query, transformedLifts);
      toast.success('Enquiry added successfully!');
      router.push(`/dashboard/lead-management/lead-list`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const leadSteps = [
    { id: 1, title: 'Lead Info' },
    { id: 2, title: 'Customer & Company' },
    { id: 3, title: 'Contact & Address' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PageHeader
        title={mainStage === 'lead' ? "Create New Lead" : "Add Lift Requirements"}
        description={mainStage === 'lead' ? "Complete all steps to create a lead" : "Define lift specifications for the created lead"}
        showBack={mainStage === 'lead'}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Stage Indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${mainStage === 'lead' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400'}`}>
            <Building2 className="w-5 h-5" />
            <span className="font-semibold">1. Create Lead</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${mainStage === 'enquiry' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400'}`}>
            <ListChecks className="w-5 h-5" />
            <span className="font-semibold">2. Add Enquiry</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* LEAD FORM */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {mainStage === 'lead' && (
          <>
            {/* Lead Stepper */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {leadSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                        ${currentStep > step.id ? 'bg-emerald-500 border-emerald-500 text-white' : currentStep === step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
                    >
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < leadSteps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-3 mb-6 transition-all ${currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Lead Form Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
              
              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-800">Please complete the following required fields:</p>
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

              {/* Step 1: Lead Info */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <Field label="Lead Date" required error={errors.leadDate}>
                    <input type="date" name="leadDate" value={leadFormData.leadDate} onChange={handleLeadChange} className={inputClass(errors.leadDate)} />
                  </Field>

                  <Field label="Select Executive" required error={errors.executive}>
                    <select name="executive" value={leadFormData.executive} onChange={handleLeadChange} className={inputClass(errors.executive)}>
                      <option value="">Please Select</option>
                      {executives.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>

                  <Field label="Lead Source" required error={errors.leadSource}>
                    <select name="leadSource" value={leadFormData.leadSource} onChange={handleLeadChange} className={inputClass(errors.leadSource)}>
                      <option value="">Please Select</option>
                      {leadSources.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>

                  <Field label="Lead Type" required error={errors.leadType}>
                    <select name="leadType" value={leadFormData.leadType} onChange={handleLeadChange} className={inputClass(errors.leadType)}>
                      <option value="">Please Select</option>
                      {leadTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {/* Step 2: Customer & Company */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  {/* Customer 1 */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Customer Information *</label>
                    {(errors.customer1Name || errors.customer1Designation) && (
                      <p className="text-xs text-red-500 mb-3">{errors.customer1Name || errors.customer1Designation}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <select name="customer1Title" value={leadFormData.customer1Title} onChange={handleLeadChange} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500">
                        <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                      </select>
                      <input type="text" name="customer1Name" placeholder="Customer Name" value={leadFormData.customer1Name} onChange={handleLeadChange}
                        className={`flex-1 min-w-[200px] border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${errors.customer1Name ? 'border-red-400' : 'border-gray-300'}`} />
                      <select name="customer1Designation" value={leadFormData.customer1Designation} onChange={handleLeadChange}
                        className={`border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${errors.customer1Designation ? 'border-red-400' : 'border-gray-300'}`}>
                        <option value="">Select Designation</option>
                        {designationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      {!showCustomer2 && (
                        <button type="button" onClick={() => setShowCustomer2(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                          <UserPlus className="w-4 h-4" /> Add Customer 2
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Customer 2 */}
                  {showCustomer2 && (
                    <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-semibold text-gray-800">Customer 2 (Optional)</label>
                        <button type="button" onClick={() => setShowCustomer2(false)} className="text-red-500 hover:text-red-600 p-1 transition"><Trash2 className="w-5 h-5" /></button>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <select name="customer2Title" value={leadFormData.customer2Title} onChange={handleLeadChange} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500">
                          <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                        </select>
                        <input type="text" name="customer2Name" placeholder="Name" value={leadFormData.customer2Name} onChange={handleLeadChange} className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500" />
                        <select name="customer2Designation" value={leadFormData.customer2Designation} onChange={handleLeadChange} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500">
                          <option value="">Select Designation</option>
                          {designationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <input type="text" name="customer2Contact" placeholder="Mobile (10 digits)" value={leadFormData.customer2Contact} onChange={handleLeadChange} maxLength={10} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-40 focus:ring-2 focus:ring-purple-500" />
                      </div>
                    </div>
                  )}

                  <Field label="Company Name" required error={errors.companyName}>
                    <input type="text" name="companyName" value={leadFormData.companyName} onChange={handleLeadChange} className={inputClass(errors.companyName)} />
                  </Field>

                  <Field label="Site Name same as Company" required>
                    <div className="flex gap-6">
                      {['Yes', 'No'].map((v) => (
                        <label key={v} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
                          <input type="radio" name="siteSame" value={v} checked={leadFormData.siteSame === v} onChange={handleLeadChange} className="accent-blue-600 w-4 h-4" /> {v}
                        </label>
                      ))}
                    </div>
                  </Field>

                  {leadFormData.siteSame === 'No' && (
                    <Field label="Site Name" required error={errors.siteName}>
                      <input type="text" name="siteName" value={leadFormData.siteName} onChange={handleLeadChange} className={inputClass(errors.siteName)} />
                    </Field>
                  )}

                  <Field label="Email ID" error={errors.email}>
                    <input type="email" name="email" placeholder="email@example.com" value={leadFormData.email} onChange={handleLeadChange} className={inputClass(errors.email)} />
                  </Field>

                  {!showEmail2 ? (
                    <button type="button" onClick={() => setShowEmail2(true)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition">
                      <PlusCircle className="w-4 h-4" /> Add Second Email
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Email ID 2</label>
                        <button type="button" onClick={handleRemoveEmail2} className="text-red-500 hover:text-red-700 p-1 transition"><X className="w-4 h-4" /></button>
                      </div>
                      {errors.email2 && <p className="text-xs text-red-500">{errors.email2}</p>}
                      <input type="email" name="email2" value={leadFormData.email2} onChange={handleLeadChange} className={inputClass(errors.email2)} />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Contact & Address */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <Field label="Contact No." required error={errors.contactNo}>
                    <div className="flex gap-3">
                      <select name="contactCountry" value={leadFormData.contactCountry} onChange={handleLeadChange} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500">
                        <option>India (+91)</option>
                      </select>
                      <input type="text" name="contactNo" placeholder="10-digit mobile" value={leadFormData.contactNo} onChange={handleLeadChange} maxLength={10} className={`flex-1 ${inputClass(errors.contactNo)}`} />
                    </div>
                  </Field>

                  <Field label="Landline No.">
                    <input type="text" name="landlineNo" value={leadFormData.landlineNo} onChange={handleLeadChange} className={inputClass()} />
                  </Field>

                  <Field label="Company Address" required error={errors.companyAddress}>
                    <textarea name="companyAddress" rows={3} value={leadFormData.companyAddress} onChange={handleLeadChange} className={inputClass(errors.companyAddress)} />
                  </Field>

                  <Field label="Site Address same as Company" required>
                    <div className="flex gap-6">
                      {['Yes', 'No'].map((v) => (
                        <label key={v} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
                          <input type="radio" name="siteSameAddress" value={v} checked={leadFormData.siteSameAddress === v} onChange={handleLeadChange} className="accent-blue-600 w-4 h-4" /> {v}
                        </label>
                      ))}
                    </div>
                  </Field>

                  {leadFormData.siteSameAddress === 'No' && (
                    <Field label="Site Address" required error={errors.siteAddress}>
                      <textarea name="siteAddress" rows={3} value={leadFormData.siteAddress} onChange={handleLeadChange} className={inputClass(errors.siteAddress)} />
                    </Field>
                  )}

                  <Field label="Select Area">
                    <select name="area" value={leadFormData.area} onChange={handleLeadChange} className={inputClass()}>
                      <option value="">Please Select</option>
                      {areaOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>

                  <Field label="Lead Stage">
                    <select name="leadStage" value={leadFormData.leadStage} onChange={handleLeadChange} className={inputClass()}>
                      <option value="">Please Select</option>
                      {leadStageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                <div>
                  {currentStep > 1 && (
                    <button type="button" onClick={handleLeadBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition">
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition">
                    Cancel
                  </button>
                  {currentStep < 3 ? (
                    <button type="button" onClick={handleLeadNext} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium shadow-md transition">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="button" onClick={handleLeadSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition">
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? 'Creating Lead...' : 'Create Lead & Continue'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center"><span className="text-red-500">*</span> Indicates mandatory fields</p>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ENQUIRY FORM */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {mainStage === 'enquiry' && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4 px-6">
              <h2 className="text-xl font-bold">Lift Requirements Specification</h2>
              <p className="text-sm text-blue-100 mt-1">Enquiry Type: <span className="font-semibold">{enquiryTypeName}</span></p>
            </div>

            <form onSubmit={handleEnquirySubmit} className="p-8 space-y-6">
              
              {/* Header Info */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                  {floorOptions.map((floor) => (
                    <span key={floor} className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <span className="font-semibold">{floor}</span> = {floorLabels[floor]}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Input label="Enquiry Date *" type="date" name="enquiryDate" value={enquiryForm.enquiryDate} onChange={handleEnquiryChange} />
                  <Input label="Lead Detail *" name="leadDetail" value={enquiryForm.leadDetail} readOnly disabled />
                  <Select label="No. of Lifts *" name="noOfLifts" value={enquiryForm.noOfLifts} onChange={handleNoOfLiftsChange}>
                    {liftQuantities.map((item) => (
                      <option key={item.id} value={item.quantity}>{item.quantity}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Lift Details */}
              {enquiryForm.lifts.map((lift, index) => (
                <div key={index} className="border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Lift {index + 1} Specifications</h3>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Repeat functionality */}
                    {index > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={repeatSettings[index]?.checked || false} 
                          onChange={(e) => handleRepeatChange(index, 'checked', e.target.checked)} 
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Copy specification from Lift</span>
                        <input
                          type="number"
                          min="1"
                          max={index}
                          disabled={!repeatSettings[index]?.checked}
                          value={repeatSettings[index]?.from || ''}
                          onChange={(e) => handleRepeatChange(index, 'from', e.target.value)}
                          className={`border rounded-lg px-3 py-1.5 text-sm w-20 ${repeatSettings[index]?.checked ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRepeat(index)}
                          disabled={!repeatSettings[index]?.checked}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${repeatSettings[index]?.checked ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                          Copy Now
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <Select label="Lift Usage Type *" value={String(lift.liftUsageType)} onChange={(e) => handleLiftChange(index, 'liftUsageType', e.target.value)}>
                        <option value="">Please Select</option>
                        {liftUsageTypeOptions.map((opt) => <option key={opt.id} value={String(opt.id)}>{opt.name}</option>)}
                      </Select>

                      <Select label="Lift Mechanism *" value={String(lift.liftMechanism)} onChange={(e) => handleLiftChange(index, 'liftMechanism', e.target.value)}>
                        <option value="">Please Select</option>
                        {liftMechanismOptions.map((opt) => <option key={opt.id} value={String(opt.id)}>{opt.name}</option>)}
                      </Select>

                      <Select label="Elevator Type *" value={String(lift.elevatorType)} onChange={(e) => handleLiftChange(index, 'elevatorType', e.target.value)}>
                        <option value="">Please Select</option>
                        {elevatorTypeOptions.map((opt) => <option key={opt.id} value={String(opt.id)}>{opt.name}</option>)}
                      </Select>

                      <Select label="Machine Room Type *" value={String(lift.machineRoomType)} onChange={(e) => handleLiftChange(index, 'machineRoomType', e.target.value)}>
                        <option value="">Please Select</option>
                        {machineRoomOptions.map((opt) => <option key={opt.id} value={String(opt.id)}>{opt.name}</option>)}
                      </Select>

                      <Select label="Cabin Type *" value={String(lift.cabinType)} onChange={(e) => handleLiftChange(index, 'cabinType', e.target.value)}>
                        <option value="">Please Select</option>
                        {cabinTypeOptions.map((opt) => <option key={opt.id} value={String(opt.id)}>{opt.name}</option>)}
                      </Select>

                      <RadioGroup
                        label="Capacity Type *"
                        name={`capacityType-${index}`}
                        options={capacityTypeOptions}
                        selected={capacityTypeOptions.find(opt => opt.label === lift.capacityType)?.value || ''}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedOption = capacityTypeOptions.find(opt => String(opt.value) === selectedId);
                          if (selectedOption) {
                            handleLiftChange(index, 'capacityType', selectedOption.label);
                            handleLiftChange(index, 'capacityTermId', selectedOption.id);
                          }
                        }}
                      />

                      {lift.capacityType === 'Person' ? (
                        <Select label="Select Persons *" value={lift.personCapacityId} onChange={(e) => handleLiftChange(index, 'personCapacityId', e.target.value)}>
                          <option value="">Please Select</option>
                          {personOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.displayName}</option>)}
                        </Select>
                      ) : (
                        <Select label="Enter Kg *" value={String(lift.weightId)} onChange={(e) => handleLiftChange(index, 'weightId', e.target.value)}>
                          <option value="">Please Select</option>
                          {kgOptions.map((opt) => <option key={opt.id} value={String(opt.id)}>{opt.display}</option>)}
                        </Select>
                      )}

                      <Select label="No. of Floors *" value={String(lift.noOfFloors || "")} onChange={(e) => handleLiftChange(index, "noOfFloors", e.target.value)}>
                        <option value="">Please Select</option>
                        {floorOption.map((opt) => {
                          const plusIndex = opt.name.indexOf("+");
                          const floorNumber = plusIndex !== -1 ? parseInt(opt.name.substring(plusIndex + 1), 10) + 1 : "";
                          return <option key={opt.id} value={floorNumber}>{floorNumber}</option>;
                        })}
                      </Select>

                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Floor Designation & Additional Floors</label>
                        <input type="text" value={lift.floorsDesignation} readOnly disabled className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 cursor-not-allowed mb-3" />
                        <div className="flex flex-wrap gap-3">
                          {floorOptions.map((floor) => (
                            <label key={floor} className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-500 transition">
                              <input 
                                type="checkbox"
                                value={floor}
                                checked={lift.floorSelections.includes(floor)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const updated = checked ? [...lift.floorSelections, floor] : lift.floorSelections.filter((f) => f !== floor);
                                  handleLiftChange(index, 'floorSelections', updated);
                                }}
                                className="w-4 h-4 accent-blue-600" 
                              />
                              {floor}
                            </label>
                          ))}
                        </div>
                      </div>

                      <Select label="No. of Stops *" value={String(lift.noOfStops || "")} onChange={(e) => handleLiftChange(index, "noOfStops", Number(e.target.value))}>
                        <option value="">Please Select</option>
                        {stopsOptions.map((opt) => <option key={opt} value={String(opt)}>{opt}</option>)}
                      </Select>

                      <Select label="No. of Openings *" value={String(lift.noOfOpenings || "")} onChange={(e) => handleLiftChange(index, "noOfOpenings", Number(e.target.value))}>
                        <option value="">Please Select</option>
                        {openingOptions.map((opt) => <option key={opt} value={String(opt)}>{opt}</option>)}
                      </Select>

                      {enquiryTypeName === 'New Installation' && (
                        <>
                          <Input label="Shaft Width (mm) *" value={lift.shaftWidth} onChange={(e) => handleLiftChange(index, 'shaftWidth', e.target.value)} />
                          <Input label="Shaft Depth (mm) *" value={lift.shaftDepth} onChange={(e) => handleLiftChange(index, 'shaftDepth', e.target.value)} />
                          <Input label="Pit (mm) *" value={lift.pit} onChange={(e) => handleLiftChange(index, 'pit', e.target.value)} />
                          
                          <Select label="Stage of Project *" value={lift.stageOfProject} onChange={(e) => handleLiftChange(index, 'stageOfProject', e.target.value)}>
                            <option value="">Please Select</option>
                            {projectStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.stageName}</option>)}
                          </Select>

                          <Select label="Building Type *" value={lift.buildingType} onChange={(e) => handleLiftChange(index, 'buildingType', e.target.value)}>
                            <option value="">Please Select</option>
                            {buildingTypes.map((type) => <option key={type.buildingTypeId} value={type.buildingTypeId}>{type.buildingType}</option>)}
                          </Select>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => router.push('/dashboard/lead-management/lead-list')} 
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Skip & Finish
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════
const inputClass = (error) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? 'border-red-400' : 'border-gray-300'}`;

function Field({ label, required, error, children }) {
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
        {error && <span className="ml-2 text-xs font-normal text-red-500">({error})</span>}
      </label>
      {children}
    </div>
  );
}

const Input = ({ label, tooltip, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input 
      required 
      {...props} 
      title={tooltip} 
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition" 
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select 
      required 
      {...props} 
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
    >
      {children}
    </select>
  </div>
);

const RadioGroup = ({ label, name, options, selected, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selected === opt.value}
            onChange={onChange}
            className="w-4 h-4 accent-blue-600"
            required
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);