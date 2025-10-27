'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Search, Edit2, Plus } from 'lucide-react';
import ActionModal from '../AMC/ActionModal';
import BreakdownTodoForm from '../Jobs/BreakdownTodoForm';

// Modified to accept a 'status' prop for conditional styling
function BreakdownTodoItem({ item, status }) {
  // Determine badge color based on status
  const badgeClasses =
    status === 'missed'
      ? 'bg-red-100 text-red-600' // Red for missed activities
      : 'bg-green-100 text-green-600'; // Green for upcoming todos

  return (
    <div className="flex items-center justify-between gap-3 bg-white rounded px-3 py-2 border border-gray-100">
      <div className="text-sm text-gray-800 font-medium">{item.description}</div>
      <div className="flex items-center gap-2">
        {/* Conditional badge class applied here */}
        <div className={`px-2 py-1 rounded-full text-xs ${badgeClasses}`}>
          {item.todoDate} {item.time}
        </div>
        <button className="p-1 rounded bg-white border border-blue-200 hover:bg-blue-50">
          <Edit2 className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
}

export default function BreakdownTodos() {
  // --- Upcoming Breakdown Todos
  const [upcoming, setUpcoming] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [upcomingSize, setUpcomingSize] = useState(10);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(0);
  const [upcomingSearch, setUpcomingSearch] = useState('');

  // --- Missed Breakdown Todos
  const [missed, setMissed] = useState([]);
  const [missedLoading, setMissedLoading] = useState(false);
  const [missedPage, setMissedPage] = useState(0);
  const [missedSize, setMissedSize] = useState(10);
  const [missedTotalPages, setMissedTotalPages] = useState(0);
  const [missedSearch, setMissedSearch] = useState('');

  // --- Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUpcoming = async () => {
    setUpcomingLoading(true);
    try {
      const res = await axiosInstance.get('/api/dashboard/breakdown/notPerformed', {
        params: { search: upcomingSearch, page: upcomingPage, size: upcomingSize },
      });
      setUpcoming(res.data.content);
      setUpcomingTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
    setUpcomingLoading(false);
  };

  const fetchMissed = async () => {
    setMissedLoading(true);
    try {
      const res = await axiosInstance.get('/api/dashboard/breakdown/missed', {
        params: { search: missedSearch, page: missedPage, size: missedSize },
      });
      setMissed(res.data.content);
      setMissedTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
    setMissedLoading(false);
  };

  useEffect(() => {
    fetchUpcoming();
  }, [upcomingPage, upcomingSize, upcomingSearch]);

  useEffect(() => {
    fetchMissed();
  }, [missedPage, missedSize, missedSearch]);

  useEffect(() => {
    if (isModalOpen === false) {
      fetchUpcoming();
      fetchMissed();
    }
  }, [isModalOpen]);

  return (
    <>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Upcoming Breakdown Todos --- */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-blue-700 rounded text-sm">📋</div>
              <div className="font-semibold">Upcoming Breakdown Todos</div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
            >
              <Plus className="w-4 h-4" /> Add Todo
            </button>
          </div>

          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 w-full md:w-80">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search todo..."
                    value={upcomingSearch}
                    onChange={(e) => {
                      setUpcomingSearch(e.target.value);
                      setUpcomingPage(0);
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={upcomingSize}
                  onChange={(e) => {
                    setUpcomingSize(Number(e.target.value));
                    setUpcomingPage(0);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[5, 10, 20].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="min-h-[120px] space-y-2">
              {upcomingLoading ? (
                <div className="text-center py-6 text-gray-500">Loading...</div>
              ) : upcoming.length > 0 ? (
                // Pass status="upcoming" to show green badge
                upcoming.map((t, idx) => <BreakdownTodoItem key={idx} item={t} status="upcoming" />)
              ) : (
                <div className="text-center py-6 text-gray-500">No upcoming todos</div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="text-gray-600">
                Page {upcomingPage + 1} of {Math.max(1, upcomingTotalPages)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUpcomingPage((p) => Math.max(0, p - 1))}
                  disabled={upcomingPage === 0}
                  className={`px-3 py-1 rounded border text-sm ${
                    upcomingPage === 0
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setUpcomingPage((p) => (p + 1 < upcomingTotalPages ? p + 1 : p))
                  }
                  disabled={upcomingPage + 1 >= upcomingTotalPages}
                  className={`px-3 py-1 rounded border text-sm ${
                    upcomingPage + 1 >= upcomingTotalPages
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Missed Breakdown Todos --- */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-blue-600 rounded text-sm">📋</div>
              <div className="font-semibold">Missed Breakdown Todos</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">
                View All
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search"
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
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setMissedPage(0)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
              >
                Search
              </button>
            </div>

            <div className="space-y-2 min-h-[180px]">
              {missedLoading ? (
                <div className="text-center py-6 text-gray-500">Loading...</div>
              ) : missed.length > 0 ? (
                // Pass status="missed" to show red badge
                missed.map((m, i) => <BreakdownTodoItem key={i} item={m} status="missed" />)
              ) : (
                <div className="text-center py-6 text-gray-500">No missed todos</div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="text-gray-600">
                Page {missedPage + 1} of {Math.max(1, missedTotalPages)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMissedPage((p) => Math.max(0, p - 1))}
                  disabled={missedPage === 0}
                  className={`px-3 py-1 rounded border text-sm ${
                    missedPage === 0
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Prev
                </button>
                <button
                  onClick={() => setMissedPage((p) => (p + 1 < missedTotalPages ? p + 1 : p))}
                  disabled={missedPage + 1 >= missedTotalPages}
                  className={`px-3 py-1 rounded border text-sm ${
                    missedPage + 1 >= missedTotalPages
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Action Modal for Add Todo --- */}
      <ActionModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <BreakdownTodoForm onClose={() => setIsModalOpen(false)} />
      </ActionModal>
    </>
  );
}