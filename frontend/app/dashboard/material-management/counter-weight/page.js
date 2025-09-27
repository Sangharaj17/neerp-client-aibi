'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function CounterWeight() {
  const [form, setForm] = useState({
    name: '',
    capacityType: 'Persons',
    persons: '',
    quantity: '',
    price: '',
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [data, setData] = useState([
    { id: 1, name: 'COUNTER WEIGHT FOR 4 PASSENGER', persons: '04 Persons/272 Kg.', quantity: '392 kg', price: '5880' },
    { id: 2, name: 'COUNTER WEIGHT FOR 8 PASSENGER', persons: '08 Persons/408 Kg.', quantity: '588 kg', price: '8820' },
    { id: 3, name: 'COUNTER WEIGHT FOR 8 PASSENGER', persons: '08 Persons/544 Kg.', quantity: '784 kg', price: '11760' },
    { id: 4, name: 'COUNTER WEIGHT FOR 10 PASSENGER', persons: '10 Persons/680 Kg.', quantity: '980 kg', price: '14700' },
    { id: 5, name: 'COUNTER WEIGHT FOR 12 PASSENGER', persons: '12 Persons/816 Kg.', quantity: '1176 kg', price: '17640' },
    { id: 6, name: 'COUNTER WEIGHT FOR 13 PASSENGER', persons: '13 Persons/884 Kg.', quantity: '1274 kg', price: '19110' },
    { id: 7, name: 'COUNTER WEIGHT FOR 15 PASSENGER', persons: '15 Persons/1020 Kg.', quantity: '1470 kg', price: '22050' },
    { id: 8, name: 'COUNTER WEIGHT FOR 18 PASSENGER', persons: '18 Persons/1224 Kg.', quantity: '1764 kg', price: '26460' },
    { id: 9, name: 'COUNTER WEIGHT FOR 20 PASSENGER', persons: '20 Persons/1360 Kg.', quantity: '1960 kg', price: '29400' },
    { id: 10, name: 'COUNTER WEIGHT FOR 25 PASSENGER', persons: '25 Persons/1700 Kg.', quantity: '2450 kg', price: '36750' },
    { id: 11, name: 'COUNTER WEIGHT FOR 30 PASSENGER', persons: '30 Persons/2040 Kg.', quantity: '2940 kg', price: '44100' },
  ]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      name: form.name,
      persons: form.capacityType === 'Persons' ? `${form.persons} Persons` : `${form.persons} Kg.`,
      quantity: form.quantity,
      price: form.price,
    };

    if (editId) {
      setData(data.map((item) => (item.id === editId ? newItem : item)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({
      name: '',
      capacityType: 'Persons',
      persons: '',
      quantity: '',
      price: '',
    });
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      capacityType: item.persons.includes('Persons') ? 'Persons' : 'Kg',
      persons: item.persons.split(' ')[0],
      quantity: item.quantity,
      price: item.price,
    });
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
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Counter Weight
        </h2>
        <p className="text-sm text-gray-500">Add and manage elevator counter weight entries.</p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Counter Weight Name</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Counter Weight Name"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Capacity Type</label>
            <div className="flex gap-4 mt-2">
              <label className="text-sm text-gray-600">
                <input
                  type="radio"
                  value="Persons"
                  checked={form.capacityType === 'Persons'}
                  onChange={(e) => setForm({ ...form, capacityType: e.target.value })}
                  className="mr-1"
                />
                Persons
              </label>
              <label className="text-sm text-gray-600">
                <input
                  type="radio"
                  value="Kg"
                  checked={form.capacityType === 'Kg'}
                  onChange={(e) => setForm({ ...form, capacityType: e.target.value })}
                  className="mr-1"
                />
                Kg
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Select Persons</label>
            <select
              required
              value={form.persons}
              onChange={(e) => setForm({ ...form, persons: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Select</option>
              {[...Array(30)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <input
              required
              type="text"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="Quantity"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-end">
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">Counter Weight List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200">ID</th>
                <th className="px-4 py-2 border border-gray-200">Name</th>
                <th className="px-4 py-2 border border-gray-200">Passengers</th>
                <th className="px-4 py-2 border border-gray-200">Quantity</th>
                <th className="px-4 py-2 border border-gray-200">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 text-center">
                    <td className="px-4 py-2 border border-gray-200">{indexOfFirst + idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.name}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.persons}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.quantity}</td>
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
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
