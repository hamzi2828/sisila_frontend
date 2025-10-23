"use client";

import React, { useEffect, useState } from "react";
import {
  FiTrendingUp, FiUsers, FiPackage, FiDollarSign,
  FiAlertCircle, FiClock, FiBarChart2,
  FiShoppingCart, FiActivity, FiPercent, FiRepeat,
  FiRefreshCw
} from 'react-icons/fi';
import { StatsCard } from './adminComponents/StatsCard';
import { RecentOrdersTable } from './adminComponents/RecentOrdersTable';
import { QuickStats } from './adminComponents/QuickStats';
import { SalesTrendChart } from './adminComponents/SalesTrendChart';
import { TopProducts } from './adminComponents/TopProducts';
import { dashboardService, type DashboardData } from '@/app/(routes)/admin/services/dashboardService';

const AdminDashboardClient = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const data = await dashboardService.getDashboardData(timeRange);
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleGenerateReport = async () => {
    try {
      const report = await dashboardService.generateReport(timeRange);
      const blob = new Blob([report], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString()}.pdf`;
      a.click();
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!dashboardData || !dashboardData.stats || !dashboardData.quickStats) {
    return null;
  }

  const statsConfig = [
    {
      name: 'Total Sales',
      value: dashboardData.stats.totalSales.toLocaleString(),
      icon: FiTrendingUp,
      change: '+12.5%',
      changeType: 'increase' as const,
      prefix: ''
    },
    {
      name: 'Total Users',
      value: dashboardData.stats.totalUsers.toLocaleString(),
      icon: FiUsers,
      change: '+8.2%',
      changeType: 'increase' as const,
      prefix: ''
    },
    {
      name: 'Products',
      value: dashboardData.stats.totalProducts.toLocaleString(),
      icon: FiPackage,
      change: '+5.1%',
      changeType: 'increase' as const,
      prefix: ''
    },
    {
      name: 'Revenue',
      value: dashboardData.stats.totalRevenue.toLocaleString(),
      icon: FiDollarSign,
      change: '+18.3%',
      changeType: 'increase' as const,
      prefix: '$'
    },
    {
      name: 'Orders Today',
      value: dashboardData.stats.ordersToday.toLocaleString(),
      icon: FiShoppingCart,
      change: '+3.1%',
      changeType: 'increase' as const,
      prefix: ''
    },
    {
      name: 'Avg Order Value',
      value: (dashboardData.stats.avgOrderValue || 0).toFixed(2),
      icon: FiDollarSign,
      change: '+1.8%',
      changeType: 'increase' as const,
      prefix: '$'
    },
    {
      name: 'Conversion Rate',
      value: `${(dashboardData.stats.conversionRate || 0).toFixed(1)}%`,
      icon: FiActivity,
      change: '+0.3%',
      changeType: 'increase' as const,
      prefix: ''
    },
    {
      name: 'Refund Rate',
      value: `${(dashboardData.stats.refundRate || 0).toFixed(1)}%`,
      icon: FiPercent,
      change: '-0.1%',
      changeType: 'decrease' as const,
      prefix: ''
    },
  ];

  const quickStatsConfig = [
    {
      name: 'Pending Orders',
      value: dashboardData.quickStats.pendingOrders.toString(),
      icon: FiClock,
      color: 'text-yellow-500 bg-yellow-100'
    },
    {
      name: 'Low Stock Items',
      value: dashboardData.quickStats.lowStockItems.toString(),
      icon: FiAlertCircle,
      color: 'text-red-500 bg-red-100'
    },
    {
      name: 'New Customers',
      value: dashboardData.quickStats.newCustomers.toString(),
      icon: FiUsers,
      color: 'text-blue-500 bg-blue-100'
    },
    {
      name: 'Returned Items',
      value: dashboardData.quickStats.returnedItems.toString(),
      icon: FiRepeat,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      name: 'Avg Fulfillment',
      value: `${(dashboardData.quickStats.avgFulfillmentTime || 0).toFixed(1)}d`,
      icon: FiClock,
      color: 'text-indigo-600 bg-indigo-100'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center mt-4 space-x-2 md:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleGenerateReport}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <FiBarChart2 className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      <QuickStats stats={quickStatsConfig} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesTrendChart
          data={dashboardData.salesTrend}
          title="Sales Trend"
          dataKey="sales"
          color="#4f46e5"
        />
        <SalesTrendChart
          data={dashboardData.salesTrend}
          title="Orders Trend"
          dataKey="orders"
          color="#10b981"
        />
      </div>

      <div>
        <RecentOrdersTable orders={dashboardData.recentOrders} />
      </div>

      <div>
        <TopProducts products={dashboardData.topProducts} />
      </div>
    </div>
  );
};

export default AdminDashboardClient;