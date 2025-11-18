"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReadableValue } from "./liftService";

// export default function PreviewModal({ previewData, onClose, fieldLabels = {}, initialOptions = {} }) {
export default function PreviewModal({
  previewData,
  onClose,
  fieldLabels = {},
  initialOptions = {},
}) {
  if (!previewData?.data) return null;

console.log("PreviewModal data:", previewData);

  //   const PREVIEW_SPEC_FIELDS = [
  //     // "id",
  //     "liftQuotationNo",
  //     "quotationMainId",
  //     "leadId",
  //     "leadName",
  //     // "leadTypeId",
  //     "leadDate",
  //     "combinedEnquiryId",
  //     "enquiryId",
  //     // "enquiryTypeId",
  //     "enqDate",
  //     // "liftType",
  //     "liftTypeName",
  //     // "typeOfLift",
  //     "typeOfLiftName",
  //     // "machineRoom",
  //     "machineRoomName",
  //     // "capacityType",
  //     "capacityTypeName",
  //     // "personCapacity",
  //     "personCapacityName",
  //     // "weight",
  //     "weightName",
  //     "floors",
  //     "stops",
  //     "openings",
  //     "floorDesignations",
  //     "floorSelectionLabels",
  //     // "floorSelectionIds",
  //     "carTravel",
  //     "speed",
  //     // "cabinType",
  //     "cabinTypeName",
  //     // "cabinSubType",
  //     "cabinSubTypeName",
  //     // "lightFitting",
  //     "lightFittingName",
  //     // "cabinFlooring",
  //     "cabinFlooringName",
  //     // "cabinCeiling",
  //     "cabinCeilingName",
  //     // "airType",
  //     "airTypeName",
  //     // "airSystem",
  //     // "airSystemName",
  //     // "carEntrance",
  //     "carEntranceName",
  //     // "carEntranceSubType",
  //     "carEntranceSubTypeName",
  //     // "landingEntranceSubType1",
  //     "landingEntranceSubType1Name",
  //     // "landingEntranceSubType2",
  //     "landingEntranceSubType2Name",
  //     "landingEntranceCount",
  //     "landingEntranceSubType2_fromFloor",
  //     "landingEntranceSubType2_toFloor",
  //     // "controlPanelType",
  //     "controlPanelTypeName",
  //     // "manufacture",
  //     // "controlPanelMake",
  //     "controlPanelMakeName",
  //     // "wiringHarness",
  //     "wiringHarnessName",
  //     // "guideRail",
  //     "guideRailName",
  //     // "bracketType",
  //     "bracketTypeName",
  //     // "ropingType",
  //     "ropingTypeName",
  //     // "lopType",
  //     "lopTypeName",
  //     // "copType",
  //     "copTypeName",
  //     "overhead",
  //     // "operationType",
  //     "operationTypeName",
  //     "machineRoomDepth",
  //     "machineRoomWidth",
  //     "shaftWidth",
  //     "shaftDepth",
  //     "carInternalWidth",
  //     "carInternalDepth",
  //     "carInternalHeight",
  //     "stdFeatureIds",
  //     "autoRescue",
  //     // "vfdMainDrive",
  //     "vfdMainDriveName",
  //     // "doorOperator",
  //     "doorOperatorName",
  //     // "mainMachineSet",
  //     "mainMachineSetName",
  //     // "carRails",
  //     "carRailsName",
  //     // "counterWeightRails",
  //     "counterWeightRailsName",
  //     // "wireRope",
  //     "wireRopeName",
  //     // "warrantyPeriod",
  //     "warrantyPeriodName",
  //     // "installationRuleId",
  //     "installationRuleName",
  //     "liftQuantity",
  //     "liftRate",
  //     "pwdIncludeExclude",
  //     "scaffoldingIncludeExclude",
  //     "totalAmount",
  //     "totalAmountWithoutGST",
  //     "totalAmountWithoutLoad",
  //     "isLiftRateManual",
  //     "commercialTotal",
  //     "commercialTaxAmount",
  //     "commercialFinalAmount",
  //     "tax",
  //     "loadPerAmt",
  //     "loadAmt",
  //     "ardPrice",
  //     "machinePrice",
  //     "governorPrice",
  //     "truffingPrice",
  //     "fastenerPrice",
  //     "installationAmount",
  //     "manualPrice",
  //     "cabinPrice",
  //     "lightFittingPrice",
  //     "cabinFlooringPrice",
  //     "cabinCeilingPrice",
  //     "airSystemPrice",
  //     "carEntrancePrice",
  //     "landingEntrancePrice1",
  //     "landingEntrancePrice2",
  //     "controlPanelTypePrice",
  //     "wiringHarnessPrice",
  //     "guideRailPrice",
  //     "bracketTypePrice",
  //     "wireRopePrice",
  //     "ropingTypePrice",
  //     "lopTypePrice",
  //     "copTypePrice",
  //     "pwdAmount",
  //     "bambooScaffolding",
  //     "ardAmount",
  //     "overloadDevice",
  //     "transportCharges",
  //     "otherCharges",
  //     "powerBackup",
  //     "fabricatedStructure",
  //     "electricalWork",
  //     "ibeamChannel",
  //     "duplexSystem",
  //     "telephonicIntercom",
  //     "gsmIntercom",
  //     "numberLockSystem",
  //     "thumbLockSystem",
  //     "truffingQty",
  //     "truffingType",
  //     "fastenerType",
  //     "pitDepth",
  //     "mainSupplySystem",
  //     "auxlSupplySystem",
  //     "signals",
  //     "quotationDate",
  //     "manualDetails",
  //     "commonDetails",
  //     "remarks",
  //     "createdAt",
  //     "updatedAt",
  //   ];



  // ✅ Define key–label pairs
  const PREVIEW_SPEC_FIELDS = [
    ["id", "ID"],
    ["liftQuotationNo", "Lift Quotation No"],
    ["quotationMainId", "Quotation Main ID"],
    ["leadId", "Lead ID"],
    ["leadName", "Lead Name"],
    ["leadDate", "Lead Date"],
    ["combinedEnquiryId", "Combined Enquiry ID"],
    ["enquiryId", "Enquiry ID"],
    ["enqDate", "Enquiry Date"],
    ["liftTypeName", "Lift Type"],
    ["typeOfLiftName", "Type of Lift"],
    ["machineRoomName", "Machine Room"],
    ["capacityTypeName", "Capacity Type"],
    ["personCapacityName", "Person Capacity"],
    ["weightName", "Weight"],
    ["floors", "Floors"],
    ["stops", "Stops"],
    ["openings", "Openings"],
    ["floorDesignations", "Floor Designations"],
    ["floorSelectionLabels", "Floor Selection Labels"],
    ["carTravel", "Car Travel"],
    ["speed", "Speed"],
    ["cabinTypeName", "Cabin Type"],
    ["cabinSubTypeName", "Cabin Sub Type"],
    ["lightFittingName", "Light Fitting"],
    ["cabinFlooringName", "Cabin Flooring"],
    ["cabinCeilingName", "Cabin Ceiling"],
    ["airTypeName", "Air Type"],
    ["carEntranceName", "Car Entrance"],
    ["carEntranceSubTypeName", "Car Entrance SubType"],
    ["landingEntranceSubType1Name", "Landing Entrance Type 1"],
    ["landingEntranceSubType2Name", "Landing Entrance Type 2"],
    ["landingEntranceCount", "Landing Entrance Count"],
    ["landingEntranceSubType2_fromFloor", "Landing Entrance Type 2 From Floor"],
    ["landingEntranceSubType2_toFloor", "Landing Entrance Type 2 To Floor"],
    ["controlPanelTypeName", "Control Panel Type"],
    ["controlPanelMakeName", "Control Panel Make"],
    ["wiringHarnessName", "Wiring Harness"],
    ["guideRailName", "Guide Rail"],
    ["bracketTypeName", "Bracket Type"],
    ["ropingTypeName", "Roping Type"],
    ["lopTypeName", "LOP Type"],
    ["copTypeName", "COP Type"],
    ["overhead", "Overhead"],
    ["operationTypeName", "Operation Type"],
    ["machineRoomDepth", "Machine Room Depth"],
    ["machineRoomWidth", "Machine Room Width"],
    ["shaftWidth", "Shaft Width"],
    ["shaftDepth", "Shaft Depth"],
    ["carInternalWidth", "Car Internal Width"],
    ["carInternalDepth", "Car Internal Depth"],
    ["carInternalHeight", "Car Internal Height"],
    ["stdFeatureIds", "Standard Features"],
    // ["autoRescue", "Auto Rescue"],
    ["vfdMainDriveName", "VFD Main Drive"],
    ["doorOperatorName", "Door Operator"],
    ["mainMachineSetName", "Main Machine Set"],
    ["carRailsName", "Car Rails"],
    ["counterWeightRailsName", "Counter Weight Rails"],
    ["wireRopeName", "Wire Rope"],
    ["warrantyPeriodName", "Warranty Period"],
    ["installationRuleName", "Installation Rule"],
    // ["liftQuantity", "Lift Quantity"],
    ["liftRate", "Lift Rate"],
    ["pwdIncludeExclude", "PWD Include/Exclude"],
    ["scaffoldingIncludeExclude", "Scaffolding Include/Exclude"],
    ["totalAmount", "Total Amount"],
    ["totalAmountWithoutGST", "Total Amount (Without GST)"],
    ["totalAmountWithoutLoad", "Total Amount (Without Load)"],
    ["isLiftRateManual", "Is Lift Rate Manual"],
    ["commercialTotal", "Commercial Total"],
    ["commercialTaxAmount", "Commercial Tax Amount"],
    ["commercialFinalAmount", "Commercial Final Amount"],
    ["tax", "Tax %"],
    ["loadPerAmt", "Load Per Amount"],
    ["loadAmt", "Load Amount"],
    // ["ardPrice", "ARD Price"],
    ["machinePrice", "Machine Price"],
    ["governorPrice", "Governor Price"],
    ["truffingPrice", "Truffing Price"],
    ["fastenerPrice", "Fastener Price"],
    ["installationAmount", "Installation Amount"],
    ["manualPrice", "Manual Price"],
    ["cabinPrice", "Cabin Price"],
    ["lightFittingPrice", "Light Fitting Price"],
    ["cabinFlooringPrice", "Cabin Flooring Price"],
    ["cabinCeilingPrice", "Cabin Ceiling Price"],
    ["airSystemPrice", "Air System Price"],
    ["carEntrancePrice", "Car Entrance Price"],
    ["landingEntrancePrice1", "Landing Entrance Price 1"],
    ["landingEntrancePrice2", "Landing Entrance Price 2"],
    ["controlPanelTypePrice", "Control Panel Type Price"],
    ["wiringHarnessPrice", "Wiring Harness Price"],
    ["guideRailPrice", "Guide Rail Price"],
    ["bracketTypePrice", "Bracket Type Price"],
    ["wireRopePrice", "Wire Rope Price"],
    ["ropingTypePrice", "Roping Type Price"],
    ["lopTypePrice", "LOP Type Price"],
    ["copTypePrice", "COP Type Price"],
    ["pwdAmount", "PWD Amount"],
    ["bambooScaffolding", "Bamboo Scaffolding"],
    ["ardAmount", "ARD Amount"],
    ["overloadDevice", "Overload Device"],
    ["transportCharges", "Transport Charges"],
    ["otherCharges", "Other Charges"],
    ["powerBackup", "Power Backup"],
    ["fabricatedStructure", "Fabricated Structure"],
    ["electricalWork", "Electrical Work"],
    ["ibeamChannel", "I-Beam Channel"],
    ["duplexSystem", "Duplex System"],
    ["telephonicIntercom", "Telephonic Intercom"],
    ["gsmIntercom", "GSM Intercom"],
    ["numberLockSystem", "Number Lock System"],
    ["thumbLockSystem", "Thumb Lock System"],
    ["truffingQty", "Truffing Quantity"],
    ["truffingType", "Truffing Type"],
    ["fastenerType", "Fastener Type"],
    ["pitDepth", "Pit Depth"],
    ["mainSupplySystem", "Main Supply System"],
    ["auxlSupplySystem", "Auxiliary Supply System"],
    ["signals", "Signals"],
    ["quotationDate", "Quotation Date"],
    ["manualDetails", "Manual Details"],
    ["commonDetails", "Common Details"],
    ["remarks", "Remarks"],
    // ["createdAt", "Created At"],
    ["updatedAt", "Updated At"],
  ];

  const { id, data } = previewData;

  // ✅ Build table rows using the label mapping
  const dataEntries = PREVIEW_SPEC_FIELDS.map(([key, label]) => {
    const rawValue = data[key];
    const displayValue =
      Array.isArray(rawValue)
        ? rawValue.join(", ")
        : typeof rawValue === "boolean"
          ? rawValue
            ? "Yes"
            : "No"
          : String(rawValue ?? "-");
    return [label, displayValue];
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-[450px] max-h-[85vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white hover:text-gray-800 transition"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 text-center shadow-sm">
              <h3 className="text-lg font-semibold tracking-wide">
                Lift Preview – #{id}
              </h3>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-y-auto p-2 max-h-[70vh]">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-gray-300 z-10 shadow-sm">
                  <tr>
                    <th className="p-2 text-left font-semibold text-gray-900 border-b border-gray-300">
                      Specification
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-900 border-b border-gray-300">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataEntries.map(([label, value]) => (
                    <tr
                      key={label}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="p-2 font-medium text-gray-700 capitalize">{label}</td>
                      <td className="p-2 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-3 text-center">
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



// export default function PreviewModal({ previewData, onClose, fieldLabels = {}, initialOptions = {} }) {
//   if (!previewData?.data) return null;

//   const PREVIEW_SPEC_FIELDS = [
//     // "id",
//     "liftQuotationNo",
//     "quotationMainId",
//     "leadId",
//     "leadName",
//     // "leadTypeId",
//     "leadDate",
//     "combinedEnquiryId",
//     "enquiryId",
//     // "enquiryTypeId",
//     "enqDate",
//     // "liftType",
//     "liftTypeName",
//     // "typeOfLift",
//     "typeOfLiftName",
//     // "machineRoom",
//     "machineRoomName",
//     // "capacityType",
//     "capacityTypeName",
//     // "personCapacity",
//     "personCapacityName",
//     // "weight",
//     "weightName",
//     "floors",
//     "stops",
//     "openings",
//     "floorDesignations",
//     "floorSelectionLabels",
//     // "floorSelectionIds",
//     "carTravel",
//     "speed",
//     // "cabinType",
//     "cabinTypeName",
//     // "cabinSubType",
//     "cabinSubTypeName",
//     // "lightFitting",
//     "lightFittingName",
//     // "cabinFlooring",
//     "cabinFlooringName",
//     // "cabinCeiling",
//     "cabinCeilingName",
//     // "airType",
//     "airTypeName",
//     // "airSystem",
//     // "airSystemName",
//     // "carEntrance",
//     "carEntranceName",
//     // "carEntranceSubType",
//     "carEntranceSubTypeName",
//     // "landingEntranceSubType1",
//     "landingEntranceSubType1Name",
//     // "landingEntranceSubType2",
//     "landingEntranceSubType2Name",
//     "landingEntranceCount",
//     "landingEntranceSubType2_fromFloor",
//     "landingEntranceSubType2_toFloor",
//     // "controlPanelType",
//     "controlPanelTypeName",
//     // "manufacture",
//     // "controlPanelMake",
//     "controlPanelMakeName",
//     // "wiringHarness",
//     "wiringHarnessName",
//     // "guideRail",
//     "guideRailName",
//     // "bracketType",
//     "bracketTypeName",
//     // "ropingType",
//     "ropingTypeName",
//     // "lopType",
//     "lopTypeName",
//     // "copType",
//     "copTypeName",
//     "overhead",
//     // "operationType",
//     "operationTypeName",
//     "machineRoomDepth",
//     "machineRoomWidth",
//     "shaftWidth",
//     "shaftDepth",
//     "carInternalWidth",
//     "carInternalDepth",
//     "carInternalHeight",
//     "stdFeatureIds",
//     "autoRescue",
//     // "vfdMainDrive",
//     "vfdMainDriveName",
//     // "doorOperator",
//     "doorOperatorName",
//     // "mainMachineSet",
//     "mainMachineSetName",
//     // "carRails",
//     "carRailsName",
//     // "counterWeightRails",
//     "counterWeightRailsName",
//     // "wireRope",
//     "wireRopeName",
//     // "warrantyPeriod",
//     "warrantyPeriodName",
//     // "installationRuleId",
//     "installationRuleName",
//     "liftQuantity",
//     "liftRate",
//     "pwdIncludeExclude",
//     "scaffoldingIncludeExclude",
//     "totalAmount",
//     "totalAmountWithoutGST",
//     "totalAmountWithoutLoad",
//     "isLiftRateManual",
//     "commercialTotal",
//     "commercialTaxAmount",
//     "commercialFinalAmount",
//     "tax",
//     "loadPerAmt",
//     "loadAmt",
//     "ardPrice",
//     "machinePrice",
//     "governorPrice",
//     "truffingPrice",
//     "fastenerPrice",
//     "installationAmount",
//     "manualPrice",
//     "cabinPrice",
//     "lightFittingPrice",
//     "cabinFlooringPrice",
//     "cabinCeilingPrice",
//     "airSystemPrice",
//     "carEntrancePrice",
//     "landingEntrancePrice1",
//     "landingEntrancePrice2",
//     "controlPanelTypePrice",
//     "wiringHarnessPrice",
//     "guideRailPrice",
//     "bracketTypePrice",
//     "wireRopePrice",
//     "ropingTypePrice",
//     "lopTypePrice",
//     "copTypePrice",
//     "pwdAmount",
//     "bambooScaffolding",
//     "ardAmount",
//     "overloadDevice",
//     "transportCharges",
//     "otherCharges",
//     "powerBackup",
//     "fabricatedStructure",
//     "electricalWork",
//     "ibeamChannel",
//     "duplexSystem",
//     "telephonicIntercom",
//     "gsmIntercom",
//     "numberLockSystem",
//     "thumbLockSystem",
//     "truffingQty",
//     "truffingType",
//     "fastenerType",
//     "pitDepth",
//     "mainSupplySystem",
//     "auxlSupplySystem",
//     "signals",
//     "quotationDate",
//     "manualDetails",
//     "commonDetails",
//     "remarks",
//     "createdAt",
//     "updatedAt",
//   ];

//   // const { id, data, fieldLabels = {} } = previewData;
//   const { id, data } = previewData;
//   console.log("initialOptions:", initialOptions);
//   console.log("fieldLabels:", PREVIEW_SPEC_FIELDS);
//   console.log("PreviewModal data:", previewData);

//   // const dataEntries = Object.entries(data).map(([key, value]) => {

//   const dataEntries = Object.entries(data)
//     .filter(([key]) => PREVIEW_SPEC_FIELDS.includes(key))
//     .map(([key, value]) => {

//       //const label = fieldLabels[key] || key;
//       // console.log("fieldLabels[key]:", key);
//       const label = fieldLabels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
//       // console.log("label:", label);

//       const displayValue = getReadableValue(key, value, data, initialOptions);

//       // const formattedValue = Array.isArray(value)
//       //   ? value.join(", ")
//       //   : typeof value === "boolean"
//       //     ? value
//       //       ? "Yes"
//       //       : "No"
//       //     : String(value ?? "");

//       // console.log(`Key: ${key}, Raw Value: ${value}, Display Value: ${displayValue}`);

//       const formattedValue = Array.isArray(displayValue)
//         ? displayValue.join(", ")
//         : typeof displayValue === "boolean"
//           ? displayValue
//             ? "Yes"
//             : "No"
//           : String(displayValue ?? "");

//       return [label, formattedValue];
//     });


//   console.log("dataEntries:", dataEntries);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
//       <div className="relative bg-white rounded shadow-md w-[400px] max-h-[80vh] flex flex-col">

//         <AnimatePresence>
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="relative bg-white rounded-2xl shadow-2xl w-[450px] max-h-[85vh] flex flex-col overflow-hidden"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 150, damping: 15 }}
//             >
//               {/* Close Button */}
//               <button
//                 onClick={onClose}
//                 className="absolute top-3 right-3 text-white hover:text-gray-800 transition"
//                 aria-label="Close"
//               >
//                 <X size={22} />
//               </button>

//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 text-center shadow-sm">
//                 <h3 className="text-lg font-semibold tracking-wide">
//                   Lift Preview – #{previewData?.id}
//                 </h3>
//               </div>

//               {/* Scrollable Table */}
//               <div className="overflow-y-auto p-2 max-h-[70vh] ">
//                 <table className="w-full text-sm border-collapse">
//                   <thead className="sticky top-0 bg-gray-300 z-10 shadow-sm">
//                     <tr>
//                       <th className="p-2 text-left font-semibold text-gray-900 border-b border-gray-300">
//                         Specification
//                       </th>
//                       <th className="p-2 text-left font-semibold text-gray-900 border-b border-gray-300">
//                         Value
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {dataEntries.map(([key, value]) => (
//                       <tr
//                         key={key}
//                         className="hover:bg-gray-50 transition-colors border-b border-gray-100"
//                       >
//                         <td className="p-2 font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, " $1")}
//                         </td>
//                         <td className="p-2 text-gray-600">
//                           {typeof value === "object"
//                             ? JSON.stringify(value, null, 2)
//                             : String(value || "-")}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>

//                 </table>
//               </div>


//               {/* Footer */}
//               <div className="border-t border-gray-200 bg-gray-50 p-3 text-center">
//                 <button
//                   onClick={onClose}
//                   className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         </AnimatePresence>

//       </div>
//     </div>
//   );
// }








// export default function PreviewModal({
//   previewData,
//   onClose,
//   fieldLabels = {},
//   initialOptions = {},
// }) {
//   if (!previewData?.data) return null;

//   const data = previewData.data;

//   // 🔹 Build a readable version of the data
//   const readableData = Object.fromEntries(
//     Object.entries(data).map(([key, value]) => {
//       // Skip null/empty values
//       if (value === null || value === "" || value === undefined) return [key, "—"];

//       // If there’s a dropdown list for this key in initialOptions
//       const list = initialOptions[key];
//       if (Array.isArray(list) && list.length > 0) {
//         const match = list.find((o) => String(o.id) === String(value));
//         return [key, match ? match.name || match.label || value : value];
//       }

//       // Default fallback
//       return [key, value];
//     })
//   );

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Preview Lift Data</h2>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 font-semibold"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Render all fields */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
//         {Object.entries(readableData).map(([key, value]) => (
//           <div key={key} className="flex flex-col">
//             <span className="text-sm font-semibold text-gray-600">
//               {fieldLabels[key] || key}
//             </span>
//             <span className="text-gray-800">{String(value)}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

