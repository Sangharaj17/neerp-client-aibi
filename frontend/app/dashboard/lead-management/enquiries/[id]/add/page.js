'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AddLiftRequirementForm() {
  const { id, tenant } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const floorOptions = ['T', 'G', 'P', 'B1', 'B2'];
  const floorLabels = { T: 'Terrace', G: 'Ground', P: 'Parking', B1: 'Basement 1', B2: 'Basement 2' };
  const personOptions = ['01 Person/240Kg', '02 Persons/360Kg', '04 Persons/480Kg', '06 Persons/720Kg', '08 Persons/960Kg', '10 Persons/1200Kg', '13 Persons/1560Kg', '15 Persons/1800Kg'];
  const kgOptions = ['100Kg', '150Kg', '200Kg', '250Kg', '300Kg', '400Kg'];

  const customer = searchParams.get('customer') || 'Customer';
  const site = searchParams.get('site') || 'Site';

  const [form, setForm] = useState({
    enquiryDate: new Date().toISOString().split('T')[0],
    leadDetail: `${customer} For ${site}`,
    noOfLifts: '1',
    lifts: [getEmptyLift()],
  });

  const [repeatSettings, setRepeatSettings] = useState({});

  useEffect(() => {
    setForm((prev) => ({ ...prev, leadDetail: `${customer} For ${site}` }));
  }, [customer, site]);

  function getEmptyLift() {
    return {
      liftUsageType: '',
      liftMechanism: '',
      elevatorType: '',
      machineRoomType: '',
      cabinType: '',
      capacityType: 'Persons',
      capacityValue: '',
      noOfFloors: '',
      floorSelections: [],
      noOfStops: '',
      noOfOpenings: '',
      shaftWidth: '',
      shaftDepth: '',
      pit: '',
      stageOfProject: '',
      buildingType: '',
    };
  }

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

  return (
    <div className="w-full max-w-7xl bg-white rounded shadow-md">
      <div className="bg-blue-600 text-white text-center py-2 text-base font-semibold rounded-t-md">Add Lift Requirement</div>
      <div className="flex justify-end text-xs text-gray-700 py-1 gap-3 pr-2">
        {floorOptions.map((floor) => <span key={floor}>{floor} = {floorLabels[floor]}</span>)}
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input label="Enquiry Date *" type="date" name="enquiryDate" value={form.enquiryDate} onChange={handleChange} />
          <Input label="Lead Detail *" name="leadDetail" value={form.leadDetail} readOnly disabled tooltip="This field is auto-filled." />
          <Select label="No. of Lifts *" name="noOfLifts" value={form.noOfLifts} onChange={handleNoOfLiftsChange}>
            {[1, 2, 3].map((num) => <option key={num} value={num}>{num}</option>)}
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
              <Select label="Lift Usage Type *" value={lift.liftUsageType} onChange={(e) => handleLiftChange(index, 'liftUsageType', e.target.value)}><option>Please Select</option><option>Passenger</option><option>Goods</option><option>Stretcher</option></Select>
              <Select label="Lift Mechanism *" value={lift.liftMechanism} onChange={(e) => handleLiftChange(index, 'liftMechanism', e.target.value)}><option>Please Select</option><option>Geared</option><option>Gearless</option><option>Hydraulic</option></Select>
              <Select label="Elevator Type *" value={lift.elevatorType} onChange={(e) => handleLiftChange(index, 'elevatorType', e.target.value)}><option>Please Select</option><option>Manual</option><option>Automatic</option></Select>
              <Select label="Machine Room Type *" value={lift.machineRoomType} onChange={(e) => handleLiftChange(index, 'machineRoomType', e.target.value)}><option>Please Select</option><option>Machine Room</option><option>Machine Room Less (MRL)</option></Select>
              <Select label="Cabin Type *" value={lift.cabinType} onChange={(e) => handleLiftChange(index, 'cabinType', e.target.value)}><option>Please Select</option><option>MS Powder Coated</option><option>MS + SS Mirror Finish</option><option>Plain MS Cabin</option></Select>
              <RadioGroup label="Capacity Type *" name={`capacityType-${index}`} options={['Persons', 'Kg']} selected={lift.capacityType} onChange={(e) => handleLiftChange(index, 'capacityType', e.target.value)} />
              {lift.capacityType === 'Persons' ? <Select label="Select Persons *" value={lift.capacityValue} onChange={(e) => handleLiftChange(index, 'capacityValue', e.target.value)}><option>Please Select</option>{personOptions.map((opt) => <option key={opt}>{opt}</option>)}</Select> : <Select label="Enter Kg *" value={lift.capacityValue} onChange={(e) => handleLiftChange(index, 'capacityValue', e.target.value)}><option>Please Select</option>{kgOptions.map((opt) => <option key={opt}>{opt}</option>)}</Select>}
              <Select label="No. of Floors *" value={lift.noOfFloors} onChange={(e) => handleLiftChange(index, 'noOfFloors', e.target.value)}><option>Please Select</option>{[...Array(10)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}</Select>
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
              <Select label="No. of Stops *" value={lift.noOfStops} onChange={(e) => handleLiftChange(index, 'noOfStops', e.target.value)}><option>Please Select</option>{[...Array(10)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}</Select>
              <Select label="No. of Openings *" value={lift.noOfOpenings} onChange={(e) => handleLiftChange(index, 'noOfOpenings', e.target.value)}><option>Please Select</option>{[...Array(10)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}</Select>
              <Input label="Shaft Width (mm) *" value={lift.shaftWidth} onChange={(e) => handleLiftChange(index, 'shaftWidth', e.target.value)} />
              <Input label="Shaft Depth (mm) *" value={lift.shaftDepth} onChange={(e) => handleLiftChange(index, 'shaftDepth', e.target.value)} />
              <Input label="Pit (mm) *" value={lift.pit} onChange={(e) => handleLiftChange(index, 'pit', e.target.value)} />
              <Select label="Stage of Project *" value={lift.stageOfProject} onChange={(e) => handleLiftChange(index, 'stageOfProject', e.target.value)}><option>Please Select</option><option>Slab 1</option><option>Slab 2</option><option>Slab 3</option><option>Slab 4</option><option>Slab 5</option></Select>
              <Select label="Building Type *" value={lift.buildingType} onChange={(e) => handleLiftChange(index, 'buildingType', e.target.value)}><option>Please Select</option><option>Commercial</option><option>Residential</option><option>Hospital</option><option>Hotel</option><option>Bungalow</option></Select>
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
const Input = ({ label, tooltip, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><input {...props} title={tooltip} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed" /></div>);
const Select = ({ label, children, ...props }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><select {...props} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed">{children}</select></div>);
const RadioGroup = ({ label, name, options, selected, onChange }) => (<div><label className="block text-gray-700 text-sm mb-1">{label}</label><div className="flex gap-4">{options.map((opt) => (<label key={opt} className="text-gray-700 text-sm flex items-center gap-1"><input type="radio" name={name} value={opt} checked={selected === opt} onChange={onChange} className="text-blue-500" />{opt}</label>))}</div></div>);
