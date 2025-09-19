'use client';
import React, { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function CabinFalseCeilingType() {
  const [ceilingType, setCeilingType] = useState('');
  const [editId, setEditId] = useState(null);

  const [ceilingTypes, setCeilingTypes] = useState([
    { id: 1, name: 'Standard False Ceiling' },
    { id: 2, name: 'Designer False Ceiling' },
    { id: 3, name: 'Acrylic False Ceiling' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ceilingType.trim()) return;

    if (editId !== null) {
      setCeilingTypes((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, name: ceilingType } : item
        )
      );
      setEditId(null);
    } else {
      setCeilingTypes((prev) => [
        ...prev,
        { id: Date.now(), name: ceilingType },
      ]);
    }

    setCeilingType('');
  };

  const handleEdit = (id) => {
    const found = ceilingTypes.find((item) => item.id === id);
    setCeilingType(found.name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setCeilingTypes((prev) => prev.filter((item) => item.id !== id));
    if (editId === id) {
      setCeilingType('');
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6  min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Cabin False Ceiling Type
        </h2>
        <p className="text-sm text-gray-500">
          Manage and categorize cabin ceiling types.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="text"
            placeholder="Enter Ceiling Type"
            value={ceilingType}
            onChange={(e) => setCeilingType(e.target.value)}
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

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Cabin Ceiling Type List
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">
                  ID
                </th>
                <th className="px-4 py-2 border border-gray-200 text-left">
                  Ceiling Type
                </th>
                <th className="px-4 py-2 border border-gray-200 text-center">
                  Edit
                </th>
                <th className="px-4 py-2 border border-gray-200 text-center">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {ceilingTypes.length > 0 ? (
                ceilingTypes.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border border-gray-200">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {item.name}
                    </td>
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
                    No ceiling types added.
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
