'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function CarDoorSubtype() {
  const [operatorType, setOperatorType] = useState('');
  const [doorType, setDoorType] = useState('');
  const [doorSubtype, setDoorSubtype] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);

  const [rows, setRows] = useState([
    { id: 1, name: 'IMPERFORATE MANUAL CABIN DOOR 700 CLEAR OPENING', price: 5800 },
    { id: 2, name: 'IMPERFORATE MANUAL CABIN DOOR 800 CLEAR OPENING', price: 5800 },
    { id: 3, name: 'IMPERFORATE MANUAL CABIN DOOR 900 CLEAR OPENING', price: 6500 },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doorSubtype.trim() || price === '') return;

    const newName = doorSubtype.toUpperCase();
    const newItem = { id: editId || Date.now(), name: newName, price: Number(price) };

    if (editId) {
      setRows(rows.map((r) => (r.id === editId ? newItem : r)));
      setEditId(null);
    } else {
      setRows([...rows, newItem]);
    }

    setDoorSubtype('');
    setPrice('');
  };

  const handleEdit = (id) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      setDoorSubtype(row.name);
      setPrice(row.price);
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
    if (editId === id) {
      setEditId(null);
      setDoorSubtype('');
      setPrice('');
    }
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Car Door Subtype
        </h2>
        <p className="text-sm text-gray-500">
          Manage and configure car door subtypes.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white  border border-gray-200 rounded-lg p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <select
            value={operatorType}
            onChange={(e) => setOperatorType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            required
          >
            <option value="">Select Operator Type</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>

          <select
            value={doorType}
            onChange={(e) => setDoorType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            required
          >
            <option value="">Select Car Door Type</option>
            <option value="imperforate">Imperforate</option>
            <option value="telescopic">Telescopic</option>
          </select>

          <input
            type="text"
            placeholder="Enter Car Door Subtype"
            value={doorSubtype}
            onChange={(e) => setDoorSubtype(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            required
          />

          <input
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            required
          />

          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className=" bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              {editId ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Car Door Subtype List
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">ID</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Subtype</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Edit</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{row.name}</td>
                    <td className="px-4 py-2 border border-gray-200">{row.price}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      <button
                        onClick={() => handleEdit(row.id)}
                        className="text-gray-700 hover:text-black"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      <button
                        onClick={() => handleDelete(row.id)}
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
                    No subtypes added.
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
