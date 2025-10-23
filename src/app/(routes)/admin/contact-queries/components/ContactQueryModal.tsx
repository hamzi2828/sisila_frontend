'use client';

import React, { useState } from 'react';
import {
  FiX, FiUser, FiMail, FiPhone, FiCalendar, FiClock,
  FiMessageSquare, FiEdit3, FiSave, FiTrash2, FiCheck
} from 'react-icons/fi';
import { ContactQuery, contactQueriesService } from '../services/contactQueriesService';

interface ContactQueryModalProps {
  query: ContactQuery | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedQuery: ContactQuery) => void;
  onDelete: (queryId: string) => void;
}

export default function ContactQueryModal({
  query,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: ContactQueryModalProps) {
  const [status, setStatus] = useState(query?.status || 'new');
  const [priority, setPriority] = useState(query?.priority || 'medium');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  React.useEffect(() => {
    if (query) {
      setStatus(query.status);
      setPriority(query.priority);
      setNewNote('');
    }
  }, [query]);

  if (!isOpen || !query) return null;

  const handleStatusUpdate = async () => {
    if (!query || status === query.status) return;

    setLoading(true);
    try {
      const updatedQuery = await contactQueriesService.updateContactQueryStatus(query._id, status);
      onUpdate(updatedQuery);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityUpdate = async () => {
    if (!query || priority === query.priority) return;

    setLoading(true);
    try {
      const updatedQuery = await contactQueriesService.updateContactQueryPriority(query._id, priority);
      onUpdate(updatedQuery);
    } catch (error) {
      console.error('Failed to update priority:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!query || !newNote.trim()) return;

    setAddingNote(true);
    try {
      const updatedQuery = await contactQueriesService.addAdminNote(query._id, newNote.trim());
      onUpdate(updatedQuery);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleMarkResponseSent = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const updatedQuery = await contactQueriesService.markResponseSent(query._id);
      onUpdate(updatedQuery);
    } catch (error) {
      console.error('Failed to mark response as sent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!query || !confirm('Are you sure you want to delete this contact query?')) return;

    setLoading(true);
    try {
      await contactQueriesService.deleteContactQuery(query._id);
      onDelete(query._id);
      onClose();
    } catch (error) {
      console.error('Failed to delete contact query:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${priorityStyles[priority as keyof typeof priorityStyles] || 'bg-gray-100 text-gray-800'}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-2xl px-6 pt-6 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl">
                <FiMessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Contact Query Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">View and manage customer inquiry</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 text-gray-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                      <FiUser className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</div>
                      <div className="text-sm font-semibold text-gray-900">{query.fullName}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3">
                      <FiMail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</div>
                      <div className="text-sm font-semibold text-gray-900">{query.emailAddress}</div>
                    </div>
                  </div>
                  {query.phoneNumber && (
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                        <FiPhone className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Phone</div>
                        <div className="text-sm font-semibold text-gray-900">{query.phoneNumber}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                      <FiCalendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Submitted</div>
                      <div className="text-sm font-semibold text-gray-900">{formatDate(query.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject and Message */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  Subject
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-900 font-medium">{query.subject}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiEdit3 className="w-5 h-5 mr-2 text-gray-600" />
                  Message
                </h4>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {query.message}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h4>
                <div className="space-y-3 mb-4">
                  {query.adminNotes && query.adminNotes.length > 0 ? (
                    query.adminNotes.map((note, index) => (
                      <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3">
                        <div className="flex">
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-blue-700">{note.note}</p>
                            <div className="mt-2 text-xs text-blue-600">
                              Added on {formatDate(note.addedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No admin notes yet.</p>
                  )}
                </div>

                {/* Add Note */}
                <div className="flex space-x-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an admin note..."
                    className="flex-1 min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || addingNote}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <FiEdit3 className="h-4 w-4 mr-1" />
                    {addingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status and Priority Controls */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Status & Priority</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    {status !== query.status && (
                      <button
                        onClick={handleStatusUpdate}
                        disabled={loading}
                        className="mt-1 w-full px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        <FiSave className="h-3 w-3 mr-1 inline" />
                        Update Status
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    {priority !== query.priority && (
                      <button
                        onClick={handlePriorityUpdate}
                        disabled={loading}
                        className="mt-1 w-full px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 disabled:opacity-50"
                      >
                        <FiSave className="h-3 w-3 mr-1 inline" />
                        Update Priority
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Status Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Current Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Status:</span>
                    {getStatusBadge(query.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Priority:</span>
                    {getPriorityBadge(query.priority)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Category:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {query.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Response Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Response Status</h4>
                <div className="space-y-2">
                  {query.responseEmailSent ? (
                    <div className="flex items-center text-green-600">
                      <FiCheck className="h-4 w-4 mr-2" />
                      <span className="text-sm">Response sent</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <FiClock className="h-4 w-4 mr-2" />
                      <span className="text-sm">No response sent</span>
                    </div>
                  )}

                  {query.responseEmailSentAt && (
                    <p className="text-xs text-gray-600 mt-1">
                      Sent: {formatDate(query.responseEmailSentAt)}
                    </p>
                  )}

                  {!query.responseEmailSent && (
                    <button
                      onClick={handleMarkResponseSent}
                      disabled={loading}
                      className="w-full mt-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <FiCheck className="h-4 w-4 mr-1 inline" />
                      Mark Response Sent
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Danger Zone</h4>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  <FiTrash2 className="h-4 w-4 mr-1 inline" />
                  Delete Query
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}