'use client';

import axiosInstance from "@/utils/axiosInstance";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";


export default function AmcQuotationForm() {

  const router = useRouter();

  // --- base object for combinedQuotations ---
  const combinedQuotationBase = {
    enquiryId: null,
    revisedQuotationId: null,
    renewalQuotationId: null,
    revisedRenewalId: null,

    amount: 0,
    gstAmount: 0,
    totalAmount: 0,

    amountOrdinary: 0,
    amountSemi: 0,
    amountComp: 0,

    gstOrdinary: 0,
    gstSemi: 0,
    gstComp: 0,

    totalAmountOrdinary: 0,
    totalAmountSemi: 0,
    totalAmountComp: 0,

    liftType: "",
    machineType: "",
    noOfFloors: "",
    capacityTerm: "",
    selectPerson: "",

    from: ""

  };

  const today = new Date().toISOString().split("T")[0]; // "2025-09-06"


  const [formData, setFormData] = useState({
    quatationDate: today,
    leadId: null,
    combinedEnquiryId: null,
    enquiryId: null,
    makeOfElevatorId: null,
    paymentTermId: null,
    createdById: null,

    noOfElevator: 0,
    typeOfElevator: "",
    fromDate: "",
    toDate: "",

    isFinalOrdinary: 0,
    isFinalSemicomp: 0,
    isFinalComp: 0,

    amountOrdinary: 0,
    gstOrdinary: 0,

    amountSemiComp: 0,
    gstSemi: 0,

    amountComp: 0,
    gstComp: 0,

    status: "",
    typeContract: "",
    noOfServicesId: 0,
    gstPercentage: 0,
    isFinal: 0,
    jobStatus: 0,
    forecastMonth: "",

    customerName: "",
    selectLead: "",
    customerSite: "",
    combinedQuotations: [],
  });



  useEffect(() => {
    console.log("AMC Quotation Form Rendered");

    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("combinedEnquiry");
      console.log("Raw LocalStorage Data:", storedData);

      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          console.log("Parsed Combined Enquiry:", parsed);

          // Build combinedQuotations array dynamically from entries[]
          const combinedQuotationsArray =
            parsed.entries?.map((entry) => ({
              ...combinedQuotationBase, // clone base object
              enquiryId: entry.id, // fill enquiryId from entry
              liftType: entry.liftType,
              machineType: entry.machineType,
              noOfFloors: entry.noOfFloors,
              capacityTerm: entry.capacityTerm,
              selectPerson: entry.selectPerson,
              from: entry.from
            })) ?? [];

          setFormData((prev) => ({
            ...prev,
            combinedEnquiryId: parsed.combinedId ?? null,
            noOfElevator: parsed.entries?.length ?? 0,
            customerName: parsed.customerName ?? "",
            selectLead: parsed.selectLead ?? "",
            gstPercentage: parsed.companyAmcGstPercentage || 0,
            leadId: parsed.leadId ?? null,
            customerSite: parsed.customerSite ?? "",
            quotationDate: parsed.createdDate
              ? parsed.createdDate  // already in YYYY-MM-DD format
              : new Date().toISOString().split("T")[0], // default to today



            combinedQuotations: combinedQuotationsArray,
          }));
        } catch (e) {
          console.error("Invalid JSON in localStorage", e);
        }
      }
    }
  }, []);

  const [paymentTerms, setPaymentTerms] = useState([]);

  // Fetch payment terms on component mount
  useEffect(() => {
    axiosInstance.get("/api/amc/common/payment-terms")
      .then(res => {
        setPaymentTerms(res.data); // expects [{id:1, termName:"Monthly"}, ...]
      })
      .catch(err => console.error("Failed to fetch payment terms:", err));
  }, []);

  // Handle change for select
  const handlePaymentTermChange = (e) => {
    const selectedId = parseInt(e.target.value); // convert string to number
    setFormData(prev => ({
      ...prev,
      paymentTermId: selectedId
    }));
  };

  const handleSetStatus = (e) => {
    const val = e.target.value;

    setFormData((prev) => ({
      ...prev,
      status: val,
    }));
  };



  const [numberOfServices, setNumberOfServices] = useState([]);

  // Fetch number of services options on mount
  useEffect(() => {
    axiosInstance.get("/api/amc/common/number-of-services")
      .then(res => {
        setNumberOfServices(res.data);
        // expects array like [{id:1, name:"4"}, {id:2, name:"6"}, {id:3, name:"12"}]
      })
      .catch(err => console.error("Failed to fetch number of services:", err));
  }, []);

  // Handle change for select
  const handleNumberOfServicesChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      noOfServicesId: selectedId
    }));
  };

  const [employees, setEmployees] = useState([]);

  // Fetch employees on mount
  useEffect(() => {
    axiosInstance.get("/api/employees")
      .then(res => {
        setEmployees(res.data);
        // expects array like [{employeeId:1, employeeName:"John"}, ...]
      })
      .catch(err => console.error("Failed to fetch employees:", err));
  }, []);

  // Handle change for select
  const handleGeneratedByChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      createdById: selectedId
    }));
  };

  const [elevatorMakes, setElevatorMakes] = useState([]);

  // Fetch elevator makes on component mount
  useEffect(() => {
    axiosInstance.get("/api/amc/common/elevator-makes")
      .then(res => {
        setElevatorMakes(res.data);
        // expects array like [{id:1, name:"OTIS"}, {id:2, name:"Schindler"}, ...]
      })
      .catch(err => console.error("Failed to fetch elevator makes:", err));
  }, []);

  // Handle select change
  const handleElevatorMakeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      makeOfElevatorId: selectedId
    }));
  };

  /**  
   * 
   * 
   * this is for final amounts
   * 
   *   amountOrdinary: 0,
    amountSemi: 0,
    amountComp: 0,

    gstOrdinary: 0,
    gstSemi: 0,
    gstComp: 0,

    totalAmountOrdinary: 0,
    totalAmountSemi: 0,
    totalAmountComp: 0,

   // this is for each lift details
      isFinalOrdinary : 0,
     isFinalSemicomp : 0,
     isFinalComp : 0,

    amountOrdinary: 0,
    gstOrdinary: 0,

    amountSemiComp: 0,
    gstSemi: 0,

    amountComp: 0,
    gstComp: 0,
   */



  const handleGetGstAmount = (amount) => {
    const gstPercentage = Number(formData["gstPercentage"] || 0);
    const amt = Number(amount || 0);
    return Math.round((gstPercentage * amt) / 100); // whole number GST
  };



  const handleSetGstPercentage = (e) => {
    const gstPerc = Number(e.target.value || 0);
    setFormData((prev) => ({
      ...prev,
      gstPercentage: gstPerc, // update gstPercentage in state
    }));
  };

  const [valueInserted, setValueInserted] = useState(0);

  const handleChange = (index, field, value) => {

    setValueInserted((prev) => {
      return prev += 1;
    });

    const numericValue = Number(value || 0); // ensure it's a number

    setFormData((prev) => {
      const newQuotations = [...prev.combinedQuotations];

      // update the field
      newQuotations[index] = {
        ...newQuotations[index],
        [field]: numericValue,
      };

      // calculate GST and final amount
      const gstAmount = handleGetGstAmount(numericValue);

      let gstFieldName = "";
      let finalAmtFieldName = "";

      if (field === "amountOrdinary") {
        gstFieldName = "gstOrdinary";
        finalAmtFieldName = "totalAmountOrdinary";
      } else if (field === "amountSemi") {
        gstFieldName = "gstSemi";
        finalAmtFieldName = "totalAmountSemi";
      } else if (field === "amountComp") {
        gstFieldName = "gstComp";
        finalAmtFieldName = "totalAmountComp";
      }

      if (gstFieldName && finalAmtFieldName) {
        newQuotations[index] = {
          ...newQuotations[index],
          [gstFieldName]: gstAmount,
          [finalAmtFieldName]: numericValue + gstAmount,
        };
      }

      return { ...prev, combinedQuotations: newQuotations };
    });
  };

  useEffect(() => {
    handleCalculateAllThings();
  }, [valueInserted, formData.gstPercentage]);

  const handleCalculateAllThings = () => {
    setFormData((prev) => {
      const newQuotations = [...prev.combinedQuotations];

      // Use let instead of const because we are mutating these values
      let amountOrdinary1 = 0;
      let gstOrdinary1 = 0;
      let isFinalOrdinary1 = 0;

      let amountSemiComp1 = 0;
      let gstSemi1 = 0;
      let isFinalSemicomp1 = 0;

      let amountComp1 = 0;
      let gstComp1 = 0;
      let isFinalComp1 = 0;

      for (let index = 0; index < newQuotations.length; index++) {
        const elevator = newQuotations[index];

        const amountOrdinary = Number(elevator.amountOrdinary || 0);
        const amountSemi = Number(elevator.amountSemi || 0);
        const amountComp = Number(elevator.amountComp || 0);

        const gstOrdinary = handleGetGstAmount(amountOrdinary);
        const gstSemi = handleGetGstAmount(amountSemi);
        const gstComp = handleGetGstAmount(amountComp);

        const totalAmountOrdinary = amountOrdinary + gstOrdinary;
        const totalAmountSemi = amountSemi + gstSemi;
        const totalAmountComp = amountComp + gstComp;

        newQuotations[index] = {
          ...elevator,
          gstOrdinary,
          gstSemi,
          gstComp,
          totalAmountOrdinary,
          totalAmountSemi,
          totalAmountComp,
        };

        // Accumulate totals
        amountOrdinary1 += amountOrdinary;
        gstOrdinary1 += gstOrdinary;
        isFinalOrdinary1 += totalAmountOrdinary;

        amountSemiComp1 += amountSemi;
        gstSemi1 += gstSemi;
        isFinalSemicomp1 += totalAmountSemi;

        amountComp1 += amountComp;
        gstComp1 += gstComp;
        isFinalComp1 += totalAmountComp;
      }

      return {
        ...prev,
        combinedQuotations: newQuotations,
        amountOrdinary: amountOrdinary1,
        gstOrdinary: gstOrdinary1,
        isFinalOrdinary: isFinalOrdinary1,
        amountSemiComp: amountSemiComp1,
        gstSemi: gstSemi1,
        isFinalSemicomp: isFinalSemicomp1,
        amountComp: amountComp1,
        gstComp: gstComp1,
        isFinalComp: isFinalComp1,
      };
    });
  };


  const handleCreateAmcQuotation = async () => {
    try {

      // ✅ Validate typeContract before submit
      if (!formData.typeContract || formData.typeContract.trim() === "") {
        toast.error("Please select at least one contract type before submitting.");
        return; // stop form submission
      }
      // Build payload from formData
      const payload = {
        ...formData,
        combinedQuotations: formData.combinedQuotations.length
          ? formData.combinedQuotations
          : [combinedQuotationBase], // fallback if empty
      };

      console.log("Sending Payload to Backend:", payload);

      const response = await axiosInstance.post(
        "/api/amc/quotation/initial",
        payload
      );

      if (response.status === 200) {
        //  console.log("AMC Quotation created successfully:", response.data);
        // alert("AMC Quotation created successfully!");

        toast.success('AMC Quotation created successfully!');

        router.push(
          `/dashboard/quotations/amc_quatation_list`
        );
      }
    } catch (error) {
      console.error("Error creating AMC Quotation:", error);
      alert("Failed to create AMC Quotation. Please try again.");
    }
  };


useEffect(() => {
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedNextYear = nextYear.toISOString().split("T")[0];

  setFormData((prev) => ({
    ...prev,
    fromDate: formattedToday,
    toDate: formattedNextYear,
  }));
}, []); // runs only once on first render


  // Function to handle AMC From Date
  // Function to handle AMC From Date
const handleAmcFromDateChange = (e) => {
  const value = e.target.value; // "YYYY-MM-DD"

  // Convert to Date object
  const startDate = new Date(value);

  // Add 1 year
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  // Format back to YYYY-MM-DD
  const formattedEndDate = endDate.toISOString().split("T")[0];

  setFormData((prev) => ({
    ...prev,
    fromDate: value,
    toDate: formattedEndDate, // auto-fill AMC To Date
  }));
};


  // Function to handle AMC To Date
  const handleAmcToDateChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      toDate: value,
    }));
  };



  const handleAmcForecastMonthChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      forecastMonth: value,
    }));
  };

  const [nonComprehensiveChecked, setNonComprehensiveChecked] = useState(false);
  const [semiComprehensiveChecked, setSemiComprehensiveChecked] = useState(false);
  const [comprehensiveChecked, setComprehensiveChecked] = useState(false);

  // ✅ Keep checkbox states in sync when formData.typeContract changes
  useEffect(() => {
    const selected = formData.typeContract?.split(",") || [];
    setNonComprehensiveChecked(selected.includes("Non-Comprehensive"));
    setSemiComprehensiveChecked(selected.includes("Semi-Comprehensive"));
    setComprehensiveChecked(selected.includes("Comprehensive"));

    let nonCompStatus = selected.includes("Non-Comprehensive");
    let semiCompStatus = selected.includes("Semi-Comprehensive");
    let compStatus = selected.includes("Comprehensive");

    setFormData((prev) => {
      const updatedCombined = prev.combinedQuotations.map((q) => {
        const updated = { ...q };

        // Reset in combinedQuotations based on unchecked status
        if (!nonCompStatus) {
          updated.amountOrdinary = 0;
          updated.gstOrdinary = 0;
          updated.totalAmountOrdinary = 0;
        }
        if (!semiCompStatus) {
          updated.amountSemi = 0;
          updated.gstSemi = 0;
          updated.totalAmountSemi = 0;
        }
        if (!compStatus) {
          updated.amountComp = 0;
          updated.gstComp = 0;
          updated.totalAmountComp = 0;
        }

        return updated;
      });

      return {
        ...prev,
        // ✅ Reset only the 9 fields in main formData
        ...(nonCompStatus
          ? {}
          : { amountOrdinary: 0, gstOrdinary: 0, isFinalOrdinary: 0 }),
        ...(semiCompStatus
          ? {}
          : { amountSemiComp: 0, gstSemi: 0, isFinalSemicomp: 0 }),
        ...(compStatus ? {} : { amountComp: 0, gstComp: 0, isFinalComp: 0 }),

        combinedQuotations:
          updatedCombined.length > 0 ? updatedCombined : [{ ...combinedQuotationBase }],
      };
    });
  }, [formData.typeContract]);


  return (
    <div className="min-h-screen p-2 ">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateAmcQuotation(); }}>

          {/* Page Header */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700">AMC Quotation</h1>
            {/* <button onClick={()=>{
                  router.push(`/dashboard/quotations/amc_quatation_list`);

          }} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            back to List
          </button> */}
          </div>

          {/* Quotation Details */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Quotation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quotation Details inputs remain as your original design */}
              <div>
                <label className="block text-sm font-semibold mb-1">Quotation Date</label>
                <input
                  readOnly
                  type="date"
                  name="quotationDate"
                  value={formData['quotationDate'] || new Date().toISOString().split("T")[0]}
                  className="border p-2 w-full rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Select Lead</label>
                <input name="selectLead" readOnly value={formData['selectLead']} className=" bg-gray-100 border p-2 w-full rounded" />

              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Customer</label>
                <input name="customer" readOnly value={formData['customerName']} className=" bg-gray-100 border p-2 w-full rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Customer Site</label>
                <input name="customerSite" readOnly value={formData['customerSite']} className=" bg-gray-100 border p-2 w-full rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Make Of Elevators</label>
                <select
                  className="border p-2 w-full rounded"
                  value={formData.makeOfElevatorId || ""}
                  onChange={handleElevatorMakeChange}
                  required
                >
                  <option value="">Please Select</option>
                  {elevatorMakes.map(make => (
                    <option key={make.id} value={make.id}>
                      {make.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold mb-1">AMC From Date</label>
                  <input
                    type="date"
                    name="amcFrom"
                    value={formData.fromDate || ""}
                    onChange={handleAmcFromDateChange}
                    className="border p-2 w-full rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">AMC To Date</label>
                  <input
                    type="date"
                    name="amcTo"
                    value={formData.toDate || ""}
                    onChange={handleAmcToDateChange}
                    className="border p-2 w-full rounded"
                    required
                  />
                </div>

              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">No Of Services</label>
                <select
                  className="border p-2 w-full rounded"
                  value={formData.noOfServicesId || ""}
                  onChange={handleNumberOfServicesChange}
                  required
                >
                  <option value="">Please Select</option>
                  {numberOfServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">GST Percentage</label>
                <input type="number" value={formData.gstPercentage} name="gstPercentage" onChange={handleSetGstPercentage} className="border p-2 w-full rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Payment Terms</label>
                <select
                  className="border p-2 w-full rounded"
                  value={formData.paymentTermId || ""}
                  onChange={handlePaymentTermChange}
                  required
                >
                  <option value="">Select</option>
                  {paymentTerms.map(term => (
                    <option key={term.id} value={term.id}>
                      {term.termName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Generated By</label>
                <select
                  className="border p-2 w-full rounded"
                  value={formData.createdById || ""}
                  onChange={handleGeneratedByChange}
                  required
                >
                  <option value="">Select</option>
                  {employees.map(emp => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Forecast Date</label>
                <input
                  type="date"
                  name="amcFrom"
                  value={formData.forecastMonth || ""}
                  onChange={handleAmcForecastMonthChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              {/* ✅ Contract Checkboxes Section */}
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1">
                  Contract <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Non-Comprehensive", "Semi-Comprehensive", "Comprehensive"].map(
                    (contractType) => (
                      <label key={contractType} className="flex items-center gap-2">
                        <input

                          type="checkbox"
                          checked={
                            formData.typeContract?.split(",").includes(contractType) || false
                          }
                          onChange={(e) => {
                            const selected = formData.typeContract
                              ? formData.typeContract.split(",")
                              : [];

                            let updated;
                            if (e.target.checked) {
                              // Add selected type
                              updated = [...selected, contractType];
                            } else {
                              // Remove unchecked type
                              updated = selected.filter((t) => t !== contractType);
                            }

                            setFormData((prev) => ({
                              ...prev,
                              typeContract: updated.join(","), // ✅ Store as comma-separated string
                            }));
                          }}
                        />
                        {contractType}
                      </label>
                    )
                  )}
                </div>
              </div>



              <div className="md:col-span-3">
                <label className="block text-sm font-semibold mb-1">Status Of Quotation</label>
                <input required name="status" onChange={(e) => handleSetStatus(e)} className="border p-2 w-full rounded" placeholder="Enter Status" />
              </div>
            </div>
          </div>

          {/* Elevator Details */}
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Elevator Details</h2>

            {formData.combinedQuotations.map((elevator, index) => (
              <div key={elevator.enquiryId} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-center bg-gray-50 p-4 rounded-lg">
                {/* Lift ID */}
                <div className="md:col-span-1 flex items-center justify-center font-semibold text-gray-700">
                  {`Lift ${index + 1}`}
                </div>


                {/* liftType : "",
      machineType: "",
      noOfFloors: "",
      capacityTerm: "",
      selectPerson:"", */}

                {/* Left Side: Elevator Info */}
                <div className="md:col-span-3 space-y-2">
                  {/* Lift Type */}
                  <div className="flex items-center mb-2">
                    <label className="w-32 text-sm font-semibold text-gray-700">
                      Lift Type
                    </label>
                    <input
                      type="text"
                      placeholder="Lift Type"
                      readOnly
                      value={elevator.liftType || ""}
                      className="flex-1 p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"

                    />
                  </div>

                  {/* No of Floors */}
                  <div className="flex items-center mb-2">
                    <label className="w-32 text-sm font-semibold text-gray-700">
                      No. of Floors
                    </label>
                   <input
                      type="text"
                      placeholder="no of floors"
                      readOnly
                      value={elevator.noOfFloors || ""}
                      className="flex-1 p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* No. of Persons */}
                  <div className="flex items-center">
                    <label className="w-32 text-sm font-semibold text-gray-700">
                      Capacity value
                    </label>
                    <input
                      type="text"
                      placeholder="Capacity value"
                      readOnly
                      value={elevator.selectPerson || ""}
                      className="flex-1 p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* <select
                 // value={formData[elevator.id]?.type || ""}
                 // onChange={(e) => handleChange(e, elevator.id, "type")}
                  className="p-2 w-full rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Type Of Elevator</option>
                  <option>Manual</option>
                  <option>Automatic</option>
                </select>
                <select
                 // value={formData[elevator.id]?.capacity || ""}
                 // onChange={(e) => handleChange(e, elevator.id, "capacity")}
                  className="p-2 w-full rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Selected Persons</option>
                  <option>4 Persons / 272 Kg</option>
                  <option>10 Persons / 680 Kg</option>
                </select> */}

                </div>

                {/* Right Side: Pricing */}
                <div className="md:col-span-8 grid grid-cols-3 gap-3">

                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <h3 className="font-semibold text-center mb-2">Non-Comp</h3>
                    <input
                      type="number"
                      placeholder="Base Price"
                      value={elevator['amountOrdinary'] || ""}
                      required={nonComprehensiveChecked}
                      readOnly={!nonComprehensiveChecked}
                      // onChange={(e) => handleChange(e, elevator.id, `${plan}_base`)}
                      onChange={(e) => handleChange(index, "amountOrdinary", e.target.value)}
                      className={`p-2 w-full rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${nonComprehensiveChecked ? "bg-white" : "bg-gray-50"
                        }`}                      // className="flex-1 p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"

                    />
                    <input
                      type="number"
                      placeholder="GST"
                      value={elevator['gstOrdinary'] || ""}
                      readOnly
                      //  value={formData[elevator.id]?.[`${plan}_gst`] || ""}
                      //  onChange={(e) => handleChange(e, elevator.id, `${plan}_gst`)}
                      className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                    />
                    <input
                      type="number"
                      placeholder="Final Amount"
                      value={elevator['totalAmountOrdinary'] || ""}
                      readOnly
                      //  value={formData[elevator.id]?.[`${plan}_final`] || ""}
                      //  onChange={(e) => handleChange(e, elevator.id, `${plan}_final`)}
                      className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                    />
                  </div>

                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <h3 className="font-semibold text-center mb-2">Semi-Comp</h3>
                    <input
                      type="number"
                      placeholder="Base Price"
                      value={elevator['amountSemi'] || ""}
                      onChange={(e) => handleChange(index, "amountSemi", e.target.value)}
                      required={semiComprehensiveChecked}
                      readOnly={!semiComprehensiveChecked}
                      // value={formData[elevator.id]?.[`${plan}_base`] || ""}
                      // onChange={(e) => handleChange(e, elevator.id, `${plan}_base`)}
                      // className="p-2 w-full rounded bg-white-900 shadow-sm  focus:outline-none focus:ring-1 focus:ring-blue-500"
                      className={`p-2 w-full rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${semiComprehensiveChecked ? "bg-white" : "bg-gray-50"
                        }`}
                    />
                    <input
                      type="number"
                      placeholder="GST"
                      value={elevator['gstSemi'] || ""}
                      readOnly
                      //  value={formData[elevator.id]?.[`${plan}_gst`] || ""}
                      //  onChange={(e) => handleChange(e, elevator.id, `${plan}_gst`)}
                      className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                    />
                    <input
                      type="number"
                      placeholder="Final Amount"
                      value={elevator['totalAmountSemi'] || ""}
                      readOnly
                      //  value={formData[elevator.id]?.[`${plan}_final`] || ""}
                      //  onChange={(e) => handleChange(e, elevator.id, `${plan}_final`)}
                      className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                    />
                  </div>

                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <h3 className="font-semibold text-center mb-2">Comp</h3>
                    <input
                      type="number"
                      placeholder="Base Price"
                      value={elevator['amountComp'] || ""}
                      onChange={(e) => handleChange(index, "amountComp", e.target.value)}
                      required={comprehensiveChecked}
                      readOnly={!comprehensiveChecked}

                      // value={formData[elevator.id]?.[`${plan}_base`] || ""}
                      // onChange={(e) => handleChange(e, elevator.id, `${plan}_base`)}
                      // className="p-2 w-full rounded bg-white-900 shadow-sm  focus:outline-none focus:ring-1 focus:ring-blue-500"
                      className={`p-2 w-full rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${comprehensiveChecked ? "bg-white" : "bg-gray-50"
                        }`}
                    />
                    <input
                      type="number"
                      placeholder="GST"
                      value={elevator['gstComp'] || ""}
                      readOnly
                      //  value={formData[elevator.id]?.[`${plan}_gst`] || ""}
                      //  onChange={(e) => handleChange(e, elevator.id, `${plan}_gst`)}
                      className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                    />
                    <input
                      type="number"
                      placeholder="Final Amount"
                      value={elevator['totalAmountComp'] || ""}
                      readOnly
                      //  value={formData[elevator.id]?.[`${plan}_final`] || ""}
                      //  onChange={(e) => handleChange(e, elevator.id, `${plan}_final`)}
                      className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                    />
                  </div>

                </div>


              </div>
            ))}


          </div>

          {/*  last final amount part   */}

          <div className="bg-white shadow-md rounded-xl mt-10 p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Final Amounts Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-center bg-gray-50 p-4 rounded-lg">
              {/* Lift ID */}
              <div className="md:col-span-1 flex items-center justify-center font-semibold text-gray-700">

              </div>


              {/* liftType : "",
      machineType: "",
      noOfFloors: "",
      capacityTerm: "",
      selectPerson:"", */}

              {/* Left Side: Elevator Info */}
              <div className="md:col-span-3 space-y-6 mt-9">
                {/* Final Amount */}
                <div className="flex items-center ml-20">
                  <label className="font-semibold text-gray-900">Final Amount</label>
                </div>

                {/* Final GST */}
                <div className="flex items-center ml-20">
                  <label className="font-semibold text-gray-900">Final GST</label>
                </div>

                {/* Final Total Amount */}
                <div className="flex items-center ml-20">
                  <label className="font-semibold text-gray-900">Final Total Amount</label>
                </div>
              </div>





              {/* Right Side: Pricing */}
              <div className="md:col-span-8 grid grid-cols-3 gap-3">

                {/* non - comp */}
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <h3 className="font-semibold text-center mb-2">Non-Comp</h3>
                  <input
                    type="number"
                    placeholder="Base Price"
                    value={formData['amountOrdinary'] || ""}
                    readOnly
                    // onChange={(e) => handleChange(e, elevator.id, `${plan}_base`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="GST"
                    value={formData['gstOrdinary'] || ""}
                    readOnly
                    //  value={formData[elevator.id]?.[`${plan}_gst`] || ""}
                    //  onChange={(e) => handleChange(e, elevator.id, `${plan}_gst`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                  />
                  <input
                    type="number"
                    placeholder="Final Amount"
                    value={formData['isFinalOrdinary'] || ""}
                    readOnly
                    //  value={formData[elevator.id]?.[`${plan}_final`] || ""}
                    //  onChange={(e) => handleChange(e, elevator.id, `${plan}_final`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                  />
                </div>

                {/* semi - comp */}
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <h3 className="font-semibold text-center mb-2">Semi-Comp</h3>
                  <input
                    type="number"
                    placeholder="Base Price"
                    value={formData['amountSemiComp'] || ""}
                    readOnly
                    // value={formData[elevator.id]?.[`${plan}_base`] || ""}
                    // onChange={(e) => handleChange(e, elevator.id, `${plan}_base`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="GST"
                    value={formData['gstSemi'] || ""}
                    readOnly
                    //  value={formData[elevator.id]?.[`${plan}_gst`] || ""}
                    //  onChange={(e) => handleChange(e, elevator.id, `${plan}_gst`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                  />
                  <input
                    type="number"
                    placeholder="Final Amount"
                    value={formData['isFinalSemicomp'] || ""}
                    readOnly
                    //  value={formData[elevator.id]?.[`${plan}_final`] || ""}
                    //  onChange={(e) => handleChange(e, elevator.id, `${plan}_final`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                  />
                </div>

                {/* comp */}
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <h3 className="font-semibold text-center mb-2">Comp</h3>
                  <input
                    type="number"
                    placeholder="Base Price"
                    value={formData['amountComp'] || ""}
                    readOnly
                    // value={formData[elevator.id]?.[`${plan}_base`] || ""}
                    // onChange={(e) => handleChange(e, elevator.id, `${plan}_base`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="GST"
                    value={formData['gstComp'] || ""}
                    readOnly
                    //  value={formData[elevator.id]?.[`${plan}_gst`] || ""}
                    //  onChange={(e) => handleChange(e, elevator.id, `${plan}_gst`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                  />
                  <input
                    type="number"
                    placeholder="Final Amount"
                    value={formData['isFinalComp'] || ""}
                    readOnly
                    //  value={formData[elevator.id]?.[`${plan}_final`] || ""}
                    //  onChange={(e) => handleChange(e, elevator.id, `${plan}_final`)}
                    className="p-2 w-full rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                  />
                </div>




              </div>


            </div>



          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
            <button   // <-- call function here
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
