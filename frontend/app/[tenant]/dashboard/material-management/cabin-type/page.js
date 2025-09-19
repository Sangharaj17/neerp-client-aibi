'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, SquareStack } from 'lucide-react';

export default function CabinType() {
  const [cabinType, setCabinType] = useState('');
  const [editId, setEditId] = useState(null);

  const [cabinTypes, setCabinTypes] = useState([
    { id: 1, name: 'CABIN M.S POWDER COATED REGULAR' },
    { id: 2, name: 'CABIN M.S P.C + S.S MIRROR( BACK SIDE)' },
    { id: 3, name: 'CABIN M.S P.C CUSTOMISED' },
    { id: 4, name: 'CABIN M.S P.C CAPSULE BACK SIDE GLASS' },
    { id: 5, name: 'CABIN M.S P.C + GLASS CAPSULE' },
    { id: 6, name: 'CABIN S.S HAIRLINE FINISH' },
    { id: 7, name: 'CABIN S.S MIRROR FINISH' },
    { id: 8, name: 'CABIN S.S CUSTOMISED FINISH' },
    { id: 9, name: 'CABIN S.S CAPSULE + BACK SIDE GLASS' },
    { id: 10, name: 'CABIN S.S MAT FINISH' },
    { id: 11, name: 'CABIN GLASS CAPSULE' },
    { id: 12, name: 'CABIN GLASS CAPSULE CUSTOMISED' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cabinType.trim()) return;

    if (editId !== null) {
      setCabinTypes(prev =>
        prev.map(item =>
          item.id === editId ? { ...item, name: cabinType.toUpperCase() } : item
        )
      );
      setEditId(null);
    } else {
      setCabinTypes(prev => [
        ...prev,
        { id: Date.now(), name: cabinType.toUpperCase() },
      ]);
    }

    setCabinType('');
  };

  const handleEdit = (id) => {
    const found = cabinTypes.find(item => item.id === id);
    setCabinType(found.name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setCabinTypes(prev => prev.filter(item => item.id !== id));
    if (editId === id) {
      setCabinType('');
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6  min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          
          Cabin Type
        </h2>
        <p className="text-sm text-gray-500">Manage and categorize cabin types.</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Enter Cabin Type"
            value={cabinType}
            onChange={(e) => setCabinType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 text-sm focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
          >
            {editId !== null ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Cabin Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">ID</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Cabin Type</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {cabinTypes.length > 0 ? (
                cabinTypes.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
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
                    No cabin types added.
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
