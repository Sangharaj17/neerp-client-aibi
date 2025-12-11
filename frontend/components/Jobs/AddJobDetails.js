// components/AddJobForm.jsx
import { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

import { useRouter, useParams } from "next/navigation";

export default function AddJobForm() {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState([]);
  //   "AMC for Mr. SAGAR KANJANE / Regent Hills - B&C WING",
  //     "AMC for Mr. JOHN DOE / Skyline Tower",
  //     "AMC for Mr. RAJ PATIL / Green Valley"
  const [filteredJobs, setFilteredJobs] = useState(jobDetails);
  const [jobSearch, setJobSearch] = useState("");
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");

  // const [engineers] = useState([
  //   { id: 1, name: "Aniket Ramchandra Bandal", role: "Service Engineer", address: "Pune" },
  //   { id: 2, name: "Rahul Deshmukh", role: "Senior Engineer", address: "Mumbai" },
  //   { id: 3, name: "Sneha Kulkarni", role: "Field Engineer", address: "Nagpur" },
  //   { id: 4, name: "Manish Patil", role: "Technician", address: "Pune" }
  // ]);

  const [engineers, setEngineers] = useState([]);

  const [filteredEngineers, setFilteredEngineers] = useState(engineers);
  const [engineerSearch, setEngineerSearch] = useState("");
  const [engineerDropdownOpen, setEngineerDropdownOpen] = useState(false);
  const [selectedEngineers, setSelectedEngineers] = useState([]);

  // Routes Data
  // const [routes] = useState([
  //   { id: 1, name: "Route 1 - Pune", engineers: [1, 4] },
  //   { id: 2, name: "Route 2 - Mumbai", engineers: [2] },
  //   { id: 3, name: "Route 3 - Nagpur", engineers: [3] }
  // ]);

  const [routes, setRoutes] = useState([]);


  const [routeSearch, setRouteSearch] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const [routeDropdownOpen, setRouteDropdownOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Toggle between route mode / manual selection
  const [selectionMode, setSelectionMode] = useState("manual");

  // Track selected job type (small change)
  const [selectedJobType, setSelectedJobType] = useState("");

  //   const handleJobSearch = (value) => {
  //     setJobSearch(value);
  //     setFilteredJobs(
  //       jobDetails.filter((job) => job.toLowerCase().includes(value.toLowerCase()))
  //     );
  //   };

  const handleEngineerSearch = (value) => {
    setEngineerSearch(value);
    setFilteredEngineers(
      engineers.filter((eng) =>
        `${eng.name} ${eng.role} ${eng.address}`
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
  };

  const addEngineer = (eng) => {
    if (!selectedEngineers.find((e) => e.employeeId === eng.employeeId)) {
      setSelectedEngineers([...selectedEngineers, eng]);
    }
    setEngineerSearch("");
    setEngineerDropdownOpen(false);
  };

  const removeEngineer = (id) => {
    setSelectedEngineers(selectedEngineers.filter((e) => e.employeeId !== id));
  };

  // Handle route search
  const handleRouteSearch = (value) => {
    setRouteSearch(value);
    setFilteredRoutes(
      routes.filter((route) =>
        route.routeName.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setRouteSearch(route.routeName);
    setRouteDropdownOpen(false);

    // Auto-select engineers for this route
    // Auto-select engineers for this route
    const routeEngineers = route.employees || []; // directly take employees from selected route
    setSelectedEngineers(routeEngineers);
  };

  const [jobTypes, setJobTypes] = useState([]);

  // Fetch job types from API on mount
  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await axiosInstance.get("/api/enquiry-types");
        setJobTypes(response.data || []); // assuming response is an array of {id, name}
      } catch (error) {
        console.error("Error fetching job types:", error);
      }
    };

    fetchJobTypes();
  }, []);

  useEffect(() => {

  }, [jobTypes])

  //  useEffect(() => {
  //   async function fetchJobs() {
  //     try {
  //       const res = await axiosInstance.get("/api/amc-jobs/pending");
  //       const data = res.data;

  //       // Optional: Map for better display (if needed)
  //       setJobDetails(data);
  //       setFilteredJobs(data);
  //     } catch (error) {
  //       console.error("Error fetching jobs:", error);
  //     }
  //   }

  //   fetchJobs();
  // }, []);

  useEffect(() => {

    async function fetchJobs() {
      try {
        if (selectedJobType === "New Installation") {
          const res = await axiosInstance.get("/api/quotations/finalized-active");
          const data = res.data?.data || [];

          setJobDetails(data);
          setFilteredJobs(data);
        } else {
          // Run both API calls in parallel
          const [amcJobsRes, renewalJobsRes] = await Promise.all([
            axiosInstance.get("/api/amc-jobs/pending"),
            axiosInstance.get("/api/amc-renewal-jobs/pendingRenewalJobs")
          ]);

          const amcJobs = amcJobsRes.data;
          const renewalJobs = renewalJobsRes.data;

          // Combine both results (customize as needed)
          const combinedJobs = [...amcJobs, ...renewalJobs];

          // Store combined data in your states
          setJobDetails(combinedJobs);
          setFilteredJobs(combinedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    fetchJobs();
  }, [selectedJobType]);


  // ✅ Handle search filtering
  const handleJobSearch = (value) => {
    setJobSearch(value);
    console.log(value, "handleJobSearch");
    console.log(jobDetails, "jobDetails");
    const filtered = jobDetails.filter((job) =>
      job.selectDetailForJob.toLowerCase().includes(value.toLowerCase())
    );
    console.log(filtered, "filtered");
    setFilteredJobs(filtered);
  };

  const [jobDetailsData, setJobDetailsData] = useState(null);

  const fetchJobDetails = async () => {
    //setLoading(true);
    //setError(null);
    try {
      const response = await axiosInstance.post(
        "/api/amc-jobs/get-add-job-details",
        {
          selectDetailForJob: selectedJob.selectDetailForJob,
          amcQuatationId: selectedJob.amcQuatationId,
          revisedQuatationId: selectedJob.revisedQuatationId,
        }
      );
      setJobDetailsData(response.data);
      setFilteredEngineers(response.data.employeeDtos || []);

      setRoutes(response.data.routesDtos || []);
      setFilteredRoutes(response.data.routesDtos || []);
      setEngineers(response.data.employeeDtos || []);

    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to fetch job details");
    } finally {
      //setLoading(false);
    }
  };

  const fetchRenewalJobDetails = async () => {
    //setLoading(true);
    //setError(null);
    try {
      const response = await axiosInstance.post(
        "/api/amc-renewal-jobs/get-add-renewal-job-details",
        {
          selectDetailForJob: selectedJob.selectDetailForJob,
          amcRenewalQuatationId: selectedJob.amcRenewalQuatationId,
          revisedRenewalQuatationId: selectedJob.revisedRenewalQuatationId,
        }
      );
      setJobDetailsData(response.data);
      setFilteredEngineers(response.data.employeeDtos || []);

      setRoutes(response.data.routesDtos || []);
      setFilteredRoutes(response.data.routesDtos || []);
      setEngineers(response.data.employeeDtos || []);

    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to fetch job details");
    } finally {
      //setLoading(false);
    }
  };



  useEffect(() => {
    if (!selectedJob) return; // Do nothing if no job is selected

    console.log(selectedJob);
    if (selectedJob.thisJobIsRenewal === true) {
      fetchRenewalJobDetails();
    } else
      fetchJobDetails();

  }, [selectedJob]);

  const [jobStatus, setJobStatus] = useState("");
  const [gstNumber, setCustomerGstNo] = useState("");
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");



  const handleSubmit = async () => {

    let selectedEmployeesIds = null;
    if (selectedRoute == null && selectionMode === "manual") {
      selectedEmployeesIds = selectedEngineers.map((eng) => eng.employeeId);
    }

    try {
      const requestDto = {
        // leadId: lead_id_state,
        amcQuatationId: selectedJob.amcQuatationId || null,
        revisedQuatationId: selectedJob.revisedQuatationId || null,

        // serviceEngineerId: selectedEngineer,
        salesExecutiveId: selectedSalesPerson,
        routeId: selectedRoute ? selectedRoute.routeId || 0 : null,
        listOfEmployees: selectedEmployeesIds,
        renewlStatus: 0,
        contractType: "",
        makeOfElevator: "",
        noOfElevator: 0,
        jobNo: 0,
        customerGstNo: gstNumber,
        jobType: "AMC",
        startDate: jobDetailsData ? jobDetailsData.startDate : "",
        endDate: "",
        noOfServices: jobDetailsData ? jobDetailsData.noOfServices : "",
        jobAmount: jobDetailsData ? jobDetailsData.jobAmount : 0,
        amountWithGst: 0,
        amountWithoutGst: 0,
        paymentTerm: jobDetailsData ? jobDetailsData.paymentTerm : "",
        gstPercentage: 0,
        dealDate: "",
        jobLiftDetail: "",
        jobStatus: jobStatus,
        status: 1,
        renewalRemark: "",
        isNew: 1,
        currentServiceNumber: 0,
      };

      toast.loading("Saving job...");

      const response = await axiosInstance.post("/api/amc-jobs/create-amc-job", requestDto);

      toast.dismiss(); // remove loading toast

      if (response.status === 200) {
        toast.success("AMC Job saved successfully!");
        // `/${tenant}/dashboard/jobs/amc_job_list`
        router.push(
          `/dashboard/jobs/amc_job_list/false`
        );
      } else {
        toast.error("Something went wrong while saving!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error saving AMC job:", error);
      toast.error("Failed to save AMC job");
    }
  };

  const handleSubmitRenewalJob = async () => {

    let selectedEmployeesIds = null;
    if (selectedRoute == null && selectionMode === "manual") {
      selectedEmployeesIds = selectedEngineers.map((eng) => eng.employeeId);
    }

    try {
      const requestDto = {
        // leadId: lead_id_state,
        amcRenewalQuatationId: selectedJob.amcRenewalQuatationId || null,
        revisedRenewalQuatationId: selectedJob.revisedRenewalQuatationId || null,

        // serviceEngineerId: selectedEngineer,
        salesExecutiveId: selectedSalesPerson,
        routeId: selectedRoute ? selectedRoute.routeId || 0 : null,
        listOfEmployees: selectedEmployeesIds,
        //renewlStatus: 0,
        contractType: "",
        makeOfElevator: "",
        noOfElevator: 0,
        jobNo: 0,
        customerGstNo: gstNumber,
        jobType: "AMC",
        startDate: jobDetailsData ? jobDetailsData.startDate : "",
        endDate: "",
        noOfServices: jobDetailsData ? jobDetailsData.noOfServices : "",
        jobAmount: jobDetailsData ? jobDetailsData.jobAmount : 0,
        amountWithGst: 0,
        amountWithoutGst: 0,
        paymentTerm: jobDetailsData ? jobDetailsData.paymentTerm : "",
        gstPercentage: 0,
        dealDate: "",
        jobLiftDetail: "",
        jobStatus: jobStatus,
        status: 1,
        renewalRemark: "",
        isNew: 1,
        currentServiceNumber: 0,
      };

      toast.loading("Saving Renewal job...");

      const response = await axiosInstance.post("/api/amc-renewal-jobs/create-amc-renewal-job", requestDto);

      toast.dismiss(); // remove loading toast

      if (response.status === 200) {
        toast.success("AMC Renewal Job saved successfully!");
        // `/${tenant}/dashboard/jobs/amc_job_list`
        let isRenewal = false;
        if (selectedJob.thisJobIsRenewal === true) {
          isRenewal = true;
        }
        router.push(
          `/dashboard/jobs/amc_job_list/${isRenewal}`
        );
      } else {
        toast.error("Something went wrong while saving!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error saving AMC job:", error);
      toast.error("Failed to save AMC job");
    }
  };


  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Job Details</h1>

      {/* Job Type and (conditionally shown) Job Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Job Type*</label>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedJobType}
            onChange={(e) => {
              setSelectedJobType(e.target.value);
              // reset job detail when type changes
              setSelectedJob("");
              setJobSearch("");
              setFilteredJobs(jobDetails);
            }}
          >
            <option value="">Select Job Type</option>
            {jobTypes.map((type) => (
              <option key={type.enquiryTypeId} value={type.enquiryTypeName}>
                {type.enquiryTypeName}
              </option>
            ))}
          </select>
        </div>

        {/* Select Detail For Job - SHOW ONLY when a job type is chosen */}
        {/* Select Detail For Job - SHOW ONLY when a job type is chosen */}
        {selectedJobType && (
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Select Detail For Job*
            </label>
            <input
              type="text"
              value={jobSearch}
              onChange={(e) => handleJobSearch(e.target.value)}
              onFocus={() => setJobDropdownOpen(true)}
              onBlur={() => setTimeout(() => setJobDropdownOpen(false), 150)}
              placeholder="Search Job..."
              className="w-full border rounded-lg p-2"
            />
            {jobDropdownOpen && (
              <ul className="absolute z-10 bg-white border rounded-lg shadow w-full mt-1 max-h-40 overflow-auto">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedJob(job); // store full object
                        setJobSearch(job.selectDetailForJob); // show text in input
                        setJobDropdownOpen(false);
                      }}
                    >
                      {job.selectDetailForJob}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-400 text-sm">
                    No results found
                  </li>
                )}
              </ul>
            )}
            {selectedJob && (
              <div className="mt-2 text-sm text-green-700 font-medium">
                ✅ {selectedJob.selectDetailForJob}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Show below fields only when a job is selected */}
      {selectedJob && (
        <>
          {/* Remaining Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Job Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Amount*</label>
              <input
                type="number"
                readOnly
                value={jobDetailsData ? jobDetailsData.jobAmount : 0}
                className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer</label>
              <input
                readOnly
                value={jobDetailsData ? jobDetailsData.customer : ""}
                type="text"
                className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer Site</label>
              <input
                readOnly
                value={jobDetailsData ? jobDetailsData.customerSite : ""}
                type="text"
                className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">Job No</label>
              <input type="text" className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer GST No</label>
              <input onChange={(e) => {
                setCustomerGstNo(e.target.value);
              }} type="text" className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sales Executive*
              </label>
              <select onChange={(e) => {
                setSelectedSalesPerson(e.target.value);
              }} className="w-full border rounded-lg p-2">
                <option value="">Select</option>
                {engineers.map((engineer) => (
                  <option key={engineer.employeeId} value={engineer.employeeId}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">Start Date*</label>
              <input
                type="date"
                readOnly
                value={jobDetailsData ? jobDetailsData.startDate : ""}
                className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>


            {/* <div>
              <label className="block text-sm font-medium mb-1">Job Lift Details</label>
              <select className="w-full border rounded-lg p-2">
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium mb-1">Job Status*</label>
              <select
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Select Job Status --</option>
                <option value="Hold">Hold</option>
                <option value="WIP">WIP</option>
                <option value="Pre Service">Pre Service</option>
                <option value="Option">Option</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms*</label>
              <input
                type="text"
                readOnly
                value={jobDetailsData ? jobDetailsData.paymentTerm : ""}
                className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

          </div>

          {/* Selection Mode Toggle */}
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="selectionMode"
                value="routes"
                checked={selectionMode === "routes"}
                onChange={() => {
                  setSelectionMode("routes");
                  setSelectedEngineers([]); // 
                }}
              />
              Go with Routes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="selectionMode"
                value="manual"
                checked={selectionMode === "manual"}
                onChange={() => {
                  setSelectionMode("manual");
                  setSelectedRoute(null);
                  setSelectedEngineers([]); // 
                  setRouteSearch("");
                }}
              />
              Select Individual Engineers
            </label>
          </div>

          {/* Service Engineer Section */}
          {selectionMode === "routes" ? (
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Select Route*</label>
              <input
                type="text"
                value={routeSearch}
                onChange={(e) => handleRouteSearch(e.target.value)}
                onFocus={() => setRouteDropdownOpen(true)}
                onBlur={() => setTimeout(() => setRouteDropdownOpen(false), 150)}
                placeholder="Search Route..."
                className="w-full border rounded-lg p-2"
              />
              {routeDropdownOpen && (
                <ul className="absolute z-10 bg-white border rounded-lg shadow w-full mt-1 max-h-40 overflow-auto">
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((route, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleRouteSelect(route);
                          setFilteredRoutes(routes);
                        }}
                      >
                        {route.routeName}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-400 text-sm">
                      No routes found
                    </li>
                  )}
                </ul>
              )}
              {selectedRoute && (
                <div className="mt-2 text-sm text-green-700 font-medium">
                  ✅ {selectedRoute.routeName}
                </div>
              )}
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium mb-1">
                Select Service Engineer*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={engineerSearch}
                  onChange={(e) => handleEngineerSearch(e.target.value)}
                  onFocus={() => setEngineerDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setEngineerDropdownOpen(false), 150)}
                  placeholder="Search by name, role or address..."
                  className="w-full border rounded-lg p-2"
                />
                {engineerDropdownOpen && (
                  <ul className="absolute z-10 bg-white border rounded-lg shadow w-full mt-1 max-h-40 overflow-auto">
                    {filteredEngineers.length > 0 ? (
                      filteredEngineers.map((eng, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            addEngineer(eng);
                            setEngineerSearch("");
                            setFilteredEngineers(engineers);
                          }}
                        >
                          <span className="font-medium">{eng.name}</span> —{" "}
                          <span className="text-sm text-gray-600">{eng.role}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({eng.address})
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-gray-400 text-sm">
                        No results found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* Selected Engineers Grid */}
          {selectedEngineers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {selectedEngineers.map((eng, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 shadow hover:shadow-md flex items-start gap-3 bg-gray-50 relative"
                >
                  <User className="text-blue-500 w-6 h-6 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">{eng.name}</p>
                    <p className="text-sm text-gray-600">{eng.role}</p>
                    <p className="text-xs text-gray-500">{eng.address}</p>
                  </div>
                  <button
                    onClick={() => removeEngineer(eng.employeeId)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Lift Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {jobDetailsData?.liftDatas?.map((lift, index) => (
                <div
                  key={index}
                  className="relative border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-5 overflow-hidden"
                >
                  {/* Gradient Header */}
                  <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl flex items-center px-5 text-white font-bold text-lg">
                    {/* Lift {index + 1} */}
                    {lift.liftName || `Lift ${index + 1}`}
                  </div>

                  <div className="mt-14 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm mb-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Lift Name
                      </span>
                      <span className="text-gray-800 font-medium">{lift.liftName || "N/A"}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm mb-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m2 0a2 2 0 110 4H7a2 2 0 110-4h2"
                          />
                        </svg>
                        Capacity
                      </span>
                      <span className="text-gray-800 font-medium">{lift.capacityValue}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm mb-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-8 8v8m8-8v8M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                          />
                        </svg>
                        Type
                      </span>
                      <span className="text-gray-800 font-medium">{lift.typeOfElevators}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm mb-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M3 12h18M3 17h18"
                          />
                        </svg>
                        Floors
                      </span>
                      <span className="text-gray-800 font-medium">{lift.noOfFloors}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Submit Button */}
          <div className="mt-6">
            <button onClick={() => {

              if (selectedJob.thisJobIsRenewal === true) {
                handleSubmitRenewalJob();
              } else {
                handleSubmit();
              }

            }} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
