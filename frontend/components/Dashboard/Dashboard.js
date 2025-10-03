'use client'
import { useEffect, useState } from 'react';
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
  Edit2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import LeadsSection from './LeadsSection';
import CustomerTodoAndMissedActivity from './CustomerTodoAndMissedActivity';
import OfficeActivity from './OfficeActivity';
import BreakdownTodos from './BreakdownTodos';

const Dashboard = () => {

  const router = useRouter();
  // --- global / counts
  const [activeTab, setActiveTab] = useState('leads');
  const [counts, setCounts] = useState(null);

  // --- AMC alerts (kept)
  const [amcServiceAlerts, setAmcServiceAlerts] = useState([]);
  const [amcPage, setAmcPage] = useState(0);
  const [amcSize, setAmcSize] = useState(10);
  const [amcTotalPages, setAmcTotalPages] = useState(0);
  const [amcSearch, setAmcSearch] = useState('');
  const [amcLoading, setAmcLoading] = useState(false);


  // --- Customer To Do
  const [customerTodos, setCustomerTodos] = useState([]);
  const [customerPage, setCustomerPage] = useState(0);
  const [customerSize, setCustomerSize] = useState(10);
  const [customerTotalPages, setCustomerTotalPages] = useState(0);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

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

  // fetch AMC alerts
  useEffect(() => {
    const fetchAmcAlerts = async () => {
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
    };
    fetchAmcAlerts();
  }, [amcPage, amcSize, amcSearch]);

  
  // fetch Customer To Do
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
    {
      id: 'leads',
      title: 'Leads',
      count: counts?.totalActiveLeadCounts ?? 0,
      action: 'Add New Lead',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-b-blue-500'
    },
    {
      id: 'installation',
      title: 'New Installation',
      count: counts?.totalNewInstallationQuatationCounts ?? 0,
      subCount: counts?.totalAmcQuatationCounts ?? 0,
      subTitle: 'AMC',
      actions: ['New Installation', 'AMC Quotation'],
      icon: Wrench,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-b-green-500'
    },
    {
      id: 'customers',
      title: 'Customers',
      count: counts?.totalCustomerCounts ?? 0,
      action: 'See More Details',
      icon: UserCheck,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-b-purple-500'
    },
    {
      id: 'renewals',
      title: 'AMC Renewals',
      count: counts?.totalAmcForRenewalsCounts ?? 0,
      action: 'View Details',
      icon: FileText,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-b-orange-500'
    }
  ];

  const tabs = [
    { id: 'leads', label: 'Leads To Do', icon: Users },
    { id: 'customers', label: 'Customer To Do', icon: Users },
    { id: 'activity', label: 'Daily Activity', icon: Activity },
    { id: 'breakdown', label: 'BreakDown Calls', icon: Phone }
  ];

  /* ---------- Tab Content Renderer ---------- */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'leads':
        return (<>
        <LeadsSection/>
        </>);
           
      case 'customers':
        return (
         <>
         <CustomerTodoAndMissedActivity/>
         </>
        );
      
      case 'activity':
        return (
        <>
        <OfficeActivity/>
        </>
        );
      
      case 'breakdown':
        return (
         <>
         <BreakdownTodos/>
         </>
        );
      
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

  return (
    <div className="space-y-8 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Here you can find a summary of your dashboard activities.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.id}
            className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border-b-4 ${card.borderColor}`}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-light text-gray-900">{card.count}</span>
                  {card.subCount !== undefined && (
                    <>
                      <span className="text-xl font-light text-gray-600">{card.subCount}</span>
                      <span className="text-sm text-gray-500">{card.subTitle}</span>
                    </>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-5 h-5 ${getIconColor(card.color)}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-700">{card.title}</h3>
              <div className="space-y-2">
                {card.actions ? (
                  card.actions.map((action, index) => (
                    <button
                      key={index}
                        onClick={() => {
                          if (action === "AMC Quotation") {
                            router.push(`/dashboard/quotations/amc_quatation_list`);
                          }else if(action === "Add New Lead"){
                            router.push(`/dashboard/lead-management/lead-list/add-lead`);
                          }
                          // for other actions you can add different routing later if needed
                        }}
                      className="flex items-center justify-between w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1 group"
                    >
                      <span>{action}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  }} className="flex items-center justify-between w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1 group">
                    <span>{card.action}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-96">{renderTabContent()}</div>
      </div>

      {/* AMC Service Alerts (kept below tabs) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">AMC Service Alerts</span>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search customer/site..."
              value={amcSearch}
              onChange={(e) => {
                setAmcSearch(e.target.value);
                setAmcPage(0);
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {amcServiceAlerts.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-100 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Site</th>
                  <th className="px-4 py-3 text-left">Place</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Pending</th>
                </tr>
              </thead>
              <tbody>
                {amcLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">Loading...</td>
                  </tr>
                ) : (
                  amcServiceAlerts.map((alert) => (
                    <tr key={alert.amcJobid} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{alert.customer}</td>
                      <td className="px-4 py-2 border-b">{alert.site}</td>
                      <td className="px-4 py-2 border-b">{alert.place}</td>
                      <td className="px-4 py-2 border-b">{alert.service}</td>
                      <td className="px-4 py-2 border-b">{alert.month}</td>
                      <td className="px-4 py-2 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${alert.currentServicePendingLiftCounts > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {alert.currentServicePendingLiftCounts} / {alert.currentServiceTotalLiftsCounts}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          !amcLoading && <p className="text-sm text-gray-500">No pending AMC alerts</p>
        )}

        {amcTotalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select
                value={amcSize}
                onChange={(e) => {
                  setAmcSize(Number(e.target.value));
                  setAmcPage(0);
                }}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button
                disabled={amcPage === 0}
                onClick={() => setAmcPage((p) => p - 1)}
                className={`px-3 py-1 rounded-lg border text-sm ${amcPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100 text-blue-600 border-blue-300'}`}
              >
                Prev
              </button>
              <span className="text-gray-600">Page {amcPage + 1} of {amcTotalPages}</span>
              <button
                disabled={amcPage + 1 >= amcTotalPages}
                onClick={() => setAmcPage((p) => p + 1)}
                className={`px-3 py-1 rounded-lg border text-sm ${amcPage + 1 >= amcTotalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100 text-blue-600 border-blue-300'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;