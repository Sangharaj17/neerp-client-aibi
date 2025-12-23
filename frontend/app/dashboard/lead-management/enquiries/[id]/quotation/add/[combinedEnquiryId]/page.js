"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LiftModal from "@/app/dashboard/lead-management/enquiries/[id]/quotation/add/LiftModal";
import PreviewModal from "@/app/dashboard/lead-management/enquiries/[id]/quotation/add/PreviewModal";
import PreviewAllModal from "@/app/dashboard/lead-management/enquiries/[id]/quotation/add/PreviewAllModal";
import { toast } from "react-hot-toast";
//import { jwtDecode } from "jwt-decode";
import { getFilteredLeads, getLeadById, getEnquiryByLeadAndEnquiry } from "@/services/leadsApi";
import { saveQuotation, getMissingLifts, getExistingLifts, markLiftsAsSaved, getRevisionsLifts, createRevision, addMissingRevisedLift } from "@/services/quotationApi";
import { fieldLabels } from "../liftService";

///dashboard/lead-management/enquiries/1/quotation/add/2?action=revise&id=4
//1 is lead id, 2 is combined enquiry id, 4 is quotation main id

export default function QuotationAddPage() {
  // const { id, tenant } = useParams();
  // const { tenant, id, combinedEnquiryId } = useParams();

  const { id, combinedEnquiryId, } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const action = searchParams.get("action") || "";
  const quotaionMainId = searchParams.get("id") || "";


  const [tenant, setTenant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [selectedLift, setSelectedLift] = useState(null);

  const [quotationMainDetails, setQuotationMainDetails] = useState(null);

  const [quotationDate, setQuotationDate] = useState("");

  const [quotationMainId, setQuotationMainId] = useState(null);
  const [quotationLiftDetailId, setQuotationLiftDetailId] = useState(null);
  const [edition, setEdition] = useState("");
  const [lead, setLead] = useState("");
  const [leads, setLeads] = useState([]);
  const [payload, setPayload] = useState(null);
  const [customer, setCustomer] = useState("");
  const [site, setSite] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [enquiryTypeId, setEnquiryTypeId] = useState(null);
  const [enquiryTypeName, setEnquiryTypeName] = useState("");
  const [modalEnquiryId, setModalEnquiryId] = useState(null);
  const [status, setStatus] = useState(null);

  // const [combinedEnquiryId, setCombinedEnquiryId] = useState(0);
  const [lifts, setLifts] = useState([]);
  const [initialOptions, setInitialOptions] = useState({});

  const [refreshKey, setRefreshKey] = useState(0);

  const lead_Id = id;

  const [userId, setUserId] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTenant = localStorage.getItem("tenant");
      if (storedTenant) {
        setTenant(storedTenant);
        // Also load userId here since you need tenant for the key
        const storedUserId = localStorage.getItem(`${storedTenant}_userId`);
        if (storedUserId) {
          setUserId(storedUserId);
        }
      }
    }
  }, [id]);


  const formatLocalTime = (date) => {
    // 1. Get components, ensuring two digits (e.g., '03' instead of '3')
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // 2. Combine into the required format: YYYY-MM-DDTHH:MM
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchLead = async (leadIdParam) => {
    try {
      const leadIdToUse = leadIdParam || lead_Id;
      if (!leadIdToUse) return;

      const leadData = await getLeadById(leadIdToUse);
      console.log(leadData.leadId, "Lead Data:", leadData);

      setLeads(leadData ? [leadData] : []);
      setLead(leadData.leadId);
    } catch (err) {
      console.error("Failed to load lead:", err);
    }
  };

  const fetchRevisionsData = async () => {

    if (!lead_Id || !combinedEnquiryId) return;

    try {
      console.log("🔍 Fetching Revised Quotation...", { quotaionMainId, action });
      const revisionQuote = await getRevisionsLifts(quotaionMainId, action);

      if (!revisionQuote) {
        console.warn("⚠ No revision quotation found.");
        return;
      }

      console.log("📌 Revision Quotation Response:", revisionQuote);


      // Extract lift details + main details
      const { liftDetails = [], ...mainDetails } = revisionQuote;

      // ---------------------------
      // 1️⃣ SET MAIN DETAILS
      // ---------------------------
      setQuotationMainDetails(mainDetails);
      setCustomer(mainDetails.customerName);
      setSite(mainDetails.siteName);
      setEnquiryTypeId(mainDetails.enquiryTypeId);
      setEnquiryTypeName(mainDetails.enquiryTypeName);
      setCustomerId(mainDetails.customerId || null);
      setSiteId(mainDetails.siteId || null);
      fetchLead(mainDetails.leadId || lead_Id);

      setQuotationMainId(mainDetails.id);
      setEdition(mainDetails.edition ?? 0);

      const formattedDate = formatLocalTime(
        new Date(mainDetails.quotationDate || new Date())
      );
      setQuotationDate(formattedDate);
      setStatus(mainDetails.status);

      // ---------------------------
      // 2️⃣ PREPARE LIFT DETAILS
      // ---------------------------
      const formattedRevisedLifts = liftDetails.map((lift) => ({
        //...lift,
        id: lift.id,
        enquiryId: lift.enquiryId,
        saved: true,
        fullyFilled: true,
        source: "revision",
        data: lift,
        fieldLabels: null,
        quotationDate: formatLocalTime(
          new Date(lift.quotationDate || mainDetails.quotationDate || new Date())
        ),
      }));

      // Apply revised lifts
      setLifts(formattedRevisedLifts);

      console.log("🚀 Revision Lifts Loaded:", formattedRevisedLifts);

      toast.success(
        `Loaded ${formattedRevisedLifts.length} revised lift(s) successfully.`
      );

    } catch (err) {
      console.error("❌ Failed to load lifts:", err);
      toast.error("Failed to fetch revised quotation data.");
    }
  }

  const fetchExistingOrEnquiry = async () => {
    // Early exit if dependencies are missing
    if (!lead_Id || !combinedEnquiryId) return;

    try {
      console.log("🔍 Checking for existing quotation records...");

      // 1️⃣ Fetch data concurrently
      const [existingQuotationList, missingLifts] = await Promise.all([
        getExistingLifts(lead_Id, combinedEnquiryId),
        getMissingLifts(lead_Id, combinedEnquiryId),
      ]);

      // Ensure lists are arrays and extract the main quotation object
      const existingQuotation = Array.isArray(existingQuotationList) ? existingQuotationList : [];
      const firstQuotationMain = existingQuotation.length > 0 ? existingQuotation[0] : null;

      console.log("Existing Quotation:", existingQuotation);
      console.log("Missing Lift Details:", missingLifts);
      console.log("Existing Lifts Count:", existingQuotation.length);
      console.log("Missing Lifts Count:", missingLifts.length);

      // 2️⃣ Set Quotation Main Details and Date (Reduce/Simplify)
      let mainQuoteDetails = null;

      if (firstQuotationMain) {
        // Case 1: Existing quotation found
        const { liftDetails, ...quotationMain } = firstQuotationMain;
        mainQuoteDetails = quotationMain;

        // Set date using the existing date, or current date if missing
        const quoteDate = quotationMain.quotationDate
          ? new Date(quotationMain.quotationDate)
          : new Date();

        setQuotationDate(formatLocalTime(quoteDate));
        setEdition(quotationMain.edition || 0);
        setQuotationMainId(quotationMain.id || null);
      } else if (missingLifts && missingLifts.length > 0) {
        // Case 2: No existing quotation, but new lifts from enquiry found
        const storedPayload = sessionStorage.getItem("quotationPayload");
        mainQuoteDetails = storedPayload ? JSON.parse(storedPayload) : {};

        setQuotationDate(formatLocalTime(new Date()));
        setEdition(0);
        setQuotationMainId(null);
      }

      // Apply main details if found in either case
      if (mainQuoteDetails) {
        setQuotationMainDetails(mainQuoteDetails);
        setCustomer(mainQuoteDetails.customerName);
        setSite(mainQuoteDetails.siteName);
        setEnquiryTypeId(mainQuoteDetails.enquiryTypeId);
        setEnquiryTypeName(mainQuoteDetails.enquiryTypeName);
        setCustomerId(mainQuoteDetails.customerId || null);
        setSiteId(mainQuoteDetails.siteId || null);
        // Assuming fetchLead needs to be called with leadId from the found/parsed data
        fetchLead(mainQuoteDetails.leadId || lead_Id);
      }


      // 3️⃣ Merge both lift lists
      const mergedLifts = [

        // 1. Existing Lifts (from QuotationMain's liftDetails array)
        ...(firstQuotationMain?.liftDetails || []).map(liftDetail => ({
          // Spread all properties of the Lift Detail (QuotationLiftDetailResponseDTO)
          //...liftDetail,

          // Custom properties for UI state
          id: liftDetail.id,
          enquiryId: liftDetail.enquiryId,
          saved: true,
          fullyFilled: true,
          data: liftDetail, // Set the entire lift detail object as 'data' for easy access
          fieldLabels: null,
          source: "quotation",

          // Correctly format the date from the nested lift detail or fall back to main quote date
          quotationDate: formatLocalTime(
            new Date(
              liftDetail.quotationDate || // Use lift-specific date if available (preferred)
              firstQuotationMain.quotationDate || // Fallback to main quote date
              new Date() // Fallback to current date
            )
          ),
        })),

        // 2. Missing Lifts (from Enquiry)
        ...missingLifts.map(lift => ({
          ...lift,
          id: lift.id,
          enquiryId: lift.enquiryId,
          saved: false,
          fullyFilled: false,
          data: null,
          fieldLabels: null,
          source: "enquiry",
          // Use the quotationDate state that was just set above
          quotationDate,
        })),

      ];

      setLifts(mergedLifts);
      console.log("✅ Merged Lifts Set:", mergedLifts);

      // 4️⃣ Notifications
      const savedCount = existingQuotation.length;
      const missingCount = missingLifts.length;

      if (savedCount > 0 && missingCount > 0) {
        toast.success(`Loaded ${savedCount} saved and ${missingCount} new lifts.`);
      } else if (savedCount > 0) {
        toast.success("Loaded all lifts from quotation.");
      } else if (missingCount > 0) {
        toast.success("Loaded all lifts from enquiry.");
      }

    } catch (err) {
      console.error("❌ Failed to load lifts:", err);
      toast.error("Failed to fetch quotation or enquiry data.");
    }
  };


  useEffect(() => {
    if (!lead_Id || !combinedEnquiryId) return;
    console.log("Fetching data for Lead ID:", lead_Id, "Combined Enquiry ID:", combinedEnquiryId, "Action:", action, "Quotation Main ID:", quotaionMainId);
    const loadData = async () => {
      if (action === "revise" || action === "editRevision") {
        console.log("Action is revise/editRevision, fetching revision data...");
        fetchRevisionsData();
      } else if (action === "edit" || action === "") {
        fetchExistingOrEnquiry();
      }
    };

    loadData();
  }, [lead_Id, combinedEnquiryId, action, quotaionMainId, refreshKey]);




  useEffect(() => {
    console.log("=============lifts==============>", lifts);
  }, [lifts]);

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
    return acc + (lift.data.totalAmount || 0);
  }, 0);

  const openModal = (lift) => {
    console.log("====lift====openModal=======>", lift);
    setSelectedLift(lift);
    setModalOpen(true);
  };

  const openPreview = (lift) => {
    if (lift.data) {
      // setPreviewData({ id: lift.enquiryId, data: lift.data });
      setPreviewData({
        id: lift.enquiryId,
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

  // In Parent Component (QuotationAddPage)

  const handleResetLift = (liftId, initialLift) => {
    setLifts((prev) =>
      prev.map((lift) =>
        lift.enquiryId === liftId
          ? {
            ...initialLift, // Replace entire lift object
            saved: false,   // Optionally reset status fields
            fullyFilled: false,
          }
          : lift
      )
    );

    console.log("✅ Lift reset to:", initialLift);
    toast.success(`Lift ${liftId} reset to initial state.`);
  };

  /**
 * Recursively sets all Entity IDs within the QuotationMainRequestDTO to null.
 * This forces the backend (QuotationService) to create new database rows for the revision,
 * ensuring the new revision is fully decoupled from the original's nested data.
 * * @param {object} payload - The QuotationMainRequestDTO object.
 * @returns {object} The modified payload with all IDs set to null.
 */
  const prepareRevisionPayload = (payload, liftQuotationNo) => {
    console.log("🧹 Starting deep ID nulling for revision payload...");

    // 1. Nullify the main QuotationMain ID (optional, but safe)
    payload.id = null;

    // Helper function to nullify IDs in a list
    // Helper function to nullify IDs in a list
    const nullifyIds = (list) => {
      if (Array.isArray(list)) {
        list.forEach(item => {
          if (item) {
            // Nullify the primary key (id) to force new row
            if (item.id !== undefined) {
              item.id = null;
            }
            // 💡 NEW: Nullify the Foreign Key (quotationLiftDetailId) if present
            if (item.quotationLiftDetailId !== undefined) {
              item.quotationLiftDetailId = null;
            }
          }
        });
      }
    };

    // 2. Iterate through all lift details and nullify IDs recursively
    if (payload.liftDetails && payload.liftDetails.length > 0) {

      // Use map to ensure the list is updated, though mutation within forEach is also fine 
      // since we're modifying the objects in place.
      payload.liftDetails.forEach(liftDTO => {

        // 2.1. Nullify the QuotationLiftDetail ID
        // liftDTO.id = null;

        liftDTO.parentLiftId = liftDTO.id;

        console.log("Setting liftQuotationNo from", liftDTO.liftQuotationNo, "to", liftQuotationNo);
        liftDTO.liftQuotationNo = liftQuotationNo;

        // 2.2. Nullify all nested Material IDs (QuotationLiftMaterial / SelectedQuotationMaterial)
        nullifyIds(liftDTO.manualDetails);
        nullifyIds(liftDTO.commonDetails);
        nullifyIds(liftDTO.otherDetails);
        nullifyIds(liftDTO.selectedMaterials);
      });
    }

    console.log("✅ ID cleaning complete.");
    return payload;
  };

  const prepareEditRevisionForMissingPayload = (payload, liftQuotationNo) => {
    console.log("🛠 Preparing EDIT-REVISION payload for missing lift...");

    if (!payload || !payload.liftDetails) {
      console.warn("⚠ Payload missing liftDetails.");
      return payload;
    }

    // Helper function to nullify IDs in a list
    const nullifyIds = (list) => {
      if (Array.isArray(list)) {
        list.forEach(item => {
          if (item) {
            // Nullify the primary key (id) to force new row
            if (item.id !== undefined) {
              item.id = null;
            }
            // 💡 NEW: Nullify the Foreign Key (quotationLiftDetailId) if present
            if (item.quotationLiftDetailId !== undefined) {
              item.quotationLiftDetailId = null;
            }
          }
        });
      }
    };

    // 2. Iterate through all lift details and nullify IDs recursively
    if (payload.liftDetails && payload.liftDetails.length > 0) {

      // Use map to ensure the list is updated, though mutation within forEach is also fine 
      // since we're modifying the objects in place.
      payload.liftDetails.forEach(liftDTO => {

        liftDTO.parentLiftId = liftDTO.id; // Retain original lift ID in parentLiftId

        console.log("Setting liftQuotationNo from", liftDTO.liftQuotationNo, "to", liftQuotationNo);
        liftDTO.liftQuotationNo = liftQuotationNo;

        // 2.1. Nullify the QuotationLiftDetail ID
        liftDTO.id = null;

        // 2.2. Nullify all nested Material IDs (QuotationLiftMaterial / SelectedQuotationMaterial)
        nullifyIds(liftDTO.manualDetails);
        nullifyIds(liftDTO.commonDetails);
        nullifyIds(liftDTO.otherDetails);
        nullifyIds(liftDTO.selectedMaterials);


      });
    }

    console.log("✅ ID cleaning complete.");
    console.log("✅ Edit Revision Payload Prepared (missing Lifts Added):", payload);
    return payload;
  };

  const prepareEditRevisionPayload = (payload, parentLiftId, liftQuotationNo) => {
    console.log("🛠 Preparing EDIT-REVISION payload...");
    console.log("📌 Received parentLiftId:", parentLiftId);

    if (!payload || !payload.liftDetails) {
      console.warn("⚠ Payload missing liftDetails.");
      return payload;
    }

    // 2. Iterate through all lift details and set parentLiftId
    if (payload.liftDetails && payload.liftDetails.length > 0) {
      payload.liftDetails.forEach(liftDTO => {
        console.log("Setting parentLiftId from", liftDTO.parentLiftId, "to", parentLiftId);
        liftDTO.parentLiftId = parentLiftId; // Set the parent lift ID for revision tracking
        console.log("Setting liftQuotationNo from", liftDTO.liftQuotationNo, "to", liftQuotationNo);
        liftDTO.liftQuotationNo = liftQuotationNo; // Set the lift quotation number for revision tracking 
      });
    }

    console.log("✅ ID cleaning complete.");
    console.log("✅ Edit Revision Payload Prepared (No New Lifts Added already exists in db):", payload);
    return payload;
  };

  const handleSave = async (liftId, data, isValid, fieldLabels, options) => {
    const TOAST_ID = `save-quote-${liftId}`;
    if (!isValid) {
      toast.error(`Please complete all required fields for Lift ${liftId}`);
      return;
    }

    console.log({ id: TOAST_ID }, "🔹 Saving lift:", liftId, "with data:", data);


    const liftToUpdate = lifts.find((lift) => {
      const currentLiftId = lift.data?.id ?? lift.enquiryId;
      return currentLiftId === liftId;
    });

    // 1. Get the base payload from the current state/data
    let payloadForBackend = getPayload(
      liftId,
      data,
      liftToUpdate
    );

    // --- 🚨 Call the separate function for revision preparation ---
    // if (action === "revise") {
    //   payloadForBackend = prepareRevisionPayload(payloadForBackend);
    // }

    // if (action === "editRevision") {
    //   payloadForBackend = prepareEditRevisionPayload(payloadForBackend);
    // }
    // --- End revision preparation ---

    const originOfLift = payloadForBackend?.liftDetails?.[0]?.origin ?? "";


    try {
      toast.loading(`Saving quotation for Lift ${liftId}...`, { id: TOAST_ID });
      console.log(`Saving quotation for Lift ${liftId}...`);

      console.log(originOfLift, "<<<<<<<<----originOfLift---------action------------->>>>>>>>:", action);

      let response = null;
      // ✅ Call API service
      // if (action === "revise") {
      //   console.log("🚀 Calling createRevision for revision...");

      //   //response = await createRevision(payloadForBackend, quotaionMainId);
      //   console.log("💾 Backend response for Lift", liftId, response);
      // }

      // if (action === "editRevision" && originOfLift === "MISSING_FROM_PARENT") {


      //   const missingLiftToRevise = payloadForBackend.liftDetails[0];
      //   console.log("🚀 Calling addMissingRevisedLift for revision...", missingLiftToRevise);

      //   // response = await addMissingRevisedLift(missingLiftToRevise, quotaionMainId);

      //   console.log("💾 Backend response for Lift", liftId, response);
      // }

      // if (action === "" || (action === "editRevision" && originOfLift === "CURRENT_INCLUDED")) {
      //   console.log("🚀 Calling saveQuotation for new/edit...");
      //   // response = await saveQuotation(payloadForBackend);
      //   console.log("💾 Backend response for Lift", liftId, response);
      // }



      if (action === "revise") {
        console.log("🚀 Calling createRevision for revision...");


        const liftQuotationNo = liftToUpdate.data?.liftQuotationNo || null;
        // Creating a new revision
        payloadForBackend = prepareRevisionPayload(payloadForBackend, liftQuotationNo);
        console.log("📦 Payload ready for backend for revise:", payloadForBackend);
        response = await createRevision(payloadForBackend, quotationMainId);

      } else if (action === "editRevision") {
        // Editing an existing revision
        const originOfLift = payloadForBackend.liftDetails[0]?.origin;
        console.log("🚀 originOfLift", originOfLift);

        if (originOfLift === "MISSING_FROM_PARENT") {
          console.log("🚀 Calling addMissingRevisedLift for revision...");
          // This is a new lift added to revision
          const liftQuotationNo = liftToUpdate.data?.liftQuotationNo || null;
          payloadForBackend = prepareEditRevisionForMissingPayload(payloadForBackend, liftQuotationNo);
          console.log("📦 Payload ready for backend for edit revision missing lift :", payloadForBackend);
          const liftDetail = payloadForBackend.liftDetails[0];
          response = await addMissingRevisedLift(liftDetail, quotationMainId);
        } else {
          console.log("🚀 Calling saveQuotation for edit revision which are in db...");
          // Editing existing lift in revision
          const parentLiftId = liftToUpdate.data?.parentLiftId || null;
          const liftQuotationNo = liftToUpdate.data?.liftQuotationNo || null;
          payloadForBackend = prepareEditRevisionPayload(payloadForBackend, parentLiftId, liftQuotationNo);
          console.log("📦 Payload ready for backend for edit revision which are in db:", payloadForBackend);
          response = await saveQuotation(payloadForBackend);
        }

      } else {
        console.log("🚀 Calling saveQuotation new quotaion...");
        console.log("📦 Payload ready for backend for new quotation :", payloadForBackend);
        // New quotation OR Edit quotation
        response = await saveQuotation(payloadForBackend);
      }


      console.log("✅ Backend response for Lift", liftId);
      console.log("💾 Backend Response:", response);
      if (response?.success) {
        toast.success(`Quotation for Lift ${liftId} saved successfully!`, { id: TOAST_ID },);
        console.log("✅ Backend Response:", response);

        // // ⭐️ SUCCESS: Set saved: true and update lift data
        // setLifts((prev) =>
        //   prev.map((lift) =>
        //     lift.enquiryId === liftId
        //       ? { //...lift, 
        //         id: lift.id,
        //         enquiryId: lift.enquiryId,
        //         saved: true,
        //         fullyFilled: isValid,
        //         source: lift.source,
        //         data,
        //         fieldLabels,
        //       }
        //       : lift
        //   )
        // );

        // 🌀 Now re-fetch everything from DB for accurate state
        // console.log("🔄 Refreshing lifts from database after save...");
        // await fetchExistingOrEnquiry();

        // 🔄 If action is "revise", switch to "editRevision" mode with the new quotation ID
        if (action === "revise" && response.data?.id) {
          const newQuotationId = response.data.id;
          console.log("🔄 Switching from revise to editRevision mode with new quotation ID:", newQuotationId);

          // Update URL to editRevision mode
          const newUrl = `/dashboard/lead-management/enquiries/${id}/quotation/add/${combinedEnquiryId}?action=editRevision&id=${newQuotationId}`;
          router.replace(newUrl);

          toast.success("Revision created! Now in edit mode.", { duration: 3000 });
        } else {
          // For other actions, just refresh the data
          console.log("🔄 Triggering automatic refresh via useEffect...");
          setRefreshKey(prev => prev + 1);
        }


        // Update quotationMainId if backend returns it
        // if (response.data?.id) {
        //   setQuotationMainId(response.data.id);
        // }
      } else {
        toast.error(response?.message || "Failed to save quotation", { id: TOAST_ID },);

        setLifts((prev) =>
          prev.map((lift) =>
            lift.enquiryId === liftId
              ? {
                //...lift, 
                id: lift.id,
                enquiryId: lift.enquiryId,
                saved: false,
                fullyFilled: isValid,
                data,
                fieldLabels
              }
              : lift
          )
        );
      }
    } catch (error) {
      console.error("❌ Error saving quotation:", error);
      toast.error("Something went wrong while saving the quotation", { id: TOAST_ID },);

      setLifts((prev) =>
        prev.map((lift) =>
          lift.enquiryId === liftId
            ? {
              // ...lift, 
              id: lift.id,
              enquiryId: lift.enquiryId,
              saved: false,
              fullyFilled: isValid,
              data,
              fieldLabels
            }
            : lift
        )
      );
      console.log("Updated lift state after failed save.", lifts);
    } finally {
      setInitialOptions(options);
      setModalOpen(false);
    }
  };

  const getPayload = (liftId, data, lift) => {
    console.log("In payload-----");
    console.log("*******leads********", leads);
    console.log("previous lift :", lift);
    console.log("Saving lift:", liftId, "with new data:", data);
    console.log("Parent Lift ID from lift.data:", lift.data?.parentLiftId);

    if (lift.data != null) {
      console.log("previous lift selected materials:", lift.data.selectedMaterials);
    }

    console.log(action, "New lift selected materials:", data.selectedMaterials);

    const liftDetailId = lift.id || null;
    console.log("liftDetailId:", liftDetailId);

    const mappedSelectedMaterials = Array.isArray(data.selectedMaterials)
      ? data.selectedMaterials.map(material => ({
        ...material,
        // 💡 Set the ID of the parent lift detail here:
        id: liftDetailId === null ? null : material.id,
        quotationLiftDetailId: liftDetailId,
      }))
      : [];

    console.log("New lift selected materials 22222222222:", mappedSelectedMaterials);

    // const floorsCount =
    //   lift.noOfFloors?.name?.includes("G+")
    //     ? parseInt(lift.noOfFloors.name.replace("G+", "")) + 1
    //     : Number(lift.noOfFloors?.name) || null;

    return {
      id: quotationMainId, // Include if editing an existing quotation
      quotationNo: data.quotationNo || `QUOT-${combinedEnquiryId}`,
      quotationDate: quotationDate || new Date().toISOString(),

      leadId: lead || lead_Id || null,
      leadTypeId: leads[0].leadTypeId,
      leadDate: leads[0].leadDate,

      combinedEnquiryId: combinedEnquiryId,
      enquiryTypeId: enquiryTypeId,

      customerName: customer || "Unknown",
      customerId: customerId || null,
      siteName: site || "Unknown",
      siteId: siteId || null,

      edition: edition || 0,
      // totalBasicAmount: quotationPrice,
      // totalGSTAmount: 0,
      totalQuotationAmount: lifts.reduce((acc, l) => {
        const currentLiftId = l.data?.id ?? l.enquiryId;
        if (currentLiftId === liftId) {
          return acc + (Number(data.totalAmount) || 0);
        }
        return acc + (Number(l.data?.totalAmount) || 0);
      }, 0),
      status: "DRAFTED",
      remarks: data.remarks || "Draft but not saved",
      createdByEmployeeId: userId,

      liftDetails: [
        {
          id: lift.id || null, // Include if editing an existing lift
          liftQuotationNo: data.liftQuotationNo || `QUOT-${combinedEnquiryId}-${liftId}`, // Use data.quotationId
          quotationMainId: quotationMainId || null,

          // --- ENQUIRY/LEAD DETAILS ---
          leadId: lead || lead_Id || null, // Inherited from parent payload
          leadTypeId: leads[0].leadTypeId, // Inherited from parent scope
          leadDate: leads[0].leadDate, // Inherited from parent scope

          combinedEnquiryId: combinedEnquiryId || null, // Inherited from parent payload
          enquiryId: data.enquiryId || lift.enquiryId || null, // Use data.enquiryId
          enquiryTypeId: data.enquiryTypeId || lift.enquiryTypeId || enquiryTypeId || null, // Use data.enquiryTypeId
          enqDate: data.enqDate || lift.enqDate || quotationDate || null, // Use data.enqDate

          origin: data.origin || lift.origin || "",

          // ***************** LIFT SPECIFICATION **************
          // liftQuantity: Number(data.liftQuantity) || 1,
          liftTypeId: data.liftType || null,
          typeOfLiftId: data.typeOfLift || null,
          machineRoomId: data.machineRoom || null,
          capacityTypeId: data.capacityType || null,

          // Correctly map personCapacity or weight based on capacityType and capacityValue
          personCapacityId: data.capacityType === 1 ? data.capacityValue || null : null,
          weightId: data.capacityType === 2 ? data.capacityValue || null : null,


          floors: Number(data.floors) || 0, // Use data.floors 
          stops: Number(data.stops) || 0,
          openings: Number(data.openings) || 0,

          floorDesignations: data.floorDesignations || lift.floorsDesignation || "",
          floorSelectionIds: Array.isArray(data.floorSelections)
            ? data.floorSelections.map(id => id)
            : [],

          carTravel: Number(data.carTravel) || 0, // Use data.carTravel
          speed: data.speed || "", // Use data.speed

          cabinTypeId: Number(data.cabinType) || null,
          cabinSubTypeId: Number(data.cabinSubType) || null,
          lightFittingId: Number(data.lightFitting) || null,
          cabinFlooringId: Number(data.cabinFlooring) || null,
          cabinCeilingId: Number(data.cabinCeiling) || null,
          airTypeId: Number(data.airType) || null,
          airSystemId: Number(data.airSystem) || null,
          carEntranceId: Number(data.carEntrance) || null,
          carEntranceSubTypeId: Number(data.carEntranceSubType) || null,

          // --- LANDING ENTRANCES ---
          landingEntranceSubType1Id: Number(data.landingEntranceSubType1) || null,
          landingEntranceSubType2Id: Number(data.landingEntranceSubType2) || null,
          landingEntranceCount: Number(data.landingEntranceCount) || "",
          landingEntranceSubType2_fromFloor: Number(data.landingEntranceSubType2_fromFloor) || 0,
          landingEntranceSubType2_toFloor: Number(data.landingEntranceSubType2_toFloor) || 0,

          // ***************** CABIN DESIGN *****************
          controlPanelTypeId: Number(data.controlPanelType) || null,
          manufacture: data.manufacture || "",
          controlPanelMakeId: Number(data.controlPanelMake) || null,
          wiringHarnessId: Number(data.wiringHarness) || null,
          guideRailId: Number(data.guideRail) || null,
          bracketTypeId: Number(data.bracketType) || null,
          ropingTypeId: Number(data.ropingType) || null,
          lopTypeId: Number(data.lopType) || null,
          copTypeId: Number(data.copType) || null,
          overhead: Number(data.overhead) || 4800,
          operationTypeId: data.operationType || null,

          // --- DIMENSIONS ---
          machineRoomDepth: Number(data.machineRoomDepth) || 0,
          machineRoomWidth: Number(data.machineRoomWidth) || 0,
          shaftWidth: Number(data.shaftWidth) || 0,
          shaftDepth: Number(data.shaftDepth) || 0,
          carInternalWidth: Number(data.carInternalWidth) || 0,
          carInternalDepth: Number(data.carInternalDepth) || 0,
          carInternalHeight: Number(data.carInternalHeight) || 2100,

          // --- FEATURES ---
          // Note: stdFeatures is typically saved as an array of IDs, no need to map to {id} objects unless backend requires it
          stdFeatureIds: data.stdFeatures || [],
          autoRescue: data.autoRescue || false,
          vfdMainDriveId: Number(data.vfdMainDrive) || null,
          doorOperatorId: Number(data.doorOperator) || null,
          mainMachineSetId: Number(data.mainMachineSet) || null,
          carRailsId: Number(data.carRails) || null,
          counterWeightRailsId: Number(data.counterWeightRails) || null,
          wireRopeId: Number(data.wireRope) || null,

          warrantyPeriodId: data.warrantyPeriod ? Number(data.warrantyPeriod) : null,
          pwdIncludeExclude: data.pwdIncludeExclude || false,
          scaffoldingIncludeExclude: data.scaffoldingIncludeExclude || false,
          installationAmountRuleId: data.installationAmountRuleId || "",

          // ******************* PRICE FIELDS (Breakdowns) ************
          // cabinPrice: Number(data.cabinPrice) || 0,
          cabinPrice: Number(data.cabinSubTypePrice) || 0,
          lightFittingPrice: Number(data.lightFittingPrice) || 0,
          cabinFlooringPrice: Number(data.cabinFlooringPrice) || 0, // Added
          cabinCeilingPrice: Number(data.cabinCeilingPrice) || 0, // Added
          airSystemPrice: Number(data.airSystemPrice) || 0,
          carEntrancePrice: Number(data.carEntrancePrice) || 0, // Added
          landingEntrancePrice1: Number(data.landingEntrancePrice1) || 0,
          landingEntrancePrice2: Number(data.landingEntrancePrice2) || 0,

          controlPanelTypePrice: Number(data.controlPanelTypePrice) || 0,
          wiringHarnessPrice: Number(data.wiringHarnessPrice) || 0,
          guideRailPrice: Number(data.guideRailPrice) || 0,
          bracketTypePrice: Number(data.bracketTypePrice) || 0,
          wireRopePrice: Number(data.wireRopePrice) || 0,
          ropingTypePrice: Number(data.ropingTypePrice) || 0,
          lopTypePrice: Number(data.lopTypePrice) || 0,
          copTypePrice: Number(data.copTypePrice) || 0,

          // --- COMMERCIAL FIELDS (Costs/Charges) ---
          pwdAmount: Number(data.pwdAmount) || 0,
          bambooScaffolding: Number(data.bambooScaffolding) || 0,
          ardAmount: Number(data.ardAmount) || 0,
          overloadDevice: Number(data.overloadDevice) || 0,
          transportCharges: Number(data.transportCharges) || 0,
          otherCharges: Number(data.otherCharges) || 0,
          powerBackup: Number(data.powerBackup) || 0,
          fabricatedStructure: Number(data.fabricatedStructure) || 0,
          electricalWork: Number(data.electricalWork) || 0,
          ibeamChannel: Number(data.ibeamChannel) || 0,
          duplexSystem: Number(data.duplexSystem) || 0,
          telephonicIntercom: Number(data.telephonicIntercom) || 0,
          gsmIntercom: Number(data.gsmIntercom) || 0,
          numberLockSystem: Number(data.numberLockSystem) || 0,
          thumbLockSystem: Number(data.thumbLockSystem) || 0,
          tax: Number(data.tax) || 18,
          loadPerAmt: Number(data.loadPerAmt) || 0,
          loadAmt: Number(data.loadAmt) || 0,

          truffingQty: data.truffingQty || "",
          truffingType: data.truffingType || "",

          // --- INTERNAL PRICE CALCULATION / BREAKDOWNS ---
          machinePrice: Number(data.machinePrice) || 0,
          governorPrice: Number(data.governorPrice) || 0,
          truffingPrice: Number(data.truffingPrice) || 0,
          fastenerPrice: Number(data.fastenerPrice) || 0,
          installationAmount: data.installationAmount || "", // Stored as a string in formData
          manualPrice: Number(data.manualPrice) || 0,
          commonPrice: Number(data.commonPrice) || 0,
          otherPrice: Number(data.otherPrice) || 0,
          manualDetails: data.manualDetails || [],
          commonDetails: data.commonDetails || [],
          otherDetails: data.otherDetails || [],

          selectedMaterials: mappedSelectedMaterials || [],

          // --- TOTALS ---
          totalAmount: Number(data.totalAmount) || 0,
          totalAmountWithoutGST: Number(data.totalAmountWithoutGST) || 0,
          totalAmountWithoutLoad: Number(data.totalAmountWithoutLoad) || 0,
          liftRate: Number(data.liftRate) || 0,
          isLiftRateManual: data.isLiftRateManual || false,
          commercialTotal: Number(data.commercialTotal) || 0,
          commercialTaxAmount: Number(data.commercialTaxAmount) || 0,
          commercialFinalAmount: Number(data.commercialFinalAmount) || 0,

          // --- MISCELLANEOUS ---
          fastenerType: data.fastenerType || "",
          pitDepth: Number(data.pitDepth) || 1500,
          mainSupplySystem: data.mainSupplySystem || "415 Volts, 3 Phase, 50HZ A.C. (By Client)",
          auxlSupplySystem: data.auxlSupplySystem || "220/230 Volts, Single Phase 50Hz A.C. (By Client)",
          signals: data.signals || "Alarm Bell, Up/Dn. Direction Indicators at all landings",

          isSaved: false,
          isFinalized: false,

          // --- QUOTATION DATE ---
          quotationDate: data.quotationDate || lift.quotationDate || new Date().toISOString(),

          // // --- LAST FIELD (If backend needs it at the end) ---
          // projectStage: data.projectStage ? { id: data.projectStage.id } : (lift.projectStage ? { id: lift.projectStage.id } : null),

        },
      ],


    };
  };

  // Function to prepare and send a batch update request
  const handleSaveAll = async () => {
    const TOAST_ID = 'save-all-lifts';

    // status: "DRAFT",
    //   remarks: data.remarks || "Drafted but not saved",
    //   createdByEmployeeId: userId,
    //   liftDetails: [
    //     {
    //       id: lift.id || null, // Include if editing an existing lift
    //       liftQuotationNo: data.liftQuotationNo || `QUOT-${combinedEnquiryId}-${liftId}`, // Use data.quotationId
    //       quotationMainId: quotationMainId || null,

    console.log(quotationMainId + "----quotationMainId------------userId---" + userId);
    if (!quotationMainId || !userId) {
      toast.error("Quotation ID or UserId is missing. Cannot save.", { id: TOAST_ID });
      return;
    }

    console.log("Lifts to be saved as Draft:", lifts);
    const liftIds = lifts
      .filter(lift => lift.fullyFilled)
      .map(lift => lift.id || lift.data?.id) // use whichever ID represents the lift in DB
      .filter(Boolean); // remove undefined/null
    console.log("All fully filled lift IDs:", liftIds);

    if (liftIds.length === 0) {
      toast.info("All valid lifts are already finalized!", { id: TOAST_ID });
      return;
    }

    console.log("Lift Ids to be saved as Draft:", liftIds);

    try {
      toast.loading(`Saving ${liftIds.length} lift(s) ...`, { id: TOAST_ID });

      // 2. Pass the required data to the API wrapper
      const dataToSave = {
        liftIds: liftIds,
        quotationMainId: quotationMainId, // Main ID
        remarks: "Save",                  // Remarks from the input
        createdByEmployeeId: userId // Current user's ID
      };

      // const response = await markLiftsAsSaved(liftIds);;
      // console.log("💾 Backend response for saving all lifts:", response);

      const response = await markLiftsAsSaved(dataToSave);
      console.log("💾 Backend response for saving all lifts:", response);

      const resData = response;

      if (resData?.success) {
        toast.success(`✅ All lifts saved successfully!`, { id: TOAST_ID });
        // 4. Refresh data to reflect the new saved status
        // await fetchExistingOrEnquiry();
        router.push(`/dashboard/quotations/new-installation`);
      } else {
        toast.error(resData?.message || "Failed to save all lifts.", { id: TOAST_ID });
      }
    } catch (error) {
      console.error("❌ Error saving all lifts:", error);
      toast.error("A critical error occurred while attempting to save all lifts.", { id: TOAST_ID });
    } finally {
      toast.dismiss(TOAST_ID);
    }
  };

  const allLiftsFullyFilled = lifts.every((l) => l.fullyFilled);

  const handleRepeatChange = (liftIndex, field, value) => {
    console.log("Repeat Settings Change:", { liftIndex, field, value });
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
    // 1. Identify Target and Source Lifts
    const targetLift = lifts[liftIndex];
    // We use the numeric enquiryId directly for comparison and state tracking
    const targetEnquiryId = targetLift.enquiryId;

    const fromLiftNumber = Number(repeatSettings[liftIndex].from);

    // 2. Validation and Error Handling (Restored)

    // Validate if a valid source lift number was entered
    if (!fromLiftNumber) {
      toast.error("Please select a lift number to copy from.");
      return;
    }

    // Validate if the source lift number is less than the current lift number
    if (fromLiftNumber >= targetEnquiryId) {
      toast.error("Please select a valid lift number that is less than the current lift.");
      return;
    }

    // Find the source lift
    const fromLift = lifts.find((l) => l.enquiryId === fromLiftNumber);

    // Validate if the source lift exists and has saved data
    if (!fromLift || !fromLift.data) {
      toast.error(`Lift ${fromLiftNumber} has no data to copy.`);
      return;
    }

    // --- NEW LOGIC PREPARATION ---
    // Get the selected materials from the target lift (if they exist)
    const targetSelectedMaterials = targetLift.data?.selectedMaterials || [];
    // --- END NEW LOGIC PREPARATION ---

    // 3. Perform the Main State Update (Cleansing IDs)
    setLifts((prev) => {
      const newLiftsArray = prev.map((lift) => {
        // Check if this is the lift we are updating
        if (lift.enquiryId === targetEnquiryId) {

          const isTargetLiftSaved = !!lift.data;

          // 3a. Preserve the unique identifying data of the target lift
          const preservedUniqueData = {
            id: lift.data?.id || null, // ID of the target lift's main data entry (if previously saved)
            liftQuotationNo: lift.data?.liftQuotationNo || null,
            quotationNo: lift.data?.quotationNo || null,
            enquiryId: lift.enquiryId,
            parentLiftId: lift.data?.parentLiftId || null, // Preserve parent lift ID for revision tracking
            origin: lift.data?.origin || null,
            quotationMainId: lift.data?.quotationMainId || null,
          };

          // 3b. Destructure and get data fields from the source lift (fromLift)
          const { id, enquiryId, liftQuotationNo, isSaved, isFinalized, quotationDate, data, ...restFromLift } = fromLift;
          // Capture selectedMaterials and other data fields from the source lift's data
          const { id: sourceDataId, enquiryId: sourceDataEnquiryId, quotationNo: sourceDataQuotationNo, liftQuotationNo: sourceDataLiftQuotationNo, selectedMaterials, ...restData } = data || {};

          // 3c. Deep Cleansing: Remove/Preserve database-managed IDs from selectedMaterials
          const sourceMaterials = selectedMaterials || [];

          const cleanedMaterials = sourceMaterials.map(material => {

            // --- MODIFIED LOGIC START ---
            // 1. Try to find a corresponding material in the target lift's existing data
            const existingTargetMaterial = targetSelectedMaterials.find(
              targetMaterial => targetMaterial.materialTypeId === material.materialTypeId
            );

            // 2. Determine the IDs to use: target lift's IDs if a match exists, otherwise null
            const materialId = existingTargetMaterial?.id || null;
            const quotationLiftDetailId = existingTargetMaterial?.quotationLiftDetailId || null;

            // 3. Return the new material object
            return {
              ...material, // Copy all properties from the source material
              id: materialId, // Use the ID from the target lift's existing data or null
              quotationLiftDetailId: quotationLiftDetailId, // Use the FK from the target lift's existing data or null
            };
            // --- MODIFIED LOGIC END ---
          });

          // 3d. Construct the updated lift object
          const updatedLift = {
            //...lift,
            ...restFromLift, // Copy main lift properties (e.g., fields outside of 'data')
            id: lift.id,
            enquiryId: lift.enquiryId,
            saved: isTargetLiftSaved ? lift.saved : false,
            fullyFilled: false,
            // Use cleansed selectedMaterials and preserved IDs
            data: {
              ...restData,
              selectedMaterials: cleanedMaterials,
              ...preservedUniqueData // Apply target lift's unique IDs
            },
            fieldLabels: fromLift.fieldLabels ? { ...fromLift.fieldLabels } : undefined,
          };

          return updatedLift;
        }
        return lift;
      });

      return newLiftsArray;
    });

    // 4. Trigger Side Effects

    // Set the ID to trigger the useEffect that opens the modal
    setModalEnquiryId(targetEnquiryId);

    toast.success(
      `Specification copied from Lift ${fromLiftNumber} to Lift ${targetEnquiryId}. Review and save your changes. Please wait it get loaded....`,
      { duration: 5000 }
    );
  };


  // Make sure this is in your component, and modalEnquiryId is declared with useState(null)
  useEffect(() => {
    // 1. Check if a modal is pending to be opened
    if (modalEnquiryId) {

      // 2. Find the target lift data from the newly updated 'lifts' state
      // This will only succeed after 'lifts' has been updated by setLifts
      const targetLiftData = lifts.find(l => l.enquiryId === modalEnquiryId);

      console.log("Before open the modal lift data:======>", targetLiftData);
      if (targetLiftData) {
        // 3. Open the modal with the found data
        openModal(targetLiftData);

        // 4. Reset the trigger ID to prevent re-opening
        setModalEnquiryId(null);
      }
    }

    // Dependency array must watch both the trigger ID and the source data
  }, [modalEnquiryId, lifts, openModal]);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ---- PAGE TITLE ---- */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          {action === "revise"
            ? "🔄 Revise"
            : action === "editRevision" && edition == 0
              ? "✏️ Edit Original"
              : action === "editRevision"
                ? "🔄 Edit Revised"
                : "ADD New "
          } Quotation{" "}
          {payload?.enquiryTypeName && (
            <span className="text-blue-600">
              [{payload.enquiryTypeName}]
            </span>
          )}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enquiry ID: <span className="font-medium">{combinedEnquiryId}</span>
        </p>
      </div>

      {/* ---- QUOTATION INFO CARD ---- */}
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 text-center border-b pb-2">
          Quotation Information
        </h3>

        <div className="space-y-4 text-gray-800">
          {/* Quotation Date */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">
              Quotation Date<span className="text-red-500">*</span>:
            </label>
            <input
              type="datetime-local"
              value={quotationDate}
              onChange={(e) => {
                const newDate = e.target.value;
                setQuotationDate(newDate);
                setLifts((prevLifts) =>
                  prevLifts.map((lift) => ({
                    //...lift,
                    quotationDate: newDate,
                    data: { ...lift.data, quotationDate: newDate },
                  }))
                );
              }}
              className="border border-gray-300 p-1.5 rounded w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Edition */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">Edition:</label>
            <input
              type="text"
              value={Number(edition) === 0 ? "Original" : edition}
              onChange={(e) => setEdition(e.target.value)}
              className="border border-gray-300 p-1.5 rounded w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
              // disabled={Number(edition) >= 1}
              disabled
            />
          </div>

          {/* Lead Selection */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">
              Select Lead<span className="text-red-500">*</span>:
            </label>
            <select
              value={lead || ""}
              onChange={(e) => setLead(e.target.value)}
              className="border border-gray-300 p-1.5 rounded w-1/2 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Lead</option>
              {leads.map((l) => (
                <option key={l.leadId} value={l.leadId}>
                  {l.leadCompanyName}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">Customer:</label>
            <input
              type="text"
              value={customer || ""}
              readOnly
              className="border border-gray-200 p-1.5 rounded w-1/2 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Site */}
          <div className="flex justify-between items-center">
            <label className="font-semibold">Site:</label>
            <input
              type="text"
              value={site || ""}
              readOnly
              className="border border-gray-200 p-1.5 rounded w-1/2 bg-gray-100 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* ---- LIFT LIST SECTION ---- */}
      <div className="space-y-4">
        {(() => {
          // Sort lifts when in editRevision mode
          let sortedLifts = [...lifts];

          if (action === "editRevision") {
            sortedLifts = lifts.sort((a, b) => {
              const originA = a.origin || a.data?.origin || "CURRENT_INCLUDED";
              const originB = b.origin || b.data?.origin || "CURRENT_INCLUDED";

              // MISSING_FROM_PARENT lifts go to the end
              if (originA === "MISSING_FROM_PARENT" && originB !== "MISSING_FROM_PARENT") {
                return 1; // a comes after b
              }
              if (originA !== "MISSING_FROM_PARENT" && originB === "MISSING_FROM_PARENT") {
                return -1; // a comes before b
              }

              // If both are MISSING_FROM_PARENT, sort by ID
              if (originA === "MISSING_FROM_PARENT" && originB === "MISSING_FROM_PARENT") {
                const idA = a.data?.id || a.id || 0;
                const idB = b.data?.id || b.id || 0;
                return idA - idB;
              }

              // Otherwise, maintain original order
              return 0;
            });
          }

          return sortedLifts.map((lift, index) => {
            const origin = lift.origin || lift.data?.origin || "CURRENT_INCLUDED";
            const keyId = lift.id || lift.data?.id || lift.enquiryId;
            return (
              <div
                // key={lift?.enquiryId ?? lift.data?.id} 
                key={lift.data?.id ?? lift?.enquiryId}
                className="border border-gray-200 bg-white shadow-sm hover:shadow-md rounded-xl p-4 transition-all duration-200 w-full lg:w-3/4 mx-auto"
              >
                {console.log(lift.data?.id, "<---data----enquiryId----enquiry-->", lift?.enquiryId)}
                {console.log(lift, "------------key------------", lift?.enquiryId || lift.data?.id)}
                <div className="flex flex-col lg:flex-row justify-between gap-3">
                  {/* Title + Price + Status */}
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-gray-800">
                        Lift {index + 1} (ID: {lift.data?.id || lift.data?.enquiryId || lift?.enquiryId})
                      </div>

                      {/* Dynamic Status Display */}
                      {/* Determine status based on isFinalized and isSaved */}
                      {(() => {
                        // console.log("Lift status check:", lift);

                        const { id: outerId, fullyFilled } = lift;
                        const { isSaved, isFinalized, id: innerId } = lift.data ?? {};

                        // console.log("Outer ID:", outerId, "Inner ID:", innerId, "isSaved:", isSaved, "fullyFilled:", fullyFilled);
                        // const id = innerId || outerId;

                        // console.log("..............isSaved:", isSaved, "isFinalized:", isFinalized, "fullyFilled:", fullyFilled, "id:", id);




                        if (origin === "MISSING_FROM_PARENT") {
                          // This lift was removed from the current edition, but shown for comparison.
                          // It should have a distinct visual treatment and a final status.
                          return (
                            <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-700 w-[250px]" >
                              Not yet revised(Included From parent lift [Quotation ID: {lift.data?.quotationMainId
                              }])
                            </div>
                          );
                        }

                        let statusText = "⚠️ Incomplete";
                        let statusClass = "bg-red-100 text-red-700";

                        if (isSaved && isFinalized) {
                          // ✅ Case 1: Both saved and finalized
                          statusText = "🎉 Finalized";
                          statusClass = "bg-purple-100 text-purple-700 font-bold";
                        }
                        else if (!isSaved && !isFinalized && fullyFilled && id != null) {
                          // ✅ Case 2: Lift filled, enter in DB but status not saved
                          statusText = "📝 Drafted & read to Save";
                          statusClass = "bg-green-100 text-green-700";
                        }
                        else if (isSaved && !isFinalized && fullyFilled && id != null) {
                          // ✅ Case 3: Lift filled, enter in DB,  status saved and not finalized
                          statusText = "💾 Saved";
                          statusClass = "bg-blue-100 text-blue-700";
                        }
                        else if (!isSaved && !isFinalized && fullyFilled && id == null) {
                          // ✅ Case 4: Filled but not yet saved in DB
                          statusText = "🟡 Ready to Add (New)";
                          statusClass = "bg-yellow-100 text-yellow-700";
                        }
                        else if (!isSaved && !isFinalized && !fullyFilled && id == null) {
                          // ✅ Case 4: Not saved, not filled, not in DB
                          statusText = "⚠️ Incomplete";
                          statusClass = "bg-red-100 text-red-700";
                        }

                        return (
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                            {statusText}
                          </div>
                        );
                      })()}

                    </div>

                    {/* <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold text-gray-800">
                    Lift {index + 1} (ID: {lift.enquiryId})
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${lift.saved
                        ? "bg-green-100 text-green-700"
                        : lift.fullyFilled
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {lift.saved
                      ? "✅ Saved"
                      : lift.fullyFilled
                        ? "🟡 Ready to Save"
                        : "⚠️ Incomplete"}
                  </div>
                </div> */}
                    <div className="text-sm text-blue-600 mt-1">
                      Price: ₹ {lift.data?.totalAmount ?? "0"}
                    </div>
                  </div>


                  {/* Repeat Lift */}
                  {index !== 0 && (
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Repeat Specification:
                      </label>
                      <select
                        value={repeatSettings[index]?.from || ""}
                        onChange={(e) =>
                          handleRepeatChange(index, "from", e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="">Select</option>
                        {lifts
                          .filter((prevLift) => {
                            console.log(prevLift, "**********prevLift***********")
                            // const prevLiftId = prevLift.data?.id || prevLift.data?.enquiryId || prevLift.enquiryId;
                            // // const currentLiftId = lifts[index].data?.id || lifts[index].enquiryId;

                            // const currentLiftId = lifts[index].data?.id || lifts[index].data?.enquiryId || lifts[index].enquiryId;

                            const prevLiftId = prevLift.enquiryId;
                            // const currentLiftId = lifts[index].data?.id || lifts[index].enquiryId;

                            const currentLiftId = lifts[index].enquiryId;

                            console.log(prevLiftId, "**********currentLiftId***********", currentLiftId)

                            return prevLiftId < currentLiftId;
                          })
                          .map((prevLift) => {
                            // 🎯 Helper function to determine the correct ID (data.id if exists, otherwise enquiryId)
                            { console.log(prevLift, "**********prevLift inside map***********") }
                            // const liftId = prevLift.data?.id || prevLift.data?.enquiryId || prevLift.enquiryId;

                            const liftId = prevLift.enquiryId;

                            { console.log(liftId, "**********prevLift inside map***********") }

                            return (
                              <option
                                key={liftId}
                                value={liftId} // Value is the unique ID (data.id or enquiryId)
                              >
                                {/* Display Lift [Enquiry ID] - used for human-readable display */}
                                Lift {index}
                              </option>
                            );
                          })}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRepeat(index)}
                        disabled={!repeatSettings[index]?.checked}
                        className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${repeatSettings[index]?.checked
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                      >
                        Repeat
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 items-center">
                    {!lift.isFinalized && (
                      console.log("--------lift action button----", origin, action),
                      <button
                        onClick={() => openModal(lift)}
                        className={`px-4 py-2 h-9 rounded transition-all flex items-center justify-center text-white font-medium whitespace-nowrap
                      ${action === "revise" ? "bg-yellow-600 hover:bg-yellow-700" :
                            action === "editRevision" && origin === "MISSING_FROM_PARENT" ? "bg-orange-600 hover:bg-orange-700" :
                              "bg-blue-500 hover:bg-blue-600"}
                    `}
                      >
                        {console.log("--------lift action button inside----", origin, action)}
                        {
                          action === ""
                            ? "✏️ Edit"
                            : action === "revise"
                              ? "🔄 Revise"
                              : action === "editRevision" && origin === "MISSING_FROM_PARENT"
                                ? "🔄 Revise Original"
                                : action === "editRevision" && origin === "CURRENT_INCLUDED" && edition == 0
                                  ? "✏️ Edit Original"
                                  : "✏️ Edit Revised"
                        }
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (!lift.data) {
                          toast.error("Please fill quotation details first!");
                          return;
                        }
                        setPreviewData({
                          id: lift.enquiryId,
                          data: lift.data,
                          fieldLabels: lift.fieldLabels || {},
                        });
                      }}
                      className="bg-gray-200 hover:bg-gray-300 px-4 h-9 rounded flex items-center justify-center"
                    >
                      👁️ Preview
                    </button>
                  </div>


                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* ---- SUMMARY & ACTIONS ---- */}
      <div className="mt-8 border-t pt-6 flex flex-col lg:flex-row justify-between items-center gap-4 max-w-7xl mx-auto px-4">
        <div className="text-xl font-semibold text-gray-700">
          Total Quotation Price:{" "}
          <span className="text-blue-700">
            ₹ {quotationPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex gap-3">
          {!lifts.every(lift => lift.isFinalized) && (
            <button
              disabled={!allLiftsFullyFilled}
              onClick={handleSaveAll}
              className={`px-5 py-2 rounded font-medium ${allLiftsFullyFilled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
            >
              💾 Confirm & Save All
            </button>
          )}

          <button
            onClick={handlePreviewAll}
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700"
          >
            📄 Preview All
          </button>
        </div>
      </div>

      {/* ---- MODALS ---- */}
      {modalOpen && (
        <LiftModal
          // key={
          //   selectedLift?.enquiryId +
          //   (selectedLift?.data ? JSON.stringify(selectedLift.data).length : 0)
          // }

          // key={
          //   selectedLift?.data?.enquiryId + // Safely access the nested enquiryId
          //   (selectedLift?.data ? JSON.stringify(selectedLift.data).length : 0)
          // }

          key={
            selectedLift?.data?.enquiryId +
            "_" +
            JSON.stringify(selectedLift?.data || {}).length
          }

          lift={selectedLift}
          setLifts={setLifts}
          action={action}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          quotationDate={quotationDate}
        />
      )}

      {previewData && (
        <PreviewModal
          previewData={previewData}
          fieldLabels={fieldLabels}
          initialOptions={initialOptions}
          onClose={() => setPreviewData(null)}
        />
      )}

      {previewOpen && (
        <PreviewAllModal
          quotationInfo={{
            "Quotation Date": quotationDate,
            Edition: edition,
            Lead: lead || "N/A",
            Customer: customer || "N/A",
            Site: site || "N/A",
            "Total Amount": quotationPrice.toLocaleString(),
          }}
          initialOptions={initialOptions}
          lifts={lifts}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );


  // return (
  //   <div className="p-6">
  //     {/* <h2 className="text-3xl font-bold mb-6 text-left">Add Quotation {payload?.enquiryTypeName && (
  //       <span>[{payload.enquiryTypeName}]
  //         <span>[Lead:{payload.leadId}-(Enq:{payload.combinedEnquiryId})-{payload.customer}-{payload.site}]</span>
  //       </span>
  //     )}</h2> */}

  //     <h2 className="text-3xl font-bold mb-6 text-left">Add Quotation {payload?.enquiryTypeName && (
  //       <span>[{payload.enquiryTypeName}]
  //       </span>
  //     )}</h2>

  //     <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
  //       <h3 className="text-xl font-semibold text-center text-blue-600 mb-4">
  //         Quotation Information (Enquiry Id : {combinedEnquiryId})
  //       </h3>

  //       <div className="space-y-4 text-gray-800">
  //         {/* Quotation Date */}
  //         <div className="flex justify-between items-center">
  //           <label className="font-semibold">
  //             Quotation Date<span className="text-red-500">*</span>:
  //           </label>
  //           <input
  //             type="datetime-local"
  //             value={quotationDate}
  //             onChange={(e) => {
  //               const newDate = e.target.value;
  //               setQuotationDate(newDate);
  //               setLifts((prevLifts) =>
  //                 prevLifts.map((lift) => ({
  //                   ...lift,
  //                   quotationDate: newDate,
  //                   data: {
  //                     ...lift.data,
  //                     quotationDate: newDate, // also update inside formData if already present
  //                   },
  //                 }))
  //               );
  //             }}

  //             className="border p-1 rounded w-1/2"
  //           />
  //         </div>

  //         {/* Edition */}
  //         <div className="flex justify-between items-center">
  //           <label className="font-semibold">Edition:</label>
  //           <input
  //             type="text"
  //             value={edition}
  //             onChange={(e) => setEdition(e.target.value)}
  //             className="border p-1 rounded w-1/2"
  //           />
  //         </div>

  //         {/* Select Lead */}
  //         <div className="flex justify-between items-center">
  //           <label className="font-semibold">
  //             Select Lead<span className="text-red-500">*</span>:
  //           </label>
  //           <select
  //             value={lead || ""}
  //             onChange={(e) => setLead(e.target.value)}
  //             className="border p-1 rounded w-1/2"
  //           >
  //             <option value="">Select Lead</option>
  //             {leads.map((l) => (
  //               <option key={l.leadId} value={l.leadId}>
  //                 {l.leadCompanyName}
  //               </option>
  //             ))}
  //           </select>
  //         </div>

  //         {/* Customer - Read-only */}
  //         <div className="flex justify-between items-center">
  //           <label className="font-semibold">Customer:</label>
  //           <input
  //             type="text"
  //             value={customer}
  //             readOnly
  //             className="border p-1 rounded w-1/2 bg-gray-100"
  //           />
  //         </div>

  //         {/* Customer Site - Read-only */}
  //         <div className="flex justify-between items-center">
  //           <label className="font-semibold">Site:</label>
  //           <input
  //             type="text"
  //             value={site}
  //             readOnly
  //             className="border p-1 rounded w-1/2 bg-gray-100"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     {/* <div className="my-6 space-y-3">
  //       {lifts.map((lift, index) => (
  //         <div
  //           key={lift.enquiryId}
  //           className="border rounded p-2 flex justify-between items-center bg-white shadow-md w-3/4 mx-auto hover:shadow-lg transition-all"
  //         >
  //           <div className="flex items-center space-x-2">
  //             <span className="font-semibold text-lg text-gray-700">
  //               Lift {index + 1} (Enquiry ID: {lift.enquiryId})
  //             </span>
  //             <span
  //               className={`text-sm px-2 py-1 rounded-full ${lift.fullyFilled
  //                 ? "bg-green-100 text-green-700"
  //                 : "bg-red-100 text-red-700"
  //                 }`}
  //             >
  //               {lift.fullyFilled ? "✅ Fully Saved" : "⚠️ Not Fully Filled"}
  //             </span>
  //           </div>
  //           {index !== 0 && (
  //             <div className="mb-2 flex items-center space-x-2">
  //               <span className="font-semibold text-sm">
  //                 Repeat specification of Lift
  //               </span>
  //               <select
  //                 disabled={lifts[index].enquiryId === 1} // Disable for first lift (id=1)
  //                 value={repeatSettings[index]?.from || ""}
  //                 onChange={(e) =>
  //                   handleRepeatChange(index, "from", e.target.value)
  //                 }
  //                 className="border rounded px-2 py-1 text-xs w-24 bg-white cursor-pointer"
  //                 title="Select lift number to repeat from."
  //               >
  //                 <option value="">Select</option>
  //                 {lifts
  //                   .filter((l) => l.enquiryId < lifts[index].enquiryId)
  //                   .map((previousLift) => (
  //                     <option key={previousLift.enquiryId} value={previousLift.enquiryId}>
  //                       {previousLift.enquiryId}
  //                     </option>
  //                   ))}
  //               </select>

  //               <button
  //                 type="button"
  //                 onClick={() => handleRepeat(index)}
  //                 disabled={!repeatSettings[index]?.checked}
  //                 className={`px-3 py-1 rounded text-xs ${repeatSettings[index]?.checked
  //                   ? "bg-blue-600 text-white hover:bg-blue-700"
  //                   : "bg-gray-400 text-gray-700 cursor-not-allowed"
  //                   }`}
  //                 title="Copy specification from selected lift."
  //               >
  //                 Repeat
  //               </button>
  //             </div>
  //           )}

  //           <div className="flex space-x-2">
  //             <button
  //               onClick={() => openModal(lift)}
  //               title="Add / Edit"
  //               className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
  //             >
  //               ✏️
  //             </button>
  //             <button
  //               onClick={() => {
  //                 if (!lift.data) {
  //                   toast.error("Please fill quotation details first!");
  //                   return;
  //                 }
  //                 console.log("Lift Preview Data:", lift);
  //                 console.log("Field Labels:", lift.fieldLabels);
  //                 setPreviewData({
  //                   id: lift.enquiryId,
  //                   data: lift.data,
  //                   fieldLabels: lift.fieldLabels || {}, // ✅ important
  //                 });
  //               }}
  //             >
  //               👁️
  //             </button>
  //           </div>
  //         </div>
  //       ))}
  //     </div> */}

  //     <div className="my-6 space-y-3">
  //       {lifts.map((lift, index) => (
  //         <div
  //           key={lift.enquiryId}
  //           className="border rounded p-3 bg-white shadow-md w-full lg:w-3/4 mx-auto hover:shadow-lg transition-all"
  //         >
  //           {/* Outer flex wrapper → stack on mobile & md, row only on lg+ */}
  //           <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

  //             {/* Title + Status */}
  //             <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
  //               <span className="font-semibold text-lg text-gray-700">
  //                 Lift {index + 1} (Lift Enquiry ID: {lift.enquiryId})

  //                 <div className="mt-1 text-sm text-blue-800">
  //                   Price: ₹ {lift.data?.totalAmount ?? "0"}
  //                 </div>
  //               </span>
  //               <span
  //                 className={`text-sm mt-1 lg:mt-0 px-2 py-1 rounded-full 
  //   ${lift.saved
  //                     ? "bg-green-100 text-green-700" // Saved status (primary success state)
  //                     : lift.fullyFilled
  //                       ? "bg-yellow-100 text-yellow-700" // Not saved, but fully filled (ready to save)
  //                       : "bg-red-100 text-red-700" // Not fully filled (needs attention)
  //                   }`}
  //               >
  //                 {lift.saved
  //                   ? "✅ Saved"
  //                   : lift.fullyFilled
  //                     ? "🟡 Drafted & Ready to Save"
  //                     : "⚠️ Not Fully Filled"}
  //               </span>
  //             </div>

  //             {/* Repeat section (full-width until lg) */}
  //             {index !== 0 && (
  //               <div className="flex flex-col lg:flex-row lg:items-center gap-2 w-full lg:w-auto">
  //                 <span className="font-semibold text-sm">
  //                   Repeat specification of Lift
  //                 </span>

  //                 <select
  //                   value={repeatSettings[index]?.from || ""}
  //                   onChange={(e) =>
  //                     handleRepeatChange(index, "from", e.target.value)
  //                   }
  //                   className="border rounded px-2 py-1 text-sm w-full lg:w-32 bg-white cursor-pointer"
  //                 >
  //                   <option value="">Select</option>
  //                   {lifts
  //                     .filter((l) => l.enquiryId < lifts[index].enquiryId)
  //                     .map((previousLift) => (
  //                       <option
  //                         key={previousLift.enquiryId}
  //                         value={previousLift.enquiryId}
  //                       >
  //                         Lift {previousLift.enquiryId}
  //                       </option>
  //                     ))}
  //                 </select>

  //                 <button
  //                   type="button"
  //                   onClick={() => handleRepeat(index)}
  //                   disabled={!repeatSettings[index]?.checked}
  //                   className={`px-3 py-1 rounded text-sm w-full lg:w-auto ${repeatSettings[index]?.checked
  //                     ? "bg-blue-600 text-white hover:bg-blue-700"
  //                     : "bg-gray-400 text-gray-700 cursor-not-allowed"
  //                     }`}
  //                 >
  //                   Repeat
  //                 </button>
  //               </div>
  //             )}

  //             {/* Action Buttons (stack until lg, row on lg+) */}
  //             <div className="flex flex-row gap-2 w-full lg:w-auto">
  //               <button
  //                 onClick={() => openModal(lift)}
  //                 className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full lg:w-auto"
  //               >
  //                 ✏️
  //               </button>
  //               <button
  //                 onClick={() => {
  //                   if (!lift.data) {
  //                     toast.error("Please fill quotation details first!");
  //                     return;
  //                   }
  //                   setPreviewData({
  //                     id: lift.enquiryId,
  //                     // lift: lift,
  //                     data: lift.data,
  //                     fieldLabels: lift.fieldLabels || {},
  //                   });
  //                 }}
  //                 className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded w-full lg:w-auto"
  //               >
  //                 👁️
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>





  //     <div className="flex justify-between items-center space-x-4 mt-6 max-w-7xl mx-auto px-4">
  //       <div className="text-lg font-semibold text-gray-700">
  //         Total Quotation Price: ₹ {quotationPrice.toLocaleString()}
  //       </div>
  //       <div className="flex space-x-4">
  //         <button
  //           disabled={!allLiftsFullyFilled}
  //           onClick={handleSaveAll}
  //           className={`px-4 py-2 rounded ${allLiftsFullyFilled
  //             ? "bg-green-500 text-white hover:bg-green-600"
  //             : "bg-gray-300 text-gray-700 cursor-not-allowed"
  //             }`}
  //         >
  //           Confirm to Save All Quotations
  //         </button>

  //         <button
  //           onClick={handlePreviewAll}
  //           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  //         >
  //           Preview All Quotation
  //         </button>
  //       </div>
  //     </div>


  //     {modalOpen && (
  //       <LiftModal
  //         key={selectedLift?.enquiryId + (selectedLift?.data ? JSON.stringify(selectedLift.data).length : 0)} // 👈 unique key
  //         lift={selectedLift}
  //         setLifts={setLifts}
  //         onClose={() => setModalOpen(false)}
  //         onSave={handleSave}
  //         // onReset={handleResetLift}
  //         quotationDate={quotationDate}
  //       />
  //     )}

  //     {previewData && (
  //       <PreviewModal
  //         previewData={previewData}
  //         fieldLabels={fieldLabels}
  //         initialOptions={initialOptions}
  //         onClose={() => setPreviewData(null)}
  //       />
  //     )}

  //     {previewOpen && (
  //       <PreviewAllModal
  //         quotationInfo={{
  //           "Quotation Date": quotationDate,
  //           Edition: edition,
  //           // Lead: searchParams.get("lead") || "N/A",
  //           // Customer: searchParams.get("customer") || "N/A",
  //           // Site: searchParams.get("site") || "N/A",
  //           Lead: lead || "N/A",
  //           Customer: customer || "N/A",
  //           Site: site || "N/A",
  //           "Total Amount": quotationPrice.toLocaleString(),
  //         }}
  //         initialOptions={initialOptions}
  //         lifts={lifts}
  //         onClose={() => setPreviewOpen(false)}
  //       />
  //     )}
  //   </div>
  // );
}
