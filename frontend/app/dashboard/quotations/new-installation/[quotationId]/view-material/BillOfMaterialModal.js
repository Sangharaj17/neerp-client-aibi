import { useState, useEffect, useRef } from "react";
import { groupAndSortMaterials } from "@/services/quotationApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const clean = (val) =>
  String(val)
    .replace(/[^\d.-]/g, "") // remove hidden unicode
    .trim();

function exportToPDF(rows, summary) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "A4",
  });

  // ------------------------------------------------------
  // 1. Table Headers + Table Rows
  // ------------------------------------------------------
  const tableColumns = [
    { header: "Material Name", dataKey: "name" },
    { header: "Quantity", dataKey: "qty" },
    { header: "Price", dataKey: "price" },
    // { header: "Vendor", dataKey: "vendor" },
    // { header: "Selected", dataKey: "selected" },
  ];

  // Convert rows → table-friendly format
  const tableRows = rows.map((r) => ({
    name: r.name,
    qty: r.qty,
    price: r.prices?.default ?? 0,
    vendor: r.vendorId || "—",
    selected: r.selected ? "Yes" : "No",
  }));

  // ------------------------------------------------------
  // 2. Draw Table
  // ------------------------------------------------------
  autoTable(doc, {
    head: [tableColumns.map((c) => c.header)],
    body: tableRows.map((r) => Object.values(r)),

    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [33, 150, 243], textColor: 255, halign: "center" },
    bodyStyles: { fontSize: 10 },
    styles: { halign: "center", cellPadding: 5 },
    margin: { left: 20, right: 20 },
  });

  // ------------------------------------------------------
  // 3. Summary Section under Table
  // ------------------------------------------------------
  const finalY = doc.lastAutoTable.finalY + 30; // space after table

  const summaryRows = [
    ["Customer Standard", summary.customerStandard],
    ["Basic Material Amount (Excl. GST)", `₹${clean(summary.amount.toFixed(2))}`],
    ["GST %", `${clean(summary.gstPercentage)}%`],
    ["GST Amount", `₹${clean(summary.gstAmount.toFixed(2))}`],
    ["Load %", `${clean(summary.loadPercentage)}%`],
    ["Load Amount", `₹${clean(summary.loadAmount.toFixed(2))}`],
    ["Final Quotation Amount", `₹${clean(summary.finalAmount.toFixed(2))}`],
  ];

  doc.setFontSize(14);
  doc.text("Quotation Summary", 20, finalY);

  autoTable(doc, {
    startY: finalY + 10,
    theme: "plain",
    body: summaryRows,
    styles: {
      fontSize: 11,
      cellPadding: 3,
      overflow: "linebreak", // wraps long text
    },
    margin: { left: 20, right: 20 },

    // Force left alignment for all columns
    columnStyles: {
      0: { halign: "left", fontStyle: "bold" },
      1: { halign: "left", cellWidth: 200 }, // fixed width to stop overflow
    },

    didParseCell(data) {
      data.cell.text = data.cell.text.map(t =>
        t.replace(/[^\x00-\x7F]/g, "")
      );
    }
  });


  // ------------------------------------------------------
  // 4. Save PDF
  // ------------------------------------------------------
  doc.save(`BOM_Lift_${Date.now()}.pdf`);
}

function exportToExcel(rows, summary) {
  // ---------------------------
  // 1. Convert table rows to Excel sheet format
  // ---------------------------
  const tableData = rows.map(r => ({
    "Material Name": r.name,
    "Quantity": r.qty,
    "Price": r.prices?.default ?? 0,
    // "Vendor": r.vendorId || "—",
    // "Selected": r.selected ? "Yes" : "No"
  }));

  const tableSheet = XLSX.utils.json_to_sheet(tableData, { origin: "A1" });

  // ---------------------------
  // 2. Add Summary Section BELOW Table
  // ---------------------------
  const summaryStartRow = tableData.length + 3;

  const summaryData = [
    ["Customer Standard", summary.customerStandard],
    ["Basic Material Amount (Excl. GST)", summary.amount],
    ["GST %", summary.gstPercentage],
    ["GST Amount", summary.gstAmount],
    ["Load %", summary.loadPercentage],
    ["Load Amount", summary.loadAmount],
    ["Final Quotation Amount", summary.finalAmount]
  ];

  summaryData.forEach((row, index) => {
    XLSX.utils.sheet_add_aoa(tableSheet, [row], {
      origin: `A${summaryStartRow + index}`
    });
  });

  // ---------------------------
  // 3. Create Workbook & Export
  // ---------------------------
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, tableSheet, "Bill Of Material");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    `BOM_Lift_${Date.now()}.xlsx`
  );
}


// Sample vendors
const VENDORS = [
  { id: 1, name: "Vendor A" },
  { id: 2, name: "Vendor B" },
  { id: 3, name: "Vendor C" },
];

export default function BillOfMaterialModal({ liftId, liftData, onClose }) {
  console.log(liftData?.selectedMaterials.length, "--------liftData-------->", liftData);

  if (liftData?.selectedMaterials && Array.isArray(liftData.selectedMaterials)) {
    liftData = {
      ...liftData,
      selectedMaterials: groupAndSortMaterials(liftData.selectedMaterials)
    };
  }

  console.log("Final Processed liftData:", liftData);

  const decodeMaterialName = (name) => {
    return name ? name.replace(/&amp;/g, '&') : '';
  };

  const initialRows = (() => {
    if (!liftData) return [];

    // 1. Materials from the 'selectedMaterials' array (using 'materials' based on your previous data)
    const materialArrayRows = (liftData.materials || liftData.selectedMaterials || []).map(item => ({
      id: item.id, // Primary unique ID for the row
      name: decodeMaterialName(item.materialDisplayName || item.materialName),
      qty: item.quantity || 1,
      // Map the single price into the expected 'prices' structure
      prices: { default: item.price || 0 },
      selected: true,
      vendorId: "",
      materialId: item.materialId, // Original material definition ID
      materialType: item.materialType,
    }));

    // 2. Additional specific material fields from liftData
    const additionalRows = [];

    // --- Guide Rail Item ---
    // if (liftData.guideRailName && liftData.guideRailPrice) {
    //   additionalRows.push({
    //     // Use a unique placeholder ID (e.g., negative ID or based on liftId/field name)
    //     // If 'liftData.guideRailId' exists, use it. Otherwise, use a synthetic ID.
    //     id: liftData.guideRailId || `guide-rail-${liftData.id}`, 
    //     name: liftData.guideRailName,
    //     qty: liftData.guideRailQuantity || 1, // Assume 1 if quantity field is missing
    //     prices: { default: liftData.guideRailPrice },
    //     selected: true,
    //     vendorId: "",
    //     materialId: liftData.guideRailMaterialId || null, // Optional
    //     materialType: 'GuideRail',
    //   });
    // }

    // 3. Combine and return the full list
    return materialArrayRows.concat(additionalRows);

  })();

  const [rows, setRows] = useState(initialRows);
  const [globalSelectedVendorId, setGlobalSelectedVendorId] = useState("");

  const [gstPercentage, setGstPercentage] = useState(liftData?.tax || 18);
  const [loadPercentage, setLoadPercentage] = useState(liftData?.loadPerAmt || 20);
  const [customerStandard, setCustomerStandard] = useState("MEDIUM");

  const allSelected = rows.length > 0 && rows.every((item) => item.selected);
  const someSelected = rows.some((item) => item.selected);

  const selectAllRef = useRef(null);

  const getItemPrice = (item) => {
    // 1. Check if the row object itself has the 'prices' structure (which we mapped from 'item.price')
    if (item.prices) {
      // If a vendor is selected, try to find that price, otherwise use the default (which is item.price)
      return item.prices[item.vendorId] || item.prices.default || 0;
    }

    // 2. Fallback: This path is for compatibility with the old logic if needed, 
    // but should be avoided if liftData is the single source of truth.
    const originalMaterial = allMaterials.find(mat => mat.id === item.materialId);
    if (originalMaterial && originalMaterial.prices) {
      return originalMaterial.prices[item.vendorId] || originalMaterial.prices.default || 0;
    }

    return 0;
  };

  // const amount = rows.reduce((sum, item) => {
  //   if (item.selected) {
  //     return sum + getItemPrice(item) * item.qty;
  //   }
  //   return sum;
  // }, 0);

  const amount = liftData?.totalAmountWithoutGST || 0;
  const gstAmount = liftData?.totalAmountWithoutLoad || amount * (gstPercentage / 100);
  const loadAmount = liftData?.totalAmount || gstAmount * (loadPercentage / 100);
  const finalAmount = liftData?.totalAmount || (amount + gstAmount + loadAmount);

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
            {/* <select
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
            </select> */}
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
                {/* <th className="p-2 border">Vendor</th> */}
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
                  {/* <td className="border p-1">
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
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- New Summary/Calculation Section --- */}
        {/* --- New Summary/Calculation Section --- */}
        <div className="pt-4 mt-4 border-t grid grid-cols-2 gap-y-2 gap-x-4 text-sm flex-shrink-0">

          {/* 2. Customer Standard (Optional, using current state) */}
          <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label className="font-semibold text-gray-700">Customer Standard:</label>
            {/* <input
              type="text"
              readOnly
              value={customerStandard}
              className="border-0 bg-gray-100 p-1 w-32 text-right"
            /> */}
            <div className="border-0 bg-gray-100 p-1 w-32 text-right rounded">
              {customerStandard}
            </div>
          </div>

          {/* 1. Basic Material Amount (totalAmountWithoutGST) */}
          <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label className="font-semibold text-gray-700">Basic Material Amount (Excl. GST):</label>
            {/* <input
              type="text"
              readOnly
              // 🚨 Display the material amount calculated from the table
              value={`₹${amount.toFixed(2)}`}
              className="border-0 bg-gray-100 p-1 w-32 text-right font-bold text-gray-800"
            /> */}
            <div className="border-0 bg-gray-100 p-1 w-32 text-right font-bold text-gray-800 rounded">
              ₹{amount.toFixed(2)}
            </div>
          </div>



          <hr className="col-span-2 border-gray-300 my-1" />

          {/* 3. GST % (Editable input reflects the rate from liftData) */}
          <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label htmlFor="gst-percent" className="font-semibold text-orange-600">GST Rate %:</label>
            <div className="flex items-center gap-1">
              <div className="border-0 bg-orange-50 p-1 w-32 text-right font-bold text-orange-700 rounded">
                {gstPercentage}
              </div>
              <span className="text-lg font-bold">%</span>
            </div>
            {/* <div className="flex items-center gap-1">
              <input
                id="gst-percent"
                type="number"
                readOnly
                value={gstPercentage}
                // onChange={(e) => setGstPercentage(Number(e.target.value))}
                className="border-0 bg-orange-50 p-1 w-32 text-right font-bold text-orange-700"
              />
              <span className="text-lg font-bold">%</span>
            </div> */}
          </div>

          {/* 4. GST Amount (Calculated based on Amount * GST %) */}
          <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label className="font-semibold text-orange-600">GST Amount:</label>
            {/* <input
              type="text"
              readOnly
              value={`₹${gstAmount.toFixed(2)}`}
              className="border-0 bg-orange-50 p-1 w-32 text-right font-bold text-orange-700"
            /> */}
            <div className="border-0 bg-orange-50 p-1 w-32 text-right font-bold text-orange-700 rounded">
              ₹{gstAmount.toFixed(2)}
            </div>
          </div>

          <hr className="col-span-2 border-gray-300 my-1" />

          {/* 5. Load % (Editable input reflects the rate from liftData) */}
          <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label htmlFor="load-percent" className="font-semibold text-red-600">Load Rate %:</label>
            {/* <div className="flex items-center gap-1">
              <input
                id="load-percent"
                type="number"
                readOnly
                value={loadPercentage}
                // onChange={(e) => setLoadPercentage(Number(e.target.value))}
                className="border-0 bg-red-50 p-1 w-32 text-right font-bold text-red-700"
              />
              <span className="text-lg font-bold">%</span>
            </div> */}
            <div className="flex items-center gap-1">
              <div className="border-0 bg-red-50 p-1 w-32 text-right font-bold text-red-700 rounded">
                {loadPercentage}
              </div>
              <span className="text-lg font-bold">%</span>
            </div>
          </div>

          {/* 6. Load Amount (Calculated based on Amount * Load %) */}
          <div className="flex justify-between items-center col-span-2 sm:col-span-1">
            <label className="font-semibold text-red-600">Load Amount:</label>
            {/* <input
              type="text"
              readOnly
              value={`₹${loadAmount.toFixed(2)}`}
              className="border-0 bg-red-50 p-1 w-32 text-right font-bold text-red-700"
            /> */}
            <div className="border-0 bg-red-50 p-1 w-32 text-right font-bold text-red-700 rounded">
              ₹{loadAmount.toFixed(2)}
            </div>
          </div>

          <hr className="col-span-2 border-blue-500 my-2" />

          {/* 7. Final Amount (Amount + GST Amount + Load Amount) */}
          <div className="flex justify-between items-center col-span-2">
            <label className="font-extrabold text-2xl text-blue-900">Final Quotation Amount:</label>
            {/* <input
              type="text"
              readOnly
              value={`₹${finalAmount.toFixed(2)}`}
              className="border-0 bg-blue-100 p-1 w-48 text-right font-extrabold text-2xl text-blue-900"
            /> */}
            <div className="border-0 bg-blue-100 p-1 w-48 text-right font-extrabold text-2xl text-blue-900 rounded">
              ₹{finalAmount.toFixed(2)}
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 flex-shrink-0">

          <button
            className="bg-green-600 text-white px-3 py-1.5 text-sm rounded hover:bg-green-700"
            onClick={() => exportToPDF(rows, {
              amount,
              gstPercentage,
              gstAmount,
              loadPercentage,
              loadAmount,
              finalAmount,
              customerStandard
            })}
          >
            Export to PDF
          </button>

          <button
            className="bg-green-600 text-white px-3 py-1.5 text-sm rounded hover:bg-green-700"
            onClick={() => exportToExcel(rows, {
              amount,
              gstPercentage,
              gstAmount,
              loadPercentage,
              loadAmount,
              finalAmount,
              customerStandard
            })}
          >
            Export to Excel
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-600"
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