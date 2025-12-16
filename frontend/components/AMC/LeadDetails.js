"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import { useParams } from "next/navigation";
import ActionModal from "@/components/AMC/ActionModal";
import AddTodo from "./AddTodo";
import AddActivity from "./AddActivity";
import axiosInstance from "@/utils/axiosInstance";
import UpdateProjectStage from "./UpdateProjectStage";
import UpdateLeadStatus from "./UpdateLeadStatus";
import UpdateLeadStage from "./UpdateLeadStage";

export default function LeadDetails({ leadId}) {

      const router = useRouter();

        const { id } = useParams();


        
      

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const handleSetLead = (data) => {
    setLead(data);
  }

  // Fetch Lead Details
  useEffect(() => {
    const fetchLeadDetails = async () => {
      if (!leadId) return;

      try {
        const response = await axiosInstance.get(
          `/api/leadmanagement/leads/${leadId}`
        );
        console.log("Lead data:", response.data);
        setLead(response.data);
      } catch (error) {
        console.error("Error fetching lead:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId]);

  // Fetch Lead Activities
  useEffect(() => {
    fetchLeadActivities();
  }, [leadId ]);

   const [activityAddedStatus, setActivityAddedStatus] = useState(false);

  const handleActivityAdded = (status) => {
    setActivityAddedStatus(status);
  }

  useEffect(() => {
    if(activityAddedStatus === true){
    fetchLeadActivities();
    setActivityAddedStatus(false);
    }
  }, [ activityAddedStatus]);

   const fetchLeadActivities = async () => {
      if (!leadId) return;

      try {
        const response = await axiosInstance.get(
          "/api/leadmanagement/lead-activity/getAllLeadTodoActivitylist",
          { params: { leadId } }
        );
        console.log("Lead activities:", response.data);
        setActivities(response.data || []);
      } catch (error) {
        console.error("Error fetching lead activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

 
    

   const [isModalOpen, setModalOpen] = useState(false);
const [modalTitle, setModalTitle] = useState('');
const [modalContent, setModalContent] = useState(null);

// ---- Generic Method to Open Modal ----
const openModal = (title, content) => {
  setModalTitle(title);
  setModalContent(content);
  setModalOpen(true); // ✅ fixed name
};

const closeModal = () => {
    setModalOpen(false);
    setModalTitle('');
}

// ---- Action Methods ----
const addToDo = () => {
  openModal("Add To Do", <AddTodo closeModal={closeModal} leadId={leadId}/>);
};

const addActivity = () => {
  openModal("Add Activity", <AddActivity leadId={leadId} closeModal={closeModal} handleActivityAdded = {handleActivityAdded}/>);
};

const updateStage = () => {
  openModal("Update Stage", <UpdateLeadStage closeModal={closeModal} leadId={leadId} handleStageUpdated={handleSetLead} currentLead={lead} />);
};

const updateStatus = () => {
  openModal("Update Status", <UpdateLeadStatus closeModal={closeModal} leadId={leadId} handleStatusUpdated={handleSetLead} currentLead={lead} />);
};

const updateStageOfProject = () => {
  openModal("Update Stage Of Project", <UpdateProjectStage closeModal={closeModal} leadId={leadId} handleStageUpdated={handleSetLead} currentLead={lead} />);
};


  const backToList = () => {
    router.push(ROUTES.LEAD_LIST());
  };

  // ---- Buttons Config ----
  const buttons = [
    { label: "Add To Do", onClick: addToDo },
    { label: "Add Activity", onClick: addActivity },
    { label: "Update Stage", onClick: updateStage },
    { label: "Update Status", onClick: updateStatus },
    { label: "Update Stage Of Project", onClick: updateStageOfProject },
    { label: "Back To List", onClick: backToList },
  ];

  if (loading) return <div className="p-4">Loading...</div>;
  if (!lead) return <div className="p-4">No data found.</div>;


 

  return (
    <>
    <div className="p-4 space-y-6">
      {/* Top Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={btn.onClick}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded"
        >
          {btn.label}
        </button>
      ))}
    </div>

      {/* Lead Details */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          {/* Left column */}
          <div className="border-r border-gray-300">
            {[
              ["Lead Type", lead.leadType],
              ["Sales Employee Name", lead.activityBy?.employeeName],
              ["Lead Company Name", lead.leadCompanyName],
              ["Contact Name", lead.customerName],
              ["Address", lead.address],
              ["Email Id", lead.emailId],
            ].map(([label, value], i) => (
              <div key={i} className="flex border-b border-gray-300">
                <div className="w-1/2 bg-gray-100 px-3 py-2 text-sm font-medium">
                  {label}
                </div>
                <div className="w-1/2 px-3 py-2 text-sm">{value || "-"}</div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div>
            {[
              ["Contact No", lead.contactNo],
              ["Site Name", lead.siteName],
              ["Site Address", lead.siteAddress],
              ["Lead Stage", lead.leadStage?.stageName],
              ["Status", lead.status],
              ["Stage of Project", lead.projectStage?.stageName || "-"],
            ].map(([label, value], i) => (
              <div key={i} className="flex border-b border-gray-300">
                <div className="w-1/2 bg-gray-100 px-3 py-2 text-sm font-medium">
                  {label}
                </div>
                <div className="w-1/2 px-3 py-2 text-sm">{value || "-"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead History Details Table */}
      <div className="flex justify-center">
        <div className="w-full md:w-11/12 lg:w-5/6 xl:w-3/4">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Lead History Details
          </h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Sr. No.",
                    "Activity Date",
                    "Activity Time",
                    "Activity By",
                    "Activity Title",
                    "Feedback",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium text-left"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingActivities ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      Loading activities...
                    </td>
                  </tr>
                ) : activities.length > 0 ? (
                  activities.map((activity, idx) => (
                    <tr key={activity.activityId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.activityDate || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.activityTime || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.activityByEmpName || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.activityTitle || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.feedback || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

     {/* Modal */}
      <ActionModal
        isOpen={isModalOpen}
        title={modalTitle}
        onCancel={() => setModalOpen(false)}
      >
        {modalContent}
      </ActionModal>
    </>
  );
}
