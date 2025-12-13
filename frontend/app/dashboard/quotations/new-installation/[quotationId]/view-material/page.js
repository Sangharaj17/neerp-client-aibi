"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from 'next/navigation';
import { Truck, DollarSign, List, CalendarCheck, Building } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import BillOfMaterialModal from "./BillOfMaterialModal";
import { getTenant } from '@/utils/tenant';
import { getQuotationById } from "@/services/quotationApi";
import { formatDateIN, formatCurrency } from "@/utils/common";

export default function ViewMaterialPage() {
  const tenant = getTenant();
  const params = useParams();
  const quotationMainId = params.quotationId;

  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lifts, setLifts] = useState([])

  const [bomPopup, setBomPopup] = useState({ open: false, liftId: null, liftData: null });
  const [overallGstPercentage, setOverallGstPercentage] = useState(18);


  useEffect(() => {
    // Ensure we have a valid ID to fetch
    if (!quotationMainId) {
      toast.error("Missing quotation ID.");
      setError("Missing quotation ID.");
      return;
    }

    const fetchQuotationData = async () => {
      // 1. Set Loading State
      setLoading(true);

      // 2. Show Loading Toast and capture its ID for dismissal/update
      let fetchToastId = toast.loading(`Loading Quotation #${quotationMainId}...`);

      try {
        const response = await getQuotationById(quotationMainId);

        if (response.success) {
          const quotationData = response.data;

          setQuotationData(quotationData);
          setLifts(quotationData.liftDetails);
          toast.success(`Quotation ${quotationData.quotationNo || quotationMainId} loaded successfully!`, {
            id: fetchToastId,
          });

        } else {
          setError(response.message || 'Failed to retrieve quotation details.');

          toast.error(response.message || 'Failed to retrieve quotation details.', {
            id: fetchToastId,
          });
        }

      } catch (err) {
        setError(err.message || 'An unexpected error occurred during fetch.');

        console.error('Unexpected error during fetch process:', err);

        toast.error('An unexpected error occurred. Please try again.', {
          id: fetchToastId,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationData();

  }, [quotationMainId]);

  // // Helper function to calculate a single lift's default amounts
  // const calculateDefaultLiftAmounts = () => {
  //   // This logic mimics the initial calculation in BillOfMaterialModal
  //   const initialRows = allMaterials.map((item) => ({
  //     ...item,
  //     qty: 1,
  //     selected: true,
  //     vendorId: "", // Default to no specific vendor, use default price
  //   }));

  //   // Helper function (copied from BillOfMaterialModal)
  //   const getItemPrice = (item) => {
  //     const originalMaterial = allMaterials.find(mat => mat.id === item.id);
  //     if (!originalMaterial || !originalMaterial.prices) {
  //       return 0;
  //     }
  //     return originalMaterial.prices[item.vendorId] || originalMaterial.prices.default || 0;
  //   };

  //   const defaultAmount = initialRows.reduce((sum, item) => {
  //     if (item.selected) {
  //       return sum + getItemPrice(item) * item.qty;
  //     }
  //     return sum;
  //   }, 0);

  //   const defaultGstPercentage = 18; // Default GST from BillOfMaterialModal
  //   const defaultLoadPercentage = 20; // Default Load from BillOfMaterialModal

  //   const defaultGstAmount = defaultAmount * (defaultGstPercentage / 100);
  //   const defaultLoadAmount = defaultAmount * (defaultLoadPercentage / 100);
  //   const defaultFinalAmount = defaultAmount + defaultGstAmount + defaultLoadAmount;

  //   return {
  //     totalAmount: defaultAmount, // This is the base material amount
  //     gstAmount: defaultGstAmount,
  //     loadAmount: defaultLoadAmount,
  //     finalAmount: defaultFinalAmount, // This includes the lift's individual GST and Load
  //     liftGstPercentage: defaultGstPercentage,
  //     liftLoadPercentage: defaultLoadPercentage,
  //   };
  // };

  // // useEffect to calculate default amounts for all lifts on initial load
  // useEffect(() => {
  //   const defaultAmounts = calculateDefaultLiftAmounts();
  //   setLifts((prevLifts) =>
  //     prevLifts.map((lift) => ({
  //       ...lift,
  //       ...defaultAmounts, // Apply the calculated default amounts to each lift
  //     }))
  //   );
  // }, []);

  // Function to update a specific lift's amounts after modal close
  const handleBomClose = (data) => {
    // setLifts((prevLifts) =>
    //   prevLifts.map((lift) =>
    //     lift.id === bomPopup.liftId
    //       ? {
    //         ...lift,
    //         totalAmount: data.amount, // Base material amount from modal
    //         gstAmount: data.gstAmount,
    //         loadAmount: data.loadAmount,
    //         finalAmount: data.finalAmount, // Final amount from modal (materials + modal's GST + modal's Load)
    //         liftGstPercentage: data.gstPercentage,
    //         liftLoadPercentage: data.loadPercentage,
    //       }
    //       : lift
    //   )
    // );
    setBomPopup({ open: false, liftId: null, liftData: null });
  };

  const {
    overallTotalMaterialAmount,
    overallTotalGstAmount,
    overallTotalLoadAmount,
    amountIncludingGST,
    gstBreakdown,
    loadBreakdown,
    floorDesignationsString,
    headerSummaryString,
  } = useMemo(() => {

    // --- Step 1: Initialize Accumulators ---
    let baseMaterialTotal = 0;
    let totalGstAmount = 0;
    let totalLoadAmount = 0;

    const gstBreakdown = {};
    const loadBreakdown = {};
    // String accumulator for floor designations
    const uniqueFloorDesignations = new Set();
    const uniqueLiftTypes = new Set();
    const uniqueLiftModelTypes = new Set();
    const uniqueTital = new Set();

    // --- Step 2: Iterate and Calculate ---
    lifts.forEach((lift, index) => {
      const baseAmount = lift.totalAmountWithoutGST || 0;
      const taxRate = lift.tax || 0;
      const loadRate = lift.loadPerAmt || 0;

      // 1. Accumulate Base Material Total
      baseMaterialTotal += baseAmount;

      // 2. Calculate GST Amount (if not already calculated in lift.gstAmount)
      const liftGstAmount = baseAmount * (taxRate / 100);
      totalGstAmount += liftGstAmount;

      // 3. Accumulate Load Amount (Use the provided amount from lift data)
      const liftLoadAmount = lift.loadAmt || 0;
      totalLoadAmount += liftLoadAmount;

      // 4. Build GST Breakdown
      const currentGstTotal = gstBreakdown[taxRate] || 0;
      gstBreakdown[taxRate] = currentGstTotal + liftGstAmount;

      // 5. Build Load Breakdown (if different rates exist)
      const currentLoadTotal = loadBreakdown[loadRate] || 0;
      loadBreakdown[loadRate] = currentLoadTotal + liftLoadAmount;

      if (lift.floorDesignations) {
        // liftFloorDetails.push(`Lift ${index + 1}: ${lift.floorDesignations}`);
        uniqueFloorDesignations.add(lift.floorDesignations);
      }

      if (lift.liftTypeName) {
        uniqueLiftTypes.add(lift.liftTypeName);
      }

      if (lift.typeOfLiftName) {
        uniqueLiftModelTypes.add(lift.typeOfLiftName);
      }

      uniqueTital.add(lift.floorDesignations + " " + lift.liftTypeName + " " + lift.typeOfLiftName)

    });

    // 6. Calculate Amount including GST (Total Material + Total GST)
    const amountInclGST = baseMaterialTotal + totalGstAmount;

    // Join the parts into a single string for display
    const finalDesignationsString = Array.from(uniqueFloorDesignations).join(', ');
    const liftTypeString = Array.from(uniqueLiftTypes).join(' & '); // Join Lift Types (e.g., Passenger & Goods)
    const liftModelTypeString = Array.from(uniqueLiftModelTypes).join(', '); // Join Model Types (e.g., MRL, Hydraulic)

    // Combine all strings into a descriptive header
    let summaryParts = [];
    if (liftTypeString) {
      // Example: "Passenger & Goods Lifts"
      summaryParts.push(`${liftTypeString} Lifts`);
    } else {
      summaryParts.push("Lift Quotation");
    }

    if (liftModelTypeString) {
      // Example: " (MRL, Hydraulic)"
      summaryParts.push(`(${liftModelTypeString})`);
    }

    if (finalDesignationsString) {
      // Example: " for floors G+29, B+1"
      summaryParts.push(`for floors ${finalDesignationsString}`);
    }

    // Join with spaces to create the final sentence/header
    const headerSummaryString = summaryParts.join(' ');

    return {
      overallTotalMaterialAmount: baseMaterialTotal,
      overallTotalGstAmount: totalGstAmount,
      overallTotalLoadAmount: totalLoadAmount,
      amountIncludingGST: amountInclGST,
      gstBreakdown: gstBreakdown,
      loadBreakdown: loadBreakdown,
      floorDesignationsString: finalDesignationsString,
      headerSummaryString: headerSummaryString,
    };
  }, [lifts]);

  // Overall Final Amount is now: Material + GST + Load
  const overallFinalAmount = amountIncludingGST + overallTotalLoadAmount;

  // if (loading) return <div className="p-4 text-center text-blue-600">Loading quotation data...</div>;
  // if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  if (quotationData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-5">

        {/* {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
          <p className="font-bold">Data Error:</p>
          <p>{error}</p>
        </div>
      )} */}

        {/* HEADER AND BACK BUTTON */}
        <div className="flex items-center justify-between sticky top-0 bg-white z-20 pb-4 ">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <List className="w-8 h-8 text-blue-600" /> Bill Of Material
          </h1>
          <Link
            href={`/dashboard/quotations/new-installation`}
            className="flex items-center space-x-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg transition duration-150 ease-in-out shadow-sm"
          >
            <span className="text-xl">⟵</span> <span>Back To List</span>
          </Link>
        </div>

        {/* LIFT SUMMARY & ORDER INFO (Elevated Card) - Integrated Order Date/Quotation No */}
        <div className="bg-white p-6 rounded-xl bg-gray-200 shadow-lg border border-gray-400 space-y-6">
          <div className="text-2xl text-center font-bold text-blue-700">
            {/* {floorDesignationsString || 'N/A'} GEARED Manual Elevator */}
            {headerSummaryString || 'Quotation Material Summary'}
          </div>

          <div className="grid md:grid-cols-4 gap-x-10 gap-y-4 text-sm text-gray-600">
            <InfoBox label="Customer Name" value={quotationData.customerName} icon={<List className="w-4 h-4" />} />
            <InfoBox label="Site Name" value={quotationData.siteName} icon={<Truck className="w-4 h-4" />} />
            <InfoBox label="Quotation No." value={quotationData.quotationNo} icon={<List className="w-4 h-4" />} />
            <InfoBox label="Order Date" value={formatDateIN(quotationData.leadDate)} icon={<CalendarCheck className="w-4 h-4" />} />
            <InfoBox label="Customer Address" value={quotationData.customerAdder || ""} />
            <InfoBox label="Site Address" value={quotationData.siteAdder || ""} />
            <InfoBox label="Floor Designations" value={floorDesignationsString || 'N/A'} icon={<Building className="w-4 h-4" />} />
          </div>
        </div>

        {/* MAIN CONTENT GRID: Lifts (Left) and Summary (Right) */}
        <div className="grid lg:grid-cols-4 gap-20 pt-4">

          {/* 1. LIFT OVERVIEW SECTION (Left Column - 2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <List className="w-5 h-5" /> Individual Lift Breakdown
            </h2>

            {lifts.map((lift, index) => (
              <div
                key={lift.id}
                className="flex items-center justify-between border border-gray-200 rounded-xl p-4 shadow-md bg-white w-full transition duration-300 hover:shadow-lg hover:border-blue-400"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {/* <span className="font-bold text-xl text-blue-600">Lift {lift.id}</span> */}
                  <span className="font-bold text-xl text-blue-600">Lift {index + 1}</span>
                  <span className="text-gray-500 text-sm font-medium ml-4">
                    Final Price: <span className="text-xl font-semibold text-green-700">{formatCurrency(lift.totalAmount).toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-lg shadow-blue-300/50"
                    onClick={() => {
                      // Find the specific lift object to pass to the modal
                      const selectedLift = lifts.find(l => l.id === lift.id);

                      // Pass the entire data object to the state
                      setBomPopup({ open: true, liftId: lift.id, liftData: selectedLift });
                    }}
                  >
                    Bill of Material
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. OVERALL PROJECT SUMMARY (Right Column - 1/3 width, Highlighted) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-center text-gray-800 border-b pb-2 flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" /> Project Summary
            </h2>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-xl space-y-4 sticky top-20">

              {/* 1. Basic Amount (Total Material Excl. GST) */}
              <SummaryLine
                label="Basic Material Amount (Excl. GST)"
                value={`${formatCurrency(overallTotalMaterialAmount).toLocaleString()}`}
                className="font-extrabold text-lg text-gray-800"
              />

              <hr className="border-blue-200" />

              {/* 2. GST Rate Breakdown: (MAPPING REMAINS THE SAME) */}
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-base block mb-2">
                  {Object.keys(gstBreakdown).length > 1 ? 'Individual GST Rate Breakdown:' : 'GST Amount Detail:'}
                </label>

                {Object.keys(gstBreakdown).map(rate => (
                  <div key={rate} className="flex justify-between items-center text-sm ml-4 p-2 bg-white rounded-md border border-gray-200 shadow-sm">
                    <span className="font-medium text-gray-600">GST @ {rate}%</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(gstBreakdown[rate]).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* 3. GST Amount */}
              {/* 🚨 Only show the 'Total GST Amount' line if there are multiple rates to sum up */}
              {Object.keys(gstBreakdown).length > 1 && (
                <>
                  <hr className="border-blue-200 mt-2" /> {/* Optional separator */}
                  <SummaryLine
                    label="3. Total GST Amount"
                    value={`${formatCurrency(overallTotalGstAmount).toLocaleString()}`}
                    className="text-xl text-orange-600 font-bold"
                  />
                </>
              )}
              {/* <SummaryLine
                label="Total GST Amount"
                value={`${formatCurrency(overallTotalGstAmount).toLocaleString()}`}
                className="text-xl text-orange-600 font-bold"
              /> */}

              {/* 4. Amount Including GST (Basic + GST Amount) */}
              <SummaryLine
                label="Amount Including GST (Total)"
                // 🚨 USING calculated amountIncludingGST
                value={`${formatCurrency(amountIncludingGST).toLocaleString()}`}
                className="font-bold text-xl text-gray-700"
              />

              <hr className="border-blue-200 mt-4" />

              {/* 5. Load/Margin % Breakdown (NEW SECTION) */}
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-base block mb-2">
                  {/* Change label based on the number of unique rates */}
                  {Object.keys(loadBreakdown).length > 1 ? 'Individual Load Rate Breakdown:' : 'Load Amount Detail:'}
                </label>

                {/* Map through the calculated breakdown object */}
                {Object.keys(loadBreakdown).map(rate => (
                  <div key={rate} className="flex justify-between items-center text-sm ml-4 p-2 bg-white rounded-md border border-gray-200 shadow-sm">
                    <span className="font-medium text-gray-600">Load @ {rate}%</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(loadBreakdown[rate]).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* 6. Load Amount */}
              {/* 🚨 Only show the 'Total Load/Margin Amount' line if there are multiple rates to sum up */}
              {Object.keys(loadBreakdown).length > 1 && (
                <SummaryLine
                  label="Total Load/Margin Amount"
                  // Using calculated overallTotalLoadAmount
                  value={`${formatCurrency(overallTotalLoadAmount).toLocaleString()}`}
                  className="text-xl text-red-600 font-bold"
                />
              )}

              {/* 7. Final Quotation Amount (Grand Total) */}
              <div className="border-t-2 border-blue-700 pt-4 mt-4 bg-blue-100 p-2 rounded-lg">
                <SummaryLine
                  label="Final Quotation Amount"
                  // 🚨 USING calculated overallFinalAmount
                  value={`${formatCurrency(overallFinalAmount).toLocaleString()}`}
                  className="font-extrabold text-4xl text-blue-900"
                />
              </div>
            </div>
          </div>

        </div> {/* End Main Content Grid */}


        {/* MODAL */}
        {bomPopup.open && (
          <BillOfMaterialModal
            liftId={bomPopup.liftId}
            liftData={bomPopup.liftData}
            onClose={handleBomClose}
          />
        )}
      </div>
    );

  }






  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  // Fallback if data is null after loading (e.g., initial null state)
  // return <div className="p-4 text-center text-gray-500">No quotation data available.</div>;

  if (!quotationData) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }
}

// Helper component for structured info display
const InfoBox = ({ label, value, icon }) => (
  <div className="flex items-center gap-2">
    <div className="text-blue-500">{icon}</div>
    <div>
      <strong className="text-gray-900 block font-medium">{label}:</strong>
      <span className="text-gray-600">{value}</span>
    </div>
  </div>
);

// Helper component for summary lines
const SummaryLine = ({ label, value, className = '' }) => (
  <div className="flex justify-between items-center">
    <label className="text-gray-700 font-medium">{label}</label>
    <div className={`text-right ${className}`}>
      {value}
    </div>
  </div>
);