"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import { CheckCircle2, CreditCard, Mail, MapPin, Package, PackageCheck, Printer, Truck, User, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, ConfirmDialog, Modal, StatusBadge, buttonClasses } from "@/components/admin/ui";
import { OrderStatus, OrderDetailsModalProps, formatPaymentMethod } from "../types";
import { FALLBACK_PRODUCT_IMAGE, getCustomerEmail, getCustomerName, getItemImage, getItemName } from "./orderHelpers";
import { printOrderInvoice } from "./printInvoice";

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700">
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
      </div>
      <div className="space-y-1 text-sm text-stone-600">{children}</div>
    </div>
  );
}

function ItemImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 ${className}`}>
      <Image
        src={failed ? FALLBACK_PRODUCT_IMAGE : src}
        alt={alt}
        fill
        sizes="64px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function OrderDetailsModal({ order, onClose, formatCurrency, formatDate, onUpdateStatus }: OrderDetailsModalProps) {
  const [updatingTo, setUpdatingTo] = useState<OrderStatus | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // Reset local state whenever a different order is opened
  useEffect(() => {
    setUpdatingTo(null);
    setConfirmCancel(false);
  }, [order?._id]);

  if (!order) return null;

  const isUpdating = updatingTo !== null;
  const customerName = getCustomerName(order);
  const customerEmail = getCustomerEmail(order);
  const address = order.shippingAddress;
  const items = order.items || [];

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!onUpdateStatus) return;

    setUpdatingTo(newStatus);
    try {
      await onUpdateStatus(order._id, newStatus);
      // Close modal after successful update
      onClose();
    } catch (error) {
      // The page already shows the error toast; keep the modal open
      console.error("Error updating status:", error);
    } finally {
      setUpdatingTo(null);
    }
  };

  const handlePrint = () => {
    if (!printOrderInvoice(order)) toast.error("Pop-up blocked. Allow pop-ups to print the invoice.");
  };

  const mailto = customerEmail
    ? `mailto:${customerEmail}?subject=${encodeURIComponent(`Your Silsila order #${order.orderNumber}`)}`
    : null;

  const footer = (
    <>
      <div className="flex flex-col-reverse gap-2 sm:mr-auto sm:flex-row">
        <Button variant="secondary" leftIcon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
          Print Invoice
        </Button>
        {mailto && (
          <a href={mailto} className={buttonClasses("secondary", "md")}>
            <Mail className="h-4 w-4" />
            Send Email
          </a>
        )}
      </div>

      <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
        Close
      </Button>

      {/* Status update buttons */}
      {onUpdateStatus && (
        <>
          {(order.orderStatus === "pending" || order.orderStatus === "processing" || order.orderStatus === "shipped") && (
            <Button
              variant="danger-outline"
              leftIcon={<XCircle className="h-4 w-4" />}
              loading={updatingTo === "cancelled"}
              loadingText="Updating..."
              disabled={isUpdating}
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Order
            </Button>
          )}

          {order.orderStatus === "pending" && (
            <Button
              leftIcon={<PackageCheck className="h-4 w-4" />}
              loading={updatingTo === "processing"}
              loadingText="Updating..."
              disabled={isUpdating}
              onClick={() => handleStatusUpdate("processing")}
            >
              Mark as Processing
            </Button>
          )}

          {order.orderStatus === "processing" && (
            <Button
              leftIcon={<Truck className="h-4 w-4" />}
              loading={updatingTo === "shipped"}
              loadingText="Updating..."
              disabled={isUpdating}
              onClick={() => handleStatusUpdate("shipped")}
            >
              Mark as Shipped
            </Button>
          )}

          {order.orderStatus === "shipped" && (
            <Button
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              loading={updatingTo === "delivered"}
              loadingText="Updating..."
              disabled={isUpdating}
              onClick={() => handleStatusUpdate("delivered")}
            >
              Mark as Delivered
            </Button>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <Modal
        open
        onClose={onClose}
        size="2xl"
        dismissible={!confirmCancel && !isUpdating}
        title={
          <span className="flex flex-wrap items-center gap-2">
            Order #{order.orderNumber}
            <StatusBadge status={order.orderStatus} />
          </span>
        }
        description={`Placed on ${formatDateTime(order.createdAt)}`}
        footer={footer}
      >
        <div className="space-y-5 sm:space-y-6">
          {/* Customer, payment & shipping */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            <InfoCard icon={<User className="h-4 w-4" />} title="Customer">
              <p className="font-medium text-stone-900">{customerName}</p>
              <p className="break-all">{customerEmail || "No email provided"}</p>
              {address?.phone && <p>{address.phone}</p>}
            </InfoCard>

            <InfoCard icon={<CreditCard className="h-4 w-4" />} title="Payment">
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-500">Method</span>
                <span className="font-medium text-stone-900">{formatPaymentMethod(order.paymentMethod)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-500">Status</span>
                <StatusBadge status={order.paymentStatus || "unknown"} size="sm" />
              </div>
              {order.stripePaymentIntentId && (
                <p className="truncate pt-1 text-xs text-stone-500" title={order.stripePaymentIntentId}>
                  Payment ID: {order.stripePaymentIntentId}
                </p>
              )}
            </InfoCard>

            <InfoCard icon={<MapPin className="h-4 w-4" />} title="Shipping Address">
              <p className="font-medium text-stone-900">{address?.fullName}</p>
              <p>{address?.address}</p>
              <p>{[address?.city, address?.state, address?.zipCode].filter(Boolean).join(", ")}</p>
              <p>{address?.country}</p>
              {order.notes && <p className="pt-1 text-xs text-stone-500">{order.notes}</p>}
              {order.trackingNumber && (
                <p className="text-xs text-stone-500">
                  Tracking: <span className="font-medium text-stone-700">{order.trackingNumber}</span>
                </p>
              )}
            </InfoCard>
          </div>

          {/* Order items */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-stone-500" />
              <h4 className="text-sm font-semibold text-stone-900">Order Items</h4>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">{items.length}</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-stone-200">
              <div className="hidden grid-cols-12 gap-4 bg-stone-50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-stone-500 sm:grid">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Size / Color</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="divide-y divide-stone-100">
                {items.map((item, index) => {
                  const productName = getItemName(item, index);
                  const productImage = getItemImage(item);
                  const lineTotal = formatCurrency(item.price * item.quantity);

                  return (
                    <div key={item._id || index} className="px-4 py-3">
                      {/* Mobile */}
                      <div className="flex gap-3 sm:hidden">
                        <ItemImage src={productImage} alt={productName} className="h-14 w-14" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-stone-900">{productName}</p>
                          <p className="text-xs text-stone-500">SKU: {item.sku}</p>
                          <p className="mt-1 text-xs text-stone-600">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-sm">
                            <span className="text-stone-600">
                              {item.quantity} × {formatCurrency(item.price)}
                            </span>
                            <span className="font-semibold text-stone-900">{lineTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop */}
                      <div className="hidden grid-cols-12 items-center gap-4 sm:grid">
                        <div className="col-span-5 flex min-w-0 items-center gap-3">
                          <ItemImage src={productImage} alt={productName} className="h-14 w-14" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-stone-900" title={productName}>
                              {productName}
                            </p>
                            <p className="truncate text-xs text-stone-500">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-sm text-stone-900">{item.size}</p>
                          <p className="text-xs text-stone-500">{item.color}</p>
                        </div>
                        <div className="col-span-1 text-center text-sm font-medium text-stone-900">{item.quantity}</div>
                        <div className="col-span-2 text-right text-sm text-stone-700">{formatCurrency(item.price)}</div>
                        <div className="col-span-2 text-right text-sm font-semibold text-stone-900">{lineTotal}</div>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && <p className="px-4 py-6 text-center text-sm text-stone-500">No items on this order.</p>}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 text-xs text-stone-500">
              {order.shippedAt && <p>Shipped on {formatDate(order.shippedAt)}</p>}
              {order.deliveredAt && <p>Delivered on {formatDate(order.deliveredAt)}</p>}
              {order.cancelledAt && <p>Cancelled on {formatDate(order.cancelledAt)}</p>}
              {order.refundedAt && <p>Refunded on {formatDate(order.refundedAt)}</p>}
            </div>
            <div className="w-full rounded-xl border border-stone-200 bg-stone-50 p-4 sm:max-w-xs">
              <h4 className="mb-3 text-sm font-semibold text-stone-900">Order Summary</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500">Subtotal</dt>
                  <dd className="text-stone-900">{formatCurrency(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Shipping</dt>
                  <dd className="text-stone-900">{formatCurrency(order.shippingCost)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Tax</dt>
                  <dd className="text-stone-900">{formatCurrency(order.tax)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Discount</dt>
                    <dd className="text-emerald-700">-{formatCurrency(order.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold">
                  <dt className="text-stone-900">Total</dt>
                  <dd className="text-stone-900">{formatCurrency(order.total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this order?"
        message={
          <>
            Order <span className="font-semibold text-stone-900">#{order.orderNumber}</span> for {customerName} will be
            marked as cancelled.
          </>
        }
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          // Close the confirm first so the two dialogs never unmount in the same commit
          setConfirmCancel(false);
          handleStatusUpdate("cancelled");
        }}
      />
    </>
  );
}
