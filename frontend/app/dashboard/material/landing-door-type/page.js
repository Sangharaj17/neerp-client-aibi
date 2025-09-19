'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, DoorOpen } from 'lucide-react';

export default function LandingDoorType() {
  const [operatorType, setOperatorType] = useState('');
  const [doorType, setDoorType] = useState('');
  const [editId, setEditId] = useState(null);
  const [doorTypes, setDoorTypes] = useState([
    { id: 1, name: 'COLLAPSIBLE MANUAL LANDING DOOR' },
    { id: 2, name: 'M.S SWING MANUAL LANDING DOOR' },
    { id: 3, name: 'IMPERFORATE MANUAL LANDING DOOR' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doorType.trim()) return;

    if (editId) {
      setDoorTypes(prev =>
        prev.map(item =>
          item.id === editId ? { ...item, name: doorType.toUpperCase() } : item
        )
      );
      setEditId(null);
    } else {
      setDoorTypes(prev => [
        ...prev,
        { id: Date.now(), name: doorType.toUpperCase() }
      ]);
    }

    setDoorType('');
  };

  const handleEdit = (id) => {
    const found = doorTypes.find(l => l.id === id);
    setDoorType(found.name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setDoorTypes(prev => prev.filter(l => l.id !== id));
    if (editId === id) {
      setDoorType('');
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6  min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-gray-600" />
          Landing Door Type
        </h2>
        <p className="text-sm text-gray-500">
          Manage and categorize types of landing doors.
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
            placeholder="Enter Door Type"
            value={doorType}
            onChange={(e) => setDoorType(e.target.value)}
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Landing Door Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">ID</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Door Type</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {doorTypes.length > 0 ? (
                doorTypes.map((item, idx) => (
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
                    No door types added.
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
