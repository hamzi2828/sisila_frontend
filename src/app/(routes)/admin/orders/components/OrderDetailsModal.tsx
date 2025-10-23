"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiPrinter, FiMail, FiTruck, FiPackage, FiMapPin, FiUser, FiCreditCard, FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Order, OrderStatus, OrderDetailsModalProps } from "../types";

export default function OrderDetailsModal({ order, onClose, formatDate, getStatusColor, onUpdateStatus }: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const customerName = order.user
    ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer'
    : order.shippingAddress?.fullName || 'Unknown Customer';
  const customerEmail = order.user?.email || order.shippingAddress?.email || 'No email provided';

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!onUpdateStatus) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus);
      // Close modal after successful update
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Order #{order.orderNumber}</h3>
                <p className="text-blue-100 text-sm">Placed on {formatDate(order.createdAt)}</p>
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
            {/* Customer & Order Info Grid */}
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
                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
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
                  {order.stripePaymentIntentId && (
                    <p className="text-xs text-gray-500 truncate">
                      Payment ID: {order.stripePaymentIntentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FiMapPin className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Shipping Address</h4>
                </div>
                <div className="text-sm text-gray-900">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiPackage className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Order Items</h4>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Size/Color</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-1 text-center">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => {
                    const product = typeof item.product === 'object' ? item.product : null;
                    const productName = product?.name || `Product ${index + 1}`;

                    let productImage = '/images/gym1.svg';
                    if (product?.primaryImageUrl) {
                      productImage = process.env.NEXT_PUBLIC_BACKEND_URL + product.primaryImageUrl;
                    } else if (product?.thumbnailUrl) {
                      productImage = process.env.NEXT_PUBLIC_BACKEND_URL + product.thumbnailUrl;
                    } else if (product?.images?.[0]) {
                      productImage = process.env.NEXT_PUBLIC_BACKEND_URL + product.images[0];
                    }

                    return (
                      <div key={item._id || index} className="px-4 py-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center space-x-3">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={productImage}
                              alt={productName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{productName}</p>
                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-sm text-gray-900">{item.size}</p>
                          <p className="text-xs text-gray-500">{item.color}</p>
                        </div>
                        <div className="col-span-1 text-center">
                          <p className="text-sm font-medium text-gray-900">{item.quantity}</p>
                        </div>
                        <div className="col-span-1 text-center">
                          <p className="text-sm text-gray-900">Rs {item.price.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-sm font-semibold text-gray-900">Rs {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">Rs {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Rs {order.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">Rs {order.tax.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-Rs {order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">Rs {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
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
                {order.orderStatus === 'processing' && (
                  <button
                    type="button"
                    className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleStatusUpdate('shipped')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <FiLoader className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FiTruck className="-ml-1 mr-2 h-4 w-4" />
                    )}
                    {isUpdating ? 'Updating...' : 'Mark as Shipped'}
                  </button>
                )}

                {order.orderStatus === 'shipped' && (
                  <button
                    type="button"
                    className="inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <FiLoader className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FiCheckCircle className="-ml-1 mr-2 h-4 w-4" />
                    )}
                    {isUpdating ? 'Updating...' : 'Mark as Delivered'}
                  </button>
                )}

                {(order.orderStatus === 'processing' || order.orderStatus === 'shipped') && (
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
                    {isUpdating ? 'Updating...' : 'Cancel Order'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
