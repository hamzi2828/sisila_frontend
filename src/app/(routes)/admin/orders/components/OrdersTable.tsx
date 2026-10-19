"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Eye, Package, PackageCheck, Truck, XCircle } from "lucide-react";
import { ConfirmDialog, IconButton, StatusBadge } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { Order, OrderStatus, OrdersTableProps } from "../types";
import { FALLBACK_PRODUCT_IMAGE, getCustomerEmail, getCustomerName, getItemCount, getItemImage } from "./orderHelpers";

// Inked Wear-style chip buttons: white on the grey row card
const chip = "bg-white border border-stone-200";

function OrderThumb({ order, className }: { order: Order; className?: string }) {
  const src = getItemImage(order.items?.[0]);
  const [failed, setFailed] = useState(false);

  if (src === FALLBACK_PRODUCT_IMAGE || failed) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-100", className)}>
        <Package className="h-5 w-5 text-stone-500" />
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100", className)}>
      <Image src={src} alt="" fill sizes="48px" className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
}

export default function OrdersTable({ orders, onView, onUpdateStatus, formatCurrency, formatDate }: OrdersTableProps) {
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    const loadingKey = `${orderId}-${status}`;
    setLoadingStatus(loadingKey);
    try {
      await onUpdateStatus(orderId, status);
      return true;
    } catch {
      // The page shows the error toast
      return false;
    } finally {
      setLoadingStatus(null);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    await handleStatusUpdate(cancelTarget._id, "cancelled");
    setCancelTarget(null);
  };

  const renderActions = (order: Order, size: "sm" | "md") => {
    const busy = loadingStatus?.startsWith(`${order._id}-`) ?? false;
    return (
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <IconButton
          label="View details"
          size={size}
          className={chip}
          icon={<Eye className="h-4 w-4" />}
          onClick={() => onView(order)}
        />
        {order.orderStatus === "pending" && (
          <IconButton
            label="Mark as Processing"
            size={size}
            tone="warning"
            className={chip}
            icon={<PackageCheck className="h-4 w-4" />}
            loading={loadingStatus === `${order._id}-processing`}
            disabled={busy}
            onClick={() => handleStatusUpdate(order._id, "processing")}
          />
        )}
        <IconButton
          label="Mark as Shipped"
          size={size}
          tone="info"
          className={chip}
          icon={<Truck className="h-4 w-4" />}
          loading={loadingStatus === `${order._id}-shipped`}
          disabled={busy || order.orderStatus === "shipped"}
          onClick={() => handleStatusUpdate(order._id, "shipped")}
        />
        <IconButton
          label="Mark as Delivered"
          size={size}
          tone="success"
          className={chip}
          icon={<CheckCircle2 className="h-4 w-4" />}
          loading={loadingStatus === `${order._id}-delivered`}
          disabled={busy || order.orderStatus === "delivered"}
          onClick={() => handleStatusUpdate(order._id, "delivered")}
        />
        <IconButton
          label="Cancel Order"
          size={size}
          tone="danger"
          className={chip}
          icon={<XCircle className="h-4 w-4" />}
          loading={loadingStatus === `${order._id}-cancelled`}
          disabled={busy || order.orderStatus === "cancelled"}
          onClick={() => setCancelTarget(order)}
        />
      </div>
    );
  };

  return (
    <>
      <ul className="space-y-2 sm:space-y-3">
        {orders.map((order) => {
          const customerName = getCustomerName(order);
          const customerEmail = getCustomerEmail(order);
          const itemCount = getItemCount(order);

          return (
            <li
              key={order._id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-3 transition-shadow duration-200 hover:shadow-md sm:p-4"
            >
              {/* Mobile layout */}
              <div className="flex flex-col gap-3 sm:hidden">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onView(order)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none"
                  >
                    <OrderThumb order={order} className="h-10 w-10" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-stone-900">#{order.orderNumber}</h3>
                        <StatusBadge status={order.orderStatus} size="sm" />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-stone-500">{customerName}</p>
                    </div>
                  </button>
                  <p className="whitespace-nowrap text-sm font-semibold text-stone-900">{formatCurrency(order.total)}</p>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-2">
                  <p className="min-w-0 truncate text-xs text-stone-500">
                    {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                  {renderActions(order, "sm")}
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden items-center gap-4 sm:flex">
                <OrderThumb order={order} className="h-12 w-12" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      className="text-base font-semibold text-stone-900 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                    >
                      #{order.orderNumber}
                    </button>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <p className="truncate text-sm text-stone-500">
                    {customerName}
                    {customerEmail && ` • ${customerEmail}`}
                  </p>
                </div>

                <div className="hidden text-right md:block">
                  <p className="text-xs text-stone-500">Order Date</p>
                  <p className="whitespace-nowrap text-sm text-stone-700">{formatDate(order.createdAt)}</p>
                </div>

                <div className="hidden text-right lg:block">
                  <p className="text-xs text-stone-500">Items</p>
                  <p className="text-sm text-stone-700">{itemCount}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-500">Total</p>
                  <p className="whitespace-nowrap text-sm font-semibold text-stone-900">{formatCurrency(order.total)}</p>
                </div>

                {renderActions(order, "md")}
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel this order?"
        message={
          cancelTarget ? (
            <>
              Order <span className="font-semibold text-stone-900">#{cancelTarget.orderNumber}</span> for{" "}
              {getCustomerName(cancelTarget)} will be marked as cancelled.
            </>
          ) : null
        }
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        loading={!!cancelTarget && loadingStatus === `${cancelTarget._id}-cancelled`}
        onCancel={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
    </>
  );
}
