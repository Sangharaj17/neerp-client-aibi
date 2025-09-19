import { useState, useEffect, useRef } from "react";

// Sample vendors
const VENDORS = [
  { id: 1, name: "Vendor A" },
  { id: 2, name: "Vendor B" },
  { id: 3, name: "Vendor C" },
];

// MODIFIED: allMaterials now includes vendor-specific prices or a default price
const allMaterials = [
  { id: 1, name: "LANDING LOCK SET...", prices: { default: 3000, "1": 2900, "2": 3100 } }, // Vendor A (id:1) might give a discount, Vendor B (id:2) slightly higher
  { id: 2, name: "CARGET ANGLE ONLY...", prices: { default: 1125, "1": 1100, "3": 1150 } }, // Vendor C (id:3) is a bit more expensive
  { id: 3, name: "CAR & COUNTER WEIGHT...", prices: { default: 40312.5, "2": 39500 } }, // Only Vendor B has a special price
  { id: 4, name: "MAGNET SQR SET", prices: { default: 279 } }, // No vendor specific price
  { id: 5, name: "DOOR FRAME", prices: { default: 5000, "1": 4900, "3": 5100 } },
  { id: 6, name: "CABIN WALLS", prices: { default: 15000, "2": 14500 } },
  { id: 7, name: "CEILING LIGHTS", prices: { default: 800 } },
  { id: 8, name: "FLOORING TILES", prices: { default: 1200, "1": 1180 } },
  { id: 9, name: "BUTTON PANEL", prices: { default: 2500, "3": 2600 } },
  { id: 10, name: "ROPES", prices: { default: 7000, "2": 6900 } },
  { id: 11, name: "CONTROLLER", prices: { default: 18000, "1": 17500 } },
  { id: 12, name: "SAFETY GEAR", prices: { default: 3500 } },
  { id: 13, name: "BUFFER", prices: { default: 900, "3": 880 } },
  { id: 14, name: "GUIDE RAILS", prices: { default: 6000, "2": 5900 } },
  { id: 15, name: "MOTOR", prices: { default: 25000, "1": 24000, "3": 25500 } },
  // NEW MATERIALS ADDED FROM THE IMAGE
  { id: 16, name: "DOOR SAFETY SENSOR ONLY FOR AUTOMATIC LIFT", prices: { default: 7500 } },
  { id: 17, name: "FINAL LIMIT CAMP 10FT", prices: { default: 1250 } },
  { id: 18, name: "JUNCTION BOX & CARTOP JUNCTION AND MAINTENANCE BOX", prices: { default: 3750 } },
  { id: 19, name: "PENCIL READ", prices: { default: 1000 } },
  { id: 20, name: "TARMİNAL PATA WITH G. CLIP BIG AND HARDWARE", prices: { default: 1128 } },
  { id: 21, name: "WIRE TIE", prices: { default: 125 } },
  { id: 22, name: "GEAR OIL 90 NO", prices: { default: 938 } },
  { id: 23, name: "COTTON WEASTE 1 KG", prices: { default: 125 } },
  { id: 24, name: "EARTH - WIRE BIG 3 KG GALVENISE", prices: { default: 125 } },
  { id: 25, name: "EARTHING BRACKET", prices: { default: 125 } },
  { id: 26, name: "CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE", prices: { default: 40312.5 } },
  { id: 27, name: "CABLE HENGER YELLOW", prices: { default: 564 } },
  { id: 28, name: "MAGNET SQR SET", prices: { default: 465 } },
  { id: 29, name: "PIT SWITCH BOX", prices: { default: 376 } },
  { id: 30, name: "TARMİNAL SWITCH O/S TYPE", prices: { default: 2250 } },
  { id: 31, name: "POWER WIRE FOR MOTOR 2.5 SQMM 4 CORE (6 MTR)", prices: { default: 875 } },
  { id: 32, name: "GREACE", prices: { default: 125 } },
  { id: 33, name: "CWT GUIDE CLIP SMALL WITH HARDWARE", prices: { default: 0 } },
  { id: 34, name: "EARTH - WIRE SMALL Â 0.5 MM", prices: { default: 406 } },
  { id: 35, name: "HARDWARE WITH FASTNER For G+4", prices: { default: 8500 } },
];

export default function BillOfMaterialModal({ liftId, onClose }) {
  const [rows, setRows] = useState(
    allMaterials.map((item) => ({
      ...item,
      qty: 1,
      selected: true, // Default to selected
      vendorId: "",
    }))
  );
  const [globalSelectedVendorId, setGlobalSelectedVendorId] = useState("");

  const [gstPercentage, setGstPercentage] = useState(18);
  const [loadPercentage, setLoadPercentage] = useState(20);
  const [customerStandard, setCustomerStandard] = useState("MEDIUM");

  const allSelected = rows.length > 0 && rows.every((item) => item.selected);
  const someSelected = rows.some((item) => item.selected);

  const selectAllRef = useRef(null);

  const getItemPrice = (item) => {
    const originalMaterial = allMaterials.find(mat => mat.id === item.id);
    if (!originalMaterial || !originalMaterial.prices) {
      return 0;
    }
    return originalMaterial.prices[item.vendorId] || originalMaterial.prices.default || 0;
  };

  const amount = rows.reduce((sum, item) => {
    if (item.selected) {
      return sum + getItemPrice(item) * item.qty;
    }
    return sum;
  }, 0);

  const gstAmount = amount * (gstPercentage / 100);
  const loadAmount = amount * (loadPercentage / 100);
  const finalAmount = amount + gstAmount + loadAmount;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const handleSelectAll = () => {
    const newSelectedState = !allSelected;
    setRows((currentRows) =>
      currentRows.map((r) => ({
        ...r,
        selected: newSelectedState,
        vendorId: newSelectedState
          ? globalSelectedVendorId || r.vendorId || ""
          : "",
      }))
    );
  };

  const handleGlobalVendorChange = (e) => {
    const newVendorId = e.target.value;
    setGlobalSelectedVendorId(newVendorId);

    setRows((currentRows) =>
      currentRows.map((r) => {
        if (r.selected) {
          return { ...r, vendorId: newVendorId };
        }
        return r;
      })
    );
  };

  const handleRowVendorChange = (idx, newVendorId) => {
    setRows((currentRows) => {
      const updatedRows = [...currentRows];
      updatedRows[idx] = { ...updatedRows[idx], vendorId: newVendorId };
      return updatedRows;
    });
  };

  const handleSelect = (idx) => {
    setRows((currentRows) => {
      const updatedRows = [...currentRows];
      const newSelectedState = !updatedRows[idx].selected;
      updatedRows[idx] = {
        ...updatedRows[idx],
        selected: newSelectedState,
        vendorId: newSelectedState
          ? globalSelectedVendorId || updatedRows[idx].vendorId || ""
          : "",
      };
      return updatedRows;
    });
  };

  const handleClose = () => {
    const selected = rows.filter((r) => r.selected);
    onClose({
      selectedMaterials: selected,
      amount: amount,
      gstPercentage: gstPercentage,
      gstAmount: gstAmount,
      finalAmount: finalAmount,
      customerStandard: customerStandard,
      loadPercentage: loadPercentage,
      loadAmount: loadAmount,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"> {/* Added p-4 for some padding */}
      <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6 flex flex-col max-h-[95vh]"> {/* Added max-h-[95vh] and flex-col */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0"> {/* flex-shrink-0 ensures it doesn't shrink */}
          <h4 className="text-lg font-semibold">
            Bill of Material - Lift {liftId}
          </h4>
          <div className="flex items-center gap-2">
            <select
              value={globalSelectedVendorId}
              onChange={handleGlobalVendorChange}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="">Apply Vendor to Selected</option>
              {VENDORS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <button className="text-gray-500 ml-2" onClick={handleClose}>
              ✖
            </button>
          </div>
        </div>
        {/* Changed from fixed max-h to flex-grow to occupy remaining space */}
        <div className="overflow-auto flex-grow">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="p-2 border">
                  <input
                    type="checkbox"
                    ref={selectAllRef}
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 border">Material Name</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => (
                <tr key={item.id} className={item.selected ? "" : "opacity-50"}>
                  <td className="border p-1 text-center">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleSelect(idx)}
                    />
                  </td>
                  <td className="border p-1">{item.name}</td>
                  <td className="border p-1">
                    {item.qty} Set{item.qty > 1 ? "s" : ""}
                  </td>
                  <td className="border p-1">
                    <span className="font-medium">₹{getItemPrice(item).toFixed(2)}</span>
                  </td>
                  <td className="border p-1">
                    <select
                      className="border rounded px-1 w-full"
                      value={item.vendorId}
                      onChange={(e) => handleRowVendorChange(idx, e.target.value)}
                      disabled={!item.selected}
                    >
                      <option value="">Select Vendor</option>
                      {VENDORS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- New Summary/Calculation Section --- */}
        <div className="pt-4 mt-4 border-t grid grid-cols-2 gap-y-2 gap-x-4 text-sm flex-shrink-0"> {/* flex-shrink-0 ensures it doesn't shrink */}
          {/* Amount */}
          <div className="flex gap-2 items-center col-span-2 sm:col-span-1">
            <label className="font-semibold">Amount:</label>
            <input
              type="text"
              readOnly
              value={amount.toFixed(2)}
              className="border-0 bg-gray-50 p-1 w-32 text-left"
            />
          </div>

          {/* GST % */}
          {/* <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label htmlFor="gst-percent" className="font-semibold">GST %:</label>
            <input
              id="gst-percent"
              type="number"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(Number(e.target.value))}
              className="border rounded p-1 w-32 text-right"
            />
          </div> */}

          {/* GST Amount */}
          <div className="flex gap-2 items-center col-span-2 sm:col-span-1">
            <label className="font-semibold">GST Amount:</label>
            <input
              type="text"
              readOnly
              value={gstAmount.toFixed(2)}
              className="border-0 bg-gray-50 p-1 w-32 text-left"
            />
          </div>

          {/* Final Amount */}
          <div className="flex gap-2 items-center col-span-2 sm:col-span-1">
            <label className="font-semibold">Final Amount:</label>
            <input
              type="text"
              readOnly
              value={finalAmount.toFixed(2)}
              className="border-0 bg-gray-50 p-1 w-32 text-left font-bold text-blue-700"
            />
          </div>

          {/* Customer Standard */}
          <div className="flex gap-2 items-center col-span-2 sm:col-span-1">
            <label className="font-semibold">Customer Standard:</label>
            <input
              type="text"
              readOnly
              value={customerStandard}
              className="border-0 bg-gray-50 p-1 w-32 text-left"
            />
          </div>

          {/* Load % */}
          <div className="flex gap-2 items-center col-span-2 sm:col-span-1">
            <label htmlFor="load-percent" className="font-semibold">Load %:</label>
            <input
              id="load-percent"
              type="number"
              value={loadPercentage}
              onChange={(e) => setLoadPercentage(Number(e.target.value))}
              className="border rounded p-1 w-32 text-left"
            />
          </div>

          {/* Load Amount */}
          <div className="flex gap-2 items-center col-span-2 sm:col-span-1">
            <label className="font-semibold">Load Amount:</label>
            <input
              type="text"
              readOnly
              value={loadAmount.toFixed(2)}
              className="border-0 bg-gray-50 p-1 w-32 text-left"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 flex-shrink-0"> {/* flex-shrink-0 */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="text-xs text-gray-500 pt-2 flex-shrink-0"> {/* flex-shrink-0 */}
          <span className="italic">
            Tip: Use the "Apply Vendor to Selected" dropdown to quickly assign a
            vendor to multiple checked materials. You can still change individual
            vendors below.
          </span>
        </div>
      </div>
    </div>
  );
}