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
  ChevronUp,
  ChevronDown,
  List, // New icon for the Service Engineer Report button
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import LeadsSection from './LeadsSection';
import CustomerTodoAndMissedActivity from './CustomerTodoAndMissedActivity';
import OfficeActivity from './OfficeActivity';
import BreakdownTodos from './BreakdownTodos';
import ActionModal from '../AMC/ActionModal';
import AddJobActivityForm from '../Jobs/AddJobActivityForm';

import { Loader2 } from 'lucide-react';
import AddRenewalJobActivityForm from '../Jobs/AddRenewalJobActivityForm';


// Helper function to get the assigned employee names as a string (Unchanged)
const getAssignedEmployees = (employees) => {
  if (!employees || employees.length === 0) return 'Unassigned';
  return employees.map(emp => emp.name).join(', ');
};

// --- NEW Component for displaying the Service Engineer Report in the modal ---
const ServiceEngineerReportContent = ({ reports, totalAmcJobs, amcDoneCounts, amcPendingCounts }) => {
    return (
        <div className="p-4 sm:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Service Engineer Performance Report</h3>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <p className="text-sm text-blue-700 font-medium">Total AMC Jobs</p>
                    <p className="text-2xl font-bold text-blue-900">{totalAmcJobs}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <p className="text-sm text-green-700 font-medium">Completed Jobs</p>
                    <p className="text-2xl font-bold text-green-900">{amcDoneCounts}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
                    <p className="text-sm text-red-700 font-medium">Pending Jobs</p>
                    <p className="text-2xl font-bold text-red-900">{amcPendingCounts}</p>
                </div>
            </div>

            {/* Employee Reports Grid */}
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Engineer Breakdown:</h4>
            {reports.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reports.map((report, index) => (
                        <div key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <p className="text-lg font-bold text-gray-900 mb-3">{report.empName}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Assigned Services:</span>
                                    <span className="font-semibold text-blue-600">{report.assginedServiceCounts}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Done Services:</span>
                                    <span className="font-semibold text-green-600">{report.doneServiceCounts}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Pending Services:</span>
                                    <span className="font-semibold text-red-600">{report.pendingServicesCounts}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No service engineer reports available.</p>
            )}
        </div>
    );
};
// ---------------------------------------------------------------------------


const Dashboard = () => {
  const router = useRouter();

  // --- Visibility State (Unchanged) ---
  const [isTodoListCollapsed, setIsTodoListCollapsed] = useState(true); // Default: Hide
  const [isAmcAlertsCollapsed, setIsAmcAlertsCollapsed] = useState(false); // Default: Show
  // ------------------------------

  // --- global / counts (Unchanged)
  const [activeTab, setActiveTab] = useState('leads');
  const [counts, setCounts] = useState(null);

  // --- AMC alerts (Unchanged)
  const [amcServiceAlerts, setAmcServiceAlerts] = useState([]);
  const [amcPage, setAmcPage] = useState(0);
  const [amcSize, setAmcSize] = useState(10);
  const [amcTotalPages, setAmcTotalPages] = useState(0);
  const [amcSearch, setAmcSearch] = useState('');
  const [amcLoading, setAmcLoading] = useState(false);

  // --- Renewal alerts
const [renewalServiceAlerts, setRenewalServiceAlerts] = useState([]);
const [renewalPage, setRenewalPage] = useState(0);
const [renewalSize, setRenewalSize] = useState(10);
const [renewalTotalPages, setRenewalTotalPages] = useState(0);
const [renewalSearch, setRenewalSearch] = useState('');
const [renewalLoading, setRenewalLoading] = useState(false);


  // --- Customer To Do (Existing state) (Unchanged)
  const [customerTodos, setCustomerTodos] = useState([]);
  const [customerPage, setCustomerPage] = useState(0);
  const [customerSize, setCustomerSize] = useState(10);
  const [customerTotalPages, setCustomerTotalPages] = useState(0);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  // --- NEW: Service Engineer Report State ---
  const [engineerReport, setEngineerReport] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  // ------------------------------------------

  // --- NEW: State for Modal Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [modalContentType, setModalContentType] = useState(null); // 'ACTIVITY' or 'REPORT'
  const [loadingBtn, setLoadingBtn] = useState(null);

  // Function to open the modal for Add Activity
  const openAddActivityModal = (jobId) => {
      setSelectedJobId(jobId);
      setModalContentType('ACTIVITY');
      setIsModalOpen(true);
  };

  const openRenewalAddActivityModal = (jobId) => {
      setSelectedJobId(jobId);
      setModalContentType('Renewal');
      setIsModalOpen(true);
  };

  // Function to open the modal for Service Engineer Report
  const openReportModal = () => {
      setModalContentType('REPORT');
      setIsModalOpen(true);
  };

  // Function to close the modal
  const closeAddActivityModal = () => {
      setIsModalOpen(false);
      setSelectedJobId(null);
      setModalContentType(null);
  };

  // Function to close the modal AND trigger a refresh of the alerts table
  const handleActivitySuccess = () => {
    closeAddActivityModal();
    fetchAmcAlerts();
  };

  const handleRenewalActivitySuccess = () => {
    closeAddActivityModal();
    fetchRenewalAlerts();
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

  // --- NEW: Fetch Service Engineer Report ---
  const fetchServiceEngineerReport = useCallback(async () => {
      try {
          setIsReportLoading(true);
          const res = await axiosInstance.get('/api/dashboard/service-engineers-report');
          setEngineerReport(res.data);
      } catch (err) {
          console.error('Error fetching service engineer report:', err);
      } finally {
          setIsReportLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchServiceEngineerReport();
  }, [fetchServiceEngineerReport]);
  // ------------------------------------------

  // fetch AMC alerts - Wrapped in useCallback for cleaner dependency (Unchanged)
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


  // fetch Renewal alerts - Wrapped in useCallback for cleaner dependency
const fetchRenewalAlerts = useCallback(async () => {
    try {
        setRenewalLoading(true);
        const res = await axiosInstance.get('/api/dashboard/amc-renewal-alerts', {
            params: { page: renewalPage, size: renewalSize, search: renewalSearch }
        });
        setRenewalServiceAlerts(res.data.content || []);
        setRenewalTotalPages(res.data.totalPages ?? 0);
    } catch (err) {
        console.error('Error fetching Renewal service alerts:', err);
    } finally {
        setRenewalLoading(false);
    }
}, [renewalPage, renewalSize, renewalSearch]);

useEffect(() => {
    fetchRenewalAlerts();
}, [fetchRenewalAlerts]); // Depend on the memoized function



  // fetch Customer To Do (Existing logic) (Adjusted to respect collapse state)
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

    if (activeTab === 'customers' && !isTodoListCollapsed) { // Only fetch if the tab is active AND the section is shown
      fetchCustomerTodos();
    }
  }, [customerPage, customerSize, customerSearch, activeTab, isTodoListCollapsed]);

  /* stat cards & tabs, renderTabContent, getIconColor (Unchanged) */
  const statCards = [
    { id: 'leads', title: 'Leads', count: counts?.totalActiveLeadCounts ?? 0, action: 'Add New Lead', icon: Users, color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
    { id: 'installation', title: 'New Quotations', count: counts?.totalNewInstallationQuatationCounts ?? 0, subCount: counts?.totalAmcQuatationCounts ?? 0, subTitle: 'AMC', actions: ['New Installation', 'AMC Quotation'], icon: Wrench, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-500' },
    { id: 'customers', title: 'Customers', count: counts?.totalCustomerCounts ?? 0, action: 'See More Details', icon: UserCheck, color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-500' },
    { id: 'renewals', title: 'AMC Renewals', count: counts?.totalAmcForRenewalsCounts ?? 0, action: 'View Details', icon: FileText, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-500' }
  ];

  const tabs = [
    { id: 'leads', label: 'Leads To Do', icon: Users },
    { id: 'customers', label: 'Customer To Do', icon: UserCheck },
    { id: 'activity', label: 'Daily Activity', icon: Activity },
    { id: 'breakdown', label: 'BreakDown Calls', icon: Phone }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'leads': return (<LeadsSection/>);
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
      case 'activity': return (<OfficeActivity/>);
      case 'breakdown': return (<BreakdownTodos/>);
      default: return (<div className="p-8 text-center"><p className="text-gray-500 text-sm">Select a tab to view content</p></div>);
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
  /* ----------------------------------------------------------------------- */

      const [activeAlertTab, setActiveAlertTab] = useState('service'); 


  return (
    <div className="space-y-8 w-full p-6 bg-gray-50 min-h-screen">

      {/* Header (Unchanged) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here's a summary of your key business metrics and tasks.</p>
      </div>

      {/* Stat Cards (Unchanged) */}
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

                {/* Action Buttons Group */}
                {card.actions ? (
                  card.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLoadingBtn(action);
                        if (action === "AMC Quotation") {
                          router.push(`/dashboard/quotations/amc_quatation_list`);
                        } else if (action === "New Installation") {
                          router.push(`/dashboard/quotations/installation_quatation_list`);
                        }
                      }}
                      disabled={loadingBtn === action}
                      className={`flex items-center justify-between w-full text-left text-sm font-medium ${getIconColor(card.color).replace('text-', 'text-')} hover:text-gray-900 py-1 group transition-colors disabled:opacity-60`}
                    >
                      <span>{action}</span>
                      {loadingBtn === action ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin text-purple-500" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => {
                      setLoadingBtn(card.action);
                      if (card.action === "Add New Lead") {
                        router.push(`/dashboard/lead-management/lead-list/add-lead`);
                      } else if (card.action === "See More Details") {
                        router.push(`/dashboard/customer/customer-list`);
                      } else if (card.action === "View Details") {
                        router.push(`/dashboard/dashboard-data/amc_renewals_list`);
                      }
                    }}
                    disabled={loadingBtn === card.action}
                    className={`flex items-center justify-between w-full text-left text-sm font-medium ${getIconColor(card.color).replace('text-', 'text-')} hover:text-gray-900 py-1 group transition-colors disabled:opacity-60`}
                  >
                    <span>{card.action}</span>
                    {loadingBtn === card.action ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin text-purple-500" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Section - To Do & Activity List (Collapsible) */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">To Do & Activity List</h3>
          <button
            onClick={() => setIsTodoListCollapsed(!isTodoListCollapsed)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-expanded={!isTodoListCollapsed}
            aria-controls="todo-activity-content"
            title={isTodoListCollapsed ? "Show To Do Lists" : "Hide To Do Lists"}
          >
            {isTodoListCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>
        <div id="todo-activity-content" className={`transition-all duration-300 ease-in-out overflow-hidden ${isTodoListCollapsed ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100'}`}>
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
      </div>

      {/* AMC Service Alerts - MODIFIED TO INCLUDE REPORT SUMMARY & BUTTON */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 gap-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg shadow-sm">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-semibold text-gray-900">AMC Service Alerts</span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
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
            {/* HIDE/SHOW BUTTON for AMC Alerts */}
            <button
              onClick={() => setIsAmcAlertsCollapsed(!isAmcAlertsCollapsed)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-expanded={!isAmcAlertsCollapsed}
              aria-controls="amc-alerts-content"
              title={isAmcAlertsCollapsed ? "Show AMC Alerts" : "Hide AMC Alerts"}
            >
              {isAmcAlertsCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* --- Service Engineer Summary and Report Button --- */}
 {engineerReport && !isAmcAlertsCollapsed && (
    <div className="p-6 pt-4 space-y-4 border-b border-gray-100">
        <h4 className="text-lg font-semibold text-gray-700">Service Engineer Summary (Current Jobs)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total AMC Jobs */}
            <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center border-l-4 border-blue-500">
                <span className="text-sm font-medium text-blue-700">Total Jobs:</span>
                <span className="text-xl font-bold text-blue-900">{engineerReport.totalAmcJobs}</span>
            </div>
            {/* AMC Done Counts */}
            <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center border-l-4 border-green-500">
                <span className="text-sm font-medium text-green-700">Jobs Done:</span>
                <span className="text-xl font-bold text-green-900">{engineerReport.amcDoneCounts}</span>
            </div>
            {/* AMC Pending Counts */}
            <div className="bg-red-50 p-3 rounded-lg flex justify-between items-center border-l-4 border-red-500">
                <span className="text-sm font-medium text-red-700">Jobs Pending:</span>
                <span className="text-xl font-bold text-red-900">{engineerReport.amcPendingCounts}</span>
            </div>
        </div>

        {/* Buttons Section: Alert Buttons (Left) and Report Button (Right) */}
        <div className="pt-2 flex justify-between items-center">
            
            {/* 1. New Alert Buttons (Grouped on the Left) - Using TEAL for highlighted state */}
            <div className="flex space-x-3">
                {/* New AMC Service Alerts Button */}
                <button
                    onClick={() => setActiveAlertTab('service')}
                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-colors 
                        ${activeAlertTab === 'service' 
                            // TEAL highlighted style
                            ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700' 
                            // Default style
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                >
                    AMC Service Alerts
                </button>
                
                {/* New AMC Renewal Service Alert Button */}
                <button
                    onClick={() => setActiveAlertTab('renewal')}
                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-colors
                        ${activeAlertTab === 'renewal' 
                            // TEAL highlighted style
                            ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700' 
                            // Default style
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                >
                    AMC Renewal Service Alert
                </button>
            </div>


            {/* 2. Original Report Button (On the Right) - Retains INDIGO color */}
            <div>
                <button
                    onClick={openReportModal}
                    disabled={isReportLoading}
                    // Retaining the original indigo color
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    {isReportLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <List className="w-4 h-4 mr-2" />
                    )}
                    {isReportLoading ? 'Loading Report...' : 'View Engineer Report'}
                </button>
            </div>
        </div>
    </div>
)}
        {/* ------------------------------------------------------------------- */}


        {/* Conditional Content Rendering for AMC Alerts (Table) */}
        <div id="amc-alerts-content" className={`transition-all duration-300 ease-in-out overflow-hidden ${isAmcAlertsCollapsed ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100 p-6 pt-4'}`}>
                      
            {

              activeAlertTab === 'service' && (
                
                amcLoading ? (
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
                  <>
                    <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr No</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site / Place</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Serviced</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending Lifts / Total Lifts</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Add Activity</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm">
                          {amcServiceAlerts.map((alert, index) => {
                            const isCompleted = alert.remark === 'Completed';
                            const srNo = amcPage * amcSize + index + 1;
                            return (
                              <tr key={alert.amcJobid} className="hover:bg-blue-50/50 transition-colors">
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
                                <td className="px-6 py-3 text-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                    {alert.currentServicePendingLiftCounts} / {alert.currentServiceTotalLiftsCounts}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-2">
                                    {/* Add Activity Button (Opens Modal) */}
                                    <button
                                      onClick={() => openAddActivityModal(alert.amcJobid)}
                                      disabled={isCompleted}
                                      className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2
                                        ${isCompleted
                                            ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                            : 'text-green-600 hover:text-white hover:bg-green-500 focus:ring-green-500'}`}
                                      title={isCompleted ? "Service Completed" : `Add Activity to Job ${alert.amcJobid}`}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
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
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">All clear! No pending AMC service alerts found for the current search.</p>
                )

              ) 
                
            }

           {activeAlertTab === 'renewal' && (
  <>
    {renewalLoading ? (
      <div className="text-center py-10 text-gray-500 font-medium">
        <div className="flex justify-center items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading Renewal Alerts...</span>
        </div>
      </div>
    ) : renewalServiceAlerts.length > 0 ? (
      <>
        <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site / Place</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Serviced</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending Lifts / Total Lifts</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Add Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {renewalServiceAlerts.map((alert, index) => {
                const isCompleted = alert.remark === 'Completed';
                const srNo = renewalPage * renewalSize + index + 1;
                return (
                  <tr key={alert.renewalJobId} className="hover:bg-blue-50/50 transition-colors">
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
                    <td className="px-6 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                        {alert.currentServicePendingLiftCounts} / {alert.currentServiceTotalLiftsCounts}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Add Activity Button (Opens Modal) */}
                        <button
                          onClick={() => openRenewalAddActivityModal(alert.renewalJobId)}
                          disabled={isCompleted}
                          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2
                            ${isCompleted
                                ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                : 'text-green-600 hover:text-white hover:bg-green-500 focus:ring-green-500'}`}
                          title={isCompleted ? "Service Completed" : `Add Activity to Job ${alert.renewalJobId}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 text-sm px-2">
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">Rows per page:</span>
            <select
              value={renewalSize}
              onChange={(e) => {
                setRenewalSize(Number(e.target.value));
                setRenewalPage(0);
              }}
              className="border border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">Page {renewalPage + 1} of {renewalTotalPages}</span>
            <button
              disabled={renewalPage === 0}
              onClick={() => setRenewalPage((p) => p - 1)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${renewalPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-600 text-white bg-blue-500 shadow-md'}`}
            >
              Prev
            </button>
            <button
              disabled={renewalPage + 1 >= renewalTotalPages}
              onClick={() => setRenewalPage((p) => p + 1)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${renewalPage + 1 >= renewalTotalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-600 text-white bg-blue-500 shadow-md'}`}
            >
              Next
            </button>
          </div>
        </div>
      </>
    ) : (
      <p className="text-sm text-gray-500 text-center py-6">
        All clear! No pending Renewal service alerts found for the current search.
      </p>
    )}
  </>
)}

            


        </div>


      </div>

      {/* --- Action Modal Component (Now handles two types of content) --- */}
      <ActionModal
          isOpen={isModalOpen}
          onCancel={closeAddActivityModal}
          // Customize the modal title based on content type
          title={modalContentType === 'REPORT' ? 'Service Engineer Performance' :
            modalContentType === 'ACTIVITY' ? 
             'Add Job Activity' : "Add Renewal Job Activity"
            }
      >
          {/* Render AddJobActivityForm if modalContentType is 'ACTIVITY' */}
          {modalContentType === 'ACTIVITY' && selectedJobId && (
              <AddJobActivityForm
                  jobId={selectedJobId}
                  onSuccess={handleActivitySuccess}
                  comingFromDashboard={true}
              />
          )}

           {modalContentType === 'Renewal' && selectedJobId && (
              <AddRenewalJobActivityForm
                  renewalJobId={selectedJobId}
                  onSuccess={handleRenewalActivitySuccess}
                  comingFromDashboard={true}
              />
          )}

          {/* Render ServiceEngineerReportContent if modalContentType is 'REPORT' */}
          {modalContentType === 'REPORT' && engineerReport && (
              <ServiceEngineerReportContent
                  reports={engineerReport.serviceEmployeeReports}
                  totalAmcJobs={engineerReport.totalAmcJobs}
                  amcDoneCounts={engineerReport.amcDoneCounts}
                  amcPendingCounts={engineerReport.amcPendingCounts}
              />
          )}

      </ActionModal>
      {/* ------------------------------------- */}
    </div>
  );
};

export default Dashboard;