'use client';
import React, { useState } from 'react';
import { Settings2, Pencil, Trash2 } from 'lucide-react';

export default function ControlPanelType() {
  const [form, setForm] = useState({
    operatorType: '',
    machineMode: '',
    controlPanelType: '',
    capacityType: '',
    passenger: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      controlPanelType:
        'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 4 PASSENGER 5 HP',
      passenger: '04 Persons/272 Kg.',
      price: '60000',
    },
    {
      id: 2,
      controlPanelType:
        'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 6 PASSENGER 5 HP',
      passenger: '06 Persons/408 Kg.',
      price: '48300',
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { controlPanelType, passenger, price } = form;
    if (!controlPanelType.trim() || !passenger.trim() || !price.trim()) return;

    const newData = {
      controlPanelType: controlPanelType.toUpperCase(),
      passenger,
      price,
    };

    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...newData } : item
        )
      );
      setEditId(null);
    } else {
      setData((prev) => [...prev, { id: Date.now(), ...newData }]);
    }

    setForm({
      operatorType: '',
      machineMode: '',
      controlPanelType: '',
      capacityType: '',
      passenger: '',
      price: '',
    });
  };

  const handleEdit = (id) => {
    const selected = data.find((d) => d.id === id);
    setForm({
      operatorType: '',
      machineMode: '',
      controlPanelType: selected.controlPanelType,
      capacityType: '',
      passenger: selected.passenger,
      price: selected.price,
    });
    setEditId(id);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    if (editId === id) {
      setForm({
        operatorType: '',
        machineMode: '',
        controlPanelType: '',
        capacityType: '',
        passenger: '',
        price: '',
      });
      setEditId(null);
    }
  };

  const fields = [
    {
      label: 'Operator Type',
      name: 'operatorType',
      type: 'select',
      options: ['', 'GEARED', 'GEARLESS'],
    },
    {
      label: 'Machine Mode',
      name: 'machineMode',
      type: 'select',
      options: ['', 'MANUAL', 'AUTOMATIC'],
    },
    {
      label: 'Control Panel Type',
      name: 'controlPanelType',
      type: 'text',
      placeholder: 'Control Panel Type',
    },
    {
      label: 'Capacity Type',
      name: 'capacityType',
      type: 'select',
      options: [
        '',
        '04 Persons/272 Kg',
        '06 Persons/408 Kg',
        '08 Persons/544 Kg',
        '10 Persons/680 Kg',
        '13 Persons/884 Kg',
        '15 Persons/1020 Kg',
        '20 Persons/1360 Kg',
        '25 Persons/1700 Kg',
        '30 Persons/2040 Kg',
      ],
    },
    {
      label: 'Select Passenger',
      name: 'passenger',
      type: 'select',
      options: [
        '',
        '04 Persons/272 Kg.',
        '06 Persons/408 Kg.',
        '08 Persons/544 Kg.',
        '10 Persons/680 Kg.',
        '13 Persons/884 Kg.',
        '15 Persons/1020 Kg.',
        '20 Persons/1360 Kg.',
        '25 Persons/1700 Kg.',
        '30 Persons/2040 Kg.',
      ],
    },
    {
      label: 'Price',
      name: 'price',
      type: 'text',
      placeholder: 'Price',
    },
  ];

  return (
    <div className=" min-h-screen p-6">
      <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-gray-600" />
        Add Control Panel Type
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {fields.map((field, index) => (
            <div key={index}>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
                >
                  {field.options.map((option, j) => (
                    <option key={j} value={option}>
                      {option || 'Please Select'}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              {editId ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Control Panel Type List
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2 border-gray-200 text-center">Sr.No.</th>
                  <th className="border px-4 py-2 border-gray-200 text-center">Control Panel Type</th>
                  <th className="border px-4 py-2 border-gray-200 text-center">Passenger</th>
                  <th className="border px-4 py-2 border-gray-200 text-center">Price</th>
                  <th className="border px-4 py-2 border-gray-200 text-center">Edit</th>
                  <th className="border px-4 py-2 border-gray-200 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr key={item.id} className="text-center hover:bg-gray-50">
                      <td className="border px-3 py-2 border-gray-200 text-center">{idx + 1}</td>
                      <td className="border px-3 py-2 border-gray-200 text-left">{item.controlPanelType}</td>
                      <td className="border px-3 py-2 border-gray-200 text-center">{item.passenger}</td>
                      <td className="border px-3 py-2 border-gray-200 text-center">{item.price}</td>
                      <td className="border px-3 py-2 border-gray-200 text-center">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-gray-600 hover:text-black"
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                      <td className="border px-3 py-2 border-gray-200 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-600 hover:text-black"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No control panel types added.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
