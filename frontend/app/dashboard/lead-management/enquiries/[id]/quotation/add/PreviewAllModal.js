import { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";

export default function PreviewAllModal({ quotationInfo, lifts, onClose }) {
  const [expandedLifts, setExpandedLifts] = useState({});

  const toggleLift = (id) => {
    setExpandedLifts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-4 rounded shadow-md w-[500px] max-h-[90vh] overflow-y-auto relative">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">
          Quotation Preview
        </h3>

        {/* Quotation Info */}
        <h4 className="text-lg font-semibold mb-1">Quotation Information</h4>
        <div className="text-sm mb-4">
          {Object.entries(quotationInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-semibold">{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>

        {/* Lift Sections */}
        <h4 className="text-lg font-semibold mb-2">Lifts Details</h4>
        {lifts.map((lift) => {
          const { id, data = {}, fieldLabels = {} } = lift;
          const isExpanded = expandedLifts[id];

          return (
            <div key={id} className="border p-2 rounded mb-4 text-sm">
              <button
                onClick={() => toggleLift(id)}
                className="flex items-center justify-between w-full bg-gray-300 p-2 rounded font-semibold text-base mb-2 focus:outline-none"
              >
                <span>Lift {id}</span>
                {isExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              {isExpanded && (
                <div className="max-h-[200px] overflow-y-auto">
                  <table className="w-full text-sm border-separate border-spacing-y-1">
                    <tbody>
                      {Object.entries(data).map(([key, value]) => {
                        const label = fieldLabels[key] || key;
                        const formattedValue = Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "boolean"
                          ? value
                            ? "Yes"
                            : "No"
                          : String(value ?? "");

                        return (
                          <tr key={key} className="border-none">
                            <td className="py-1 pr-2 font-medium align-top w-[50%] border-none">
                              {label}
                            </td>
                            <td className="py-1 align-top border-none">
                              {formattedValue}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
