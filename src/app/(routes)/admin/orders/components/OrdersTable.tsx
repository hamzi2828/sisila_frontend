"use client";
import React, { useState } from "react";
import { FiEye, FiTruck, FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { Order, OrderStatus, OrdersTableProps } from "../types";

export default function OrdersTable({ orders, onView, onUpdateStatus, formatCurrency, formatDate, getStatusColor }: OrdersTableProps) {
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const customerName = order.user
                      ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer'
                      : order.shippingAddress?.fullName || 'Unknown Customer';
                    const customerEmail = order.user?.email || order.shippingAddress?.email || 'No email provided';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customerName}</div>
                          <div className="text-sm text-gray-500">{customerEmail}</div>
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
                            <button
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Mark as Shipped"
                              onClick={() => handleStatusUpdate(order._id, 'shipped')}
                              disabled={loadingStatus === `${order._id}-shipped`}
                            >
                              {loadingStatus === `${order._id}-shipped` ? (
                                <FiLoader className="h-5 w-5 animate-spin" />
                              ) : (
                                <FiTruck className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              title="Mark as Delivered"
                              onClick={() => handleStatusUpdate(order._id, 'delivered')}
                              disabled={loadingStatus === `${order._id}-delivered`}
                            >
                              {loadingStatus === `${order._id}-delivered` ? (
                                <FiLoader className="h-5 w-5 animate-spin" />
                              ) : (
                                <FiCheckCircle className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Cancel Order"
                              onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                              disabled={loadingStatus === `${order._id}-cancelled`}
                            >
                              {loadingStatus === `${order._id}-cancelled` ? (
                                <FiLoader className="h-5 w-5 animate-spin" />
                              ) : (
                                <FiXCircle className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No orders found. Try adjusting your search or filter criteria.
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
