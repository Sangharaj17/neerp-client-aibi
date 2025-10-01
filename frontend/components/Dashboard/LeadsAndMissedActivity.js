'use client';
import { Search, Edit2 } from 'lucide-react';
import TodoItem from './TodoItem';

export default function LeadsAndMissedActivity({
  // --- Leads Props ---
  leads,
  leadsLoading,
  leadsPage,
  leadsTotalPages,
  leadsSearch,
  leadsSize,
  setLeadsSearch,
  setLeadsPage,
  setLeadsSize,

  // --- Missed Props ---
  missed,
  missedLoading,
  missedPage,
  missedTotalPages,
  missedSearch,
  missedSize,
  setMissedSearch,
  setMissedPage,
  setMissedSize,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* --- Leads To Do --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-700 rounded text-sm">📋</div>
            <div className="font-semibold">Leads To Do List</div>
          </div>
          <button className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100">
            + Add Lead To Do
          </button>
        </div>

        <div className="p-4">
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
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="min-h-[120px]">
            {leadsLoading ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : leads.length > 0 ? (
              leads.map((t, idx) => <TodoItem key={idx} item={t} />)
            ) : (
              <div className="text-center py-6 text-gray-500">No leads to do</div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="text-gray-600">
              Page {leadsPage + 1} of {Math.max(1, leadsTotalPages)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeadsPage((p) => Math.max(0, p - 1))}
                disabled={leadsPage === 0}
                className={`px-3 py-1 rounded border text-sm ${
                  leadsPage === 0
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Prev
              </button>
              <button
                onClick={() => setLeadsPage((p) => (p + 1 < leadsTotalPages ? p + 1 : p))}
                disabled={leadsPage + 1 >= leadsTotalPages}
                className={`px-3 py-1 rounded border text-sm ${
                  leadsPage + 1 >= leadsTotalPages
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

      {/* --- Missed Activity --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-600 rounded text-sm">📋</div>
            <div className="font-semibold">Missed Activity</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">
              View To Do List
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
              missed.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 bg-white rounded px-3 py-2 border border-gray-100"
                >
                  <div className="text-sm text-gray-800 font-medium">{m.todoName}</div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs">{m.dateAndTime}</div>
                    <button className="p-1 rounded bg-white border border-blue-200 hover:bg-blue-50">
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">No missed activities</div>
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
  );
}
