'use client';
import { useState } from 'react';
import { PackageCheck, Pencil, Trash2 } from 'lucide-react';

export default function OtherMaterial() {
  const [form, setForm] = useState({
    operatorType: '',
    material: '',
    persons: '',
    mode: '',
    quantity: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    { id: 1, material: 'GEARED MACHINE UNIT 4 PASSENGER', price: '55500' },
    { id: 2, material: 'GEARED MACHINE UNIT 6 PASSENGER', price: '55500' },
    { id: 3, material: 'GEARED MACHINE UNIT 8 PASSENGER', price: '71500' },
    { id: 4, material: 'GEARED MACHINE UNIT 10 PASSENGER', price: '80500' },
    { id: 5, material: 'GEARED MACHINE UNIT 13 PASSENGER', price: '112500' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      material: form.material,
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
      material: '',
      persons: '',
      mode: '',
      quantity: '',
      price: '',
    });
  };

  const handleEdit = (item) => {
    setForm({ ...form, material: item.material, price: item.price });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-gray-600" />
          Other Material Configuration
        </h2>
        <p className="text-sm text-gray-500">Manage and list other elevator materials.</p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ['Operator Type', 'operatorType', 'select', ['Auto', 'Manual']],
            ['Other Material', 'material', 'text'],
            ['Select Persons', 'persons', 'select', ['4', '6', '8', '10', '13', '15', '20']],
            ['Machine Mode', 'mode', 'select', ['GEARED', 'GEARLESS']],
            ['Quantity', 'quantity', 'text'],
            ['Price', 'price', 'text'],
          ].map(([label, name, type, options]) => (
            <div key={name} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-1/4 font-medium text-gray-700">{label}*</label>
              {type === 'select' ? (
                <select
                  required
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
                >
                  <option value="">Please Select</option>
                  {options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type="text"
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  placeholder={`Enter ${label}`}
                  className="w-full sm:w-3/4 border border-gray-300 rounded p-2 text-sm"
                />
              )}
            </div>
          ))}

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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Other Material List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Material</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.material}</td>
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
                    No materials added.
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
