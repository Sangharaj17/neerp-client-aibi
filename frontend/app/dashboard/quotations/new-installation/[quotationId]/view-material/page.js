// ViewMaterialPage.jsx
"use client";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import BillOfMaterialModal from "./BillOfMaterialModal";
import { useParams } from 'next/navigation'; 

// --- IMPORTANT: These constants are duplicated for initial calculation.
// --- In a real app, you'd import these from a central config/data file.
const VENDORS = [
  { id: 1, name: "Vendor A" },
  { id: 2, name: "Vendor B" },
  { id: 3, name: "Vendor C" },
];

const allMaterials = [
  { id: 1, name: "LANDING LOCK SET...", prices: { default: 3000, "1": 2900, "2": 3100 } },
  { id: 2, name: "CARGET ANGLE ONLY...", prices: { default: 1125, "1": 1100, "3": 1150 } },
  { id: 3, name: "CAR & COUNTER WEIGHT...", prices: { default: 40312.5, "2": 39500 } },
  { id: 4, name: "MAGNET SQR SET", prices: { default: 279 } },
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
// --- End of duplicated constants ---

export default function ViewMaterialPage(params) {
  // Use useParams to get the tenant from the URL in ViewMaterialPage
  const { tenant } = useParams();
  const { quotationId } = params; // quotationId can still come from params if it's a dynamic segment for this page

  const [lifts, setLifts] = useState([
    { id: 1, totalAmount: 0, gstAmount: 0, loadAmount: 0, finalAmount: 0 },
    { id: 2, totalAmount: 0, gstAmount: 0, loadAmount: 0, finalAmount: 0 },
    { id: 3, totalAmount: 0, gstAmount: 0, loadAmount: 0, finalAmount: 0 },
  ]);
  const [bomPopup, setBomPopup] = useState({ open: false, liftId: null });
  const [overallGstPercentage, setOverallGstPercentage] = useState(18);

  // Helper function to calculate a single lift's default amounts
  const calculateDefaultLiftAmounts = () => {
    // This logic mimics the initial calculation in BillOfMaterialModal
    const initialRows = allMaterials.map((item) => ({
      ...item,
      qty: 1,
      selected: true,
      vendorId: "", // Default to no specific vendor, use default price
    }));

    // Helper function (copied from BillOfMaterialModal)
    const getItemPrice = (item) => {
      const originalMaterial = allMaterials.find(mat => mat.id === item.id);
      if (!originalMaterial || !originalMaterial.prices) {
        return 0;
      }
      return originalMaterial.prices[item.vendorId] || originalMaterial.prices.default || 0;
    };

    const defaultAmount = initialRows.reduce((sum, item) => {
      if (item.selected) {
        return sum + getItemPrice(item) * item.qty;
      }
      return sum;
    }, 0);

    const defaultGstPercentage = 18; // Default GST from BillOfMaterialModal
    const defaultLoadPercentage = 20; // Default Load from BillOfMaterialModal

    const defaultGstAmount = defaultAmount * (defaultGstPercentage / 100);
    const defaultLoadAmount = defaultAmount * (defaultLoadPercentage / 100);
    const defaultFinalAmount = defaultAmount + defaultGstAmount + defaultLoadAmount;

    return {
      totalAmount: defaultAmount, // This is the base material amount
      gstAmount: defaultGstAmount,
      loadAmount: defaultLoadAmount,
      finalAmount: defaultFinalAmount, // This includes the lift's individual GST and Load
      liftGstPercentage: defaultGstPercentage,
      liftLoadPercentage: defaultLoadPercentage,
    };
  };

  // useEffect to calculate default amounts for all lifts on initial load
  useEffect(() => {
    const defaultAmounts = calculateDefaultLiftAmounts();
    setLifts((prevLifts) =>
      prevLifts.map((lift) => ({
        ...lift,
        ...defaultAmounts, // Apply the calculated default amounts to each lift
      }))
    );
  }, []);

  // Function to update a specific lift's amounts after modal close
  const handleBomClose = (data) => {
    setLifts((prevLifts) =>
      prevLifts.map((lift) =>
        lift.id === bomPopup.liftId
          ? {
              ...lift,
              totalAmount: data.amount, // Base material amount from modal
              gstAmount: data.gstAmount,
              loadAmount: data.loadAmount,
              finalAmount: data.finalAmount, // Final amount from modal (materials + modal's GST + modal's Load)
              liftGstPercentage: data.gstPercentage,
              liftLoadPercentage: data.loadPercentage,
            }
          : lift
      )
    );
    setBomPopup({ open: false, liftId: null });
  };

  // Calculate the overall sum of 'Final Amount' from all lifts for 'Overall Material Amount'
  // This matches your expectation that 275387.28 is the base for overall GST.
  const overallTotalMaterialAmount = lifts.reduce(
    (sum, lift) => sum + lift.finalAmount, // <--- CHANGED THIS TO sum + lift.finalAmount
    0
  );

  // Calculate the overall GST Amount based on overallGstPercentage
  const overallGstAmount =
    overallTotalMaterialAmount * (overallGstPercentage / 100);

  // Calculate the overall Final Amount
  const overallFinalAmount = overallTotalMaterialAmount + overallGstAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2 border-b">
        <h1 className="text-2xl font-bold">Bill Of Material</h1>
        {/* CORRECTED LINK HERE */}
        <Link
          href={`/dashboard/quotations/new-installation`}
          className="text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 font-medium px-4 py-2 rounded"
        >
          ⬅ Back To List
        </Link>
      </div>

      <div className="text-xl text-center font-semibold text-gray-800">
        G+5 GEARED Manual Elevator
      </div>

      <div className="grid md:grid-cols-3 gap-x-8 gap-y-3 bg-gray-50 p-4 rounded shadow-sm text-sm">
        <div>
          <strong>Customer Name:</strong> MR.PRAYUSH
        </div>
        <div>
          <strong>Site Name:</strong> BRAMAHA site Navi Mumbai
        </div>
        <div>
          <strong>Quotation No.:</strong> PEPL-2
        </div>
        <div>
          <strong>Customer Address:</strong> Mumbai
        </div>
        <div>
          <strong>Site Address:</strong> Navi Mumbai
        </div>
        <div>
          <strong>Floor Designations:</strong> G+29
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="font-medium text-sm">Order Date*</label>
        <div className="flex items-center border px-2 py-1 rounded text-sm">
          <input
            type="date"
            className="outline-none"
            defaultValue="2025-07-25"
          />
          <Calendar className="w-4 h-4 text-gray-500 ml-2" />
        </div>
      </div>

      <div>
        <div className="my-6 space-y-3">
          {lifts.map((lift) => (
            <div
              key={lift.id}
              className="flex items-center justify-between border rounded p-2 shadow-md bg-white w-3/4 mx-auto"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">Lift {lift.id}</span>
                <span className="text-gray-600 text-sm">
                  (Total: ₹{lift.finalAmount.toFixed(2)})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-sky-600 text-white px-3 py-1 rounded"
                  onClick={() => setBomPopup({ open: true, liftId: lift.id })}
                >
                  Bill of Material
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Total and GST Section */}
        <div className="border-t pt-4 mt-6 space-y-3">
          <h2 className="text-xl font-bold text-center">Overall Project Summary</h2>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 bg-gray-50 p-4 rounded shadow-sm text-sm">
            {/* Overall Total Amount */}
            <div className="flex items-center gap-2">
              <label className="font-semibold">Overall Material Amount:</label>
              <input
                type="text"
                readOnly
                value={overallTotalMaterialAmount.toFixed(2)}
                className="border-0 bg-transparent p-1 w-32 text-left font-bold"
              />
            </div>

            {/* Overall GST % */}
            <div className="flex gap-2 items-center">
              <label htmlFor="overall-gst-percent" className="font-semibold">
                Overall GST %:
              </label>
              <input
                id="overall-gst-percent"
                type="number"
                value={overallGstPercentage}
                onChange={(e) =>
                  setOverallGstPercentage(Number(e.target.value))
                }
                className="border rounded p-1 w-32 text-right"
              />
            </div>

            {/* Overall GST Amount */}
            <div className="flex gap-2 items-center">
              <label className="font-semibold">Overall GST Amount:</label>
              <input
                type="text"
                readOnly
                value={overallGstAmount.toFixed(2)}
                className="border-0 bg-transparent p-1 w-32 text-left"
              />
            </div>

            {/* Overall Final Amount */}
            <div className="flex gap-2 items-center">
              <label className="font-semibold">Overall Final Amount:</label>
              <input
                type="text"
                readOnly
                value={overallFinalAmount.toFixed(2)}
                className="border-0 bg-transparent p-1 w-32 text-left font-bold text-lg text-blue-700"
              />
            </div>
          </div>
        </div>

        {bomPopup.open && (
          <BillOfMaterialModal
            liftId={bomPopup.liftId}
            onClose={handleBomClose}
          />
        )}
      </div>
    </div>
  );
}