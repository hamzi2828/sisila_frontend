export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type PaymentMethod = 'card' | 'paypal' | 'stripe' | 'cod' | 'cash_on_delivery';

export interface ColorMedia {
  color: string;
  images: string[];
  thumbnail?: string;
}

export interface ProductVariant {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  price: number;
  discountedPrice?: number;
}

export interface Product {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discountedPrice?: number;
  thumbnail?: string;
  thumbnailUrl?: string;
  bannerUrls?: string[];
  primaryImageUrl?: string;
  colorMedia?: ColorMedia[];
  variants?: ProductVariant[];
  description?: string;
  category?: string;
  stock?: number;
  status?: 'active' | 'inactive';
  productType?: string;
  featured?: boolean;
}

export interface OrderItem {
  _id?: string;
  product: Product | string;
  variantId: string;
  sku: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  notes?: string;
}

// Additional interfaces for better type safety
export interface OrderFilters {
  status?: OrderStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface PaginationInfo {
  page: number;
  pages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Backward compatibility - map new structure to old interface for components
export interface LegacyOrder {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  status: OrderStatus;
  total: number;
  items: LegacyOrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

export interface LegacyOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}


// Type guards for better type safety
export function isProduct(product: Product | string): product is Product {
  return typeof product === 'object' && product !== null && '_id' in product;
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(status);
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'].includes(status);
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return ['card', 'paypal', 'stripe', 'cod', 'cash_on_delivery'].includes(method);
}

// Utility functions
export function formatOrderStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatPaymentMethod(method?: PaymentMethod): string {
  if (!method) return 'N/A';
  switch (method) {
    case 'cod':
    case 'cash_on_delivery': return 'Cash on Delivery';
    default: return method.charAt(0).toUpperCase() + method.slice(1);
  }
}

// Service-related interfaces
export interface AdminGetOrdersParams {
  status?: OrderStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: PaginationInfo;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  order?: Order;
}

export interface GetOrderByIdResponse {
  success: boolean;
  order: Order;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface OrderStatsResponse {
  success: boolean;
  stats: OrderSummary;
}

export interface BulkOrderUpdateRequest {
  orderIds: string[];
  status: OrderStatus;
  reason?: string;
}

export interface BulkOrderUpdateResponse {
  success: boolean;
  updated: number;
  failed: number;
  errors?: Array<{
    orderId: string;
    error: string;
  }>;
}

// Component Props interfaces
export interface OrdersTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}
