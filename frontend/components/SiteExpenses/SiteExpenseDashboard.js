import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Search, Loader2, Plus } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '@/utils/axiosInstance';
import AddSiteExpenseModal from './AddSiteExpenseModal'; // Import the new modal component

const SiteExpenseDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [expenses, setExpenses] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch Expense List with search
  useEffect(() => {
    fetchExpenses();
  }, [searchTerm, dateSearch, page]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/api/site-expenses/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: 'expenseDate',
        direction: 'desc'
      };
      
      if (searchTerm) params.search = searchTerm;
      if (dateSearch) params.dateSearch = dateSearch;

      const response = await axiosInstance.get('/api/site-expenses', { params });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleExpenseCreated = () => {
    // Refresh dashboard and expense list after new expense is created
    fetchDashboardData();
    fetchExpenses();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Prepare chart data
  const categoryData = dashboardData?.categoryWiseExpenses?.expensesByCategory 
    ? Object.entries(dashboardData.categoryWiseExpenses.expensesByCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value)
      }))
    : [];

  const monthlyData = dashboardData?.monthlyExpenseTrend?.monthlyData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Site Expense Dashboard</h1>
            <p className="text-slate-600 mt-1">Track and analyze your site expenses</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Expenses Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(dashboardData?.summaryCards?.totalExpenses)}
                </p>
                <p className="text-purple-100 text-xs mt-1">
                  {dashboardData?.summaryCards?.totalExpenseCount || 0} transactions
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-200 opacity-80" />
            </div>
          </div>

          {/* Today's Expenses Card */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Today's Expenses</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(dashboardData?.summaryCards?.todayExpenses)}
                </p>
                <p className="text-pink-100 text-xs mt-1">
                  {dashboardData?.summaryCards?.todayExpenseCount || 0} transactions
                </p>
              </div>
              <Calendar className="w-12 h-12 text-pink-200 opacity-80" />
            </div>
          </div>

          {/* This Month Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(dashboardData?.summaryCards?.thisMonthExpenses)}
                </p>
                <p className="text-amber-100 text-xs mt-1">
                  {dashboardData?.summaryCards?.thisMonthExpenseCount || 0} transactions
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-amber-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category-wise Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Category-wise Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Monthly Expense Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} name="Amount" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Expensive Projects */}
<div className="bg-white rounded-xl shadow-lg p-6">
  <h3 className="text-xl font-semibold text-slate-800 mb-4">
    Top 5 Expensive Projects
  </h3>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200">
          <th className="text-left py-3 px-4 font-semibold text-slate-700">Customer</th>
          <th className="text-left py-3 px-4 font-semibold text-slate-700">Site</th>
          <th className="text-left py-3 px-4 font-semibold text-slate-700">Job Type</th>
          <th className="text-right py-3 px-4 font-semibold text-slate-700">Total Expense</th>
          <th className="text-center py-3 px-4 font-semibold text-slate-700">Count</th>
        </tr>
      </thead>

      <tbody>
        {dashboardData?.topExpensiveProjects?.map((project, index) => (
          <tr
            key={index}
            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            {/* Customer Name */}
            <td className="py-3 px-4">{project.customerName}</td>

            {/* Site */}
            <td className="py-3 px-4">{project.siteName}</td>

            {/* Job Type Badge */}
            <td className="py-3 px-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.jobType === "AMC_INITIAL"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {project.jobType.replace("_", " ")}
              </span>
            </td>

            {/* Total Expense */}
            <td className="py-3 px-4 text-right font-semibold text-slate-800">
              {formatCurrency(project.totalExpense)}
            </td>

            {/* Count */}
            <td className="py-3 px-4 text-center">
              <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                {project.expenseCount}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Latest 10 Expenses (from Dashboard) */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Latest 10 Expense Entries</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Employee</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Narration</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Job Type</th>

                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Payment</th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData?.latestExpenses || []).map((expense, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm">{expense.expenseDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {expense.expenseType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{expense.employeeName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{expense.narration || '-'}</td>
 {/* Job Type Badge */}
            <td className="py-3 px-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  expense.jobType === "AMC_INITIAL"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {expense.jobType.replace("_", " ")}
              </span>
            </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm">{expense.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Searchable All Expenses List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">All Expenses (Searchable)</h3>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <input
              type="date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Employee</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Narration</th>
                                              <th className="text-left py-3 px-4 font-semibold text-slate-700">Job Type</th>

                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Payment</th>
                </tr>
              </thead>
              <tbody>
                {(expenses.content || []).map((expense, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm">{expense.expenseDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {expense.expenseType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{expense.employeeName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{expense.narration || '-'}</td>
                     {/* Job Type Badge */}
            <td className="py-3 px-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  expense.jobType === "AMC_INITIAL"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {expense.jobType.replace("_", " ")}
              </span>
            </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm">{expense.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {expenses.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-300 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {page + 1} of {expenses.totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(expenses.totalPages - 1, page + 1))}
                disabled={page >= expenses.totalPages - 1}
                className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Add Expense Modal */}
      <AddSiteExpenseModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleExpenseCreated}
      />
    </div>
  );
};

export default SiteExpenseDashboard;