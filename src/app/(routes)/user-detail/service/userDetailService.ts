// src/app/(routes)/user-detail/service/userDetailService.ts
import { getAuthHeader } from "@/helper/helper";

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  profileImage: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
}

export const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  returned: "bg-gray-100 text-gray-800 border-gray-200",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
}

export async function updateUser( payload: UpdateUserPayload) {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }
  const res = await fetch(`${API_BASE_URL}/update/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Update failed";
    try {
      const err = await res.json();
      msg = err?.message || err?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getUserDetailForProfile() {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
  }
  const res = await fetch(`${API_BASE_URL}/userDetailForProfile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let msg = "Get user detail failed";
    try {
      const err = await res.json();
      msg = err?.message || err?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
