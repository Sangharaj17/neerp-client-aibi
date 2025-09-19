'use client';
import React, { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2, FanIcon } from 'lucide-react';

export default function AirSystemType() {
  const [form, setForm] = useState({
    type: '',
    capacity: '',
    passenger: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);

  const [items, setItems] = useState([
    {
      id: 1,
      type: 'FAN',
      capacity: '6 Passenger/408 Kg',
      passenger: '6 Passenger/408 Kg',
      price: '1700',
    },
    {
      id: 2,
      type: 'FAN',
      capacity: '8 Passenger/544 Kg',
      passenger: '8 Passenger/544 Kg',
      price: '1700',
    },
    {
      id: 10,
      type: 'BLOWER',
      capacity: '10 Passenger/680 Kg',
      passenger: '10 Passenger/680 Kg',
      price: '3200',
    },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { type, capacity, passenger, price } = form;
    if (!type.trim() || !capacity.trim() || !passenger.trim() || !price.trim())
      return;

    if (editId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...form } : item
        )
      );
      setEditId(null);
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
    }

    setForm({ type: '', capacity: '', passenger: '', price: '' });
  };

  const handleEdit = (id) => {
    const found = items.find((i) => i.id === id);
    setForm(found);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (editId === id) {
      setForm({ type: '', capacity: '', passenger: '', price: '' });
      setEditId(null);
    }
  };

  return (
    <div className=" p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <FanIcon className="w-5 h-5 text-gray-600"/>
          Air System Type
        </h2>
        <p className="text-sm text-gray-500">
          Manage fan/blower types for various passenger capacities.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Air System Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Air System Type"
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Capacity Type <span className="text-red-500">*</span>
            </label>
            <select
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
              required
            >
              <option value="">Select</option>
              <option value="6 Passenger/408 Kg">6 Passenger/408 Kg</option>
              <option value="8 Passenger/544 Kg">8 Passenger/544 Kg</option>
              <option value="10 Passenger/680 Kg">10 Passenger/680 Kg</option>
              <option value="13 Passenger/884 Kg">13 Passenger/884 Kg</option>
              <option value="15 Passenger/1020 Kg">
                15 Passenger/1020 Kg
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Passenger <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="passenger"
              value={form.passenger}
              onChange={handleChange}
              placeholder="Passenger"
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2 text-center mt-2">
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              {editId !== null ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Cabin Air System Type List
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2  border-gray-200 text-center">Sr.No.</th>
                <th className="border px-4 py-2  border-gray-200 text-center">Type</th>
                <th className="border px-4 py-2 border-gray-200 text-center">Passenger</th>
                <th className="border px-4 py-2 border-gray-200 text-center">Price</th>
                <th className="border px-4 py-2 border-gray-200 text-center">Edit</th>
                <th className="border px-4 py-2 border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50 text-center"
                  >
                    <td className="border px-3 py-2 border-gray-200 text-left">{idx + 1}</td>
                    <td className="border px-3 py-2 border-gray-200 text-left">{item.type}</td>
                    <td className="border px-3 py-2 border-gray-200 text-left">{item.passenger}</td>
                    <td className="border px-3 py-2 border-gray-200 text-left">{item.price}</td>
                    <td className="border px-3 py-2 border-gray-200 text-left">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-gray-700 hover:text-black "
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                    <td className="border px-3 py-2 border-gray-200 text-center">
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
                    No air system types added.
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
