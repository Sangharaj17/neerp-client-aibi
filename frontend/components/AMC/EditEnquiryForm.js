'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';

export default function EditEnquiryForm({ enquiryTypeId, enquiryTypeName, action }) {

  console.log("Selected enquiryTypeName:", enquiryTypeName);
  const { id, tenant } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const floorOptions = ['T', 'G', 'P', 'B1', 'B2'];
  const floorLabels = { T: 'Terrace', G: 'Ground', P: 'Parking', B1: 'Basement 1', B2: 'Basement 2' };
  // const personOptions = ['01 Person/240Kg', '02 Persons/360Kg', '04 Persons/480Kg', '06 Persons/720Kg', '08 Persons/960Kg', '10 Persons/1200Kg', '13 Persons/1560Kg', '15 Persons/1800Kg'];
  //const kgOptions = ['100Kg', '150Kg', '200Kg', '250Kg', '300Kg', '400Kg'];

  const customer = searchParams.get('customer') || 'Customer';
  const site = searchParams.get('site') || 'Site';

  const [form, setForm] = useState({
    // enquiryDate: new Date().toISOString().split('T')[0],
    enquiryDate: new Date().toISOString().split('T')[0], // "2025-08-08"
    leadDetail: `${customer} For ${site}`,
    noOfLifts: '1',
    lifts: [getEmptyLift()],
  });

  const updatedRepeatSettings = (index, from = '', checked = false) => {
    setRepeatSettings(prevSettings => ({
      ...prevSettings,
      [index]: { checked, from }
    }));
  };
  const [combinedEnqId, setCombinedEnqId] = useState(null);


  useEffect(() => {
    const rawCombined = sessionStorage.getItem('combinedEnquiry');
    if (!rawCombined) return;

    const combined = JSON.parse(rawCombined);
    const enquiries = combined.enquiries || [];

    setCombinedEnqId(combined.id || null); // ✅ extract and set


    const updated = {}; // temp object to build new repeatSettings

    enquiries.forEach((enquiry, index) => {

      console.log(enquiry.enquiryId + " enq id printed");
      const checked = enquiry.checked ?? false;
      const from = enquiry.from ?? '';
      updated[index] = { checked, from };
    });

    // Set state once with the full object
    setRepeatSettings(updated);

    // ✅ Log to console
    console.log("Updated Repeat Settings:", updated);

    // 👇 Loop over each enquiry and map to a lift object
    const mappedLifts = enquiries.map((enquiry, index) => ({


      leadId: enquiry.lead?.leadId || '',
      enquiryId: enquiry.enquiryId || '',
      // liftUsageType: '', // Set if available
      liftMechanism: enquiry.typeOfLift?.id || '',
      elevatorType: enquiry.liftType?.id || '',
      machineRoomType: enquiry.reqMachineRoom?.id || '',
      cabinType: enquiry.cabinType?.id || '',
      capacityType: enquiry.capacityTerm?.id || '',
      capacityTermId: enquiry.capacityTerm?.id || '',
      personCapacityId: enquiry.personCapacity?.id || '',
      weightId: enquiry.weight?.id || '',
      noOfFloors: enquiry.noOfFloors?.id || '',
      floorsDesignation: enquiry.floorsDesignation || '',
      noOfStops: enquiry.noOfStops || '',
      noOfOpenings: enquiry.noOfOpenings || '',
      floorSelections: [],

      shaftWidth: enquiry.shaftsWidth || '',
      shaftDepth: enquiry.shaftsDepth || '',
      pit: enquiry.pit || '',
      stageOfProject: enquiry.projectStage?.id || '',
      liftUsageType: enquiry.buildType?.id || '',
      buildingType: enquiry.buildingType?.buildingTypeId || '',
    }));

    setForm((prev) => {
      return {
        ...prev,
        enquiryDate: combined.enquiryDate || prev.enquiryDate, // it's already a string like "2025-08-08"
        noOfLifts: String(mappedLifts.length),
        lifts: mappedLifts,
      };
    });




    console.log(combined.enquiryDate + " enquiry date printed");
  }, []);


  const [repeatSettings, setRepeatSettings] = useState({});
  const [personOptions, setPersonOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/personCapacity')
      .then((response) => {
        const formatted = response.data.data.map((p) => ({
          id: p.id,
          convertedString: `${String(p.personCount).padStart(2, '0')} Person${p.personCount > 1 ? 's' : ''}/${p.weight}Kg`
        }));

        setPersonOptions(formatted); // Directly set formatted array
      })
      .catch((error) => {
        console.error('Error fetching person capacities:', error);
      });
  }, []);

  const [kgOptions, setKgOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/weights')
      .then((response) => {
        const formatted = response.data.data.map((w) => ({
          id: w.id,
          display: `${w.weightValue} ${w.unit || 'Kg'}`
        }));
        setKgOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching weights:', error);
      });
  }, []);

  const [machineRoomOptions, setMachineRoomOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/machine-rooms')
      .then((response) => {
        const formatted = response.data.data.map((room) => ({
          id: room.id,
          name: room.machineRoomName
        }));
        setMachineRoomOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching machine room types:', error);
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
        setCabinTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching cabin types:', error);
      });
  }, []);

  const [floorOption, setFloorOption] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/floors')
      .then((response) => {
        const formatted = response.data.data.map((floor) => ({
          id: floor.id,
          name: floor.floorName
        }));
        setFloorOption(formatted);
      })
      .catch((error) => {
        console.error('Error fetching floor options:', error);
      });
  }, []);

  const [elevatorTypeOptions, setElevatorTypeOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/operator-elevator') // <-- Adjust endpoint as per your API
      .then((response) => {
        const formatted = response.data.data.map((item) => ({
          id: item.id,
          name: item.name
        }));
        setElevatorTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching elevator types:', error);
      });
  }, []);

  const [liftMechanismOptions, setLiftMechanismOptions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/type-of-lift') // Adjust endpoint accordingly
      .then((response) => {
        const formatted = response.data.data.map((item) => ({
          id: item.id,
          name: item.liftTypeName
        }));
        setLiftMechanismOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching lift mechanisms:', error);
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
        setLiftUsageTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching lift usage types:', error);
      });
  }, []);

  const [capacityTypeOptions, setCapacityTypeOptions] = useState([]);

  useEffect(() => {
    const fetchCapacityTypes = async () => {
      try {
        const response = await axiosInstance.get("/api/capacityTypes");
        const data = response.data; // Axios auto-parses JSON

        // Convert to display-friendly format
        const options = data.data.map(item => ({
          id: item.id,
          label: item.type,  // This is for display
          value: String(item.id)  // This will be used as radio value
        }));

console.log(options);
        setCapacityTypeOptions(options);
      } catch (error) {
        console.error("Error fetching capacity types:", error);
      }
    };

    fetchCapacityTypes();
  }, []);



  useEffect(() => {
    setForm((prev) => ({ ...prev, leadDetail: `${customer} For ${site}` }));
  }, [customer, site]);

  function getEmptyLift() {
    return {
      leadId: id || '',
      enquiryId: '',
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

  const transformLift = (lift, index) => {
    const repeatSetting = repeatSettings[index] || {}; // fallback if missing
    return {
      leadId: lift.leadId,
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
      stageOfProject: lift.stageOfProject,
      buildingType: lift.buildingType,

      // 👉 Include `checked` and `from` from repeatSettings
      checked: repeatSetting.checked ?? false,
      from: repeatSetting.from ?? "",
    };
  };

  const handleSubmitj = async (event) => {

    event.preventDefault(); // 🛑 Prevent full page reload

    const leadId = id; // Get actual leadId if needed
    const projectName = "sacwwc";
    //const enquiryTypeId = 2; // Replace with actual

    if (!combinedEnqId) {
      alert("Missing combinedEnqId");
      return;
    }

    const enquiryDate = form.enquiryDate; // Already a string like "2025-08-08"

    const apiUrl = `/api/combined-enquiry/${leadId}/update-combined-enquiries`;

    const query = `?combinedEnqId=${combinedEnqId}&projectName=${encodeURIComponent(projectName)}&enquiryTypeId=${enquiryTypeId}&enquiryDate=${enquiryDate}`;


    const transformedLifts = form.lifts.map((lift, index) => transformLift(lift, index));
    console.log("Transformed Lifts:", transformedLifts);

    try {
      const response = await axiosInstance.put(apiUrl + query, transformedLifts);
      toast.success("Enquiry updated successfully.");
      router.push(
        `/${tenant}/dashboard/lead-management/enquiries/${leadId}?customer=${encodeURIComponent(customer)}&site=${encodeURIComponent(site)}&enquiryTypeName=${encodeURIComponent(enquiryTypeName)}`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update combined enquiry");
    }
  };


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
        console.log("callingggg");
        // Checkbox unchecked: clear repeat setting AND reset lift fields
        updated[index] = { checked: false, from: '' };
        setForm((prevForm) => {
          const updatedLifts = [...prevForm.lifts];
          // updatedLifts[index] = getEmptyLift();
          return { ...prevForm, lifts: updatedLifts };
        });
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const deleteRepeatSettingAndLift = (deletedIndex) => {

    console.log('Deleting lift at index:', deletedIndex);
    // 1. Update repeatSettings
    setRepeatSettings((prevSettings) => {
      const updatedSettings = {};

      Object.entries(prevSettings).forEach(([key, value]) => {
        const idx = parseInt(key, 10);

        if (idx < deletedIndex) {
          updatedSettings[idx] = {
            ...value,
            from:
              value.from !== '' && parseInt(value.from, 10) > deletedIndex
                ? String(parseInt(value.from, 10) - 1)
                : value.from,
          };
        }
        else if (idx > deletedIndex) {
          const newIndex = idx - 1;
          updatedSettings[newIndex] = {
            ...value,
            from:
              value.from !== '' && parseInt(value.from, 10) >= deletedIndex
                ? String(parseInt(value.from, 10) - 1)
                : value.from,
          };
        }
        // if idx === deletedIndex, skip (delete)
      });

      return updatedSettings;
    });

    // 2. Update lifts in form
    setForm((prevForm) => {
      const newLifts = [...prevForm.lifts];
      newLifts.splice(deletedIndex, 1); // remove lift at index

      return {
        ...prevForm,
        lifts: newLifts,
        noOfLifts: String(newLifts.length), // also update lift count
      };
    });
    handleDeleteRepeatSetting(deletedIndex);
  };

  const handleDeleteRepeatSetting = (deletedIndex) => {
    setRepeatSettings((prevSettings) => {
      const updatedSettings = updateFromAfterDelete(prevSettings, deletedIndex);
      return updatedSettings;
    });
  };

  const updateFromAfterDelete = (obj, deletedIndex) => {
    const targetFromValue = deletedIndex;

    console.log('Target from value:', targetFromValue);

    // Step 1: Find all affected keys
    const affectedKeys = Object.entries(obj)
      .filter(([_, value]) => Number(value.from) === targetFromValue)
      .map(([key]) => parseInt(key, 10));

    if (affectedKeys.length <= 1) return obj; // nothing to update if 0 or 1

    // Step 2: Find minKey (to skip)
    const minKey = Math.min(...affectedKeys);

    console.log('Affected keys:', affectedKeys);

    // Step 3: Create new object and update `from` values (excluding minKey)
    const newObj = { ...obj };
    affectedKeys.forEach((key) => {
      if (key !== minKey) {
        newObj[key] = { ...newObj[key], from: String(minKey + 1) };
      } else if (key === minKey) {
        newObj[key] = { ...newObj[key], from: '' }; // reset from for minKey
      }
    });

    return newObj;
  };




  const handleRepeat = (index) => {
    const repeatFrom = parseInt(repeatSettings[index]?.from || '', 10) - 1;
    if (isNaN(repeatFrom) || repeatFrom < 0 || repeatFrom >= index) {
      toast.error(`Invalid lift number to repeat from for Lift ${index + 1}`);
      return;
    }

    setForm((prevForm) => {
      const updatedLifts = [...prevForm.lifts];

      const source = updatedLifts[repeatFrom];
      const target = updatedLifts[index];

      // Copy all properties from source but keep the current enquiryId
      updatedLifts[index] = {
        ...source,
        enquiryId: target.enquiryId, // keep original
      };

      return { ...prevForm, lifts: updatedLifts };
    });


    // Trigger handleLiftChange for sync propagation
    //handleLiftChange(repeatFrom, '__dummy__', '__noop__'); // Trigger propagation only
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



  return (
    <div className="w-full max-w-7xl bg-white rounded shadow-md">
      <div className="bg-blue-600 text-white text-center py-2 text-base font-semibold rounded-t-md">Add Lift Requirement</div>
      <div className="flex justify-end text-xs text-gray-700 py-1 gap-3 pr-2">
        {floorOptions.map((floor) => <span key={floor}>{floor} = {floorLabels[floor]}</span>)}
      </div>
      <form onSubmit={handleSubmitj} className="p-6 space-y-4 text-sm">
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
            <div className="flex items-center justify-between">
              <SectionTitle title={`Lift ${index + 1} Details`} />

              {/* Show delete button only if more than 1 lift remains */}
              {form.lifts.length > 1 && index != 0 && (
                <button
                  type="button"
                  onClick={() => deleteRepeatSettingAndLift(index)}
                  className="text-red-600 border border-red-600 rounded px-2 py-1 text-sm hover:bg-red-100"
                >
                  Delete
                </button>
              )}
            </div>
            {index > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={repeatSettings[index]?.checked || false} onChange={(e) => handleRepeatChange(index, 'checked', e.target.checked)} title="Check to enable repeat functionality." />
                <span>Repeat specification of Lift</span>

                <input
                  type="number"
                  min="1"
                  max={form.lifts.length}
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
                value={String(lift.liftUsageType)} // must hold the selected ID
                onChange={(e) => handleLiftChange(index, 'liftUsageType', e.target.value)}
              >
                <option value="">Please Select</option>
                {liftUsageTypeOptions && liftUsageTypeOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Lift Mechanism *"
                value={String(lift.liftMechanism)} // should store the selected lift type ID
                onChange={(e) => handleLiftChange(index, 'liftMechanism', e.target.value)}
              >
                <option value="">Please Select</option>
                {liftMechanismOptions && liftMechanismOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Elevator Type *"
                value={String(lift.elevatorType)} // should hold the selected ID
                onChange={(e) => handleLiftChange(index, 'elevatorType', e.target.value)}
              >
                <option value="">Please Select</option>
                {elevatorTypeOptions && elevatorTypeOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Machine Room Type *"
                value={String(lift.machineRoomType)} // selected ID from backend
                onChange={(e) => handleLiftChange(index, 'machineRoomType', e.target.value)}
              >
                <option value="">Please Select</option>
                {machineRoomOptions && machineRoomOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Cabin Type *"
                value={String(lift.cabinType)} // should store the selected ID
                onChange={(e) => handleLiftChange(index, 'cabinType', e.target.value)}
              >
                <option value="">Please Select</option>
                {cabinTypeOptions && cabinTypeOptions.map((opt) => (
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
                selected={String(lift.capacityTermId) || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedOption = capacityTypeOptions.find(opt => opt.value === selectedId);

                  if (selectedOption) {
                    handleLiftChange(index, 'capacityType', Number(selectedOption.value));
                    handleLiftChange(index, 'capacityTermId', Number(selectedOption.value)); // Send id to backend
                  }
                }}
              />



              {/* {lift.capacityType === 'Persons' ? */}
              {lift.capacityType === 1 ?
                <Select
                  label="Select Persons *"
                  value={lift.personCapacityId} // should be the ID you're storing
                  onChange={(e) => {
                    // alert(e.target.value);
                    handleLiftChange(index, 'personCapacityId', e.target.value);
                  }
                  }
                >
                  <option value="">Please Select</option>
                  {personOptions && personOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.convertedString}
                    </option>
                  ))}
                </Select>
                :
                <Select
                  label="Enter Kg *"
                  value={String(lift.weightId)} // assuming it stores selected weight `id`
                  onChange={(e) => handleLiftChange(index, 'weightId', e.target.value)}
                >
                  <option value="">Please Select</option>
                  {kgOptions && kgOptions.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.display}
                    </option>
                  ))}
                </Select>
              }
              <Select
                label="No. of Floors *"
                value={String(lift.noOfFloors)} // lift.noOfFloors should store selected floor `id`
                onChange={(e) => {
                  handleLiftChange(index, 'noOfFloors', e.target.value);
                  //handleUpdateFloorDesignationAndStopsAndOpenings(index, e.target.value);
                }
                }
              >
                <option value="">Please Select</option>
                {floorOption && floorOption.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </Select>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Floor Designation</label>
                <input type="text" value={lift.noOfFloors ? `G + ${lift.noOfFloors - 1}` : ''} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />
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
                <input type="text" value={lift.noOfFloors ? lift.noOfFloors : ''} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />

              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">No. of Openings *</label>
                <input type="text" value={lift.noOfFloors ? lift.noOfFloors : ''} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />

              </div>


              {enquiryTypeName === 'New Installation' && (
                <>
                {console.log(lift)}
                  <Input label="Shaft Width (mm) *" value={lift.shaftWidth} onChange={(e) => handleLiftChange(index, 'shaftWidth', e.target.value)} />
                  <Input label="Shaft Depth (mm) *" value={lift.shaftDepth} onChange={(e) => handleLiftChange(index, 'shaftDepth', e.target.value)} />
                  <Input label="Pit (mm) *" value={lift.pit} onChange={(e) => handleLiftChange(index, 'pit', e.target.value)} />
                  <Select
                    label="Stage of Project *"
                    value={lift.stageOfProject}
                    onChange={(e) => handleLiftChange(index, 'stageOfProject', e.target.value)}
                  >
                    <option value="">Please Select</option>
                    {projectStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>{stage.stageName}</option>
                    ))}
                  </Select>

                  <Select
                    label="Building Type *"
                    value={lift.buildingType}
                    onChange={(e) => handleLiftChange(index, 'buildingType', e.target.value)}
                  >
                    <option value="">Please Select</option>
                    {buildingTypes.map((type) => (
                      <option key={type.buildingTypeId} value={type.buildingTypeId}>{type.buildingType}</option>
                    ))}
                  </Select>
                </>
              )}           </div>


          </div>
        ))}
        <div className="flex justify-end gap-4 pt-4">
          {action === 'Edit' ? (
            <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition">
              Save
            </button>
          ) : null}

          <button type="button" onClick={() => router.back()} className="border px-5 py-2 rounded hover:bg-gray-100 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}

const SectionTitle = ({ title }) => (<div className="bg-gray-100 px-3 py-1 rounded text-gray-800 font-medium text-sm">{title}</div>);
const Input = ({ label, tooltip, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><input {...props} title={tooltip} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed" /></div>);
const Select = ({ label, children, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><select {...props} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed">{children}</select></div>);
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
