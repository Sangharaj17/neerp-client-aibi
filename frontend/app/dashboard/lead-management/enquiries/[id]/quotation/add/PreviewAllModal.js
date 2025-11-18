import { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreviewAllModal({ quotationInfo, lifts, onClose }) {
  const [expandedLifts, setExpandedLifts] = useState({});

  // ✅ Define your label mapping
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
    ["vfdMainDriveName", "VFD Main Drive"],
    ["doorOperatorName", "Door Operator"],
    ["mainMachineSetName", "Main Machine Set"],
    ["carRailsName", "Car Rails"],
    ["counterWeightRailsName", "Counter Weight Rails"],
    ["wireRopeName", "Wire Rope"],
    ["warrantyPeriodName", "Warranty Period"],
    ["installationRuleName", "Installation Rule"],
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
    ["updatedAt", "Updated At"],
  ];

  const toggleLift = (id) => {
    setExpandedLifts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-[550px] max-h-[90vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 text-center shadow-sm">
            <h3 className="text-lg font-semibold tracking-wide">Quotation Preview</h3>
          </div>

          {/* Quotation Info */}
          <div className="px-4 py-3 border-b border-gray-200 overflow-y-auto max-h-[25vh]">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Quotation Information</h4>
            <div className="text-sm grid grid-cols-2 gap-y-1 gap-x-5 divide-x divide-white">
              {Object.entries(quotationInfo || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium capitalize text-gray-700">{key}</span>
                  <span className="text-gray-600">{String(value ?? "-")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifts Section */}
          <div className="p-3 overflow-y-auto max-h-[60vh]">
            <h4 className="text-base font-semibold mb-2 text-gray-800">Lift Details</h4>

            {lifts.map((lift, index) => {
              const { data = {} } = lift;
              const isExpanded = expandedLifts[lift.enquiryId];
              return (
                <motion.div
                  key={lift.enquiryId ?? index}
                  className="border rounded-lg mb-3 overflow-hidden shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => toggleLift(lift.enquiryId)}
                    className="flex items-center justify-between w-full bg-gray-200 p-2 font-semibold text-base hover:bg-gray-300 transition"
                  >
                    <span>Lift #{lift.enquiryId}[{lift.liftQuotationNo}]</span>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="bg-white max-h-[220px] overflow-y-auto p-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <table className="w-full text-sm border-collapse">
                          <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr>
                              <th className="p-2 text-left text-gray-700 border-b border-gray-300 font-semibold">
                                Specification
                              </th>
                              <th className="p-2 text-left text-gray-700 border-b border-gray-300 font-semibold">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {PREVIEW_SPEC_FIELDS.map(([key, label]) => {
                              const value = data[key];
                              const displayValue = Array.isArray(value)
                                ? value.join(", ")
                                : typeof value === "boolean"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : String(value ?? "-");

                              return (
                                <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                  <td className="p-2 font-medium text-gray-700 capitalize">{label}</td>
                                  <td className="p-2 text-gray-600">{displayValue}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-3 text-center">
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium shadow"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
