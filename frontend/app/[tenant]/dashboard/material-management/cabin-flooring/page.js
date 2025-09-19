'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, Layers } from 'lucide-react';

export default function CabinFlooringType() {
  const [flooringName, setFlooringName] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const [flooringList, setFlooringList] = useState([
    { id: 1, name: 'Chequered Plate', price: 2000 },
    { id: 2, name: 'Flooring by customer', price: 3000 },
    { id: 3, name: 'PVC Mat', price: 2500 },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!flooringName.trim()) {
      setError('This is a required field');
      return;
    }
    setError('');

    if (editId !== null) {
      setFlooringList((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, name: flooringName, price: Number(price) }
            : item
        )
      );
      setEditId(null);
    } else {
      setFlooringList((prev) => [
        ...prev,
        { id: Date.now(), name: flooringName, price: Number(price) },
      ]);
    }

    setFlooringName('');
    setPrice('');
  };

  const handleEdit = (id) => {
    const found = flooringList.find((item) => item.id === id);
    setFlooringName(found.name);
    setPrice(found.price);
    setEditId(id);
    setError('');
  };

  const handleDelete = (id) => {
    setFlooringList((prev) => prev.filter((item) => item.id !== id));
    if (editId === id) {
      setFlooringName('');
      setPrice('');
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6  min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-600" />
          Cabin Flooring Type
        </h2>
        <p className="text-sm text-gray-500">
          Add and manage flooring types and their pricing.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-2xl mx-auto"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Cabin Flooring Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={flooringName}
              onChange={(e) => setFlooringName(e.target.value)}
              className={`w-full border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md px-4 py-2 text-sm focus:outline-none`}
              placeholder="Enter Flooring Name"
              required
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
              placeholder="Enter Price"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              {editId !== null ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Cabin Flooring Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Cabin Flooring Name</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {flooringList.length > 0 ? (
                flooringList.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.name}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.price}</td>
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
