'use client';
import { useState } from 'react';
import { SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function GuideRail() {
  const [form, setForm] = useState({
    bracketType: '',
    floor: '',
    prize: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    { id: 1, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+1', prize: '6800' },
    { id: 2, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+2', prize: '6800' },
    { id: 3, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+3', prize: '6800' },
    { id: 4, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+4', prize: '6800' },
    { id: 5, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+5', prize: '6800' },
    { id: 6, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+6', prize: '6800' },
    { id: 7, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+7', prize: '6800' },
    { id: 8, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+8', prize: '6800' },
    { id: 9, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+9', prize: '6800' },
    { id: 10, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+10', prize: '6800' },
    { id: 11, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+11', prize: '6800' },
    { id: 12, bracketType: 'CAR & COUNTER WEIGHT GUIDE RAIL Á WITH HARDWARE 16 MM & 10 MM', floor: 'G+12', prize: '6800' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editId || Date.now(),
      bracketType: form.bracketType,
      floor: form.floor,
      prize: form.prize,
    };

    if (editId) {
      setData(data.map((d) => (d.id === editId ? newItem : d)));
      setEditId(null);
    } else {
      setData([...data, newItem]);
    }

    setForm({ bracketType: '', floor: '', prize: '' });
    setCurrentPage(1);
  };

  const handleEdit = (item) => {
    setForm({ bracketType: item.bracketType, floor: item.floor, prize: item.prize });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setData(data.filter((d) => d.id !== id));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Guide Rail - Car & Counter Weight
        </h2>
        <p className="text-sm text-gray-500">Manage guide rails and floor-based configurations.</p>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Bracket Type</label>
            <input
              required
              type="text"
              value={form.bracketType}
              onChange={(e) => setForm({ ...form, bracketType: e.target.value })}
              placeholder="Car Bracket Type"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Floor</label>
            <select
              required
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
            >
              <option value="">Select</option>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={`G+${i + 1}`}>{`G+${i + 1}`}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Prize</label>
            <input
              required
              type="number"
              value={form.prize}
              onChange={(e) => setForm({ ...form, prize: e.target.value })}
              placeholder="Prize"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
            />
          </div>
          <div className="text-center">
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
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Guide Rail List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-center">
              <tr>
                <th className="px-4 py-2 border border-gray-200">#</th>
                <th className="px-4 py-2 border border-gray-200">Bracket Type</th>
                <th className="px-4 py-2 border border-gray-200">Floor</th>
                <th className="px-4 py-2 border border-gray-200">Prize</th>
                <th className="px-4 py-2 border border-gray-200">Edit</th>
                <th className="px-4 py-2 border border-gray-200">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 text-center">
                    <td className="px-4 py-2 border border-gray-200">{indexOfFirst + idx + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.bracketType}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.floor}</td>
                    <td className="px-4 py-2 border border-gray-200">{item.prize}</td>
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
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 flex-wrap gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === i + 1
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
