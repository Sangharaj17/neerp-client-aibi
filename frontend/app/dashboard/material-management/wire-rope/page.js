'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function WireRope() {
  const [form, setForm] = useState({
    machineMode: '',
    wireRope: '',
    prize: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      machineMode: 'GEARED',
      wireRope: 'WIRE ROPE 13 MM FOR GEARED MACHINE 1 ST 1 ROPING',
      prize: '105',
    },
    {
      id: 2,
      machineMode: 'GEARED',
      wireRope: 'WIRE ROPE 13 MM FOR GEARED MACHINE 2 ST 1 ROPING',
      prize: '105',
    },
    {
      id: 3,
      machineMode: 'GEARLESS',
      wireRope: 'WIRE ROPE 8 MM FOR GEARLESS MACHINE 2 ST 1 ROPING',
      prize: '85',
    },
    {
      id: 4,
      machineMode: 'HYDRALIC',
      wireRope: 'WIRE ROPE 13 MM FOR HYDRALIC MACHINE 2 ST 1 ROPING',
      prize: '105',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      machineMode: form.machineMode,
      wireRope: form.wireRope,
      prize: form.prize,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({
      machineMode: '',
      wireRope: '',
      prize: '',
    });
  };

  const handleEdit = (item) => {
    setForm({
      machineMode: item.machineMode,
      wireRope: item.wireRope,
      prize: item.prize,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    if (editId === id) {
      setForm({ machineMode: '', wireRope: '', prize: '' });
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Wire Rope Management
        </h2>
        <p className="text-sm text-gray-500">Manage different wire rope configurations.</p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Machine Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/4 font-medium text-gray-700">Machine Mode*</label>
            <select
              required
              value={form.machineMode}
              onChange={(e) => setForm({ ...form, machineMode: e.target.value })}
              className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
            >
              <option value="">Please Select</option>
              <option value="GEARED">GEARED</option>
              <option value="GEARLESS">GEARLESS</option>
              <option value="HYDRALIC">HYDRALIC</option>
            </select>
          </div>

          {/* Wire Rope */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/4 font-medium text-gray-700">Wire Rope*</label>
            <input
              required
              type="text"
              value={form.wireRope}
              onChange={(e) => setForm({ ...form, wireRope: e.target.value })}
              placeholder="Enter Wire Rope Type"
              className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
            />
          </div>

          {/* Prize */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/4 font-medium text-gray-700">Prize*</label>
            <input
              required
              type="number"
              value={form.prize}
              onChange={(e) => setForm({ ...form, prize: e.target.value })}
              placeholder="Enter Prize"
              className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
            />
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              {editId ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Wire Rope List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Machine Mode</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Wire Rope Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Prize</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.machineMode}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.wireRope}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.prize}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      <button
                        onClick={() => handleEdit(item)}
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
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No wire ropes added.
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
