"use client";
import React, { useState } from "react";
import { FiEye, FiCheckCircle, FiXCircle, FiLoader, FiPlay } from "react-icons/fi";
import { PackageOrder, PackageOrderStatus, PackageOrdersTableProps, isPackage } from "../types";

export default function PackageOrdersTable({
  orders,
  onView,
  onUpdateStatus,
  formatCurrency,
  formatDate,
  getStatusColor
}: PackageOrdersTableProps) {
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, status: PackageOrderStatus) => {
    const loadingKey = `${orderId}-${status}`;
    setLoadingStatus(loadingKey);
    try {
      await onUpdateStatus(orderId, status);
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders && orders.length > 0 ? (
                  orders.map((order) => {
                    const customerName = order.user
                      ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer'
                      : order.customerInfo?.fullName || 'Unknown Customer';
                    const customerEmail = order.user?.email || order.customerInfo?.email || 'No email provided';
                    const packageName = isPackage(order.package) ? order.package.name : 'Package';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customerName}</div>
                          <div className="text-sm text-gray-500">{customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{packageName}</div>
                          {isPackage(order.package) && order.package.duration && (
                            <div className="text-sm text-gray-500">{order.package.duration}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => onView(order)} className="text-indigo-600 hover:text-indigo-900" title="View Details">
                              <FiEye className="h-5 w-5" />
                            </button>
                            {order.orderStatus === 'pending' && (
                              <button
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Activate Subscription"
                                onClick={() => handleStatusUpdate(order._id, 'active')}
                                disabled={loadingStatus === `${order._id}-active`}
                              >
                                {loadingStatus === `${order._id}-active` ? (
                                  <FiLoader className="h-5 w-5 animate-spin" />
                                ) : (
                                  <FiPlay className="h-5 w-5" />
                                )}
                              </button>
                            )}
                            {(order.orderStatus === 'pending' || order.orderStatus === 'active') && (
                              <button
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                title="Mark as Completed"
                                onClick={() => handleStatusUpdate(order._id, 'completed')}
                                disabled={loadingStatus === `${order._id}-completed`}
                              >
                                {loadingStatus === `${order._id}-completed` ? (
                                  <FiLoader className="h-5 w-5 animate-spin" />
                                ) : (
                                  <FiCheckCircle className="h-5 w-5" />
                                )}
                              </button>
                            )}
                            {(order.orderStatus === 'pending' || order.orderStatus === 'active') && (
                              <button
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Cancel Subscription"
                                onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                disabled={loadingStatus === `${order._id}-cancelled`}
                              >
                                {loadingStatus === `${order._id}-cancelled` ? (
                                  <FiLoader className="h-5 w-5 animate-spin" />
                                ) : (
                                  <FiXCircle className="h-5 w-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No package orders found. Try adjusting your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
