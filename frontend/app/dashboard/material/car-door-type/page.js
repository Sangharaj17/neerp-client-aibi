'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, DoorOpen } from 'lucide-react';

export default function CarDoorType() {
  const [operatorType, setOperatorType] = useState('');
  const [carDoorType, setCarDoorType] = useState('');
  const [editId, setEditId] = useState(null);

  const [carDoorTypes, setCarDoorTypes] = useState([
    { id: 1, name: 'IMPERFORATE MANUAL CABIN DOOR' },
    { id: 2, name: 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION' },
    { id: 3, name: 'S.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!carDoorType.trim()) return;

    if (editId) {
      setCarDoorTypes(prev =>
        prev.map(item =>
          item.id === editId ? { ...item, name: carDoorType.toUpperCase() } : item
        )
      );
      setEditId(null);
    } else {
      setCarDoorTypes(prev => [
        ...prev,
        { id: Date.now(), name: carDoorType.toUpperCase() }
      ]);
    }

    setCarDoorType('');
  };

  const handleEdit = (id) => {
    const found = carDoorTypes.find(l => l.id === id);
    setCarDoorType(found.name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setCarDoorTypes(prev => prev.filter(l => l.id !== id));
    if (editId === id) {
      setCarDoorType('');
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6  min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-gray-600" />
          Car Door Type
        </h2>
        <p className="text-sm text-gray-500">
          Manage and categorize types of car doors.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-4">
          <select
            value={operatorType}
            onChange={(e) => setOperatorType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 text-sm focus:outline-none"
            required
          >
            <option value="">Select Operator Type</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
          <input
            type="text"
            placeholder="Enter Car Door Type"
            value={carDoorType}
            onChange={(e) => setCarDoorType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 text-sm focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
          >
            {editId ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Car Door Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">ID</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Car Door Type</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {carDoorTypes.length > 0 ? (
                carDoorTypes.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.name}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-gray-700 hover:text-black"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-700 hover:text-black"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No car door types added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
