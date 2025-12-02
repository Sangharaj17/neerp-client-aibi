'use client';
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
  List,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import LeadsSection from './LeadsSection';
import CustomerTodoAndMissedActivity from './CustomerTodoAndMissedActivity';
import OfficeActivity from './OfficeActivity';
import BreakdownTodos from './BreakdownTodos';
import ActionModal from '../AMC/ActionModal';
import AddJobActivityForm from '../Jobs/AddJobActivityForm';
import AddRenewalJobActivityForm from '../Jobs/AddRenewalJobActivityForm';

// Helper function to get the assigned employee names as a string
const getAssignedEmployees = (employees) => {
  if (!employees || employees.length === 0) return 'Unassigned';
  return employees.map(emp => emp.name).join(', ');
};

// Service Engineer Report Content Component
const ServiceEngineerReportContent = ({ reports, totalAmcJobs, amcDoneCounts, amcPendingCounts }) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Service Engineer Performance Report
      </h3>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">Total AMC Jobs</p>
          <p className="text-3xl font-semibold text-blue-900">{totalAmcJobs}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium mb-1">Completed Jobs</p>
          <p className="text-3xl font-semibold text-green-900">{amcDoneCounts}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium mb-1">Pending Jobs</p>
          <p className="text-3xl font-semibold text-red-900">{amcPendingCounts}</p>
        </div>
      </div>

      {/* Employee Reports Grid */}
      <h4 className="text-base font-semibold text-gray-900 mb-4">Engineer Breakdown</h4>
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((report, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
              <p className="text-base font-semibold text-gray-900 mb-3">{report.empName}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Assigned Services</span>
                  <span className="font-semibold text-blue-600">{report.assginedServiceCounts}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Done Services</span>
                  <span className="font-semibold text-green-600">{report.doneServiceCounts}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Pending Services</span>
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

const Dashboard = () => {
  const router = useRouter();

  // Visibility State
  const [isTodoListCollapsed, setIsTodoListCollapsed] = useState(true);
  const [isAmcAlertsCollapsed, setIsAmcAlertsCollapsed] = useState(false);

  // Global / counts
  const [activeTab, setActiveTab] = useState('leads');
  const [counts, setCounts] = useState(null);

  // AMC alerts
  const [amcServiceAlerts, setAmcServiceAlerts] = useState([]);
  const [amcPage, setAmcPage] = useState(0);
  const [amcSize, setAmcSize] = useState(10);
  const [amcTotalPages, setAmcTotalPages] = useState(0);
  const [amcSearch, setAmcSearch] = useState('');
  const [amcLoading, setAmcLoading] = useState(false);

  // Renewal alerts
  const [renewalServiceAlerts, setRenewalServiceAlerts] = useState([]);
  const [renewalPage, setRenewalPage] = useState(0);
  const [renewalSize, setRenewalSize] = useState(10);
  const [renewalTotalPages, setRenewalTotalPages] = useState(0);
  const [renewalSearch, setRenewalSearch] = useState('');
  const [renewalLoading, setRenewalLoading] = useState(false);

  // Customer To Do
  const [customerTodos, setCustomerTodos] = useState([]);
  const [customerPage, setCustomerPage] = useState(0);
  const [customerSize, setCustomerSize] = useState(10);
  const [customerTotalPages, setCustomerTotalPages] = useState(0);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  // Service Engineer Report State
  const [engineerReport, setEngineerReport] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Modal Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [modalContentType, setModalContentType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(null);

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

  const openReportModal = () => {
    setModalContentType('REPORT');
    setIsModalOpen(true);
  };

  const closeAddActivityModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
    setModalContentType(null);
  };

  const handleActivitySuccess = () => {
    closeAddActivityModal();
    fetchAmcAlerts();
  };

  const handleRenewalActivitySuccess = () => {
    closeAddActivityModal();
    fetchRenewalAlerts();
  };

  // Fetch counts
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

  // Fetch Service Engineer Report
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

  // Fetch AMC alerts
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
  }, [fetchAmcAlerts]);

  // Fetch Renewal alerts
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
  }, [fetchRenewalAlerts]);

  // Fetch Customer To Do
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

    if (activeTab === 'customers' && !isTodoListCollapsed) {
      fetchCustomerTodos();
    }
  }, [customerPage, customerSize, customerSearch, activeTab, isTodoListCollapsed]);

  const statCards = [
    { id: 'leads', title: 'Leads', count: counts?.totalActiveLeadCounts ?? 0, action: 'Add New Lead', icon: Users, color: 'blue' },
    { id: 'installation', title: 'New Quotations', count: counts?.totalNewInstallationQuatationCounts ?? 0, subCount: counts?.totalAmcQuatationCounts ?? 0, subTitle: 'AMC', actions: ['New Installation', 'AMC Quotation'], icon: Wrench, color: 'blue' },
    { id: 'customers', title: 'Customers', count: counts?.totalCustomerCounts ?? 0, action: 'See More Details', icon: UserCheck, color: 'blue' },
    { id: 'renewals', title: 'AMC Renewals', count: counts?.totalAmcForRenewalsCounts ?? 0, action: 'View Details', icon: FileText, color: 'blue' }
  ];

  const tabs = [
    { id: 'leads', label: 'Leads To Do', icon: Users },
    { id: 'customers', label: 'Customer To Do', icon: UserCheck },
    { id: 'activity', label: 'Daily Activity', icon: Activity },
    { id: 'breakdown', label: 'BreakDown Calls', icon: Phone }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'leads': return (<LeadsSection />);
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
      case 'activity': return (<OfficeActivity />);
      case 'breakdown': return (<BreakdownTodos />);
      default: return (<div className="p-8 text-center"><p className="text-gray-500 text-sm">Select a tab to view content</p></div>);
    }
  };

  const [activeAlertTab, setActiveAlertTab] = useState('service');

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 text-sm mt-1">Welcome back! Here's a summary of your key business metrics and tasks.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            // Define colors based on card ID
            const colors = {
              leads: 'bg-emerald-500',
              installation: 'bg-violet-500',
              customers: 'bg-blue-500',
              renewals: 'bg-orange-500'
            };
            const bgColor = colors[card.id] || 'bg-blue-500';

            return (
              <div
                key={card.id}
                className={`${bgColor} rounded-2xl p-6 relative overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300`}
              >
                {/* Decorative Background Icon */}
                <card.icon className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-20 rotate-12" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90 font-medium text-sm">{card.title}</span>
                  </div>

                  <div className="mb-6">
                    {card.subCount !== undefined ? (
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-white/80 text-xs font-medium mb-1">New Installation</p>
                          <h3 className="text-4xl font-bold text-white">{card.count}</h3>
                        </div>
                        <div className="w-px h-12 bg-white/30"></div>
                        <div className="flex-1">
                          <p className="text-white/80 text-xs font-medium mb-1">{card.subTitle}</p>
                          <h3 className="text-4xl font-bold text-white">{card.subCount}</h3>
                        </div>
                      </div>
                    ) : (
                      <h3 className="text-4xl font-bold text-white mb-1">{card.count}</h3>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
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
                          className="flex items-center justify-between w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-white/10"
                        >
                          <span>{action}</span>
                          {loadingBtn === action ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
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
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-white/10"
                      >
                        <span>{card.action}</span>
                        {loadingBtn === card.action ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs Section - To Do & Activity List */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">To Do & Activity List</h3>
            <button
              onClick={() => setIsTodoListCollapsed(!isTodoListCollapsed)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              aria-expanded={!isTodoListCollapsed}
              aria-controls="todo-activity-content"
            >
              {isTodoListCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>

          <div
            id="todo-activity-content"
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isTodoListCollapsed ? 'max-h-0' : 'max-h-screen'}`}
          >
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6">{renderTabContent()}</div>
          </div>
        </div>

        {/* AMC Service Alerts */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 gap-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-base font-semibold text-gray-900">AMC Service Alerts</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search customer, site, or place..."
                  value={amcSearch}
                  onChange={(e) => {
                    setAmcSearch(e.target.value);
                    setAmcPage(0);
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                onClick={() => setIsAmcAlertsCollapsed(!isAmcAlertsCollapsed)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                aria-expanded={!isAmcAlertsCollapsed}
                aria-controls="amc-alerts-content"
              >
                {isAmcAlertsCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Service Engineer Summary */}
          {engineerReport && !isAmcAlertsCollapsed && (
            <div className="px-6 py-4 space-y-4 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Service Engineer Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Total Jobs</span>
                    <span className="text-xl font-semibold text-blue-900">{engineerReport.totalAmcJobs}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Jobs Done</span>
                    <span className="text-xl font-semibold text-green-900">{engineerReport.amcDoneCounts}</span>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Jobs Pending</span>
                    <span className="text-xl font-semibold text-red-900">{engineerReport.amcPendingCounts}</span>
                  </div>
                </div>
              </div>

              {/* Alert Tab Buttons and Report Button */}
              <div className="pt-2 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveAlertTab('service')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${activeAlertTab === 'service'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    AMC Service Alerts
                  </button>

                  <button
                    onClick={() => setActiveAlertTab('renewal')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${activeAlertTab === 'renewal'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    AMC Renewal Service Alert
                  </button>
                </div>

                <button
                  onClick={openReportModal}
                  disabled={isReportLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors border border-blue-600"
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
          )}

          {/* Alerts Content */}
          <div
            id="amc-alerts-content"
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isAmcAlertsCollapsed ? 'max-h-0' : 'max-h-screen p-6'}`}
          >
            {activeAlertTab === 'service' && (
              amcLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading AMC Alerts...</p>
                </div>
              ) : amcServiceAlerts.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Sr No</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Site / Place</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Service</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Serviced</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Lifts</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100 text-sm">
                        {amcServiceAlerts.map((alert, index) => {
                          const isCompleted = alert.remark === 'Completed';
                          const srNo = amcPage * amcSize + index + 1;
                          return (
                            <tr key={alert.amcJobid} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-center text-gray-600">{srNo}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{alert.customer}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {alert.site} <span className="text-xs text-gray-400">({alert.place})</span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{alert.service} - {alert.month}</td>
                              <td className="px-4 py-3 text-xs text-gray-700">{getAssignedEmployees(alert.assignedServiceEmployess)}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs">
                                {alert.previousServicingDate ? new Date(alert.previousServicingDate).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                  {alert.remark}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                  {alert.currentServicePendingLiftCounts} / {alert.currentServiceTotalLiftsCounts}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => openAddActivityModal(alert.amcJobid)}
                                  disabled={isCompleted}
                                  className={`p-2 rounded-lg transition-colors ${isCompleted
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                  title={isCompleted ? "Service Completed" : "Add Activity"}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Rows per page:</span>
                      <select
                        value={amcSize}
                        onChange={(e) => {
                          setAmcSize(Number(e.target.value));
                          setAmcPage(0);
                        }}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${amcPage === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                      >
                        Prev
                      </button>
                      <button
                        disabled={amcPage + 1 >= amcTotalPages}
                        onClick={() => setAmcPage((p) => p + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${amcPage + 1 >= amcTotalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No pending AMC service alerts found.</p>
              )
            )}

            {activeAlertTab === 'renewal' && (
              renewalLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading Renewal Alerts...</p>
                </div>
              ) : renewalServiceAlerts.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Sr No</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Site / Place</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Service</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Serviced</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Lifts</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100 text-sm">
                        {renewalServiceAlerts.map((alert, index) => {
                          const isCompleted = alert.remark === 'Completed';
                          const srNo = renewalPage * renewalSize + index + 1;
                          return (
                            <tr key={alert.renewalJobId} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-center text-gray-600">{srNo}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{alert.customer}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {alert.site} <span className="text-xs text-gray-400">({alert.place})</span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{alert.service} - {alert.month}</td>
                              <td className="px-4 py-3 text-xs text-gray-700">{getAssignedEmployees(alert.assignedServiceEmployess)}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs">
                                {alert.previousServicingDate ? new Date(alert.previousServicingDate).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                  {alert.remark}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                  {alert.currentServicePendingLiftCounts} / {alert.currentServiceTotalLiftsCounts}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => openRenewalAddActivityModal(alert.renewalJobId)}
                                  disabled={isCompleted}
                                  className={`p-2 rounded-lg transition-colors ${isCompleted
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                  title={isCompleted ? "Service Completed" : "Add Activity"}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Rows per page:</span>
                      <select
                        value={renewalSize}
                        onChange={(e) => {
                          setRenewalSize(Number(e.target.value));
                          setRenewalPage(0);
                        }}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${renewalPage === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                      >
                        Prev
                      </button>
                      <button
                        disabled={renewalPage + 1 >= renewalTotalPages}
                        onClick={() => setRenewalPage((p) => p + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${renewalPage + 1 >= renewalTotalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No pending renewal service alerts found.</p>
              )
            )}
          </div>
        </div>

      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onCancel={closeAddActivityModal}
        title={
          modalContentType === 'REPORT'
            ? 'Service Engineer Performance'
            : modalContentType === 'ACTIVITY'
              ? 'Add Job Activity'
              : 'Add Renewal Job Activity'
        }
      >
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

        {modalContentType === 'REPORT' && engineerReport && (
          <ServiceEngineerReportContent
            reports={engineerReport.serviceEmployeeReports}
            totalAmcJobs={engineerReport.totalAmcJobs}
            amcDoneCounts={engineerReport.amcDoneCounts}
            amcPendingCounts={engineerReport.amcPendingCounts}
          />
        )}
      </ActionModal>
    </div>
  );
};

export default Dashboard;