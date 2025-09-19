'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function CabinSubType() {
  const [form, setForm] = useState({
    cabinType: '',
    cabinSubType: '',
    capacityType: '',
    person: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      cabinSubType: 'CABIN M.S POWDER COATED REGULAR 4 PASSANGER',
      capacity: '04 Persons/272 Kg.',
      price: 23000,
    },
    {
      id: 2,
      cabinSubType: 'CABIN M.S POWDER COATED REGULAR 6 PASSANGER',
      capacity: '06 Persons/408 Kg.',
      price: 24500,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const weight = parseInt(form.person) * 68;
    const capacity =
      form.capacityType === 'Kg'
        ? `${weight} Kg.`
        : `${form.person} Persons/${weight} Kg.`;

    const newItem = {
      id: editId || Date.now(),
      cabinSubType: form.cabinSubType.toUpperCase(),
      capacity,
      price: form.price,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({
      cabinType: '',
      cabinSubType: '',
      capacityType: '',
      person: '',
      price: '',
    });
  };

  const handleEdit = (item) => {
    setForm({
      cabinType: '',
      cabinSubType: item.cabinSubType,
      capacityType: 'Persons',
      person: item.capacity.split(' ')[0],
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
          
          Cabin Subtype & Price Configuration
        </h2>
        <p className="text-sm text-gray-500">
          Manage cabin subtypes based on person & weight capacity.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700 text-right">
              Cabin Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.cabinType}
              onChange={(e) => setForm({ ...form, cabinType: e.target.value })}
              className="border  border-gray-300 rounded-md p-2 w-full sm:w-64 text-sm"
            >
              <option value="">Please Select</option>
              <option value="CABIN M.S POWDER COATED REGULAR">CABIN M.S POWDER COATED REGULAR</option>
              <option value="CABIN S.S MIRROR FINISH">CABIN S.S MIRROR FINISH</option>
              <option value="CABIN GLASS">CABIN GLASS</option>
            </select>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700 text-right">
              Cabin SubType <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.cabinSubType}
              onChange={(e) => setForm({ ...form, cabinSubType: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full sm:w-64 text-sm"
              placeholder="Cabin SubType"
            />
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700 text-right flex gap-2">
              Capacity Type <span className="text-red-500 ">*</span>
            </label>
            <div className="flex gap-4">
              {['Persons', 'Kg'].map((type) => (
                <label key={type} className="inline-flex items-center text-sm gap-1">
                  <input
                    type="radio"
                    name="capacityType"
                    value={type}
                    checked={form.capacityType === type}
                    onChange={(e) => setForm({ ...form, capacityType: e.target.value })}
                    required
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700 text-right">
              Select Persons <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.person}
              onChange={(e) => setForm({ ...form, person: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full sm:w-64 text-sm"
            >
              <option value="">Select</option>
              {[...Array(30)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* Row 5 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700 text-right">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full sm:w-64 text-sm"
              placeholder="Price"
            />
          </div>

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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Cabin SubType List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Sr.No.</th>
                <th className="px-4 py-2 border border-gray-200">Cabin SubType</th>
                <th className="px-4 py-2 border border-gray-200">Capacity</th>
                <th className="px-4 py-2 border border-gray-200">Price</th>
                <th className="px-4 py-2 border border-gray-200">Edit</th>
                <th className="px-4 py-2 border border-gray-200">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 text-center">
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200 text-left">{item.cabinSubType}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.capacity}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.price}</td>
                    <td className="px-4 py-2 border border-gray-200">
                      <button onClick={() => handleEdit(item)} className="text-gray-700 hover:text-black">
                        <Pencil size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      <button onClick={() => handleDelete(item.id)} className="text-gray-700 hover:text-black">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
