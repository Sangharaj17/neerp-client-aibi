'use client'
import { useState } from 'react';
import { Plus, ArrowRight, FileText, Users, Activity, Phone, BarChart3, Wrench, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');

  const statCards = [
    {
      id: 'leads',
      title: 'Leads',
      count: '227',
      action: 'Add New Lead',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-b-blue-500'
    },
    {
      id: 'installation',
      title: 'New Installation',
      count: '9',
      subCount: '184',
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
      count: '113',
      action: 'See More Details',
      icon: UserCheck,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-b-purple-500'
    },
    {
      id: 'renewals',
      title: 'AMC Renewals',
      count: '73',
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

  const renderTabContent = () => {
    const content = {
      leads: 'No pending lead tasks',
      customers: 'No customer tasks pending',
      activity: 'No activities for today',
      breakdown: 'No breakdown calls reported'
    };

    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-sm">{content[activeTab]}</p>
      </div>
    );
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
      <div>
        <h2 className="text-lg font-medium text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Here you can find a summary of your dashboard activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.id} className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border-b-4 ${card.borderColor}`}>
            <div className="p-6 space-y-4">
              {/* Icon and Numbers */}
              <div className="flex items-start justify-between">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-light text-gray-900">{card.count}</span>
                  {card.subCount && (
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
              
              {/* Title */}
              <h3 className="text-sm font-medium text-gray-700">{card.title}</h3>
              
              {/* Actions */}
              <div className="space-y-2">
                {card.actions ? (
                  card.actions.map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center justify-between w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1 group"
                    >
                      <span>{action}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                ) : (
                  <button className="flex items-center justify-between w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1 group">
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
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-32">
          {renderTabContent()}
        </div>
      </div>

      {/* Service Alert */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">AMC Service Alert</span>
          </div>
          <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <span>Show</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;