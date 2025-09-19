'use client';

import { useState, useEffect } from 'react';
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
    rose: { button: 'bg-rose-600 hover:bg-rose-700', header: 'bg-rose-500', ring: 'focus:ring-rose-400', activeSidebar: 'bg-rose-600', textAccent: 'text-rose-600' }, // new unique color
  teal: { button: 'bg-teal-600 hover:bg-teal-700', header: 'bg-teal-500', ring: 'focus:ring-teal-400', activeSidebar: 'bg-teal-600', textAccent: 'text-teal-600' }
};

/** Helper functions to get ID and Name dynamically */
const getId = (item) => item?.areaId ?? item?.stageId ?? item?.leadSourceId ?? item?.designationId ?? item?.id ?? item?.buildingTypeId ?? item?.liftUsageTypeId ?? item?.id  ?? '';
const getName = (item) => item?.areaName ?? item?.stageName ?? item?.sourceName ?? item?.designationName ?? item?.statusName ?? item?.buildingType ?? item?.name ?? item?.name ?? '';

const GridBoxComponent = () => {

      const [selectedStateName, setSelectedStateName] = useState(null);
      const [selectedBox, setSelectedBox] = useState(null);

      const apiUrlOfCities = (stateName) => 
        `/api/locations/states/${stateName}/cities`;

      useEffect(() => {
        if (selectedStateName) {
          // if box type is city → update its API dynamically
          setSelectedBox((prev) => 
            prev && prev.type === "city"
              ? { ...prev, api: apiUrlOfCities(selectedStateName) }
              : prev
          );
        } else {
          // reset API if no state selected
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
    { id: 9, title: 'Add States', api: '/api/locations/states', type: 'state', color: 'rose' }, // new
  { id: 10, title: 'Add Cities', api: null, type: 'city', color: 'teal' } // ✅ dynamic API
  ];

  // const [selectedBox, setSelectedBox] = useState(null);
const [formData, setFormData] = useState({ type: 'STATE' });
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
      setDataList(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boxes.length > 0 && !selectedBox) setSelectedBox(boxes[0]);
  }, []);

  const [allStates, setAllStates] = useState([]);

  useEffect(()=>{

    if(selectedBox?.type === 'city' && selectedBox.api === null){
      const fetchStates = async () => {
        try {
          const response = await axiosInstance.get('/api/locations/states');
          setAllStates(response.data || []);
        } catch (error) {
          console.error('Error fetching states:', error);
          setAllStates([]);
        }
      };
      fetchStates();
    }
  },[selectedBox]);

  useEffect(() => { 

    if(selectedBox && selectedBox.type === 'city'){
           if (selectedBox && selectedBox.api === null) fetchData();
    }else{
     if (selectedBox ) fetchData();
    }
  }, [selectedBox]);

  /** Handlers */
  const handleClick = (box) => {
    setSelectedBox(box);
    setFormData({});
    setEditId(null);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();

    //alert(selectedBox.api);
    if (!selectedBox?.api) return;
    setLoading(true);
    try {
      if (editId) {
        await axiosInstance.put(`${selectedBox.api}/${editId}`, formData);
        toast.success(`${selectedBox.title} updated successfully!`);
      } else {
        //alert("selected");
        await axiosInstance.post(selectedBox.api, formData);
        toast.success(`${selectedBox.title} saved successfully!`);
      }
      setFormData({});
      setEditId(null);
      fetchData();
    } catch (error) {
      //console.error('Error saving data:', error);
      toast.error('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    let nameField = '';
    let idField = '';

    switch (selectedBox.type) {
      case 'areas': nameField = 'areaName'; idField = 'areaId'; break;
      case 'leadStage': nameField = 'stageName'; idField = 'stageId'; break;
      case 'leadSource': nameField = 'sourceName'; idField = 'leadSourceId'; break;
      case 'designation': nameField = 'designationName'; idField = 'designationId'; break;
      case 'projectStage': nameField = 'stageName'; idField = 'id'; break;
      case 'leadStatus': nameField = 'statusName'; idField = 'id'; break;
      case 'buildingType': nameField = 'buildingType'; idField = 'buildingTypeId'; break;
      case 'liftUsageType': nameField = 'name'; idField = 'id'; break;
      case 'state': nameField = 'name'; idField = 'id'; break; // new
      default: break;
    }

    setFormData({ [nameField]: item?.[nameField] });
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

    const nameField =
      selectedBox.type === 'areas' ? { label: 'Area Name', key: 'areaName', color: selectedBox.color } :
      selectedBox.type === 'leadStage' ? { label: 'Stage Name', key: 'stageName', color: selectedBox.color } :
      selectedBox.type === 'leadSource' ? { label: 'Source Name', key: 'sourceName', color: selectedBox.color } :
      selectedBox.type === 'designation' ? { label: 'Designation Name', key: 'designationName', color: selectedBox.color } :
      selectedBox.type === 'projectStage' ? { label: 'Project Stage Name', key: 'stageName', color: selectedBox.color } :
      selectedBox.type === 'leadStatus' ? { label: 'Status Name', key: 'statusName', color: selectedBox.color } :
      selectedBox.type === 'buildingType' ? { label: 'Building Type', key: 'buildingType', color: selectedBox.color } :
      selectedBox.type === 'liftUsageType' ? { label: 'Lift Usage Type', key: 'name', color: selectedBox.color } :
      selectedBox.type === 'city' ? { label: 'City Name', key: 'cityName', color: selectedBox.color }:
      selectedBox.type === 'state' ? { label: 'State Name', key: 'name', color: selectedBox.color }: null

    const colorCfg = colorMap[nameField.color] || colorMap.blue;

    return (
      <>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">

          {
            selectedBox.type === 'city' && allStates.length > 0 && ( 
               <div>
                <label className="block mb-1 font-medium">Select state</label>
                <select
                  className="border rounded-lg p-2 w-full"
                  value={selectedStateName || ""}   // <-- bind it to your formData
                  onChange={(e) =>
                    setSelectedStateName(e.target.value ? e.target.value : null) // set to null if no state selected
                  }
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
             

          <div>
            <label className="block mb-1 font-medium">{nameField.label}</label>
            <input type="text" name={nameField.key} value={formData[nameField.key] || ''} onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${colorCfg.ring}`} required />
          </div>
          <button type="submit" className={`${colorCfg.button} text-white px-6 py-2 rounded-lg shadow`} disabled={loading}>
            {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-3">Existing {selectedBox.title}</h2>
        {loading ? <p>Loading...</p> :
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-lg bg-gray-50">
              <table className="min-w-full text-sm">
                <thead className={`${colorCfg.header} text-white`}>
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">{nameField.label}</th>
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
                        <td className="px-4 py-2 border-t">{name}</td>
                        <td className="px-4 py-2 border-t text-center">
                          <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></button>
                        </td>
                        <td className="px-4 py-2 border-t text-center">
                          <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {currentRecords.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No data found</td>
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
          <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-xl shadow-lg p-8">
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
