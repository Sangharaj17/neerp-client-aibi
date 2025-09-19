'use client';
import React, { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function ArdTypePage() {
  const [form, setForm] = useState({
    ardType: '',
    capacityType: 'Persons',
    person: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      ardType: 'ARD SYSTEM FOR 4 PASSENGER 5 HP',
      passenger: '04 Persons/272 Kg.',
      price: 16000,
    },
    {
      id: 2,
      ardType: 'ARD SYSTEM FOR 6 PASSENGER 5 HP',
      passenger: '06 Persons/408 Kg.',
      price: 16000,
    },
    {
      id: 3,
      ardType: 'ARD SYSTEM FOR 8 PASSENGER 7.5 HP',
      passenger: '08 Persons/544 Kg.',
      price: 21600,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      ardType: form.ardType.toUpperCase(),
      passenger: `${form.person.padStart(2, '0')} Persons/${parseInt(form.person) * 68} Kg.`,
      price: form.price,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({
      ardType: '',
      capacityType: 'Persons',
      person: '',
      price: '',
    });
  };

  const handleEdit = (item) => {
    setForm({
      ardType: item.ardType,
      capacityType: 'Persons',
      person: item.passenger.split(' ')[0],
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
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Add ARD Type
        </h2>
        <p className="text-sm text-gray-500">Add automatic rescue device types by passenger capacity and price.</p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ARD Type */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[160px] text-center sm:text-right">
              ARD Type<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.ardType}
              onChange={(e) => setForm({ ...form, ardType: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
              placeholder="e.g. ARD SYSTEM FOR 6 PASSENGER 5 HP"
            />
          </div>

          {/* Capacity Type (radio) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[160px] text-center sm:text-right flex gap-2">
              Capacity Type<span className="text-red-500 ">*</span>
            </label>
            <div className="flex gap-5">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="Persons"
                  checked={form.capacityType === 'Persons'}
                  onChange={(e) => setForm({ ...form, capacityType: e.target.value })}
                />
                Persons
              </label>
              <label className="flex justify-center items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="Kg"
                  checked={form.capacityType === 'Kg'}
                  disabled
                />
                Kg
              </label>
            </div>
          </div>

          {/* Select Person */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[160px] text-center sm:text-right">
              Select Person<span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.person}
              onChange={(e) => setForm({ ...form, person: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
            >
              <option value="">Select</option>
              {[...Array(30)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
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
          <div className=" justify-center text-center">
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">ARD Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">ARD Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Passenger</th>
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
                    <td className="px-4 py-2 border border-gray-200">{item.ardType}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.passenger}</td>
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
