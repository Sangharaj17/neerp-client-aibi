'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Search, Calendar, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomerTodoAndMissedActivity = () => {
  // --- Customer To Do state
  const [customers, setCustomers] = useState([]);
  const [custPage, setCustPage] = useState(0);
  const [custSize, setCustSize] = useState(10);
  const [custTotalPages, setCustTotalPages] = useState(0);
  const [custTotalElements, setCustTotalElements] = useState(0);
  const [custSearch, setCustSearch] = useState('');
  const [custLoading, setCustLoading] = useState(false);

  // --- Missed Activity state
  const [missed, setMissed] = useState([]);
  const [missedPage, setMissedPage] = useState(0);
  const [missedSize, setMissedSize] = useState(10);
  const [missedTotalPages, setMissedTotalPages] = useState(0);
  const [missedTotalElements, setMissedTotalElements] = useState(0);
  const [missedSearch, setMissedSearch] = useState('');
  const [missedLoading, setMissedLoading] = useState(false);

  // fetch customer todos
  useEffect(() => {
    setCustLoading(true);
    axiosInstance
      .get('/api/dashboard/customerSiteNotPerformedTodos', {
        params: { search: custSearch, page: custPage, size: custSize },
      })
      .then((res) => {
        setCustomers(res.data.content);
        setCustTotalPages(res.data.totalPages);
        setCustTotalElements(res.data.totalElements);
      })
      .finally(() => setCustLoading(false));
  }, [custSearch, custPage, custSize]);

  // fetch missed activities
  useEffect(() => {
    setMissedLoading(true);
    axiosInstance
      .get('/api/dashboard/customerSiteMissedActivities', {
        params: { search: missedSearch, page: missedPage, size: missedSize },
      })
      .then((res) => {
        setMissed(res.data.content);
        setMissedTotalPages(res.data.totalPages);
        setMissedTotalElements(res.data.totalElements);
      })
      .finally(() => setMissedLoading(false));
  }, [missedSearch, missedPage, missedSize]);

  // Format date and time
  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return `${formattedDate} at ${timeString?.slice(0, 5) || '00:00'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Customer Activities</h1>
          <p className="text-gray-600">Manage customer todos and track missed activities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Customer To Do List --- */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer To Do List</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search todo..."
                  value={custSearch}
                  onChange={(e) => {
                    setCustPage(0);
                    setCustSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Todo List */}
            <div className="p-4">
              {custLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading todos...</span>
                </div>
              ) : customers.length > 0 ? (
                <div className="space-y-3">
                  {customers.map((todo) => (
                    <div
                      key={todo.todoId}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200 bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {todo.purpose || 'Customer Visit'}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>{todo.customerName} at {todo.siteName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{todo.place || 'No location specified'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">
                                {formatDateTime(todo.date, todo.time)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            todo.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {todo.status}
                          </span>
                          {/* <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button> */}
                        </div>
                      </div>
                      {todo.executiveName && (
                        <div className="text-xs text-gray-500 mt-2">
                          Assigned to: {todo.executiveName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-gray-500">No customer todos found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {custSearch ? 'Try adjusting your search terms' : 'No pending activities'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {custTotalPages > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {custPage + 1} of {custTotalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCustPage(custPage - 1)}
                      disabled={custPage === 0}
                      className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCustPage(custPage + 1)}
                      disabled={custPage >= custTotalPages - 1}
                      className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Missed Activities --- */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Missed Activities</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={missedSearch}
                  onChange={(e) => {
                    setMissedPage(0);
                    setMissedSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Missed Activities List */}
            <div className="p-4">
              {missedLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                  <span className="ml-2 text-gray-600">Loading activities...</span>
                </div>
              ) : missed.length > 0 ? (
                <div className="space-y-3">
                  {missed.map((activity) => (
                    <div
                      key={activity.todoId}
                      className="p-4 border border-red-200 rounded-lg hover:border-red-300 transition-colors duration-200 bg-red-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {activity.activityName || 'Missed Activity'}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>{activity.customerName} at {activity.siteName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.place || 'No location specified'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-red-500" />
                              <span className="font-medium text-red-600">
                                {formatDateTime(activity.date, activity.time)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Missed
                          </span>
                          {/* <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Reschedule
                          </button> */}
                        </div>
                      </div>
                      {/* {activity.executiveName && (
                        <div className="text-xs text-gray-500 mt-2">
                          Assigned to: {activity.executiveName}
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-gray-500">No missed activities found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {missedSearch ? 'Try adjusting your search terms' : 'All activities are completed on time'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {missedTotalPages > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {missedPage + 1} of {missedTotalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMissedPage(missedPage - 1)}
                      disabled={missedPage === 0}
                      className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setMissedPage(missedPage + 1)}
                      disabled={missedPage >= missedTotalPages - 1}
                      className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pagination Info */}
        {(custTotalPages > 0 || missedTotalPages > 0) && (
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Showing customer todos page {custPage + 1} of {custTotalPages} • 
              Missed activities page {missedPage + 1} of {missedTotalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTodoAndMissedActivity;