"use client";
import React, { useState } from "react";
import { FiPrinter, FiMail, FiMapPin, FiUser, FiCreditCard, FiLoader, FiCheckCircle, FiXCircle, FiPackage, FiPlay, FiCalendar } from "react-icons/fi";
import { PackageOrder, PackageOrderStatus, PackageOrderDetailsModalProps, isPackage } from "../types";

export default function PackageOrderDetailsModal({
  order,
  onClose,
  formatCurrency,
  formatDate,
  getStatusColor,
  onUpdateStatus
}: PackageOrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const customerName = order.user
    ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer'
    : order.customerInfo?.fullName || 'Unknown Customer';
  const customerEmail = order.user?.email || order.customerInfo?.email || 'No email provided';
  const packageName = isPackage(order.package) ? order.package.name : 'Package';
  const packageDuration = isPackage(order.package) ? order.package.duration : 'N/A';

  const handleStatusUpdate = async (newStatus: PackageOrderStatus) => {
    if (!onUpdateStatus) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Package Order #{order.orderNumber}</h3>
                <p className="text-purple-100 text-sm">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FiUser className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Customer Information</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{customerName}</p>
                  <p className="text-sm text-gray-600">{customerEmail}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo?.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FiCreditCard className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Payment Details</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Method:</span> {
                      order.paymentMethod
                        ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)
                        : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus || 'Unknown'}
                    </span>
                  </p>
                  {order.stripeSessionId && (
                    <p className="text-xs text-gray-500 truncate">
                      Session: {order.stripeSessionId.substring(0, 30)}...
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FiMapPin className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Contact Address</h4>
                </div>
                <div className="text-sm text-gray-900 space-y-1">
                  <p>{order.customerInfo?.fullName}</p>
                  <p>{order.customerInfo?.address || 'N/A'}</p>
                  <p>{order.customerInfo?.city}, {order.customerInfo?.state} {order.customerInfo?.zipCode}</p>
                  <p>{order.customerInfo?.country}</p>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiPackage className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Package Details</h4>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{packageName}</h3>
                    {isPackage(order.package) && order.package.description && (
                      <p className="text-gray-600 mb-4">{order.package.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-gray-700">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">Duration: <span className="font-semibold">{packageDuration}</span></span>
                      </div>
                    </div>
                    {isPackage(order.package) && order.package.features && order.package.features.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {order.package.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <FiCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="ml-6 text-right">
                    <p className="text-3xl font-bold text-purple-600">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-gray-500 mt-1">Package Price</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Dates */}
            {(order.startDate || order.endDate) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Subscription Period</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.startDate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(order.startDate)}</p>
                    </div>
                  )}
                  {order.endDate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(order.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPrinter className="-ml-1 mr-2 h-4 w-4" />
              Print Invoice
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiMail className="-ml-1 mr-2 h-4 w-4" />
              Send Email
            </button>
            {/* Status Update Buttons */}
            {onUpdateStatus && (
              <>
                {order.orderStatus === 'pending' && (
                  <button
                    type="button"
                    className="inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleStatusUpdate('active')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <FiLoader className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FiPlay className="-ml-1 mr-2 h-4 w-4" />
                    )}
                    {isUpdating ? 'Updating...' : 'Activate Subscription'}
                  </button>
                )}

                {(order.orderStatus === 'pending' || order.orderStatus === 'active') && (
                  <>
                    <button
                      type="button"
                      className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <FiLoader className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FiCheckCircle className="-ml-1 mr-2 h-4 w-4" />
                      )}
                      {isUpdating ? 'Updating...' : 'Mark as Completed'}
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleStatusUpdate('cancelled')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <FiLoader className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FiXCircle className="-ml-1 mr-2 h-4 w-4" />
                      )}
                      {isUpdating ? 'Updating...' : 'Cancel Subscription'}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
