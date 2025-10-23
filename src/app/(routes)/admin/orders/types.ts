export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type PaymentMethod = 'card' | 'paypal' | 'stripe' | 'cash_on_delivery';

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
  return ['pending', 'completed', 'failed', 'refunded', 'cancelled'].includes(status);
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return ['card', 'paypal', 'stripe', 'cash_on_delivery'].includes(method);
}

// Utility functions
export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'processing': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'refunded': return 'bg-purple-100 text-purple-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'refunded': return 'bg-purple-100 text-purple-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function formatOrderStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatPaymentMethod(method?: PaymentMethod): string {
  if (!method) return 'N/A';
  switch (method) {
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
export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export interface OrdersTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export interface OrdersSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface OrdersTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: OrderStatus) => string;
  loading?: boolean;
}

export interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstOrder: number;
  indexOfLastOrder: number;
  totalCount: number;
  setCurrentPage: (page: number) => void;
}

export interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: OrderStatus) => string;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export interface AllOrdersProps {
  orders: Order[];
  filter?: "all" | OrderStatus;
  onOrderSelect?: (order: Order) => void;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
}
