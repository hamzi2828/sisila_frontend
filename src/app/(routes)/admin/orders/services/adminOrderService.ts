// src/app/(routes)/admin/orders/services/adminOrderService.ts
import { getAuthHeader } from "@/helper/helper";
import {
  AdminGetOrdersParams,
  AdminOrdersResponse,
  UpdateOrderStatusResponse,
  GetOrderByIdResponse,
  ApiErrorResponse,
  OrderStatus,
  Order,
  LegacyOrder,
  LegacyOrderItem,
  Product
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to transform new order to legacy format
export function transformOrderToLegacy(order: Order): LegacyOrder {
  return {
    id: order.orderNumber,
    customer: {
      name: order.user ? `${order.user.firstName} ${order.user.lastName}` : order.shippingAddress.fullName,
      email: order.user?.email || order.shippingAddress.email,
    },
    date: order.createdAt,
    status: order.orderStatus,
    total: order.total,
    items: order.items.map((item, index): LegacyOrderItem => {
      const product = typeof item.product === 'object' ? item.product as Product : null;
      let productImage = '/images/gym1.svg';

      if (product?.primaryImageUrl) {
        productImage = product.primaryImageUrl;
      } else if (product?.thumbnailUrl) {
        productImage = product.thumbnailUrl;
      } else if (product?.images?.[0]) {
        productImage = product.images[0];
      }

      return {
        id: item._id || `${index}`,
        name: product?.name || `Product ${index + 1}`,
        price: item.price,
        quantity: item.quantity,
        image: productImage,
      };
    }),
    shippingAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
    paymentMethod: order.paymentMethod
      ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)
      : 'N/A',
  };
}

export async function getAllOrders(params?: AdminGetOrdersParams): Promise<AdminOrdersResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const searchParams = new URLSearchParams();
  if (params?.status) {
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

  const url = `${API_BASE_URL}/api/payment/getAllOrders${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let msg = "Failed to fetch all orders";
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

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<UpdateOrderStatusResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const url = `${API_BASE_URL}/api/payment/orders/${orderId}/status`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    let msg = "Failed to update order status";
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

export async function getOrderById(orderId: string): Promise<GetOrderByIdResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }

  const url = `${API_BASE_URL}/api/payment/orders/${orderId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let msg = "Failed to fetch order details";
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