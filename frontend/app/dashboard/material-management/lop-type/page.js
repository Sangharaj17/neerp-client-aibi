'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function LopSubTypePage() {
  const [form, setForm] = useState({
    operatorType: '',
    lopType: '',
    floor: '',
    lopSubType: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      lopType: 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+1',
      price: 2600,
    },
    {
      id: 2,
      lopType: 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+2',
      price: 3900,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      lopType: form.lopSubType.toUpperCase() + ' ' + form.floor,
      price: form.price,
    };

    if (editId) {
      setData((prev) => prev.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData((prev) => [...prev, newItem]);
    }

    setForm({
      operatorType: '',
      lopType: '',
      floor: '',
      lopSubType: '',
      price: '',
    });
  };

  const handleEdit = (item) => {
    const [lopSubType, floor] = item.lopType.split(/(?=G\+\d+)/);
    setForm({
      operatorType: '',
      lopType: '',
      floor: floor || '',
      lopSubType: lopSubType.trim(),
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    setEditId(null);
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          LOP Subtype
        </h2>
        <p className="text-sm text-gray-500">
          Manage and configure LOP Subtypes with price.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">Operator Type*</label>
              <select
                required
                value={form.operatorType}
                onChange={(e) => setForm({ ...form, operatorType: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Please Select</option>
                <option value="Auto">Auto</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">LOP Type*</label>
              <select
                required
                value={form.lopType}
                onChange={(e) => setForm({ ...form, lopType: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Please Select</option>
                <option value="Type A">Type A</option>
                <option value="Type B">Type B</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">Select Floor*</label>
              <select
                required
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={`G+${i + 1}`}>{`G+${i + 1}`}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">LOP SubType*</label>
              <input
                required
                type="text"
                placeholder="Enter LOP SubType"
                value={form.lopSubType}
                onChange={(e) => setForm({ ...form, lopSubType: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">Price*</label>
              <input
                required
                type="number"
                placeholder="Enter Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
          >
            {editId ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">LOP Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">LOP Type</th>
                <th className="px-4 py-2 border border-gray-200">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200 text-left">{item.lopType}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{item.price}</td>
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
