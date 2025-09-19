'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, Building2 } from 'lucide-react';

export default function MachineRoomType() {
  const [machineRoomType, setMachineRoomType] = useState('');
  const [editId, setEditId] = useState(null);
  const [types, setTypes] = useState([
    { id: 1, name: 'MACHINE ROOM' },
    { id: 2, name: 'MACHINE ROOM LESS' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!machineRoomType.trim()) return;

    if (editId) {
      setTypes((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, name: machineRoomType.toUpperCase() } : item
        )
      );
      setEditId(null);
    } else {
      setTypes((prev) => [
        ...prev,
        { id: Date.now(), name: machineRoomType.toUpperCase() },
      ]);
    }

    setMachineRoomType('');
  };

  const handleEdit = (id) => {
    const found = types.find((item) => item.id === id);
    setMachineRoomType(found.name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setTypes((prev) => prev.filter((item) => item.id !== id));
    if (editId === id) {
      setMachineRoomType('');
      setEditId(null);
    }
  };

  return (
    <div className=" min-h-screen p-4">
      <div className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Add Required Machine Room Type
      </div>

      <div className="bg-white border border-gray-300 rounded-md p-6 flex flex-col items-center">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl flex flex-col items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <label className="w-48 text-sm font-medium text-gray-700 text-right">
              Machine Room Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Machine Room Type"
              value={machineRoomType}
              onChange={(e) => setMachineRoomType(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-sky-300"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 text-sm rounded hover:bg-gray-700"
          >
            {editId ? 'Update' : 'Submit'}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Machine Room Type Detail List
          </h3>

          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-center">Sr.No.</th>
                <th className="border border-gray-300 px-3 py-2">Machine Room Type</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Edit</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {types.map((item, idx) => (
                <tr key={item.id} className="text-center hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 ">{idx + 1}</td>
                  <td className="border border-gray-200 px-4 py-2 text-left">{item.name}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button onClick={() => handleEdit(item.id)} className="text-gray-700 hover:text-black">
                      <Pencil size={14} />
                    </button>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button onClick={() => handleDelete(item.id)} className="text-gray-700 hover:text-black">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {types.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No data found.
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
