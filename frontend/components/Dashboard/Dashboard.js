'use client'
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import {
  Plus,
  ArrowRight,
  FileText,
  Users,
  Activity,
  Phone,
  Wrench,
  UserCheck,
  Search,
  // Removed Edit2 import as it's no longer used
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import LeadsSection from './LeadsSection';
import CustomerTodoAndMissedActivity from './CustomerTodoAndMissedActivity';
import OfficeActivity from './OfficeActivity';
import BreakdownTodos from './BreakdownTodos';
// Import the new components
import ActionModal from '../AMC/ActionModal';
import AddJobActivityForm from '../Jobs/AddJobActivityForm';


// Helper function to get the assigned employee names as a string
const getAssignedEmployees = (employees) => {
  if (!employees || employees.length === 0) return 'Unassigned';
  return employees.map(emp => emp.name).join(', ');
};

const Dashboard = () => {
  const router = useRouter();
  // --- global / counts
  const [activeTab, setActiveTab] = useState('leads');
  const [counts, setCounts] = useState(null);

  // --- AMC alerts
  const [amcServiceAlerts, setAmcServiceAlerts] = useState([]);
  const [amcPage, setAmcPage] = useState(0);
  const [amcSize, setAmcSize] = useState(10);
  const [amcTotalPages, setAmcTotalPages] = useState(0);
  const [amcSearch, setAmcSearch] = useState('');
  const [amcLoading, setAmcLoading] = useState(false);

  // --- Customer To Do (Existing state)
  const [customerTodos, setCustomerTodos] = useState([]);
  const [customerPage, setCustomerPage] = useState(0);
  const [customerSize, setCustomerSize] = useState(10);
  const [customerTotalPages, setCustomerTotalPages] = useState(0);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  // --- NEW: State for Modal Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Function to open the modal and set the jobId
  const openAddActivityModal = (jobId) => {
      setSelectedJobId(jobId);
      setIsModalOpen(true);
  };

  // Function to close the modal
  const closeAddActivityModal = () => {
      setIsModalOpen(false);
      setSelectedJobId(null);
  };

  // Function to close the modal AND trigger a refresh of the alerts table
  const handleActivitySuccess = () => {
    closeAddActivityModal();
    fetchAmcAlerts();
  };
  // ---------------------------------------


  // fetch counts (unchanged)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axiosInstance.get('/api/dashboard/counts');
        setCounts(res.data);
      } catch (err) {
        console.error('Error fetching dashboard counts:', err);
      }
    };
    fetchCounts();
  }, []);

  // fetch AMC alerts - Wrapped in useCallback for cleaner dependency
  const fetchAmcAlerts = useCallback(async () => {
      try {
          setAmcLoading(true);
          const res = await axiosInstance.get('/api/dashboard/amc-service-alerts', {
              params: { page: amcPage, size: amcSize, search: amcSearch }
          });
          setAmcServiceAlerts(res.data.content || []);
          setAmcTotalPages(res.data.totalPages ?? 0);
      } catch (err) {
          console.error('Error fetching AMC service alerts:', err);
      } finally {
          setAmcLoading(false);
      }
  }, [amcPage, amcSize, amcSearch]);

  useEffect(() => {
      fetchAmcAlerts();
  }, [fetchAmcAlerts]); // Depend on the memoized function


  // fetch Customer To Do (Existing logic)
  useEffect(() => {
    const fetchCustomerTodos = async () => {
      try {
        setCustomerLoading(true);
        const res = await axiosInstance.get('/api/dashboard/customerSiteNotPerformedTodos', {
          params: { page: customerPage, size: customerSize, search: customerSearch }
        });
        setCustomerTodos(res.data.content || []);
        setCustomerTotalPages(res.data.totalPages ?? 0);
      } catch (err) {
        console.error('Error fetching customer todos:', err);
      } finally {
        setCustomerLoading(false);
      }
    };

    if (activeTab === 'customers') {
      fetchCustomerTodos();
    }
  }, [customerPage, customerSize, customerSearch, activeTab]);

  /* --------- stat cards & tabs ---------- */
  const statCards = [
    // ... (stat card definitions remain unchanged)
    {
        id: 'leads',
        title: 'Leads',
        count: counts?.totalActiveLeadCounts ?? 0,
        action: 'Add New Lead',
        icon: Users,
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500'
    },
    {
        id: 'installation',
        title: 'New Quotations',
        count: counts?.totalNewInstallationQuatationCounts ?? 0,
        subCount: counts?.totalAmcQuatationCounts ?? 0,
        subTitle: 'AMC',
        actions: ['New Installation', 'AMC Quotation'],
        icon: Wrench,
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500'
    },
    {
        id: 'customers',
        title: 'Customers',
        count: counts?.totalCustomerCounts ?? 0,
        action: 'See More Details',
        icon: UserCheck,
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-500'
    },
    {
        id: 'renewals',
        title: 'AMC Renewals',
        count: counts?.totalAmcForRenewalsCounts ?? 0,
        action: 'View Details',
        icon: FileText,
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500'
    }
  ];

  const tabs = [
    { id: 'leads', label: 'Leads To Do', icon: Users },
    { id: 'customers', label: 'Customer To Do', icon: UserCheck },
    { id: 'activity', label: 'Daily Activity', icon: Activity },
    { id: 'breakdown', label: 'BreakDown Calls', icon: Phone }
  ];

  /* ---------- Tab Content Renderer (unchanged) ---------- */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'leads':
        return (<LeadsSection/>);

      case 'customers':
        return (
          <CustomerTodoAndMissedActivity
            customerTodos={customerTodos}
            customerPage={customerPage}
            setCustomerPage={setCustomerPage}
            customerSize={customerSize}
            setCustomerSize={setCustomerSize}
            customerTotalPages={customerTotalPages}
            customerSearch={customerSearch}
            setCustomerSearch={setCustomerSearch}
            customerLoading={customerLoading}
          />
        );

      case 'activity':
        return (<OfficeActivity/>);

      case 'breakdown':
        return (<BreakdownTodos/>);

      default:
        return (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">Select a tab to view content</p>
          </div>
        );
    }
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colors[color] || 'text-gray-600';
  };

  // Removed handleAmcEdit as the edit button is removed.
  // const handleAmcEdit = (amcJobid) => {
  //   router.push(`/dashboard/amc-management/job-details/${amcJobid}`);
  // };


  return (
    <div className="space-y-8 w-full p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here's a summary of your key business metrics and tasks.</p>
      </div>

      {/* Stat Cards - IMPROVED DESIGN (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.id}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-t-4 border-l-2 ${card.borderColor.replace('border-b', 'border-t')} border-opacity-70`}
          >
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-full ${card.bgColor} shadow-md`}>
                  <card.icon className={`w-6 h-6 ${getIconColor(card.color)}`} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900 leading-none">{card.count}</span>
                  <h3 className="text-sm font-semibold text-gray-500 mt-1">{card.title}</h3>
                </div>
              </div>
              <div className="space-y-1 pt-2">

                {/* Secondary data for Quotaion card */}
                {card.subCount !== undefined && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium text-lg text-gray-700">{card.subCount}</span>
                    <span className="text-sm">{card.subTitle} Quotations</span>
                  </div>
                )}

                {/* Action Buttons Group (Refined Look) */}
                {card.actions ? (
                  card.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (action === "AMC Quotation") {
                          router.push(`/dashboard/quotations/amc_quatation_list`);
                        } else if (action === "New Installation") {
                           router.push(`/dashboard/quotations/installation_quatation_list`);
                        }
                      }}
                      className={`flex items-center justify-between w-full text-left text-sm font-medium ${getIconColor(card.color).replace('text-', 'text-')} hover:text-gray-900 py-1 group transition-colors`}
                    >
                      <span>{action}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                ) : (
                  <button onClick={()=>{
                    if(card.action === "Add New Lead"){
                      router.push(`/dashboard/lead-management/lead-list/add-lead`);
                    }else if(card.action === "See More Details"){
                      router.push(`/dashboard/customer/customer-list`);
                    }else if(card.action === "View Details"){
                      router.push(`/dashboard/dashboard-data/amc_renewals_list`);
                    }
                  }} className={`flex items-center justify-between w-full text-left text-sm font-medium ${getIconColor(card.color).replace('text-', 'text-')} hover:text-gray-900 py-1 group transition-colors`}>
                    <span>{card.action}</span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Section - IMPROVED DESIGN (unchanged) */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200 px-2 sm:px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-500 border-b-2 border-transparent hover:border-blue-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-96 p-4 sm:p-6">{renderTabContent()}</div>
      </div>

      {/* AMC Service Alerts - INTEGRATED ACTIVITY BUTTON */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg shadow-sm">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-semibold text-gray-900">AMC Service Alerts</span>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search customer, site, or place..."
              value={amcSearch}
              onChange={(e) => {
                setAmcSearch(e.target.value);
                setAmcPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {amcLoading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            <div className="flex justify-center items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading AMC Alerts...</span>
            </div>
          </div>
        ) : amcServiceAlerts.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{/* FIX: Whitespace removed for hydration error prevention */}
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site / Place</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Serviced</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                  {/* UPDATED COLUMN NAME */}
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending Lifts / Total Lifts</th>
                  {/* UPDATED COLUMN NAME */}
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Add Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm">{/* FIX: Whitespace removed for hydration error prevention */}
                {amcServiceAlerts.map((alert, index) => {
                  const isCompleted = alert.remark === 'Completed';
                  const srNo = amcPage * amcSize + index + 1;
                  return (
                    <tr key={alert.amcJobid} className="hover:bg-blue-50/50 transition-colors">{/* FIX: Whitespace removed for hydration error prevention */}
                      <td className="px-6 py-3 whitespace-nowrap text-center text-gray-600 font-mono">{srNo}</td>
                      <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">{alert.customer}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                        {alert.site} <span className="text-xs text-gray-400">({alert.place})</span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-600">{alert.service} - {alert.month}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-700">{getAssignedEmployees(alert.assignedServiceEmployess)}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-500 text-xs">{alert.previousServicingDate ? new Date(alert.previousServicingDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {alert.remark}
                        </span>
                      </td>
                      {/* LIFT COUNTS CELL */}
                      <td className="px-6 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                          {alert.currentServicePendingLiftCounts} / {alert.currentServiceTotalLiftsCounts}
                        </span>
                      </td>
                      {/* ACTION BUTTONS (Only Add Activity remains) */}
                      <td className="px-6 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                            {/* Add Activity Button (Opens Modal) */}
                            <button
                               onClick={() => openAddActivityModal(alert.amcJobid)}
                               disabled={isCompleted} // Optionally disable if completed
                               className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2
                                   ${isCompleted
                                       ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                       : 'text-green-600 hover:text-white hover:bg-green-500 focus:ring-green-500'}`}
                               title={isCompleted ? "Service Completed" : `Add Activity to Job ${alert.amcJobid}`}
                            >
                               <Plus className="w-4 h-4" />
                            </button>

                            {/* REMOVED: View/Edit Button (Edit2) */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>{/* FIX: Whitespace removed for hydration error prevention */}
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">All clear! No pending AMC service alerts found for the current search.</p>
        )}

        {/* Pagination Controls (unchanged) */}
        {amcServiceAlerts.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm px-2">
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">Rows per page:</span>
              <select
                value={amcSize}
                onChange={(e) => {
                  setAmcSize(Number(e.target.value));
                  setAmcPage(0);
                }}
                className="border border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">Page {amcPage + 1} of {amcTotalPages}</span>
              <button
                disabled={amcPage === 0}
                onClick={() => setAmcPage((p) => p - 1)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${amcPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-600 text-white bg-blue-500 shadow-md'}`}
              >
                Prev
              </button>
              <button
                disabled={amcPage + 1 >= amcTotalPages}
                onClick={() => setAmcPage((p) => p + 1)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${amcPage + 1 >= amcTotalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-600 text-white bg-blue-500 shadow-md'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- NEW: Action Modal Component --- */}
      <ActionModal
          isOpen={isModalOpen}
          onCancel={closeAddActivityModal}
      >
          {/* Pass the selected Job ID and the success handler */}
          {selectedJobId && (
              <AddJobActivityForm
                  jobId={selectedJobId}
                  onSuccess={handleActivitySuccess}
                  comingFromDashboard={true}
              />
          )}
          {/* If the user cancels or closes the modal, the form and its data will be unmounted. */}
      </ActionModal>
      {/* ------------------------------------- */}
    </div>
  );
};

export default Dashboard;