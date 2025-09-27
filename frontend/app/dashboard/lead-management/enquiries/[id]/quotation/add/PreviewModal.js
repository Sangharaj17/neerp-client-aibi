"use client";

import { X } from "lucide-react";

export default function PreviewModal({ previewData, onClose }) {
  if (!previewData?.data) return null;

  const { id, data, fieldLabels = {} } = previewData;

  const dataEntries = Object.entries(data).map(([key, value]) => {
    const label = fieldLabels[key] || key;
    const formattedValue = Array.isArray(value)
      ? value.join(", ")
      : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value ?? "");
    return [label, formattedValue];
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="relative bg-white rounded shadow-md w-[400px] max-h-[80vh] flex flex-col">
        {/* Close Icon Top-Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-semibold mb-2 text-center pt-4">
          Preview for Lift {previewData.id}
        </h3>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-4 pb-4">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border-b border-gray-300">Specification</th>
                <th className="p-2 border-b border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {dataEntries.map(([key, value]) => (
                <tr key={key}>
                  <td className="p-2 border-b border-gray-200 font-medium">
                    {key}
                  </td>
                  <td className="p-2 border-b border-gray-200">
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
