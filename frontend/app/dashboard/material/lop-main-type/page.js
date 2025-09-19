'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function LOPMainType() {
  const [form, setForm] = useState({
    operatorType: '',
    lopType: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      operatorType: 'Manual',
      lopType: 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH',
    },
    {
      id: 2,
      operatorType: 'Manual',
      lopType: 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED LINEN FINISH',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      operatorType: form.operatorType,
      lopType: form.lopType,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({
      operatorType: '',
      lopType: '',
    });
  };

  const handleEdit = (item) => {
    setForm({ operatorType: item.operatorType, lopType: item.lopType });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    if (editId === id) {
      setForm({ operatorType: '', lopType: '' });
      setEditId(null);
    }
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          LOP Main Type
        </h2>
        <p className="text-sm text-gray-500">
          Manage and categorize LOP main types.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Operator Type */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/4 font-medium text-gray-700">Operator Type*</label>
            <select
              required
              value={form.operatorType}
              onChange={(e) => setForm({ ...form, operatorType: e.target.value })}
              className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
            >
              <option value="">Please Select</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="Hydraulic">Hydraulic</option>
            </select>
          </div>

          {/* LOP Type */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/4 font-medium text-gray-700">LOP Main Type*</label>
            <input
              required
              type="text"
              value={form.lopType}
              onChange={(e) => setForm({ ...form, lopType: e.target.value })}
              placeholder="Enter LOP Type"
              className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
            />
          </div>

          {/* Submit Button */}
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">LOP Type List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Operator Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">LOP Main Type</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.operatorType}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.lopType}</td>
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
                    No LOP types added.
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
