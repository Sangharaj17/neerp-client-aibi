'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function ElevatorOperation() {
  const [liftType, setLiftType] = useState('');
  const [editId, setEditId] = useState(null);
  const [liftTypes, setLiftTypes] = useState([
    { id: 1, name: 'GEARED' },
    { id: 2, name: 'GEARLESS' },
    { id: 3, name: 'HYDRAULIC' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!liftType.trim()) return;

    if (editId) {
      setLiftTypes((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, name: liftType.toUpperCase() } : item
        )
      );
      setEditId(null);
    } else {
      setLiftTypes((prev) => [
        ...prev,
        { id: Date.now(), name: liftType.toUpperCase() },
      ]);
    }

    setLiftType('');
  };

  const handleEdit = (id) => {
    const found = liftTypes.find((l) => l.id === id);
    setLiftType(found.name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setLiftTypes((prev) => prev.filter((l) => l.id !== id));
    if (editId === id) {
      setLiftType('');
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6  min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Elevator Operation - Lift Types
        </h2>
        <p className="text-sm text-gray-500">
          Manage and categorize types of lifts.
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
            placeholder="Enter Lift Type"
            value={liftType}
            onChange={(e) => setLiftType(e.target.value)}
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Lift Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">ID</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Lift Type</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {liftTypes.length > 0 ? (
                liftTypes.map((item, idx) => (
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
                    No lift types added.
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
