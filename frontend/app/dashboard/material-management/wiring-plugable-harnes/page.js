'use client';
import React, { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2, Plug, Plug2Icon, PlugIcon } from 'lucide-react';

export default function WiringPlugableHarness() {
  const [form, setForm] = useState({
    harnessType: '',
    floor: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    { id: 1, harnessType: 'WIRING PLUGABLE HARNES FOR G+1', floor: 'G+1', price: 11000 },
    { id: 2, harnessType: 'WIRING PLUGABLE HARNES FOR G+2', floor: 'G+2', price: 12500 },
    { id: 3, harnessType: 'WIRING PLUGABLE HARNES FOR G+3', floor: 'G+3', price: 12500 },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: editId || Date.now(),
      harnessType: form.harnessType.toUpperCase(),
      floor: form.floor,
      price: form.price,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({ harnessType: '', floor: '', price: '' });
  };

  const handleEdit = (item) => {
    setForm({
      harnessType: item.harnessType,
      floor: item.floor,
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    setEditId(null);
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          
          <Plug2Icon className="w-5 h-5 text-gray-600"/>
          Wiring Plugable Harness
        </h2>
        <p className="text-sm text-gray-500">
          Add wiring harness types by floor with price.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Harness Type */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[160px] text-center sm:text-right">
              Harness Type<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.harnessType}
              onChange={(e) => setForm({ ...form, harnessType: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
              placeholder="Harness Type"
            />
          </div>

          {/* Floor */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[160px] text-center sm:text-right">
              Select Floor<span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
            >
              <option value="">Select</option>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={`G+${i + 1}`}>
                  G+{i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[160px] text-center sm:text-right">
              Price<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
              placeholder="Price"
            />
          </div>

          {/* Submit Button */}
          <div className="justify-center text-center">
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Harness Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Harness Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Floor</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.harnessType}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.floor}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.price}</td>
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
                    No records found.
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
