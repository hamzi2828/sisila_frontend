'use client';

import React from 'react';
import { FiEye, FiClock, FiUser, FiMail, FiPhone, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { ContactQuery } from '../services/contactQueriesService';

interface ContactQueryTableProps {
  queries: ContactQuery[];
  loading: boolean;
  onViewQuery: (query: ContactQuery) => void;
}

export default function ContactQueryTable({ queries, loading, onViewQuery }: ContactQueryTableProps) {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'bg-blue-100 text-blue-700 border border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border border-green-200',
      closed: 'bg-gray-100 text-gray-700 border border-gray-200',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      low: 'bg-gray-100 text-gray-700 border border-gray-200',
      medium: 'bg-blue-100 text-blue-700 border border-blue-200',
      high: 'bg-orange-100 text-orange-700 border border-orange-200',
      urgent: 'bg-red-100 text-red-700 border border-red-200',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityStyles[priority as keyof typeof priorityStyles] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryStyles = {
      general: 'bg-gray-100 text-gray-700 border border-gray-200',
      support: 'bg-purple-100 text-purple-700 border border-purple-200',
      returns: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      wholesale: 'bg-teal-100 text-teal-700 border border-teal-200',
      technical: 'bg-red-100 text-red-700 border border-red-200',
      feedback: 'bg-green-100 text-green-700 border border-green-200',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryStyles[category as keyof typeof categoryStyles] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
        {category.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contact Queries</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contact Queries</h3>
        </div>
        <div className="p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full mb-4">
            <FiMail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contact queries found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">No contact queries match your current filters. Try adjusting your search criteria or clearing filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiMessageSquare className="w-5 h-5 mr-2 text-gray-600" />
          Contact Queries
          <span className="ml-2 px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
            {queries.length}
          </span>
        </h3>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subject & Message
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status & Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queries.map((query) => (
              <tr key={query._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-semibold text-gray-900">{query.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{query.emailAddress}</span>
                    </div>
                    {query.phoneNumber && (
                      <div className="flex items-center">
                        <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{query.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-semibold text-gray-900">{query.subject}</span>
                    <span className="text-sm text-gray-600">{truncateText(query.message)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    {getStatusBadge(query.status)}
                    {getPriorityBadge(query.priority)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(query.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{formatDate(query.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewQuery(query)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                  >
                    <FiEye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {queries.map((query) => (
            <div key={query._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{query.fullName}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <FiMail className="h-4 w-4 mr-1" />
                    {query.emailAddress}
                  </div>
                  {query.phoneNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="h-4 w-4 mr-1" />
                      {query.phoneNumber}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onViewQuery(query)}
                  className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <FiEye className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">{query.subject}</h5>
                <p className="text-sm text-gray-600">{truncateText(query.message, 80)}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {getStatusBadge(query.status)}
                {getPriorityBadge(query.priority)}
                {getCategoryBadge(query.category)}
              </div>

              <div className="flex items-center text-xs text-gray-500">
                <FiCalendar className="h-3 w-3 mr-1" />
                {formatDate(query.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}