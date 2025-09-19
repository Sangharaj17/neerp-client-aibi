'use client';
import React, { useState } from 'react';
import { DoorOpen , Pencil, Trash2 } from 'lucide-react';

export default function LandingDoorPrizes() {
  const [form, setForm] = useState({
    operatorType: '',
    doorType: '',
    subType: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      subType: 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 700 CLEAR OPENING',
      price: 7000,
    },
    {
      id: 2,
      subType: 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 800 CLEAR OPENING',
      price: 7000,
    },
    {
      id: 3,
      subType: 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 900 CLEAR OPENING',
      price: 7500,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      subType: form.subType.toUpperCase(),
      price: form.price,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({
      operatorType: '',
      doorType: '',
      subType: '',
      price: '',
    });
  };

  const handleEdit = (item) => {
    setForm({
      operatorType: '',
      doorType: '',
      subType: item.subType,
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
         <DoorOpen className="w-5 h-5 text-gray-600" />
          Landing Door Type - Price Management
        </h2>
        <p className="text-sm text-gray-500">
          Add or update landing door subtypes with associated prices.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[140px] text-center sm:text-right">
              Operator Type<span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.operatorType}
              onChange={(e) => setForm({ ...form, operatorType: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
            >
              <option value="">Please Select</option>
              <option value="MANUAL">MANUAL</option>
              <option value="AUTO">AUTO</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-center  items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[140px] text-center sm:text-right">
              Landing Door Type<span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.doorType}
              onChange={(e) => setForm({ ...form, doorType: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
            >
              <option value="">Please Select</option>
              <option value="COLLAPSIBLE">COLLAPSIBLE</option>
              <option value="M.S SWING">M.S SWING</option>
              <option value="TELESCOPIC">TELESCOPIC</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-center  items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[140px] text-center sm:text-right">
              Door Subtype<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.subType}
              onChange={(e) => setForm({ ...form, subType: e.target.value })}
              placeholder="Landing Door Subtype"
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center  items-center gap-4 w-full">
            <label className="text-sm font-medium text-gray-700 min-w-[140px] text-center sm:text-right">
              Price<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 text-sm"
            />
          </div>

          <div className="justify-center  text-center">
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Landing Door Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Subtype</th>
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
                    <td className="px-4 py-2 border border-gray-200">{item.subType}</td>
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
                  <td colSpan="5" className="p-4 text-center text-gray-500">
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
