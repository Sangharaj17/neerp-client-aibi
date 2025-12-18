'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';

export default function AddEnquiryForm({ leadSubmitted, customer, site,
  leadId, form, setForm, repeatSettings, setRepeatSettings, enquiryTypeName,
  enquiryTypeId, setEnquiryTypeName, setEnquiryTypeId, handleSetLeadSumbited }) {


  console.log("Selected enquiryTypeId:", enquiryTypeId);
  const { id, tenant } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  //const enquiryType =  searchParams.get('enquiryType') || 'AMC'; 

  const floorOptions = ['T', 'G', 'P', 'B1', 'B2'];
  const floorLabels = { T: 'Terrace', G: 'Ground', P: 'Parking', B1: 'Basement 1', B2: 'Basement 2' };
  // const personOptions = ['01 Person/240Kg', '02 Persons/360Kg', '04 Persons/480Kg', '06 Persons/720Kg', '08 Persons/960Kg', '10 Persons/1200Kg', '13 Persons/1560Kg', '15 Persons/1800Kg'];
  //const kgOptions = ['100Kg', '150Kg', '200Kg', '250Kg', '300Kg', '400Kg'];

  // const customer = searchParams.get('customer') || 'Customer';
  // const site = searchParams.get('site') || 'Site';

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


  const [enquiryTypes, setEnquiryTypes] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/enquiry-types')
      .then((res) => {
        setEnquiryTypes(res.data);

        // Set the first item as default
        if (res.data.length > 0 && enquiryTypeName === '') {
          setEnquiryTypeName(res.data[0].enquiryTypeName);
          setEnquiryTypeId(res.data[0].enquiryTypeId);

        }
      })
      .catch((err) => console.error('Failed to fetch enquiry types', err));
  }, []);


  const [personOptions, setPersonOptions] = useState([]);



  useEffect(() => {
    axiosInstance.get('/api/personCapacity')
      .then((response) => {
        const formatted = response.data.map((p) => ({
          id: p.id,
          convertedString: `${String(p.personCount).padStart(2, '0')} Person${p.personCount > 1 ? 's' : ''}/${p.weight}Kg`
        }));
        console.log('Formatted person capacities:', formatted);
        setPersonOptions(formatted); // Directly set formatted array
      })
      .catch((error) => {
        console.error('Error fetching person capacities:', error);
        toast.error('Failed to load person capacity options');
      });
  }, []);

  const [kgOptions, setKgOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/weight')
      .then((response) => {
        const formatted = response.data.map((w) => ({
          id: w.id,
          display: `${w.weightValue} ${w.unit || 'Kg'}`
        }));
        console.log('Formatted weights:', formatted);
        setKgOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching weights:', error);
        toast.error('Failed to load weight options');
      });
  }, []);

  const [machineRoomOptions, setMachineRoomOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/machineRoom')
      .then((response) => {
        const formatted = response.data.map((room) => ({
          id: room.id,
          name: room.machineRoomName
        }));
        console.log('Formatted machine room types:', formatted);
        setMachineRoomOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching machine room types:', error);
        toast.error('Failed to load machine room options');
      });
  }, []);

  const [cabinTypeOptions, setCabinTypeOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/cabinType')
      .then((response) => {
        const formatted = response.data.map((type) => ({
          id: type.id,
          name: type.cabinType
        }));
        console.log('Formatted cabin types:', formatted);
        setCabinTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching cabin types:', error);
        toast.error('Failed to load cabin type options');
      });
  }, []);

  const [floorOption, setFloorOption] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/floor')
      .then((response) => {
        const formatted = response.data.map((floor) => ({
          id: floor.id,
          name: floor.name
        }));
        console.log('Formatted floor options:', formatted);
        setFloorOption(formatted);
      })
      .catch((error) => {
        console.error('Error fetching floor options:', error);
        toast.error('Failed to load floor options');
      });
  }, []);

  const [elevatorTypeOptions, setElevatorTypeOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/elevatorOperation') // <-- Adjust endpoint as per your API
      .then((response) => {
        const formatted = response.data.map((item) => ({
          id: item.id,
          name: item.name
        }));
        console.log('Formatted elevator types:', formatted);
        setElevatorTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching elevator types:', error);
        toast.error('Failed to load elevator type options');
      });
  }, []);

  const [liftMechanismOptions, setLiftMechanismOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/typeOfLift') // Adjust endpoint accordingly
      .then((response) => {
        const formatted = response.data.map((item) => ({
          id: item.id,
          name: item.liftTypeName
        }));
        console.log('Formatted lift mechanisms:', formatted);
        setLiftMechanismOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching lift mechanisms:', error);
        toast.error('Failed to load lift mechanism options');
      });
  }, []);

  const [liftUsageTypeOptions, setLiftUsageTypeOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/leadmanagement/build-types') // Adjust to your actual endpoint
      .then((response) => {
        const formatted = response.data.map((item) => ({
          id: item.id,
          name: item.name
        }));
        console.log('Formatted lift usage types:', formatted);
        setLiftUsageTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching lift usage types:', error);
        toast.error('Failed to load lift usage type options');
      });
  }, []);

  const [capacityTypeOptions, setCapacityTypeOptions] = useState([]);

  useEffect(() => {
    const fetchCapacityTypes = async () => {
      try {
        const response = await axiosInstance.get("/api/capacityType");
        const data = response.data; // Axios automatically parses JSON

        // Convert to display-friendly format
        const options = data.map(item => ({
          id: item.id,
          label: item.capacityType,
          value: item.capacityType
        }));
        console.log('Formatted capacity types:', options);

        setCapacityTypeOptions(options);
      } catch (error) {
        console.error("Error fetching capacity types:", error);
      }
    };

    fetchCapacityTypes();
  }, []);

  const [projectStages, setProjectStages] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);

  useEffect(() => {
    const fetchProjectStages = async () => {
      try {
        const response = await axiosInstance.get('/api/leadmanagement/project-stages');
        setProjectStages(response.data);
      } catch (error) {
        console.error('Error fetching project stages:', error);
      }
    };

    fetchProjectStages();
  }, []);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      try {
        const response = await axiosInstance.get('/api/leadmanagement/building-types');
        setBuildingTypes(response.data);
      } catch (error) {
        console.error('Error fetching building types:', error);
      }
    };

    fetchBuildingTypes();
  }, []);




  useEffect(() => {
    setForm((prev) => ({ ...prev, leadDetail: `${customer} For ${site}` }));
  }, [customer, site]);





  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleNoOfLiftsChange = (e) => {
    const value = e.target.value;
    const num = parseInt(value, 10) || 0;
    const liftsArray = Array.from({ length: num }, (_, i) => form.lifts[i] || getEmptyLift());

    const updatedRepeatSettings = {};
    for (let i = 0; i < num; i++) {
      if (repeatSettings[i]) updatedRepeatSettings[i] = repeatSettings[i];
    }

    setForm((prev) => ({ ...prev, noOfLifts: value, lifts: liftsArray }));
    setRepeatSettings(updatedRepeatSettings);
  };


  const handleLiftChange = (index, field, value) => {
    setForm((prevForm) => {
      const updatedLifts = [...prevForm.lifts];
      updatedLifts[index][field] = value;

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
        // Checkbox unchecked: clear repeat setting AND reset lift fields
        updated[index] = { checked: false, from: '' };
        setForm((prevForm) => {
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

    setForm((prevForm) => {
      const updatedLifts = [...prevForm.lifts];
      updatedLifts[index] = { ...updatedLifts[repeatFrom] };

      return { ...prevForm, lifts: updatedLifts };
    });

    // Trigger handleLiftChange for sync propagation
    handleLiftChange(repeatFrom, '__dummy__', '__noop__'); // Trigger propagation only
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.enquiryDate || !form.leadDetail || !form.noOfLifts) return toast.error('Fill all mandatory header fields.');
    for (let i = 0; i < form.lifts.length; i++) {
      const lift = form.lifts[i];
      for (const [key, value] of Object.entries(lift)) {
        if (key === 'floorSelections' && value.length === 0) return toast.error(`Lift ${i + 1}: Select at least one floor.`);
        if (key !== 'floorSelections' && !value) return toast.error(`Lift ${i + 1}: Fill ${key} field.`);
      }
    }
    toast.success('Form submitted successfully!');
    toast((t) => (
      <div>
        <div className="font-semibold mb-1">Submitted Data</div>
        <pre className="text-xs">{JSON.stringify(form, null, 2)}</pre>
        <button onClick={() => toast.dismiss(t.id)} className="mt-2 text-blue-500 underline text-xs">Close</button>
      </div>
    ), { duration: 8000 });
  };

  const handleUpdateFloorDesignationAndStopsAndOpenings = (index, noOfFloorsValue) => {
    const updatedLifts = [...form.lifts];
    const parsedFloors = parseInt(noOfFloorsValue);

    if (!isNaN(parsedFloors) && parsedFloors > 0) {
      updatedLifts[index] = {
        ...updatedLifts[index],
        noOfFloors: parsedFloors,
        floorsDesignation: `G + ${parsedFloors - 1}`,
        noOfStops: parsedFloors,
        noOfOpenings: parsedFloors,
      };
    } else {
      updatedLifts[index] = {
        ...updatedLifts[index],
        noOfFloors: '',
        floorsDesignation: '',
        noOfStops: '',
        noOfOpenings: '',
      };
    }

    setForm(prev => ({
      ...prev,
      lifts: updatedLifts
    }));
  };

  const [liftQuantities, setLiftQuantities] = useState([]);

  useEffect(() => {
    const fetchLiftQuantities = async () => {
      try {
        const response = await axiosInstance.get("/api/leadmanagement/lift-quantities");
        const data = response.data; // Axios auto-parses JSON
        setLiftQuantities(data);
      } catch (error) {
        console.error("Failed to fetch lift quantities:", error);
      }
    };

    fetchLiftQuantities();
  }, []);

  const handleEnquiryTypeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedType = enquiryTypes.find(et => et.enquiryTypeId === selectedId);

    if (selectedType) {
      setEnquiryTypeName(selectedType.enquiryTypeName);
      setEnquiryTypeId(selectedType.enquiryTypeId);
    }
  };


  return (
    <div className="w-full max-w-7xl bg-white rounded-lg shadow-sm border">
      <div className="bg-blue-600 text-white text-center py-3 text-base font-semibold rounded-t-lg">Add Lift Requirement</div>
      <div className="flex justify-between items-center text-xs text-gray-700 py-1 px-2 gap-3">

        {/* Label + Dropdown horizontally aligned */}
        <div className="flex items-center gap-2">
          <label htmlFor="enquiryTypeId" className="text-gray-600 text-xs font-medium whitespace-nowrap">
            Select Enquiry Type
          </label>
          <select
            id="enquiryTypeId"
            name="enquiryTypeId"
            className="border text-sm rounded px-2 py-1"
            value={enquiryTypeId || ''}
            onChange={handleEnquiryTypeChange}
          >
            <option value="" disabled>Select</option>
            {enquiryTypes.map((type) => (
              <option key={type.enquiryTypeId} value={type.enquiryTypeId}>
                {type.enquiryTypeName}
              </option>
            ))}
          </select>
        </div>

        {/* Floor info labels */}
        <div className="flex gap-2 text-xs text-gray-500 flex-wrap justify-end">
          {floorOptions.map((floor) => (
            <span key={floor}>
              {floor} = {floorLabels[floor]}
            </span>
          ))}
        </div>
      </div>




      <form className="p-6 space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input label="Enquiry Date *" type="date" name="enquiryDate" value={form.enquiryDate} onChange={handleChange} />
          <Input label="Lead Detail *" name="leadDetail" value={form.leadDetail} readOnly disabled tooltip="This field is auto-filled." />
          {/* <Select label="No. of Lifts *" name="noOfLifts" value={form.noOfLifts} onChange={handleNoOfLiftsChange}>
            {[1, 2, 3].map((num) => <option key={num} value={num}>{num}</option>)}
          </Select> */}
          <Select
            label="No. of Lifts *"
            name="noOfLifts"
            value={form.noOfLifts}
            onChange={handleNoOfLiftsChange}
          >
            {liftQuantities.map((item) => (
              <option key={item.id} value={item.quantity}>
                {item.quantity}
              </option>
            ))}
          </Select>
        </div>
        {form.lifts.map((lift, index) => (
          <div key={index} className="border p-3 rounded my-3 bg-gray-50">
            <SectionTitle title={`Lift ${index + 1} Details`} />
            {index > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={repeatSettings[index]?.checked || false} onChange={(e) => handleRepeatChange(index, 'checked', e.target.checked)} title="Check to enable repeat functionality." />
                <span>Repeat specification of Lift</span>

                <input
                  type="number"
                  min="1"
                  max={index}
                  disabled={!repeatSettings[index]?.checked}
                  value={repeatSettings[index]?.from || ''}
                  onChange={(e) => handleRepeatChange(index, 'from', e.target.value)}
                  className={`border rounded px-2 py-1 text-xs w-20 ${repeatSettings[index]?.checked ? 'bg-white cursor-text' : 'bg-gray-200 cursor-not-allowed'}`}
                  title="Enter lift number to repeat from."
                />

                <button
                  type="button"
                  onClick={() => handleRepeat(index)}
                  disabled={!repeatSettings[index]?.checked}
                  className={`px-2 py-1 rounded text-xs ${repeatSettings[index]?.checked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                  title="Copy specification from selected lift."
                >
                  Repeat
                </button>


              </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Select
                label="Lift Usage Type *"
                value={String(lift.liftUsageType || '')} // must hold the selected ID
                onChange={(e) => handleLiftChange(index, 'liftUsageType', e.target.value)}
                isEmpty={liftUsageTypeOptions.length === 0}
              >
                <option value="">Please Select</option>
                {liftUsageTypeOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Lift Mechanism *"
                value={String(lift.liftMechanism || '')} // should store the selected lift type ID
                onChange={(e) => handleLiftChange(index, 'liftMechanism', e.target.value)}
                isEmpty={liftMechanismOptions.length === 0}
              >
                <option value="">Please Select</option>
                {liftMechanismOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Elevator Type *"
                value={String(lift.elevatorType || '')} // should hold the selected ID
                onChange={(e) => handleLiftChange(index, 'elevatorType', e.target.value)}
                isEmpty={elevatorTypeOptions.length === 0}
              >
                <option value="">Please Select</option>
                {elevatorTypeOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Machine Room Type *"
                value={String(lift.machineRoomType || '')} // selected ID from backend
                onChange={(e) => handleLiftChange(index, 'machineRoomType', e.target.value)}
                isEmpty={machineRoomOptions.length === 0}
              >
                <option value="">Please Select</option>
                {machineRoomOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Cabin Type *"
                value={String(lift.cabinType || '')} // should store the selected ID
                onChange={(e) => handleLiftChange(index, 'cabinType', e.target.value)}
                isEmpty={cabinTypeOptions.length === 0}
              >
                <option value="">Please Select</option>
                {cabinTypeOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>

              {/* <RadioGroup label="Capacity Type *" name={`capacityType-${index}`} options={['Persons', 'Kg']} selected={lift.capacityType} onChange={(e) => handleLiftChange(index, 'capacityType', e.target.value)} /> */}
              <RadioGroup
                label="Capacity Type *"
                name={`capacityType-${index}`}
                options={capacityTypeOptions}
                selected={capacityTypeOptions.find(opt => opt.label === lift.capacityType)?.value || ''}
                onChange={(e) => {

                  // alert(e.target.value);
                  const selectedId = e.target.value;
                  const selectedOption = capacityTypeOptions.find(opt => String(opt.value) === selectedId);

                  // alert("Selected Option: " + JSON.stringify(selectedOption));

                  if (selectedOption) {
                    handleLiftChange(index, 'capacityType', selectedOption.label);      // e.g., "Persons"
                    // alert(selectedOption.id);
                    handleLiftChange(index, 'capacityTermId', selectedOption.id);    // e.g., 1
                  }
                }}
              />


              {lift.capacityType === 'Persons' ?
                <Select
                  label="Select Persons *"
                  value={lift.personCapacityId || ''} // should be the ID you're storing
                  onChange={(e) => {
                    // alert(e.target.value);
                    handleLiftChange(index, 'personCapacityId', e.target.value);
                  }
                  }
                  isEmpty={personOptions.length === 0}
                >
                  <option value="">Please Select</option>
                  {personOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.convertedString}
                    </option>
                  ))}
                </Select>
                :
                <Select
                  label="Enter Kg *"
                  value={String(lift.weightId || '')} // assuming it stores selected weight `id`
                  onChange={(e) => handleLiftChange(index, 'weightId', e.target.value)}
                  isEmpty={kgOptions.length === 0}
                >
                  <option value="">Please Select</option>
                  {kgOptions.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.display}
                    </option>
                  ))}
                </Select>
              }
              <Select
                label="No. of Floors *"
                value={String(lift.noOfFloors || '')} // lift.noOfFloors should store selected floor `id`
                onChange={(e) => {
                  handleLiftChange(index, 'noOfFloors', e.target.value);
                  //handleUpdateFloorDesignationAndStopsAndOpenings(index, e.target.value);
                }
                }
                isEmpty={floorOption.length === 0}
              >
                <option value="">Please Select</option>
                {floorOption.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Floor Designation</label>
                <input
                  type="text"
                  value={(() => {
                    if (!lift.noOfFloors) return '';
                    const selectedFloor = floorOption.find(f => String(f.id) === String(lift.noOfFloors));
                    if (selectedFloor && selectedFloor.name) {
                      // Extract number from floor name (e.g., "3 Floors" -> 3, or "3" -> 3)
                      const match = selectedFloor.name.match(/\d+/);
                      const floorNumber = match ? parseInt(match[0], 10) : parseInt(selectedFloor.id, 10);
                      // For 3 floors, should show "G + 2" (Ground + 2 upper floors)
                      return floorNumber > 0 ? `G + ${floorNumber - 1}` : '';
                    }
                    // Fallback: use ID as number
                    const floorId = parseInt(lift.noOfFloors, 10);
                    return floorId > 0 ? `G + ${floorId - 1}` : '';
                  })()}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />
                <div className="flex flex-wrap gap-4 mt-2">
                  {floorOptions.map((floor) => (
                    <label key={floor} className="text-gray-700 text-sm flex items-center gap-1">
                      <input type="checkbox" value={floor} checked={lift.floorSelections.includes(floor)} onChange={(e) => {
                        const checked = e.target.checked;
                        const updated = checked ? [...lift.floorSelections, floor] : lift.floorSelections.filter((f) => f !== floor);
                        handleLiftChange(index, 'floorSelections', updated);
                      }} className="text-blue-500" />
                      {floor}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">No. of Stops *</label>
                <input
                  type="text"
                  value={(() => {
                    if (!lift.noOfFloors) return '';
                    const selectedFloor = floorOption.find(f => String(f.id) === String(lift.noOfFloors));
                    if (selectedFloor && selectedFloor.name) {
                      const match = selectedFloor.name.match(/\d+/);
                      return match ? match[0] : String(lift.noOfFloors);
                    }
                    return String(lift.noOfFloors);
                  })()}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />

              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">No. of Openings *</label>
                <input
                  type="text"
                  value={(() => {
                    if (!lift.noOfFloors) return '';
                    const selectedFloor = floorOption.find(f => String(f.id) === String(lift.noOfFloors));
                    if (selectedFloor && selectedFloor.name) {
                      const match = selectedFloor.name.match(/\d+/);
                      return match ? match[0] : String(lift.noOfFloors);
                    }
                    return String(lift.noOfFloors);
                  })()}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />

              </div>


              {enquiryTypeName === 'New Installation' && (
                <>
                  <Input label="Shaft Width (mm) *" value={lift.shaftWidth} onChange={(e) => handleLiftChange(index, 'shaftWidth', e.target.value)} />
                  <Input label="Shaft Depth (mm) *" value={lift.shaftDepth} onChange={(e) => handleLiftChange(index, 'shaftDepth', e.target.value)} />
                  <Input label="Pit (mm) *" value={lift.pit} onChange={(e) => handleLiftChange(index, 'pit', e.target.value)} />
                  <Select
                    label="Stage of Project *"
                    value={lift.stageOfProject || ''}
                    onChange={(e) => handleLiftChange(index, 'stageOfProject', e.target.value)}
                    isEmpty={projectStages.length === 0}
                  >
                    <option value="">Please Select</option>
                    {projectStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>{stage.stageName}</option>
                    ))}
                  </Select>

                  <Select
                    label="Building Type *"
                    value={lift.buildingType || ''}
                    onChange={(e) => handleLiftChange(index, 'buildingType', e.target.value)}
                    isEmpty={buildingTypes.length === 0}
                  >
                    <option value="">Please Select</option>
                    {buildingTypes.map((type) => (
                      <option key={type.buildingTypeId} value={type.buildingTypeId}>{type.buildingType}</option>
                    ))}
                  </Select>
                </>
              )}

            </div>


          </div>
        ))}
        {/* <div className="flex justify-end gap-4 pt-4">
          <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition">Save</button>
          <button type="button" onClick={() => router.back()} className="border px-5 py-2 rounded hover:bg-gray-100 transition">Cancel</button>
        </div> */}
      </form>
    </div>
  );
}

const SectionTitle = ({ title }) => (<div className="bg-gray-100 px-3 py-1 rounded text-gray-800 font-medium text-sm">{title}</div>);
const Input = ({ label, tooltip, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><input {...props} title={tooltip} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed" /></div>);
const Select = ({ label, children, isEmpty, ...props }) => (
  <div>
    <label className="block text-gray-700 text-sm mb-1 font-medium">{label}</label>
    <select
      {...props}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
    >
      {isEmpty ? <option value="">Loading options...</option> : children}
    </select>
  </div>
);
// const RadioGroup = ({ label, name, options, selected, onChange }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><div className="flex gap-4">{options.map((opt) => (<label key={opt} className="text-gray-700 text-sm flex items-center gap-1"><input type="radio" name={name} value={opt} checked={selected === opt} onChange={onChange} className="text-blue-500" />{opt}</label>))}</div></div>);
const RadioGroup = ({ label, name, options, selected, onChange }) => (
  <div>
    <label className="block text-gray-700 text-sm mb-1">{label}</label>
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="text-gray-700 text-sm flex items-center gap-1">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selected === opt.value}
            onChange={onChange}
            className="text-blue-500"
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);
