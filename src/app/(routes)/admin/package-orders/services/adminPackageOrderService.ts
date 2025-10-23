// src/app/(routes)/admin/package-orders/services/adminPackageOrderService.ts
import { getAuthHeader } from "@/helper/helper";
import {
  AdminGetPackageOrdersParams,
  AdminPackageOrdersResponse,
  UpdatePackageOrderStatusResponse,
  GetPackageOrderByIdResponse,
  ApiErrorResponse,
  PackageOrderStatus,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllPackageOrders(params?: AdminGetPackageOrdersParams): Promise<AdminPackageOrdersResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== 'all') {
    searchParams.append('status', params.status);
  }
  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.search) {
    searchParams.append('search', params.search);
  }

  const url = `${API_BASE_URL}/api/gymfolio/getAllOrders${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let msg = "Failed to fetch package orders";
    try {
      const err: ApiErrorResponse = await res.json();
      msg = err?.message || err?.error || msg;
    } catch {
      // Failed to parse JSON error response
    }
    throw new Error(msg);
  }

  const response = await res.json();

  // Transform backend response to match frontend types
  return {
    success: response.success,
    orders: response.data?.map((order: any) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.userId ? {
        _id: order.userId._id,
        firstName: order.userId.firstName,
        lastName: order.userId.lastName,
        email: order.userId.email,
        phone: order.customerInfo?.phone,
      } : undefined,
      package: order.packageId ? {
        _id: order.packageId._id,
        name: order.packageId.name || order.packageDetails?.name,
        description: order.packageDetails?.description,
        price: parseFloat(order.packageId.price?.replace(/,/g, '') || order.payment?.amount || 0),
        duration: order.packageId.period || order.packageDetails?.period,
        features: order.packageDetails?.features || [],
        isActive: true,
      } : order.packageDetails?.name,
      customerInfo: order.customerInfo,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderStatus: order.status,
      paymentStatus: order.payment?.status || 'pending',
      paymentMethod: order.payment?.method,
      total: order.payment?.amount || 0,
      startDate: order.subscription?.startDate,
      endDate: order.subscription?.endDate,
      stripeSessionId: order.payment?.stripeSessionId,
      stripeSubscriptionId: order.subscription?.stripeSubscriptionId,
      notes: order.notes,
    })) || [],
    pagination: response.pagination,
  };
}

export async function updatePackageOrderStatus(orderId: string, newStatus: PackageOrderStatus): Promise<UpdatePackageOrderStatusResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const url = `${API_BASE_URL}/api/gymfolio/orders/${orderId}/status`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    let msg = "Failed to update package order status";
    try {
      const err: ApiErrorResponse = await res.json();
      msg = err?.message || err?.error || msg;
    } catch {
      // Failed to parse JSON error response
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function getPackageOrderById(orderId: string): Promise<GetPackageOrderByIdResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const url = `${API_BASE_URL}/api/gymfolio/orders/${orderId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let msg = "Failed to fetch package order details";
    try {
      const err: ApiErrorResponse = await res.json();
      msg = err?.message || err?.error || msg;
    } catch {
      // Failed to parse JSON error response
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function cancelPackageSubscription(orderId: string): Promise<UpdatePackageOrderStatusResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const url = `${API_BASE_URL}/api/gymfolio/orders/${orderId}/cancel`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let msg = "Failed to cancel package subscription";
    try {
      const err: ApiErrorResponse = await res.json();
      msg = err?.message || err?.error || msg;
    } catch {
      // Failed to parse JSON error response
    }
    throw new Error(msg);
  }

  return res.json();
}
