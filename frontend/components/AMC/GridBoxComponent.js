'use client';

import { useState, useEffect } from 'react';
// Assuming '@/utils/axiosInstance' exists and is correctly configured
import axiosInstance from '@/utils/axiosInstance'; 
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * colorMap avoids dynamic class interpolation like `bg-${color}-600`
 */
const colorMap = {
  blue: { button: 'bg-blue-600 hover:bg-blue-700', header: 'bg-blue-500', ring: 'focus:ring-blue-400', activeSidebar: 'bg-blue-600', textAccent: 'text-blue-600' },
  green: { button: 'bg-green-600 hover:bg-green-700', header: 'bg-green-500', ring: 'focus:ring-green-400', activeSidebar: 'bg-green-600', textAccent: 'text-green-600' },
  purple: { button: 'bg-purple-600 hover:bg-purple-700', header: 'bg-purple-500', ring: 'focus:ring-purple-400', activeSidebar: 'bg-purple-600', textAccent: 'text-purple-600' },
  red: { button: 'bg-red-600 hover:bg-red-700', header: 'bg-red-500', ring: 'focus:ring-red-400', activeSidebar: 'bg-red-600', textAccent: 'text-red-600' },
  indigo: { button: 'bg-indigo-600 hover:bg-indigo-700', header: 'bg-indigo-500', ring: 'focus:ring-indigo-400', activeSidebar: 'bg-indigo-600', textAccent: 'text-indigo-600' },
  emerald: { button: 'bg-emerald-600 hover:bg-emerald-700', header: 'bg-emerald-500', ring: 'focus:ring-emerald-400', activeSidebar: 'bg-emerald-600', textAccent: 'text-emerald-600' },
  cyan: { button: 'bg-cyan-600 hover:bg-cyan-700', header: 'bg-cyan-500', ring: 'focus:ring-cyan-400', activeSidebar: 'bg-cyan-600', textAccent: 'text-cyan-600' },
  amber: { button: 'bg-amber-600 hover:bg-amber-700', header: 'bg-amber-500', ring: 'focus:ring-amber-400', activeSidebar: 'bg-amber-600', textAccent: 'text-amber-600' },
  rose: { button: 'bg-rose-600 hover:bg-rose-700', header: 'bg-rose-500', ring: 'focus:ring-rose-400', activeSidebar: 'bg-rose-600', textAccent: 'text-rose-600' },
  teal: { button: 'bg-teal-600 hover:bg-teal-700', header: 'bg-teal-500', ring: 'focus:ring-teal-400', activeSidebar: 'bg-teal-600', textAccent: 'text-teal-600' },
  orange: { button: 'bg-orange-600 hover:bg-orange-700', header: 'bg-orange-500', ring: 'focus:ring-orange-400', activeSidebar: 'bg-orange-600', textAccent: 'text-orange-600' },
  yellow: { button: 'bg-yellow-600 hover:bg-yellow-700', header: 'bg-yellow-500', ring: 'focus:ring-yellow-400', activeSidebar: 'bg-yellow-600', textAccent: 'text-yellow-600' },
  lime: { button: 'bg-lime-600 hover:bg-lime-700', header: 'bg-lime-500', ring: 'focus:ring-lime-400', activeSidebar: 'bg-lime-600', textAccent: 'text-lime-600' },
  brown: { button: 'bg-amber-800 hover:bg-amber-900', header: 'bg-amber-700', ring: 'focus:ring-amber-600', activeSidebar: 'bg-amber-800', textAccent: 'text-amber-800' },
  navy: { button: 'bg-sky-800 hover:bg-sky-900', header: 'bg-sky-700', ring: 'focus:ring-sky-600', activeSidebar: 'bg-sky-800', textAccent: 'text-sky-800' },
  // ADDED: New color config for Enquiry Type
  pink: { button: 'bg-pink-600 hover:bg-pink-700', header: 'bg-pink-500', ring: 'focus:ring-pink-400', activeSidebar: 'bg-pink-600', textAccent: 'text-pink-600' }
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
    // ADDED: New box for Enquiry Type
    { id: 16, title: 'Add Enquiry Type', api: '/api/enquiry-types', type: 'enquiryType', color: 'pink' } 
  ];

  const [formData, setFormData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  /** Fetch data for selected box */
  const fetchData = async () => {
    if (!selectedBox?.api) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(selectedBox.api);
      let list = response.data?.data || response.data || []; 
      
      if (selectedBox.type === 'liftQuantity') {
        // Ensure sorting by quantity for correct sequential addition logic
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const isNumeric = name === 'personCount' || name === 'individualWeight' || name === 'unitId' || name === 'capacityTypeId' || name === 'weightValue' || name === 'quantity';
    
    const finalValue = isNumeric && value !== '' ? parseInt(value, 10) : value;

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
        
        // ** FIX for NaN error: Robust calculation of nextQuantity **
        const quantities = dataList
            .filter(item => typeof item.quantity === 'number' && item.quantity >= 0)
            .map(item => item.quantity);
            
        const lastQuantity = quantities.length > 0 ? Math.max(...quantities) : 0;
        const nextQuantity = lastQuantity + 1;
        // ** END FIX **
        
        if (editId) {
            // Editing Lift Quantity is not allowed by requirement.
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
    
    // Enquiry Type Validation (Added)
    if (selectedBox.type === 'enquiryType') {
        const { enquiryTypeName } = formData;
        if (!enquiryTypeName) {
            toast.error('Enquiry Type Name is required.');
            setLoading(false); return;
        }
    }


    setLoading(true);
    try {
      let payload = { ...formData };
      
      if (selectedBox.type === 'weight') {
          payload = {
              unitId: formData.unitId,
              weightValue: formData.weightValue,
              capacityTypeId: formData.capacityTypeId,
          };
      }
      
      if (editId) {
        // Only other types are editable
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
    // Do not allow editing Lift Quantity
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
      // ADDED: New case for Enquiry Type
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
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center mt-4 space-x-2">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg shadow-sm transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-amber-100 text-gray-700'}`}>
          Prev
        </button>

        {pageNumbers.map((num) => (
          <button key={num} onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded-lg shadow-sm transition-colors ${currentPage === num ? 'bg-amber-500 text-white' : 'bg-white hover:bg-amber-100 text-gray-700'}`}>
            {num}
          </button>
        ))}

        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg shadow-sm transition-colors ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-amber-100 text-gray-700'}`}>
          Next
        </button>
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
      // ADDED: New config for Enquiry Type
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

    // ** FIX for NaN error: Robust calculation of nextQuantity **
    const quantities = dataList
        .filter(item => typeof item.quantity === 'number' && item.quantity >= 0)
        .map(item => item.quantity);
        
    const lastQuantity = quantities.length > 0 ? Math.max(...quantities) : 0;
    const nextQuantity = lastQuantity + 1;
    // ** END FIX **

    return (
      <>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">

          {/* State Selection for City */}
          {
            isCity && allStates.length > 0 && (
              <div>
                <label className="block mb-1 font-medium">Select state</label>
                <select
                  className="border rounded-lg p-2 w-full"
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
            )
          }

          {/* Render Lift Quantity 'Add' button */}
          {isLiftQuantity ? (
              <div className='p-4 border rounded-lg bg-gray-50'>
                <p className='mb-2 text-lg font-semibold text-gray-700'>
                    Next Quantity to Add: <span className={`${colorCfg.textAccent} font-bold text-xl`}>{nextQuantity}</span>
                </p>
                <button type="submit" className={`${colorCfg.button} text-white px-6 py-2 rounded-lg shadow`} disabled={loading}>
                    {loading ? 'Adding...' : `Add Quantity ${nextQuantity}`}
                </button>
              </div>

          ) : (
            // Render Person Capacity or Weight Input Fields
            (isPersonCapacity || isWeight) ? (
              <>
                {/* Input field(s) specific to Person Capacity or Weight */}
                {(isPersonCapacity ? personCapacityInputFields : weightInputFields).map(field => (
                  <div key={field.key}>
                      <label className="block mb-1 font-medium">{field.label}</label>
                      <input 
                          type={field.type} 
                          name={field.key} 
                          value={formData[field.key] ?? ''} 
                          onChange={handleChange}
                          className={`w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-opacity-50 ${colorCfg.ring}`} 
                          required={field.required} 
                          {...(field.type === 'number' && { min: 0 })}
                      />
                  </div>
                ))}
                
                {/* Dropdown for Unit */}
                <div>
                  <label className="block mb-1 font-medium">Select Unit</label>
                  <select
                    name="unitId"
                    value={formData.unitId ?? ''} 
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-opacity-50 ${colorCfg.ring}`}
                    required
                  >
                    <option value="">-- Select Unit --</option>
                    {allUnits.map((unit, index) => (
                      <option 
                        key={unit.id || index} 
                        value={unit.id} 
                      >
                        {unit.unitName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown for Capacity Type */}
                <div>
                  <label className="block mb-1 font-medium">Select Capacity Type</label>
                  <select
                    name="capacityTypeId"
                    value={formData.capacityTypeId ?? ''}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-opacity-50 ${colorCfg.ring}`}
                    required
                  >
                    <option value="">-- Select Capacity Type --</option>
                    {allCapacityTypes.map((capType, index) => (
                      <option 
                        key={capType.id || index} 
                        value={capType.id}
                      >
                        {capType.type}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
                // Render single-field forms (standard entities including Enquiry Type)
                currentConfig && (
                    <div>
                        <label className="block mb-1 font-medium">{currentConfig.label}</label>
                        <input type="text" name={currentConfig.key} value={formData[currentConfig.key] || ''} onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-opacity-50 ${colorCfg.ring}`} required />
                    </div>
                )
            )
          )}

          {/* Unit Description Field */}
          {isUnit && (
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange}
                className={`w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-opacity-50 ${colorCfg.ring}`} rows="3" required />
            </div>
          )}
          
          {/* Standard Save Button for non-LiftQuantity forms */}
          {!(isLiftQuantity) && (
            <button type="submit" className={`${colorCfg.button} text-white px-6 py-2 rounded-lg shadow`} disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
            </button>
          )}
        </form>

        <h2 className="text-xl font-semibold mb-3">Existing {selectedBox.title}</h2>
        {loading ? <p>Loading...</p> :
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-lg bg-gray-50">
              <table className="min-w-full text-sm">
                <thead className={`${colorCfg.header} text-white`}>
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    {/* Dynamic Header based on type */}
                    {isPersonCapacity ? 
                        personCapacityDisplayFields.map(key => (
                            <th key={key} className="px-4 py-2 text-left">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                        )) : isWeight ? 
                        weightDisplayFields.map(key => (
                            <th key={key} className="px-4 py-2 text-left">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                        )) : isLiftQuantity ? (
                            liftQuantityDisplayFields.map(key => (
                                <th key={key} className="px-4 py-2 text-left">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                            ))
                        ) :
                        <th className="px-4 py-2 text-left">{currentConfig.label}</th>
                    }
                    {isUnit && <th className="px-4 py-2 text-left">Description</th>}
                    {capacityTypeDisplayFields.map(key => (
                      <th key={key} className="px-4 py-2 text-left">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                    ))}
                    <th className="px-4 py-2 text-center">Edit</th>
                    <th className="px-4 py-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((item) => {
                    const id = getId(item);
                    const name = getName(item);
                    return (
                      <tr key={id || Math.random()} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-t">{id}</td>
                        {/* Dynamic Data Cells based on type */}
                        {isPersonCapacity ? (
                            personCapacityDisplayFields.map(key => (
                                <td key={key} className="px-4 py-2 border-t">{item[key]}</td>
                            ))
                        ) : isWeight ? (
                            weightDisplayFields.map(key => (
                                <td key={key} className="px-4 py-2 border-t">{item[key]}</td>
                            ))
                        ) : isLiftQuantity ? (
                            liftQuantityDisplayFields.map(key => (
                                <td key={key} className="px-4 py-2 border-t font-semibold text-lg">{item[key]}</td>
                            ))
                        ) : (
                            <td className="px-4 py-2 border-t">{name}</td>
                        )}
                        {isUnit && <td className="px-4 py-2 border-t">{item.description}</td>}
                        {capacityTypeDisplayFields.map(key => (
                          <td key={key} className="px-4 py-2 border-t">{item[key]}</td>
                        ))}
                        <td className="px-4 py-2 border-t text-center">
                            {/* Hide Edit button for LiftQuantity */}
                            {isLiftQuantity ? (
                                <span className='text-gray-400'>N/A</span>
                            ) : (
                                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></button>
                            )}
                        </td>
                        <td className="px-4 py-2 border-t text-center">
                          <button 
                            onClick={() => handleDelete(id)} 
                            className={`hover:text-red-800 ${isWeight && id === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'}`} 
                            disabled={isWeight && id === 1}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {currentRecords.length === 0 && (
                    <tr>
                      <td colSpan={tableColSpan} className="px-4 py-3 text-center text-gray-500">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        }
      </>
    );
  };

  const activeClass = (box) => selectedBox?.id === box.id ? `${colorMap[box.color]?.activeSidebar || colorMap.blue.activeSidebar} text-white` : 'bg-white hover:bg-gray-200';

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-8 overflow-auto">
        {selectedBox ? (
          <div className="bg-gradient-to-br from-gray-50 via-gray-10 to-gray-20 rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">{selectedBox.title}</h1>
            {renderForm()}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">Select a form from the right side.</p>
        )}
      </div>

      <div className="w-64 bg-gray-100 border-l border-gray-300 p-4 space-y-4">
        {boxes.map((box) => (
          <button key={box.id} onClick={() => handleClick(box)} className={`w-full px-4 py-3 rounded-lg shadow text-left font-medium ${activeClass(box)}`}>
            {box.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GridBoxComponent;