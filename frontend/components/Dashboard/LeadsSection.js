'use client'
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Search, Edit2 } from 'lucide-react';
// Assuming you have components/AMC/ActionModal.js or adjust the path
import ActionModal from '../AMC/ActionModal';
// Assuming you have components/AMC/AddActivity.js
import AddActivity from '../AMC/AddActivity';
// Assuming you have components/AMC/AddTodo.js (or similar path)
import AddTodo from '../AMC/AddTodo'; // <--- NEW IMPORT

// --- reusable todo item
// MODIFIED: Accepts a 'status' prop to determine the badge color
const TodoItem = ({ item, openModal, status }) => {
  const badgeClasses = status === 'missed' 
    ? 'bg-red-100 text-red-600' // Red for missed
    : 'bg-green-100 text-green-700'; // Green for upcoming/todo

  return (
    <div className="flex items-center justify-between gap-3 bg-white rounded px-3 py-2 mb-2 border border-gray-200 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">¦¦</div>
        <div className="text-sm text-gray-800">
          <div className="font-medium">{item.todoName || item.taskName || 'Task'}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Conditional badge class applied here */}
        <div className={`px-2 py-1 rounded text-xs ${badgeClasses}`}>
          {item.dateAndTime || item.dueDate || 'ASAP'}
        </div>
        <button className="p-1 rounded bg-white border border-blue-200 hover:bg-blue-50">
          {/* Note: openModal is for 'AddActivity' which handles an *existing* todo */}
          <Edit2 onClick={() => openModal(item.leadId, item.todoId)} className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default function LeadsSection() {
  // --- leads todo
  const [leads, setLeads] = useState([]);
  const [leadsPage, setLeadsPage] = useState(0);
  const [leadsSize, setLeadsSize] = useState(10);
  const [leadsTotalPages, setLeadsTotalPages] = useState(0);
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsLoading, setLeadsLoading] = useState(false);

  // --- missed activities
  const [missed, setMissed] = useState([]);
  const [missedPage, setMissedPage] = useState(0);
  const [missedSize, setMissedSize] = useState(10);
  const [missedTotalPages, setMissedTotalPages] = useState(0);
  const [missedSearch, setMissedSearch] = useState('');
  const [missedLoading, setMissedLoading] = useState(false);

  // fetch leads todo
  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      const res = await axiosInstance.get('/api/dashboard/leadsTodoList', {
        params: { page: leadsPage, size: leadsSize, search: leadsSearch },
      });
      setLeads(res.data.content || []);
      setLeadsTotalPages(res.data.totalPages ?? 0);
    } catch (err) {
      console.error('Error fetching leads todo:', err);
    } finally {
      setLeadsLoading(false);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, [leadsPage, leadsSize, leadsSearch]);

  // fetch missed activities
  const fetchMissed = async () => {
    try {
      setMissedLoading(true);
      const res = await axiosInstance.get('/api/dashboard/leads-missed-no-activity', {
        params: { page: missedPage, size: missedSize, search: missedSearch },
      });
      setMissed(res.data.content || []);
      setMissedTotalPages(res.data.totalPages ?? 0);
    } catch (err) {
      console.error('Error fetching missed activities:', err);
    } finally {
      setMissedLoading(false);
    }
  };
  useEffect(() => {
    fetchMissed();
  }, [missedPage, missedSize, missedSearch]);

  // --- State for AddActivity (Edit Button) Modal
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [leadIdForActivity, setLeadIdForActivity] = useState(null);
  const [todoidForActivity, setTodoidForActivity] = useState(null);

  // --- State for AddTodo (Add Lead To Do Button) Modal
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  // State for AddTodo. We'll use this if the AddTodo component expects a leadId prop.
  const [leadIdForTodo, setLeadIdForTodo] = useState(null);


  // Function to open the AddActivity Modal (from Edit button on TodoItem)
  const openActivityModal = (id, todoId) => {
    setLeadIdForActivity(id);
    setTodoidForActivity(todoId);
    setIsActivityModalOpen(true);
  }

  // Function to open the AddTodo Modal (from '+ Add Lead To Do' button)
  const openTodoModal = () => {
    setIsTodoModalOpen(true);
    // Since this is a general "Add Lead To Do," the leadId is usually null/undefined
    // unless the component is designed to select a lead first. Setting it to null 
    // ensures a clean state for the new todo.
    setLeadIdForTodo(null);
  }

  // Function to close *both* modals and reset their context
  const closeModal = () => {
    setIsActivityModalOpen(false);
    setIsTodoModalOpen(false); // <--- Added
    setLeadIdForActivity(null);
    setTodoidForActivity(null);
    setLeadIdForTodo(null);
  };

  const [activityAddedStatus, setActivityAddedStatus] = useState(false);

  const handleActivityAdded = () => {
    // This function is called when an activity/todo is successfully added/updated
    setActivityAddedStatus(true);
  }

  useEffect(() => {
    // Refetch lists when an activity or todo is added/updated
    if (activityAddedStatus === true) {
      fetchLeads();
      fetchMissed();
      setActivityAddedStatus(false);
    }
  }, [activityAddedStatus]);


  return (
    <>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads To Do */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-blue-700 rounded text-sm">📋</div>
              <div className="font-semibold">Leads To Do List</div>
            </div>
            <button
              className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
              onClick={openTodoModal} // <--- Calls the function to open AddTodo modal
            >
              + Add Lead To Do
            </button>
          </div>

          <div className="p-4">
            {/* Search + Size */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 w-full md:w-80">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search todo..."
                    value={leadsSearch}
                    onChange={(e) => {
                      setLeadsSearch(e.target.value);
                      setLeadsPage(0);
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={leadsSize}
                  onChange={(e) => {
                    setLeadsSize(Number(e.target.value));
                    setLeadsPage(0);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[5, 10, 20].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List */}
            <div className="min-h-[200px] space-y-2">
              {leadsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading leads...</div>
              ) : leads.length > 0 ? (
                // PASSED status="todo" (green badge)
                leads.map((t, idx) => <TodoItem key={idx} item={t} openModal={openActivityModal} status="todo" />)
              ) : (
                <div className="text-center py-8 text-gray-500">No leads to do</div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="text-gray-600">Page {leadsPage + 1} of {Math.max(1, leadsTotalPages)}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeadsPage((p) => Math.max(0, p - 1))}
                  disabled={leadsPage === 0}
                  className={`px-3 py-1 rounded border text-sm ${leadsPage === 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Prev
                </button>
                <button
                  onClick={() => setLeadsPage((p) => (p + 1 < leadsTotalPages ? p + 1 : p))}
                  disabled={leadsPage + 1 >= leadsTotalPages}
                  className={`px-3 py-1 rounded border text-sm ${leadsPage + 1 >= leadsTotalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Missed Activities */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* ... (Missed Activities content) ... */}
          <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-blue-700 rounded text-sm">📌</div>
              <div className="font-semibold">Missed Activities</div>
            </div>
          </div>

          <div className="p-4">
            {/* Search + Size */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 w-full md:w-80">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search activity..."
                    value={missedSearch}
                    onChange={(e) => {
                      setMissedSearch(e.target.value);
                      setMissedPage(0);
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={missedSize}
                  onChange={(e) => {
                    setMissedSize(Number(e.target.value));
                    setMissedPage(0);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[5, 10, 20].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List */}
            <div className="min-h-[200px] space-y-2">
              {missedLoading ? (
                <div className="text-center py-8 text-gray-500">Loading activities...</div>
              ) : missed.length > 0 ? (
                // PASSED status="missed" (red badge)
                missed.map((t, idx) => <TodoItem key={idx} item={t} openModal={openActivityModal} status="missed" />)
              ) : (
                <div className="text-center py-8 text-gray-500">No missed activities</div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="text-gray-600">Page {missedPage + 1} of {Math.max(1, missedTotalPages)}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMissedPage((p) => Math.max(0, p - 1))}
                  disabled={missedPage === 0}
                  className={`px-3 py-1 rounded border text-sm ${missedPage === 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Prev
                </button>
                <button
                  onClick={() => setMissedPage((p) => (p + 1 < missedTotalPages ? p + 1 : p))}
                  disabled={missedPage + 1 >= missedTotalPages}
                  className={`px-3 py-1 rounded border text-sm ${missedPage + 1 >= missedTotalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Editing/Adding Activity on an existing Todo (from Edit2 icon) */}
      <ActionModal isOpen={isActivityModalOpen} onCancel={closeModal}>
        {leadIdForActivity && todoidForActivity ? (
          <AddActivity
            leadId={leadIdForActivity}
            closeModal={closeModal}
            todoid={todoidForActivity}
            handleActivityAdded={handleActivityAdded}
          />
        ) : null}
      </ActionModal>

      {/* Modal for Adding a new Lead To Do (from '+ Add Lead To Do' button) */}
      <ActionModal isOpen={isTodoModalOpen} onCancel={closeModal}>
        {/* Using your specified component and props */}
        <AddTodo
          closeModal={closeModal}
          leadId={leadIdForTodo} // This will be null, as it's a general 'Add Todo'
          handleActivityAdded={handleActivityAdded} // Assuming AddTodo also uses this to trigger a list refresh
        />
      </ActionModal>
    </>
  );
}