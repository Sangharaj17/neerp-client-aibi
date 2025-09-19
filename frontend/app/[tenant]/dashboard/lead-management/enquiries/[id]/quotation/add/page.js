"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LiftModal from "@/app/[tenant]/dashboard/lead-management/enquiries/[id]/quotation/add/LiftModal";
import PreviewModal from "@/app/[tenant]/dashboard/lead-management/enquiries/[id]/quotation/add/PreviewModal";
import PreviewAllModal from "@/app/[tenant]/dashboard/lead-management/enquiries/[id]/quotation/add/PreviewAllModal";
import { toast } from "react-hot-toast";
//import { jwtDecode } from "jwt-decode";
import { getFilteredLeads } from "@/services/leadsApi";

export default function QuotationAddPage() {
  const { id, tenant } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);


  const [selectedLift, setSelectedLift] = useState(null);
  const [quotationDate, setQuotationDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [edition, setEdition] = useState("First");
  const [lead, setLead] = useState("");
  const [leads, setLeads] = useState([]);
  const [payload, setPayload] = useState(null);
  const [customer, setCustomer] = useState("");
  const [site, setSite] = useState("");
  const [combinedEnquiryId, setCombinedEnquiryId] = useState(0);

  const lead_Id = id;



  useEffect(() => {
    const saved = sessionStorage.getItem("quotationPayload");

    if (saved) {
      const pl = JSON.parse(saved);
      setPayload(pl);
      setCustomer(pl.customer);
      setSite(pl.site);
      setCombinedEnquiryId(pl.combinedEnquiryId);
    } else {
      toast.error("No quotation data found. Redirecting...");

      // ⏳ Give toast time to show before redirect
      setTimeout(() => {
        router.back();
        // Or router.push(`/${tenant}/dashboard/lead-management/enquiries`);
      }, 1000);
    }
  }, [router]);

  console.log("Quotation Payload:", payload);


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getFilteredLeads();

        if (data && data.length > 0) {
          setLeads(data); 

          const targetLead = data.find(lead => lead.leadId === lead_Id); 
          if (targetLead) {
            setLead(targetLead); 
          }
        }
        //console.log("************888888",data);
      } catch (err) {
        console.error("Failed to load leads:", err);
      }
    };

    fetchLeads();
  }, []);

  const [lifts, setLifts] = useState([
    { id: 1, saved: false, fullyFilled: false },
    { id: 2, saved: false, fullyFilled: false },
    { id: 3, saved: false, fullyFilled: false },
  ]);

  const [repeatSettings, setRepeatSettings] = useState(
    lifts.map((_, i) => ({
      checked: false,
      from: "",
    }))
  );

  const quotationPrice = lifts.reduce((acc, lift) => {
    if (!lift.data) return acc;
    // Assuming lift.data has a 'price' or calculate sum of items if nested
    // Here just sum a 'price' field if directly present:
    return acc + (lift.data.price || 0);
  }, 0);

  const openModal = (lift) => {
    setSelectedLift(lift);
    setModalOpen(true);
  };

  const openPreview = (lift) => {
    if (lift.data) {
      // setPreviewData({ id: lift.id, data: lift.data });
      setPreviewData({
        id: lift.id,
        data: formData,
        fieldLabels: { ...fieldLabels }, // pass a clone
      });
    } else {
      toast.error("Please fill quotation details first!");
    }
  };

  const handlePreviewAll = () => {
    // Check if all lifts have data before showing preview
    if (lifts.some((lift) => !lift.data)) {
      toast.error("Please fill all lift details before preview!");
      return;
    }
    setPreviewOpen(true);
  };

  const handleSave = (liftId, data, isValid, fieldLabels) => {
    if (!isValid) return;

    setLifts((prev) =>
      prev.map((l) =>
        l.id === liftId
          ? { ...l, saved: true, fullyFilled: isValid, data, fieldLabels }
          : l
      )
    );
    setModalOpen(false);
    toast.success("Quotation for Lift " + liftId + " saved successfully!");
  };

  const handleSaveAll = () => {
    const quotationPayload = {
      id: id,
      tenant: tenant,
      quotationDate: "22-07-2025",
      edition: "First",
      lead: searchParams.get("lead"),
      customer: searchParams.get("customer"),
      site: searchParams.get("site"),
      lifts: lifts.map((lift) => ({
        liftId: lift.id,
        ...lift.data,
      })),
    };

    console.log("Quotation Payload:", quotationPayload);

    // You can now POST this to your backend
    // fetch(`/api/quotation/save`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(quotationPayload),
    // }).then(res => ...)

    toast.success("Quotation data ready to be saved!");
  };

  const allLiftsFullyFilled = lifts.every((l) => l.fullyFilled);

  const handleRepeatChange = (liftIndex, field, value) => {
    setRepeatSettings((prev) => {
      const updated = [...prev];
      updated[liftIndex] = {
        ...updated[liftIndex],
        [field]: value,
        checked: value !== "", // enable checkbox and button if from is chosen
      };
      return updated;
    });
  };

  const handleRepeat = (liftIndex) => {
    const fromLiftNumber = Number(repeatSettings[liftIndex].from);
    if (!fromLiftNumber || fromLiftNumber >= lifts[liftIndex].id) {
      toast.error("Please select a valid lift number less than current lift.");
      return;
    }
    // Find the lift to copy from
    const fromLift = lifts.find((l) => l.id === fromLiftNumber);
    if (!fromLift || !fromLift.data) {
      toast.error(`Lift ${fromLiftNumber} has no data to copy.`);
      return;
    }
    // Copy data from fromLift to current lift
    setLifts((prev) =>
      prev.map((lift) =>
        lift.id === lifts[liftIndex].id
          ? {
            ...lift,
            data: { ...fromLift.data },
            fieldLabels: fromLift.fieldLabels
              ? { ...fromLift.fieldLabels }
              : undefined,
            saved: fromLift.saved,
            fullyFilled: fromLift.fullyFilled,
          }
          : lift
      )
    );
    toast.success(
      `Specification repeated from Lift ${fromLiftNumber} to Lift ${lifts[liftIndex].id}.`
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-left">Add Quotation</h2>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-center text-blue-600 mb-4">
          Quotation Information (Enquiry Id : {combinedEnquiryId})
        </h3>

        <div className="space-y-4 text-gray-800">
          {/* Quotation Date */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">
              Quotation Date<span className="text-red-500">*</span>:
            </label>
            <input
              type="date"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className="border p-1 rounded w-1/2"
            />
          </div>

          {/* Edition */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">Edition:</label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              className="border p-1 rounded w-1/2"
            />
          </div>

          {/* Select Lead */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">
              Select Lead<span className="text-red-500">*</span>:
            </label>
            <select
              value={lead || ""}
              onChange={(e) => setLead(e.target.value)}
              className="border p-1 rounded w-1/2"
            >
              <option value="">Select Lead</option>
              {leads.map((l) => (
                <option key={l.leadId} value={l.leadId}>
                  {l.leadCompanyName}
                </option>
              ))}
            </select>
          </div>

          {/* Customer - Read-only */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">Customer:</label>
            <input
              type="text"
              value={customer}
              readOnly
              className="border p-1 rounded w-1/2 bg-gray-100"
            />
          </div>

          {/* Customer Site - Read-only */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">Site:</label>
            <input
              type="text"
              value={site}
              readOnly
              className="border p-1 rounded w-1/2 bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="my-6 space-y-3">
        {lifts.map((lift, index) => (
          <div
            key={lift.id}
            className="border rounded p-2 flex justify-between items-center bg-white shadow-md w-3/4 mx-auto hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg text-gray-700">
                Lift {lift.id}
              </span>
              <span
                className={`text-sm px-2 py-1 rounded-full ${lift.fullyFilled
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {lift.fullyFilled ? "✅ Fully Saved" : "⚠️ Not Fully Filled"}
              </span>
            </div>
            {lift.id !== 1 && (
              <div className="mb-2 flex items-center space-x-2">
                <span className="font-semibold text-sm">
                  Repeat specification of Lift
                </span>
                <select
                  disabled={lifts[index].id === 1} // Disable for first lift (id=1)
                  value={repeatSettings[index]?.from || ""}
                  onChange={(e) =>
                    handleRepeatChange(index, "from", e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs w-24 bg-white cursor-pointer"
                  title="Select lift number to repeat from."
                >
                  <option value="">Select</option>
                  {lifts
                    .filter((l) => l.id < lifts[index].id)
                    .map((previousLift) => (
                      <option key={previousLift.id} value={previousLift.id}>
                        {previousLift.id}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRepeat(index)}
                  disabled={!repeatSettings[index]?.checked}
                  className={`px-3 py-1 rounded text-xs ${repeatSettings[index]?.checked
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  title="Copy specification from selected lift."
                >
                  Repeat
                </button>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => openModal(lift)}
                title="Add / Edit"
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  if (!lift.data) {
                    toast.error("Please fill quotation details first!");
                    return;
                  }
                  console.log("Lift Preview Data:", lift);
                  console.log("Field Labels:", lift.fieldLabels);
                  setPreviewData({
                    id: lift.id,
                    data: lift.data,
                    fieldLabels: lift.fieldLabels || {}, // ✅ important
                  });
                }}
              >
                👁️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center space-x-4 mt-6 max-w-7xl mx-auto px-4">
        <div className="text-lg font-semibold text-gray-700">
          Total Quotation Price: ₹ {quotationPrice.toLocaleString()}
        </div>
        <div className="flex space-x-4">
          <button
            disabled={!allLiftsFullyFilled}
            onClick={handleSaveAll}
            className={`px-4 py-2 rounded ${allLiftsFullyFilled
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
          >
            Save All Quotations
          </button>

          <button
            onClick={handlePreviewAll}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Preview All Quotation
          </button>
        </div>
      </div>

      {modalOpen && (
        <LiftModal
          lift={selectedLift}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {previewData && (
        <PreviewModal
          previewData={previewData}
          onClose={() => setPreviewData(null)}
        />
      )}

      {previewOpen && (
        <PreviewAllModal
          quotationInfo={{
            "Quotation Date": "22-07-2025",
            Edition: "First",
            Lead: searchParams.get("lead") || "N/A",
            Customer: searchParams.get("customer") || "N/A",
            Site: searchParams.get("site") || "N/A",
          }}
          lifts={lifts}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
