'use client';

import React, { useEffect, useState } from 'react';
import {
  FiSearch, FiFilter, FiRefreshCw, FiDownload,
  FiMessageSquare, FiClock, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import ContactQueryTable from './components/ContactQueryTable';
import ContactQueryModal from './components/ContactQueryModal';
import {
  ContactQuery,
  ContactQueryFilters,
  ContactQueryStats,
  contactQueriesService
} from './services/contactQueriesService';

const ContactQueriesClient = () => {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [stats, setStats] = useState<ContactQueryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<ContactQueryFilters>({
    page: 1,
    limit: 20,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pages: 1,
    limit: 20,
  });

  const fetchQueries = async () => {
    try {
      setRefreshing(true);
      const response = await contactQueriesService.getContactQueries(filters);
      setQueries(response.queries);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load contact queries');
      console.error('Contact queries error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await contactQueriesService.getContactQueryStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchQueries();
    fetchStats();
  }, [filters]);

  const handleRefresh = () => {
    fetchQueries();
    fetchStats();
  };

  const handleFilterChange = (key: keyof ContactQueryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset page when other filters change
    }));
  };

  const handleViewQuery = (query: ContactQuery) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const handleUpdateQuery = (updatedQuery: ContactQuery) => {
    setQueries(prev =>
      prev.map(q => q._id === updatedQuery._id ? updatedQuery : q)
    );
    setSelectedQuery(updatedQuery);
    fetchStats(); // Refresh stats after update
  };

  const handleDeleteQuery = (queryId: string) => {
    setQueries(prev => prev.filter(q => q._id !== queryId));
    fetchStats(); // Refresh stats after delete
  };

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
  };

  const getStatsByStatus = () => {
    if (!stats) return [];

    const statusLabels = {
      new: { label: 'New', color: 'text-blue-600 bg-blue-100', icon: FiMessageSquare },
      in_progress: { label: 'In Progress', color: 'text-yellow-600 bg-yellow-100', icon: FiClock },
      resolved: { label: 'Resolved', color: 'text-green-600 bg-green-100', icon: FiCheckCircle },
      closed: { label: 'Closed', color: 'text-gray-600 bg-gray-100', icon: FiAlertCircle },
    };

    return stats.byStatus.map(stat => ({
      ...stat,
      ...statusLabels[stat._id as keyof typeof statusLabels] || statusLabels.new,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Contact Queries</h3>
              <p className="text-gray-500">Please wait while we fetch your data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                  <FiMessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
              </div>
              <p className="text-gray-600">Manage customer inquiries and support requests efficiently</p>
            </div>
            <div className="flex items-center mt-6 space-x-3 md:mt-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200 shadow-sm"
              >
                <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm">
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                      <FiMessageSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Queries</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {getStatsByStatus().map((stat) => (
              <div key={stat._id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-sm ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                        <dd className="text-2xl font-bold text-gray-900">{stat.count}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiFilter className="w-5 h-5 mr-2 text-gray-600" />
              Filters & Search
            </h3>
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors duration-200"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors duration-200"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {['general', 'support', 'returns', 'wholesale', 'technical', 'feedback'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', filters.category === category ? undefined : category)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    filters.category === category
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

      {/* Table */}
      <ContactQueryTable
        queries={queries}
        loading={refreshing}
        onViewQuery={handleViewQuery}
      />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current >= pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {(pagination.current - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-gray-900">
                    {Math.min(pagination.current * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900">{pagination.total.toLocaleString()}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current <= 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
                    let page;
                    if (pagination.pages <= 7) {
                      page = i + 1;
                    } else if (pagination.current <= 4) {
                      page = i + 1;
                    } else if (pagination.current >= pagination.pages - 3) {
                      page = pagination.pages - 6 + i;
                    } else {
                      page = pagination.current - 3 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                          page === pagination.current
                            ? 'z-10 bg-gradient-to-r from-indigo-500 to-indigo-600 border-indigo-500 text-white shadow-sm'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current >= pagination.pages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        <ContactQueryModal
          query={selectedQuery}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuery(null);
          }}
          onUpdate={handleUpdateQuery}
          onDelete={handleDeleteQuery}
        />
      </div>
    </div>
  );
};

export default ContactQueriesClient;