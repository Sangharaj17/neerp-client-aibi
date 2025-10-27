'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function AddAmcEnquiryForm({ enquiryTypeId, enquiryTypeName }) {
  const API_ADDITIONAL_FLOORS = "/api/additional-floors";

  const [typeId, setEnquiryTypeId] = useState(enquiryTypeId);
  const [typeName, setEnquiryTypeName] = useState(enquiryTypeName);
  const [enquiryTypes, setEnquiryTypes] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/enquiry-types')
      .then((res) => {
        setEnquiryTypes(res.data);
      })
      .catch((err) => console.error('Failed to fetch enquiry types', err));
  }, []);

  const handleEnquiryTypeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedType = enquiryTypes.find(et => et.enquiryTypeId === selectedId);

    if (selectedType) {
      setEnquiryTypeName(selectedType.enquiryTypeName);
      setEnquiryTypeId(selectedType.enquiryTypeId);
    }
  };

  console.log("Selected enquiryTypeId:", enquiryTypeId);
  const { id, tenant } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  //const enquiryType =  searchParams.get('enquiryType') || 'AMC'; 

  // const floorOptions = ['T', 'G', 'P', 'B1', 'B2'];
  // const floorLabels = { T: 'Terrace', G: 'Ground', P: 'Parking', B1: 'Basement 1', B2: 'Basement 2' };
  // const personOptions = ['01 Person/240Kg', '02 Persons/360Kg', '04 Persons/480Kg', '06 Persons/720Kg', '08 Persons/960Kg', '10 Persons/1200Kg', '13 Persons/1560Kg', '15 Persons/1800Kg'];
  //const kgOptions = ['100Kg', '150Kg', '200Kg', '250Kg', '300Kg', '400Kg'];

  const customer = searchParams.get('customer') || 'Customer';
  const site = searchParams.get('site') || 'Site';

  const [repeatSettings, setRepeatSettings] = useState({});
  const [floorOptions, setFloorOptions] = useState([]);
  const [stopsOptions, setStopsOptions] = useState([]);
  const [openingOptions, setOpeningOptions] = useState([]);
  const [floorLabels, setFloorLabels] = useState({});

  const [floorOption, setFloorOption] = useState([]);
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        // Fetch both APIs in parallel
        const [mainRes, additionalRes] = await Promise.all([
          axiosInstance.get('/api/floors'),
          axiosInstance.get(API_ADDITIONAL_FLOORS)
        ]);

        // Main floors
        const mainFloors = Array.isArray(mainRes.data.data) ? mainRes.data.data : [];
        const formattedMainFloors = mainFloors.map(f => ({
          id: f.id,
          name: f.floorName || f.id
        }));
        setFloorOption(formattedMainFloors);

        // Additional floors
        const additionalFloors = Array.isArray(additionalRes.data) ? additionalRes.data : [];
        const additionalFloorCodes = additionalFloors.map(f => f.code);
        const labels = {};
        additionalFloors.forEach(f => {
          labels[f.code] = f.label;
        });
        setFloorOptions(additionalFloorCodes);
        setFloorLabels(labels);

        // Total floors count = main + additional
        const totalFloorsCount = formattedMainFloors.length + additionalFloorCodes.length;

        // Stops = totalFloors
        setStopsOptions(Array.from({ length: totalFloorsCount }, (_, i) => i + 1));

        // Openings = 2 * totalFloors
        setOpeningOptions(Array.from({ length: totalFloorsCount * 2 }, (_, i) => i + 1));

      } catch (err) {
        console.error("Failed to fetch floors", err);
      }
    };

    fetchFloors();
  }, []);
  // useEffect(() => {
  //   axiosInstance.get('/api/floors')
  //     .then((response) => {
  //       const formatted = response.data.data.map((floor) => ({
  //         id: floor.id,
  //         //name: floor.floorName
  //         name: floor.id
  //       }));
  //       console.log('Formatted floor options:', formatted);
  //       setFloorOption(formatted);

  //       // 👉 total floors count
  //       const totalFloors = formatted.length + floorOptions.length; // + additional floors
  //       console.log(floorOptions);

  //       // Stops = totalFloors
  //       setStopsOptions(Array.from({ length: totalFloors }, (_, i) => i + 1));

  //       // Openings = 2 * totalFloors
  //       setOpeningOptions(Array.from({ length: totalFloors * 2 }, (_, i) => i + 1));
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching floor options:', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   const fetchFloors = async () => {
  //     try {
  //       const res = await axiosInstance.get(API_ADDITIONAL_FLOORS);
  //       const floors = Array.isArray(res.data) ? res.data : [];

  //       // Extract codes
  //       setFloorOptions(floors.map(f => f.code));

  //       // Build label map
  //       const labels = {};
  //       floors.forEach(f => {
  //         labels[f.code] = f.label;
  //       });
  //       setFloorLabels(labels);
  //     } catch (err) {
  //       console.error("Failed to fetch additional floors", err);
  //     }
  //   };

  //   fetchFloors();
  // }, []);

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
        console.log('Formatted weights:', formatted);
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
        console.log('Formatted machine room types:', formatted);
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
        console.log('Formatted cabin types:', formatted);
        setCabinTypeOptions(formatted);
      })
      .catch((error) => {
        console.error('Error fetching cabin types:', error);
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
        console.log('Formatted lift usage types:', formatted);
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
        const data = response.data;

        // Convert to display-friendly format
        const options = data.data.map(item => ({
          id: item.id,
          label: item.type,
          value: item.type
        }));

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

  function getEmptyLift() {
    return {
      liftName: '',
      leadId: id,
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


  const [form, setForm] = useState({
    enquiryDate: new Date().toISOString().split('T')[0],
    leadDetail: `${customer} For ${site}`,
    noOfLifts: '1',
    siteName: site,
    lifts: [getEmptyLift()],
  });

  // Add this new useEffect hook to your component
  useEffect(() => {
    // Check if options have been loaded and the first lift's capacityType is still empty
    if (capacityTypeOptions.length > 0 && form.lifts[0].capacityType === '') {
      // Update the form state with the first option's value and ID
      setForm((prevForm) => {
        const updatedLifts = [...prevForm.lifts];
        // Set the default for the first lift
        updatedLifts[0].capacityType = capacityTypeOptions[0].value;
        updatedLifts[0].capacityTermId = capacityTypeOptions[0].id;

        return {
          ...prevForm,
          lifts: updatedLifts,
        };
      });
    }
  }, [capacityTypeOptions]); // This effect runs whenever capacityTypeOptions changes

  const transformLift = (lift, index) => {
    const repeatSetting = repeatSettings[index] || {}; // fallback if missing
    return {
      leadId: lift.leadId,
      liftName: lift.liftName || `Lift ${index + 1}`,
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



  const handleSubmitj = async (event) => {
    event.preventDefault(); // 🛑 Prevent full page reload

    const leadId = id;
    const projectName = "sacwwc";
    const enquiryDate = form.enquiryDate;

    // const apiUrl = `/api/combined-enquiry/${leadId}/create-combined-enquiries`;

    // // const query = `?projectName=${encodeURIComponent(projectName)}&enquiryTypeId=${enquiryTypeId}`;

    // const query = `?projectName=${encodeURIComponent(projectName)}&enquiryTypeId=${typeId}&enquiryDate=${enquiryDate}`;

      const siteName = form.siteName; // ✅ Get siteName from form

  const apiUrl = `/api/combined-enquiry/${leadId}/create-combined-enquiries`;

  // Build query string including siteName
  const query = `?projectName=${encodeURIComponent(projectName)}&siteName=${encodeURIComponent(siteName)}&enquiryTypeId=${typeId}&enquiryDate=${enquiryDate}`;


    // 🔁 transform all lifts before sending
    const transformedLifts = form.lifts.map((lift, index) => transformLift(lift, index));

    //alert(transformedLifts[0].capacityTermId);

    //alert("Transformed Lifts: " + JSON.stringify(transformedLifts));


    try {
      const response = await axiosInstance.post(apiUrl + query, transformedLifts);
      //alert("Success");
      //window.location.href = `/${tenant}/dashboard/lead-management/enquiries/${id}`;
      // ✅ Redirect using props (customer, site, leadId, enquiryTypeName)

      // ✅ Use Next.js router to redirect

      toast.success('Enquiry added successfully!');

      router.push(
        `/dashboard/lead-management/enquiries/${leadId}?customer=${encodeURIComponent(customer)}&site=${encodeURIComponent(site)}&enquiryTypeName=${encodeURIComponent(typeName)}`
      );

    } catch (err) {
      console.error(err);
      alert("Failed");
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
      const currentLift = updatedLifts[index];

      // // Check if the changed field is 'noOfFloors'
      // if (field === 'noOfFloors') {
      //   // Find the floor option object that matches the selected value (ID)
      //   const selectedFloor = floorOption.find(opt => String(opt.id) === value);

      //   updatedLifts[index].floorsDesignation = selectedFloor?.name || '';
      // }

      if (field === 'noOfFloors') {
        const selectedFloor = floorOption.find(opt => String(opt.id) === value);

        if (selectedFloor) {
          currentLift.noOfStops = selectedFloor.id;
          //currentLift.noOfOpenings = selectedFloor.id * 2;
          currentLift.noOfOpenings = selectedFloor.id;

          if (selectedFloor.id === 1) {
            // For Floor 1, use its own name
            currentLift.floorsDesignation = selectedFloor.name;
          } else {
            // Find the floor option with an ID one less than the selected one
            const floorOneLess = floorOption.find(opt => opt.id === selectedFloor.id - 1);

            // Use the name of that found option, or default to an empty string
            currentLift.floorsDesignation = floorOneLess?.name || '';
          }
        } else {
          currentLift.noOfStops = 0;
          currentLift.noOfOpenings = 0;
          currentLift.floorsDesignation = '';
        }
      }

      // Handle floor selection changes
      if (field === "floorSelections") {
        const newSelections = value;

        // Update lift selections
        currentLift.floorSelections = newSelections;

        const stopNo = (Number(currentLift.noOfFloors) || 0) + newSelections.length;
        currentLift.noOfStops = stopNo
        //currentLift.noOfOpenings = Number(currentLift.noOfStops) * 2;
        currentLift.noOfOpenings = stopNo;

        // console.log("No. of Floors selected:", currentLift.noOfFloors);
        // console.log("Checkboxes selected:", newSelections.length);
        // console.log("Total Stops:", currentLift.noOfStops);
        // console.log("Total Openings:", currentLift.noOfOpenings);

        // Trigger re-render by updating the whole lifts array in state
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

  useEffect(() => {
    // This will run AFTER the state has been updated and the component re-rendered.
    console.log("Updated form state:", form.lifts);
  }, [form.lifts]);


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
        const data = response.data; // Axios already parses JSON

        setLiftQuantities(data);
      } catch (error) {
        console.error("Failed to fetch lift quantities:", error);
      }
    };

    fetchLiftQuantities();
  }, []);



  return (
    <div className="w-full max-w-7xl bg-white rounded shadow-md">
      <div className="bg-blue-600 text-white text-center py-2 text-base font-semibold rounded-t-md">
        Add Lift Requirement</div>

 
      {/* Label + Dropdown horizontally aligned */}
      {/* Parent container as a row without border */}

      <div className="inline-flex items-center gap-4 bg-white w-full pt-4 px-4">

  {/* Label + Dropdown */}
  <div className="flex items-center gap-2">
    <label
      htmlFor="enquiryTypeId"
      className="text-gray-600 text-xs font-medium whitespace-nowrap"
    >
      Select Enquiry Type
    </label>
    <select
      id="enquiryTypeId"
      name="enquiryTypeId"
      className="border text-sm rounded px-2 py-1"
      value={typeId || ''}
      onChange={handleEnquiryTypeChange}
    >
      <option value="" disabled>
        Select
      </option>
      {enquiryTypes.map((type) => (
        <option key={type.enquiryTypeId} value={type.enquiryTypeId}>
          {type.enquiryTypeName}
        </option>
      ))}
    </select>
  </div>

  {/* Site Name Input */}
  <div className="flex items-center gap-2">
    <label
      htmlFor="siteName"
      className="text-gray-600 text-xs font-medium whitespace-nowrap"
    >
      Site Name
    </label>
    <input
      type="text"
      id="siteName"
      name="siteName"
      value={form.siteName}
      onChange={handleChange}
      placeholder="Enter site name"
      className="border text-sm rounded px-2 py-1"
    />
  </div>

  {/* Floors info shifted right */}
  <div className="flex text-xs text-gray-700 gap-3 ml-auto">
    {floorOptions.map((floor) => (
      <span key={floor}>
        {floor} = {floorLabels[floor]}
      </span>
    ))}
  </div>
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

            {/* <SectionTitle title={`Lift ${index + 1} Details`} /> */}

         <div className="text-lg mb-3 flex items-center gap-2">
  <input
    type="text"
    className="border-b border-gray-300 focus:outline-none text-lg"
    value={lift.liftName || `Lift ${index + 1}`}
    onChange={(e) => {
      const newLifts = [...form.lifts];
      newLifts[index].liftName = e.target.value;
      setForm({ ...form, lifts: newLifts });
    }}
  />
  <span>Details</span> {/* Fixed keyword */}
</div>


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
                value={String(lift.liftUsageType)} // must hold the selected ID
                onChange={(e) => handleLiftChange(index, 'liftUsageType', e.target.value)}

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
                value={String(lift.liftMechanism)} // should store the selected lift type ID
                onChange={(e) => handleLiftChange(index, 'liftMechanism', e.target.value)}
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
                value={String(lift.elevatorType)} // should hold the selected ID
                onChange={(e) => handleLiftChange(index, 'elevatorType', e.target.value)}
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
                value={String(lift.machineRoomType)} // selected ID from backend
                onChange={(e) => handleLiftChange(index, 'machineRoomType', e.target.value)}
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
                value={String(lift.cabinType)} // should store the selected ID
                onChange={(e) => handleLiftChange(index, 'cabinType', e.target.value)}
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
                  //alert(e.target.value,"---",capacityTypeOptions);
                  //console.log(capacityTypeOptions);
                  const selectedId = e.target.value;
                  const selectedOption = capacityTypeOptions.find(opt => String(opt.value) === selectedId);

                  //alert("Selected Option: " + JSON.stringify(selectedOption));

                  if (selectedOption) {
                    handleLiftChange(index, 'capacityType', selectedOption.label);      // e.g., "Persons"
                    // alert(selectedOption.id);
                    handleLiftChange(index, 'capacityTermId', selectedOption.id);    // e.g., 1
                  }
                }}
              />


              {lift.capacityType === 'Person' ?
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
                  {personOptions.map((opt) => (
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
                  {kgOptions.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.display}
                    </option>
                  ))}
                </Select>
              }


              <Select
                label="No. of Floors *"
                value={String(lift.noOfFloors || "")} // lift.noOfFloors should store selected floor `id`
                onChange={(e) => {
                  handleLiftChange(index, 'noOfFloors', e.target.value);
                  //handleUpdateFloorDesignationAndStopsAndOpenings(index, e.target.value);
                }
                }
              >
                <option value="">Please Select</option>
                {floorOption.map((opt, idx) => (
                  <option key={opt.id} value={idx + 1}>
                    {/* {opt.name} */}
                    {/* {idx + 1} - {opt.name} */}
                    {idx + 1}
                  </option>
                ))}
              </Select>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Floor Designation</label>
                {/* <input type="text" value={lift.noOfFloors ? `G + ${lift.noOfFloors - 1}` : ''} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" /> */}
                <input type="text" value={lift.floorsDesignation} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />
                <div className="flex flex-wrap gap-4 mt-2">
                  {floorOptions.map((floor) => (
                    <label key={floor} className="text-gray-700 text-sm flex items-center gap-1">
                      <input type="checkbox"
                        value={floor}
                        checked={lift.floorSelections.includes(floor)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updated = checked ? [...lift.floorSelections, floor] : lift.floorSelections.filter((f) => f !== floor);
                          handleLiftChange(index, 'floorSelections', updated);
                        }}
                        className="text-blue-500" />
                      {floor}
                    </label>
                  ))}
                </div>
              </div>

              {/* <div>
                <label className="block text-gray-700 text-sm mb-1">No. of Stops *</label>
                <input type="text" value={lift.noOfStops ? lift.noOfStops : ''} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">No. of Openings *</label>
                <input type="text" value={lift.noOfOpenings ? lift.noOfOpenings : ''} readOnly disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />
              </div> */}

              {/* No. of Stops */}
              <Select
                label="No. of Stops *"
                value={String(lift.noOfStops || "")}
                onChange={(e) => handleLiftChange(index, "noOfStops", Number(e.target.value))}
              >
                <option value="">Please Select</option>
                {stopsOptions.map((opt) => (
                  <option key={opt} value={String(opt)}>
                    {opt}
                  </option>
                ))}
              </Select>

              {/* No. of Openings */}
              <Select
                label="No. of Openings *"
                value={String(lift.noOfOpenings || "")}
                onChange={(e) => handleLiftChange(index, "noOfOpenings", Number(e.target.value))}
              >
                <option value="">Please Select</option>
                {openingOptions.map((opt) => (
                  <option key={opt} value={String(opt)}>
                    {opt}
                  </option>
                ))}
              </Select>

              {typeName === 'New Installation' && (
                <>
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
              )}

            </div>


          </div>
        ))}
        <div className="flex justify-end gap-4 pt-4">
          <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition">Save</button>
          <button type="button" onClick={() => router.back()} className="border px-5 py-2 rounded hover:bg-gray-100 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}

const SectionTitle = ({ title }) => (<div className="bg-gray-100 px-3 py-1 rounded text-gray-800 font-medium text-sm">{title}</div>);
const Input = ({ label, tooltip, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><input required {...props} title={tooltip} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed" /></div>);
const Select = ({ label, children, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><select required {...props} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed">{children}</select></div>);
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
            required
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);
