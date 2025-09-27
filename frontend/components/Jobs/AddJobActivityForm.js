"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddJobActivityForm({jobId}) {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [breakdowns, setBreakdowns] = useState([]);
  const [lifts, setLifts] = useState([]);
  const [employees, setEmployees] = useState([]);

   
  useEffect(()=>{
    if(jobId){
        const selectedJob = jobs.find((j) => j.jobId.toString() === jobId);
        setMailId(selectedJob ? selectedJob.mailId : "");
    }
  })

  const [formData, setFormData] = useState({
    jobId: jobId || "",  
    jobActivityTypeId: "",
    activityDate: "",
    activityTime: "",
    activityDescription: "",
    jobService: "",
    jobTypeWork: "",
    executiveId: "",
    jobActivityById: "",
    jobActivityBy2: "",
    mailSent: false,
    remark: "",
    customerFeedback: "",
    inTime: "",
    outTime: "",
    actService: "",
    breakdownTodoId: "", 
    liftIds: [],
  });

  const [mailId , setMailId] = useState("");

  // --- Initial fetch ---
  useEffect(() => {
    axiosInstance.get("/api/amc-jobs/getAllActiveJobs")
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]));

    axiosInstance.get("/api/job-activity-types")
      .then((res) => setActivityTypes(res.data || []))
      .catch(() => setActivityTypes([]));

    axiosInstance.get("/api/employees/executives")
      .then((res) => setEmployees(res.data || []))
      .catch(() => setEmployees([]));
  }, []);

  // Fetch breakdown todos if breakdown activity selected
  useEffect(() => {
    if (formData.jobId && isBreakdownSelected()) {
      axiosInstance
        .get(`/api/breakdown-todo/job/${formData.jobId}`)
        .then((res) => {
          setBreakdowns(res.data || []);
         // alert(res.data.length+" breakdown todos found for this job.");
        })
        .catch(() => setBreakdowns([]));
    } else {
      setBreakdowns([]);
      setFormData((prev) => ({ ...prev, breakdownTodoId: "", liftIds: [] }));
      setLifts([]);
    }
  }, [formData.jobId, formData.jobActivityTypeId]);

  // Fetch lifts if breakdown todo selected
  useEffect(() => {
    setCurrentServiceStatus("");
    if (formData.breakdownTodoId) {
      axiosInstance
        .get(`/api/breakdown-todo/getLiftsByBreakDownId/${formData.breakdownTodoId}`)
        .then((res) => {setLifts(res.data || []);})
        .catch(() => setLifts([]));
    } else {
      setLifts([]);
      setFormData((prev) => ({ ...prev, liftIds: [] }));
    }
  }, [formData.breakdownTodoId]);

  const isBreakdownSelected = () => {
    const sel = activityTypes.find((a) => `${a.id}` === `${formData.jobActivityTypeId}`);
    return !!sel && sel.activityName && sel.activityName.toLowerCase() === "breakdown";
  };

  const isServiceSelected = () => {
    const sel = activityTypes.find((a) => `${a.id}` === `${formData.jobActivityTypeId}`);
    return !!sel && sel.activityName && sel.activityName.toLowerCase() === "service";
  };

  const [currentServiceStatus , setCurrentServiceStatus] = useState("");

    useEffect(() => {
    if (isServiceSelected() && formData.jobId) {
      // Call your API when service is selected and jobId exists
      axiosInstance
        .get(`/api/jobs/initial/amc-job-activities/current-service-status/${formData.jobId}`)
        .then((response) => {
           
          setCurrentServiceStatus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching current service status:", error);
          setCurrentServiceStatus(""); // fallback if error occurs
        });
    }
  }, [formData.jobActivityTypeId, formData.jobId]); // re-run when jobActivityTypeId or jobId changes

  useEffect(()=>{
    if(isBreakdownSelected()){
        setCurrentServiceStatus("");
    }
  },[formData.jobActivityTypeId])

  const [addServiceActivityGetData , setAddServiceActivityGetData] = useState(null);

 // Fetch AddServiceActivityGetData if status is pending
  useEffect(() => {

    if (currentServiceStatus === "Pending" && formData.jobId) {
         // alert(currentServiceStatus+" "+formData.jobId);
      axiosInstance
        .get(`/api/jobs/initial/amc-job-activities/getAddServiceActivityData/${formData.jobId}`)
        .then((response) => {
          setAddServiceActivityGetData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching AddServiceActivityGetData:", error);
          setAddServiceActivityGetData(null);
        });
    }
  }, [currentServiceStatus, formData.jobId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLiftToggle = (liftId) => {
    setFormData((prev) => {
      const id = Number(liftId);
      const exists = prev.liftIds.includes(id);
      return {
        ...prev,
        liftIds: exists ? prev.liftIds.filter((i) => i !== id) : [...prev.liftIds, id],
      };
    });
  };

  const validate = () => {
    if (!formData.jobId) { alert("Please select job"); return false; }
    if (!formData.jobActivityTypeId) { alert("Please select activity type"); return false; }
    if (!formData.activityDate) { alert("Please select activity date"); return false; }
    if (!formData.activityTime) { alert("Please select activity time"); return false; }
    if (!formData.jobActivityById && !formData.jobActivityBy2) {
      alert("Please select activity by (select an employee or enter name)");
      return false;
    }
    if (isBreakdownSelected() && !formData.breakdownTodoId) {
      alert("Please select breakdown todo");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      jobId: formData.jobId ? Number(formData.jobId) : null,
      jobActivityTypeId: formData.jobActivityTypeId ? Number(formData.jobActivityTypeId) : null,
      activityDate: formData.activityDate,
      activityTime: formData.activityTime,
      activityDescription: formData.activityDescription,
      jobService: addServiceActivityGetData ? addServiceActivityGetData.serviceName : "",
      jobTypeWork: formData.jobTypeWork,
      executiveId : formData.executiveId ? Number(formData.executiveId) : null,
      jobActivityById: formData.jobActivityById ? Number(formData.jobActivityById) : null,
      jobActivityBy2: formData.jobActivityBy2 || null,
      mailSent: Boolean(formData.mailSent),
      remark: formData.remark,
      customerFeedback: formData.customerFeedback,
      inTime: formData.inTime,
      outTime: formData.outTime,
      actService: formData.actService,
      breakdownTodoId: formData.breakdownTodoId ? Number(formData.breakdownTodoId) : null,
      liftIds: (formData.liftIds || []).map((i) => Number(i)),
    };

    try {
      await axiosInstance.post("/api/jobs/initial/amc-job-activities/add", payload);
     // alert("Job activity added successfully!");
      setFormData({
        jobId: "",
        jobActivityTypeId: "",
        activityDate: "",
        activityTime: "",
        activityDescription: "",
        jobService: "",
        jobTypeWork: "",
        jobActivityById: "",
        jobActivityBy2: "",
        mailSent: false,
        remark: "",
        customerFeedback: "",
        inTime: "",
        outTime: "",
        actService: "",
        breakdownTodoId: "",
        liftIds: [],
      });
      setBreakdowns([]);
      setLifts([]);
      toast.success("Job activity added successfully!");
  router.push(`/${localStorage.getItem("tenant")}/dashboard/jobs/amc_job_list/view_amc_job_detail?jobId=${jobId}`);

    } catch (err) {
      console.error(err);
      alert("Failed to submit job activity.");
    }
  };

  const [selectedJobActivityTypeId , setSelectedJobActivityTypeId] = useState("");

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Add Job Activity</h2>

      {/* Job & Activity Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Job</label>
          <select
            name="jobId"
            value={formData.jobId}
            onChange={(e) => {
              const selectedJobId = e.target.value;
              handleChange(e);
              const selectedJob = jobs.find((j) => j.jobId.toString() === selectedJobId);
              setMailId(selectedJob ? selectedJob.mailId : "");
            }}
            className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">-- Select Job --</option>
            {jobs.map((j) => (
              <option key={j.jobId} value={j.jobId}>
                {j.customerName} - {j.siteName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Activity Type</label>
          <select
            name="jobActivityTypeId"
            value={formData.jobActivityTypeId}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">-- Select Activity Type --</option>
            {activityTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.activityName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Breakdown & Lifts */}
      {isBreakdownSelected() && (
        <>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Breakdown Todo</label>
              <select
                name="breakdownTodoId"
                value={formData.breakdownTodoId}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">-- Select Breakdown --</option>
                {breakdowns.map((b) => (
                  <option key={b.custTodoId} value={b.custTodoId}>
                    {b.purpose} — {b.todoDate} ({b.venue})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {lifts.length > 0 && (
            <div>
              <label className="font-semibold text-gray-700 mb-3">Select Lifts</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-72 overflow-y-auto">
                {lifts.map((lift, idx) => (
                  <div
                    key={lift.enquiryId}
                    className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center text-center
                      ${formData.liftIds.includes(lift.enquiryId) ? "bg-blue-100 border-blue-500" : "bg-white hover:bg-gray-100"}`}
                    onClick={() => handleLiftToggle(lift.enquiryId)}
                  >
                    <span className="font-semibold text-gray-800">
                      {lift.liftName || `Lift ${idx + 1}`}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">{lift.capacityValue || "N/A"} - {lift.typeOfElevators || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {currentServiceStatus === "Pending" && addServiceActivityGetData && (
  <div className="space-y-6 mt-4">
    {/* Display service name */}
    <div>
      <label className="font-semibold text-gray-700">Service Name</label>
      <input
        type="text"
        value={addServiceActivityGetData.serviceName}
        readOnly
        className="w-full mt-2 p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700"
      />
    </div>

    {/* Display lifts as selectable grid */}
    {addServiceActivityGetData.serviceLifsDatas &&
      addServiceActivityGetData.serviceLifsDatas.length > 0 && (
        <div>
          <label className="font-semibold text-gray-700 mb-3 block">
            Select Lifts
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-72 overflow-y-auto">
            {addServiceActivityGetData.serviceLifsDatas.map((lift, idx) => (
              <div
                key={lift.enquiryId}
                className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center text-center transition
                  ${
                    formData.liftIds.includes(lift.enquiryId)
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                onClick={() => handleLiftToggle(lift.enquiryId)}
              >
                <span className="font-semibold text-gray-800">
                  {lift.liftName || `Lift ${idx + 1}`}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {lift.capacityValue || "N/A"} -{" "}
                  {lift.typeOfElevators || "N/A"}
                </span>
                <span className="text-xs text-gray-400">
                  {lift.noOfFloors ? `${lift.noOfFloors} Floors` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
  </div>
)}

{currentServiceStatus === "Completed" && (
  <div className="mt-6 flex justify-center">
    <div className="bg-green-50 border border-green-300 text-green-800 rounded-2xl shadow-md p-6 max-w-md text-center">
      <svg
        className="mx-auto mb-3 w-12 h-12 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-xl font-bold">Service Completed</h2>
      <p className="mt-2 text-gray-600">
        The service for this job has already been completed for the current month.
        <br />
        <span className="font-semibold text-gray-700">
          The next service will unlock in the next month.
        </span>
      </p>
    </div>
  </div>
)}


      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Activity Date</label>
          <input type="date" name="activityDate" value={formData.activityDate}
                 onChange={handleChange} className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Activity Time</label>
          <input type="time" name="activityTime" value={formData.activityTime}
                 onChange={handleChange} className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">Activity Description</label>
        <textarea
          name="activityDescription"
          value={formData.activityDescription}
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      {/* Job Type Work */}

      
          {/* Job Type Work */}
{/* Job Type Work */}
{isBreakdownSelected() && (
  <div className="flex flex-col md:w-1/2">
    <label className="font-semibold text-gray-700 mb-2">Job Type Work</label>
    <input
      type="text"
      name="jobTypeWork"
      value={formData.jobTypeWork}
      onChange={handleChange}
      className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
    />
  </div>
)}




      

      {/* Activity By & Executive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Activity By</label>
          <select name="jobActivityById" value={formData.jobActivityById} onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
            <option value="">-- Select Employee --</option>
            {employees.map((e) => <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Select Executive</label>
          <select name="executiveId" value={formData.executiveId} onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
            <option value="">-- Select Employee --</option>
            {employees.map((e) => <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>)}
          </select>
        </div>
      </div>

      {/* Mail Sent */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col ">
          <label className="font-semibold text-gray-700 mb-2">Mail Sent</label>
          <input type="text" name="mailSent" readOnly value={mailId}
                className="border border-gray-300 rounded-xl p-3 bg-gray-100 cursor-not-allowed" />
        </div>

        <div className="flex flex-col ">
          <label className="font-semibold text-gray-700 mb-2">Activity Remark</label>
          <input onChange={handleChange} type="text" name="remark"  value={formData.remark}
                className="border border-gray-300 rounded-xl p-3 bg-gray-100" />
        </div>
        </div>

      {/* Submit */}
      <button disabled={currentServiceStatus === "Completed"} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg transition">
        Submit
      </button>
    </form>
  );
}
