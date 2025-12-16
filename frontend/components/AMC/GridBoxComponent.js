'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance'; 
import { Pencil, Trash2, Plus, Settings, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/UI/Input';

/**
 * colorMap avoids dynamic class interpolation like `bg-${color}-600`
 */
const colorMap = {
  blue: { button: 'bg-blue-600 hover:bg-blue-700', header: 'bg-blue-500', ring: 'focus:ring-blue-400', activeSidebar: 'bg-blue-600', textAccent: 'text-blue-600', border: 'border-blue-200' },
  green: { button: 'bg-green-600 hover:bg-green-700', header: 'bg-green-500', ring: 'focus:ring-green-400', activeSidebar: 'bg-green-600', textAccent: 'text-green-600', border: 'border-green-200' },
  purple: { button: 'bg-purple-600 hover:bg-purple-700', header: 'bg-purple-500', ring: 'focus:ring-purple-400', activeSidebar: 'bg-purple-600', textAccent: 'text-purple-600', border: 'border-purple-200' },
  red: { button: 'bg-red-600 hover:bg-red-700', header: 'bg-red-500', ring: 'focus:ring-red-400', activeSidebar: 'bg-red-600', textAccent: 'text-red-600', border: 'border-red-200' },
  indigo: { button: 'bg-indigo-600 hover:bg-indigo-700', header: 'bg-indigo-500', ring: 'focus:ring-indigo-400', activeSidebar: 'bg-indigo-600', textAccent: 'text-indigo-600', border: 'border-indigo-200' },
  emerald: { button: 'bg-emerald-600 hover:bg-emerald-700', header: 'bg-emerald-500', ring: 'focus:ring-emerald-400', activeSidebar: 'bg-emerald-600', textAccent: 'text-emerald-600', border: 'border-emerald-200' },
  cyan: { button: 'bg-cyan-600 hover:bg-cyan-700', header: 'bg-cyan-500', ring: 'focus:ring-cyan-400', activeSidebar: 'bg-cyan-600', textAccent: 'text-cyan-600', border: 'border-cyan-200' },
  amber: { button: 'bg-amber-600 hover:bg-amber-700', header: 'bg-amber-500', ring: 'focus:ring-amber-400', activeSidebar: 'bg-amber-600', textAccent: 'text-amber-600', border: 'border-amber-200' },
  rose: { button: 'bg-rose-600 hover:bg-rose-700', header: 'bg-rose-500', ring: 'focus:ring-rose-400', activeSidebar: 'bg-rose-600', textAccent: 'text-rose-600', border: 'border-rose-200' },
  teal: { button: 'bg-teal-600 hover:bg-teal-700', header: 'bg-teal-500', ring: 'focus:ring-teal-400', activeSidebar: 'bg-teal-600', textAccent: 'text-teal-600', border: 'border-teal-200' },
  orange: { button: 'bg-orange-600 hover:bg-orange-700', header: 'bg-orange-500', ring: 'focus:ring-orange-400', activeSidebar: 'bg-orange-600', textAccent: 'text-orange-600', border: 'border-orange-200' },
  yellow: { button: 'bg-yellow-600 hover:bg-yellow-700', header: 'bg-yellow-500', ring: 'focus:ring-yellow-400', activeSidebar: 'bg-yellow-600', textAccent: 'text-yellow-600', border: 'border-yellow-200' },
  lime: { button: 'bg-lime-600 hover:bg-lime-700', header: 'bg-lime-500', ring: 'focus:ring-lime-400', activeSidebar: 'bg-lime-600', textAccent: 'text-lime-600', border: 'border-lime-200' },
  brown: { button: 'bg-amber-800 hover:bg-amber-900', header: 'bg-amber-700', ring: 'focus:ring-amber-600', activeSidebar: 'bg-amber-800', textAccent: 'text-amber-800', border: 'border-amber-300' },
  navy: { button: 'bg-sky-800 hover:bg-sky-900', header: 'bg-sky-700', ring: 'focus:ring-sky-600', activeSidebar: 'bg-sky-800', textAccent: 'text-sky-800', border: 'border-sky-300' },
  pink: { button: 'bg-pink-600 hover:bg-pink-700', header: 'bg-pink-500', ring: 'focus:ring-pink-400', activeSidebar: 'bg-pink-600', textAccent: 'text-pink-600', border: 'border-pink-200' }
};

/** Helper functions to get ID and Name dynamically */
const getId = (item) => item?.areaId ?? item?.stageId ?? item?.leadSourceId ?? item?.designationId ?? item?.id ?? item?.buildingTypeId ?? item?.liftUsageTypeId ?? item?.unitId ?? item?.id ?? item?.id ?? item?.enquiryTypeId ?? '';
const getName = (item) => item?.areaName ?? item?.stageName ?? item?.sourceName ?? item?.designationName ?? item?.statusName ?? item?.buildingType ?? item?.name ?? item?.unitName ?? item?.type ?? item?.displayName ?? item?.quantity ?? item?.enquiryTypeName ?? '';

const GridBoxComponent = () => {
  const [selectedStateName, setSelectedStateName] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  
  // State for Dropdown Data
  const [allUnits, setAllUnits] = useState([]);
  const [allCapacityTypes, setAllCapacityTypes] = useState([]);

  const apiUrlOfCities = (stateName) =>
    `/api/locations/states/${stateName}/cities`;

  useEffect(() => {
    if (selectedStateName) {
      setSelectedBox((prev) =>
        prev && prev.type === "city"
          ? { ...prev, api: apiUrlOfCities(selectedStateName) }
          : prev
      );
    } else {
      setSelectedBox((prev) =>
        prev && prev.type === "city"
          ? { ...prev, api: null }
          : prev
      );
    }
  }, [selectedStateName]);

  const boxes = [
    { id: 1, title: 'Add Areas', api: '/api/leadmanagement/areas', type: 'areas', color: 'blue' },
    { id: 2, title: 'Add Lead Stage', api: '/api/leadmanagement/lead-stages', type: 'leadStage', color: 'green' },
    { id: 3, title: 'Add Lead Source', api: '/api/leadmanagement/lead-sources', type: 'leadSource', color: 'purple' },
    { id: 4, title: 'Add Designation', api: '/api/leadmanagement/designations', type: 'designation', color: 'red' },
    { id: 5, title: 'Add Project Stage', api: '/api/leadmanagement/project-stages', type: 'projectStage', color: 'indigo' },
    { id: 6, title: 'Add Lead Status', api: '/api/leadmanagement/lead-status', type: 'leadStatus', color: 'emerald' },
    { id: 7, title: 'Add Building Type', api: '/api/leadmanagement/building-types', type: 'buildingType', color: 'cyan' },
    { id: 8, title: 'Add Lift Usage Type', api: '/api/leadmanagement/build-types', type: 'liftUsageType', color: 'amber' },
    { id: 9, title: 'Add States', api: '/api/locations/states', type: 'state', color: 'rose' },
    { id: 10, title: 'Add Cities', api: null, type: 'city', color: 'teal' },
    { id: 11, title: 'Add Units', api: '/api/unit', type: 'unit', color: 'orange' },
    { id: 12, title: 'Add Capacity Type', api: '/api/capacityTypes', type: 'capacityType', color: 'yellow' },
    { id: 13, title: 'Add Person Capacity', api: '/api/personCapacity', type: 'personCapacity', color: 'lime' },
    { id: 14, title: 'Add Weight', api: '/api/weights', type: 'weight', color: 'brown' },
    { id: 15, title: 'Add Lift Quantity', api: '/api/leadmanagement/lift-quantities', type: 'liftQuantity', color: 'navy' },
    { id: 16, title: 'Add Enquiry Type', api: '/api/enquiry-types', type: 'enquiryType', color: 'pink' } 
  ];

  const [formData, setFormData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  /** Fetch data for selected box */
  const fetchData = async () => {
    if (!selectedBox?.api) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(selectedBox.api);
      let list = response.data?.data || response.data || []; 
      
      if (selectedBox.type === 'liftQuantity') {
        list.sort((a, b) => a.quantity - b.quantity);
      }

      setDataList(list);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  /** useEffect to fetch dropdown data on component mount or when selecting personCapacity/weight */
  useEffect(() => {
    if (selectedBox?.type === 'personCapacity' || selectedBox?.type === 'weight') {
      const fetchDependencies = async () => {
        try {
          const unitsResponse = await axiosInstance.get('/api/unit');
          setAllUnits(unitsResponse.data?.data || []);

          const capacityResponse = await axiosInstance.get('/api/capacityTypes');
          setAllCapacityTypes(capacityResponse.data?.data || []);
        } catch (error) {
          console.error('Error fetching dependencies:', error);
          toast.error('Failed to load dependency data for Units or Capacity Types.');
        }
      };
      fetchDependencies();
    } else {
      setAllUnits([]);
      setAllCapacityTypes([]);
    }
  }, [selectedBox]);

  useEffect(() => {
    if (boxes.length > 0 && !selectedBox) setSelectedBox(boxes[0]);
  }, []);

  const [allStates, setAllStates] = useState([]);

  useEffect(() => {
    if (selectedBox?.type === 'city' && selectedBox.api === null) {
      const fetchStates = async () => {
        try {
          const response = await axiosInstance.get('/api/locations/states');
          setAllStates(response.data?.data || response.data || []);
        } catch (error) {
          console.error('Error fetching states:', error);
          setAllStates([]);
        }
      };
      fetchStates();
    }
  }, [selectedBox]);

  useEffect(() => {
    if (selectedBox && selectedBox.type === 'city') {
      if (selectedBox.api) fetchData();
      else setDataList([]);
    } else if (selectedBox) {
      fetchData();
    }
  }, [selectedBox]);

  /** Handlers */
  const handleClick = (box) => {
    setSelectedBox(box);
    setFormData({});
    setEditId(null);
  };

  // Helper function to standardize text to title case (first letter uppercase, rest lowercase)
  const standardizeText = (text) => {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return '';
    // Convert to title case: first letter uppercase, rest lowercase
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const isNumeric = name === 'personCount' || name === 'individualWeight' || name === 'unitId' || name === 'capacityTypeId' || name === 'weightValue' || name === 'quantity';
    
    let finalValue;
    if (isNumeric && value !== '') {
      finalValue = parseInt(value, 10);
    } else if (name === 'description') {
      // Don't standardize description fields, just trim
      finalValue = value.trim();
    } else if (typeof value === 'string' && name !== 'personCount' && name !== 'individualWeight' && name !== 'unitId' && name !== 'capacityTypeId' && name !== 'weightValue' && name !== 'quantity') {
      // Standardize text fields to title case
      finalValue = standardizeText(value);
    } else {
      finalValue = value;
    }

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBox?.api) {
      toast.error('Please select a state first');
      return;
    }

    // Logic for Lift Quantity creation
    if (selectedBox.type === 'liftQuantity') {
        const quantities = dataList
            .filter(item => typeof item.quantity === 'number' && item.quantity >= 0)
            .map(item => item.quantity);
            
        const lastQuantity = quantities.length > 0 ? Math.max(...quantities) : 0;
        const nextQuantity = lastQuantity + 1;
        
        if (editId) {
            toast.error("Editing Lift Quantity is not allowed. Only sequential addition is permitted.");
            setLoading(false);
            return;
        }

        const payload = { quantity: nextQuantity };

        setLoading(true);
        try {
            await axiosInstance.post(selectedBox.api, payload);
            toast.success(`Lift Quantity ${nextQuantity} saved successfully!`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || 'Error saving data';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            setFormData({});
            fetchData();
        }
        return; 
    }

    // Standard Form Validation (Person Capacity and Weight)
    if (selectedBox.type === 'personCapacity') {
        const { personCount, label, individualWeight, unitId, capacityTypeId } = formData;
        if (!personCount || !label || !individualWeight || !unitId || !capacityTypeId) {
            toast.error('All Person Capacity fields are required.');
            setLoading(false); return;
        }
    }
    
    if (selectedBox.type === 'weight') {
        const { weightValue, unitId, capacityTypeId } = formData;
        if (!weightValue || !unitId || !capacityTypeId) {
            toast.error('All Weight fields are required (Weight Value, Unit, Capacity Type).');
            setLoading(false); return;
        }
    }
    
    // Enquiry Type Validation
    if (selectedBox.type === 'enquiryType') {
        const { enquiryTypeName } = formData;
        if (!enquiryTypeName || !enquiryTypeName.trim()) {
            toast.error('Enquiry Type Name is required.');
            setLoading(false); return;
        }
    }

    // Validate whitespace-only inputs for all text fields
    const textFieldKeys = ['areaName', 'stageName', 'sourceName', 'designationName', 'statusName', 
                           'buildingType', 'name', 'cityName', 'unitName', 'type', 'enquiryTypeName', 'label'];
    for (const key of textFieldKeys) {
      if (formData[key] !== undefined && typeof formData[key] === 'string') {
        const trimmed = formData[key].trim();
        if (trimmed === '') {
          toast.error(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} cannot be empty or contain only whitespaces.`);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Standardize and sanitize payload
      let payload = { ...formData };
      
      // Standardize all text fields to title case and trim
      textFieldKeys.forEach(key => {
        if (payload[key] !== undefined && typeof payload[key] === 'string') {
          payload[key] = standardizeText(payload[key]);
        }
      });
      
      // Trim description if it exists
      if (payload.description !== undefined && typeof payload.description === 'string') {
        payload.description = payload.description.trim();
      }
      
      if (selectedBox.type === 'weight') {
          payload = {
              unitId: formData.unitId,
              weightValue: formData.weightValue,
              capacityTypeId: formData.capacityTypeId,
          };
      }
      
      if (editId) {
        await axiosInstance.put(`${selectedBox.api}/${editId}`, payload);
        toast.success(`${selectedBox.title} updated successfully!`);
      } else {
        await axiosInstance.post(selectedBox.api, payload);
        toast.success(`${selectedBox.title} saved successfully!`);
      }
      setFormData({});
      setEditId(null);
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Error saving data';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (selectedBox.type === 'liftQuantity') return; 

    let fields = {};
    let idField = '';

    switch (selectedBox.type) {
      case 'areas': fields = { areaName: item.areaName }; idField = 'areaId'; break;
      case 'leadStage': fields = { stageName: item.stageName }; idField = 'stageId'; break;
      case 'leadSource': fields = { sourceName: item.sourceName }; idField = 'leadSourceId'; break;
      case 'designation': fields = { designationName: item.designationName }; idField = 'designationId'; break;
      case 'projectStage': fields = { stageName: item.stageName }; idField = 'id'; break;
      case 'leadStatus': fields = { statusName: item.statusName }; idField = 'id'; break;
      case 'buildingType': fields = { buildingType: item.buildingType }; idField = 'buildingTypeId'; break;
      case 'liftUsageType': fields = { name: item.name }; idField = 'id'; break;
      case 'state': fields = { name: item.name }; idField = 'id'; break;
      case 'unit': fields = { unitName: item.unitName, description: item.description }; idField = 'id'; break; 
      case 'capacityType': fields = { type: item.type }; idField = 'id'; break;
      case 'personCapacity': 
          fields = { 
              personCount: item.personCount, 
              label: item.label, 
              individualWeight: item.individualWeight, 
              unitId: item.unitId,
              capacityTypeId: item.capacityTypeId,
          }; 
          idField = 'id'; 
          break;
      case 'weight': 
          fields = {
              weightValue: item.weightValue,
              unitId: item.unitId,
              capacityTypeId: item.capacityTypeId,
          };
          idField = 'id';
          break;
      case 'city': fields = { cityName: item.name }; idField = 'id'; break;
      case 'enquiryType': fields = { enquiryTypeName: item.enquiryTypeName }; idField = 'enquiryTypeId'; break;
      default: break;
    }

    setFormData(fields);
    setEditId(item?.[idField]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`${selectedBox.api}/${id}`);
      toast.success('Deleted successfully!');
      fetchData();
    } catch (error) {
      let message = 'Error deleting data';

      if (error.response) {
        if (selectedBox.type === 'weight' && id === 1) {
            message = 'Deleting the "Kg" unit weight is not allowed.';
        } else {
            switch (error.response.status) {
                case 404:
                    message = error.response.data?.message || 'Record not found';
                    break;
                case 409:
                    message = error.response.data || 'Resource is in use and cannot be deleted';
                    break;
                default:
                    message = error.response.data?.message || 'Error deleting data';
            }
        }
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /** Pagination */
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dataList.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(dataList.length / recordsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, dataList.length)} of {dataList.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  /** Form rendering */
  const renderForm = () => {
    if (!selectedBox) return null;

    const nameFieldConfig = {
      'areas': { label: 'Area Name', key: 'areaName' },
      'leadStage': { label: 'Stage Name', key: 'stageName' },
      'leadSource': { label: 'Source Name', key: 'sourceName' },
      'designation': { label: 'Designation Name', key: 'designationName' },
      'projectStage': { label: 'Project Stage Name', key: 'stageName' },
      'leadStatus': { label: 'Status Name', key: 'statusName' },
      'buildingType': { label: 'Building Type', key: 'buildingType' },
      'liftUsageType': { label: 'Lift Usage Type', key: 'name' },
      'city': { label: 'City Name', key: 'cityName' },
      'state': { label: 'State Name', key: 'name' },
      'unit': { label: 'Unit Name', key: 'unitName' },
      'capacityType': { label: 'Capacity Type', key: 'type' },
      'enquiryType': { label: 'Enquiry Type Name', key: 'enquiryTypeName' }, 
      'personCapacity': { label: 'Capacity Label', key: 'label' },
      'weight': { label: 'Weight Value', key: 'weightValue' },
      'liftQuantity': { label: 'Lift Quantity', key: 'quantity' } 
    };

    const currentConfig = nameFieldConfig[selectedBox.type];
    const colorCfg = colorMap[selectedBox.color] || colorMap.blue;
    const isUnit = selectedBox.type === 'unit';
    const isCity = selectedBox.type === 'city';
    const isCapacityType = selectedBox.type === 'capacityType';
    const isPersonCapacity = selectedBox.type === 'personCapacity';
    const isWeight = selectedBox.type === 'weight';
    const isLiftQuantity = selectedBox.type === 'liftQuantity';

    const capacityTypeDisplayFields = isCapacityType ? ['fieldKey', 'formKey'] : [];
    
    const personCapacityInputFields = [
        { label: 'Person Count', key: 'personCount', type: 'number', required: true },
        { label: 'Label', key: 'label', type: 'text', required: true },
        { label: 'Individual Weight', key: 'individualWeight', type: 'number', required: true },
    ];
    
    const weightInputFields = [
        { label: 'Weight Value (kg)', key: 'weightValue', type: 'number', required: true },
    ];
    
    const personCapacityDisplayFields = ['label', 'personCount', 'individualWeight', 'unitId', 'capacityTypeId', 'displayName'];
    const weightDisplayFields = ['weightValue', 'unitNM', 'weightFull', 'capacityTypeId'];
    const liftQuantityDisplayFields = ['quantity'];

    let tableColSpan = (isUnit ? 5 : 4) + capacityTypeDisplayFields.length;
    if (isPersonCapacity) tableColSpan = personCapacityDisplayFields.length + 2;
    if (isWeight) tableColSpan = weightDisplayFields.length + 2;
    if (isLiftQuantity) tableColSpan = liftQuantityDisplayFields.length + 2;

    const quantities = dataList
        .filter(item => typeof item.quantity === 'number' && item.quantity >= 0)
        .map(item => item.quantity);
        
    const lastQuantity = quantities.length > 0 ? Math.max(...quantities) : 0;
    const nextQuantity = lastQuantity + 1;

    return (
      <>
        {/* Form Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editId ? 'Edit' : 'Add New'} {selectedBox.title.replace('Add ', '')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* State Selection for City */}
            {isCity && allStates.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select State<span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStateName || ""}
                  onChange={(e) => setSelectedStateName(e.target.value ? e.target.value : null)}
                >
                  <option value="">-- Select State --</option>
                  {allStates.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Render Lift Quantity 'Add' button */}
            {isLiftQuantity ? (
              <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
                <p className='mb-3 text-base font-medium text-gray-700'>
                  Next Quantity to Add: <span className={`${colorCfg.textAccent} font-bold text-xl`}>{nextQuantity}</span>
                </p>
                <button 
                  type="submit" 
                  className={`${colorCfg.button} text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition-colors disabled:opacity-50`} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Quantity {nextQuantity}
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Render Person Capacity or Weight Input Fields
              (isPersonCapacity || isWeight) ? (
                <>
                  {(isPersonCapacity ? personCapacityInputFields : weightInputFields).map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] ?? ''}
                        onChange={handleChange}
                        required={field.required}
                        {...(field.type === 'number' && { min: 0 })}
                        className="w-full"
                      />
                    </div>
                  ))}
                  
                  {/* Dropdown for Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Unit<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="unitId"
                      value={formData.unitId ?? ''}
                      onChange={handleChange}
                      className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Select Unit --</option>
                      {allUnits.map((unit, index) => (
                        <option key={unit.id || index} value={unit.id}>
                          {unit.unitName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown for Capacity Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Capacity Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="capacityTypeId"
                      value={formData.capacityTypeId ?? ''}
                      onChange={handleChange}
                      className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Select Capacity Type --</option>
                      {allCapacityTypes.map((capType, index) => (
                        <option key={capType.id || index} value={capType.id}>
                          {capType.type}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                // Render single-field forms
                currentConfig && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentConfig.label}<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name={currentConfig.key}
                      value={formData[currentConfig.key] || ''}
                      onChange={handleChange}
                      onBlur={(e) => {
                        // Standardize on blur as well
                        const standardized = standardizeText(e.target.value);
                        if (standardized !== e.target.value) {
                          handleChange({ target: { name: currentConfig.key, value: standardized } });
                        }
                      }}
                      required
                      className="w-full"
                    />
                  </div>
                )
              )
            )}

            {/* Unit Description Field */}
            {isUnit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full flex min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                />
              </div>
            )}
            
            {/* Standard Save Button for non-LiftQuantity forms */}
            {!isLiftQuantity && (
              <div className="pt-2">
                <button
                  type="submit"
                  className={`${colorCfg.button} text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editId ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      {editId ? (
                        <>
                          <Pencil className="w-4 h-4" />
                          Update
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </>
                  )}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setFormData({});
                    }}
                    className="ml-3 px-6 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </form>
        </section>

        {/* Table Section */}
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Existing {selectedBox.title.replace('Add ', '')}
            </h2>
            <span className="text-sm text-gray-500">
              {dataList.length} {dataList.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                      {isPersonCapacity ? 
                        personCapacityDisplayFields.map(key => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </th>
                        )) : isWeight ? 
                        weightDisplayFields.map(key => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </th>
                        )) : isLiftQuantity ? (
                          liftQuantityDisplayFields.map(key => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </th>
                          ))
                        ) : (
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{currentConfig.label}</th>
                        )}
                      {isUnit && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>}
                      {capacityTypeDisplayFields.map(key => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.map((item) => {
                      const id = getId(item);
                      const name = getName(item);
                      return (
                        <tr key={id || Math.random()} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{id}</td>
                          {isPersonCapacity ? (
                            personCapacityDisplayFields.map(key => (
                              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item[key]}</td>
                            ))
                          ) : isWeight ? (
                            weightDisplayFields.map(key => (
                              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item[key]}</td>
                            ))
                          ) : isLiftQuantity ? (
                            liftQuantityDisplayFields.map(key => (
                              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item[key]}</td>
                            ))
                          ) : (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
                          )}
                          {isUnit && <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>}
                          {capacityTypeDisplayFields.map(key => (
                            <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item[key]}</td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-3">
                              {isLiftQuantity ? (
                                <span className='text-gray-400 text-xs'>N/A</span>
                              ) : (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(id)}
                                className={`transition-colors ${
                                  isWeight && id === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-800'
                                }`}
                                disabled={isWeight && id === 1}
                                title={isWeight && id === 1 ? 'Cannot delete' : 'Delete'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {currentRecords.length === 0 && (
                      <tr>
                        <td colSpan={tableColSpan} className="px-6 py-12 text-center text-sm text-gray-500">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          )}
        </section>
      </>
    );
  };

  const activeClass = (box) => {
    const colorCfg = colorMap[box.color] || colorMap.blue;
    return selectedBox?.id === box.id
      ? `${colorCfg.activeSidebar} text-white shadow-md`
      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Lead Settings</h1>
            <p className="text-sm text-gray-600">Manage lead management configurations and settings</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Categories</h3>
            <nav className="space-y-2">
              {boxes.map((box) => {
                const colorCfg = colorMap[box.color] || colorMap.blue;
                return (
                  <button
                    key={box.id}
                    onClick={() => handleClick(box)}
                    className={`w-full px-4 py-2.5 rounded-md text-sm font-medium text-left transition-all ${activeClass(box)}`}
                  >
                    {box.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {selectedBox ? (
            <div className="space-y-6">
              {renderForm()}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a category from the sidebar to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GridBoxComponent;
