// Package Order Status Types
export type PackageOrderStatus = 'pending' | 'active' | 'cancelled' | 'expired' | 'completed';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type PaymentMethod = 'card' | 'paypal' | 'stripe';

// Package interface
export interface Package {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
  features?: string[];
  isActive?: boolean;
}

// User interface
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
}

// Customer Info interface
export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Package Order interface
export interface PackageOrder {
  _id: string;
  orderNumber: string;
  user?: User;
  package: Package | string;
  customerInfo: CustomerInfo;
  createdAt: string;
  updatedAt: string;
  orderStatus: PackageOrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  total: number;
  startDate?: string;
  endDate?: string;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  notes?: string;
}

// Filters interface
export interface PackageOrderFilters {
  status?: PackageOrderStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  paymentStatus?: PaymentStatus;
}

// Pagination interface
export interface PaginationInfo {
  page: number;
  pages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Type guards
export function isPackage(pkg: Package | string): pkg is Package {
  return typeof pkg === 'object' && pkg !== null && '_id' in pkg;
}

export function isValidPackageOrderStatus(status: string): status is PackageOrderStatus {
  return ['pending', 'active', 'cancelled', 'expired', 'completed'].includes(status);
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return ['pending', 'completed', 'failed', 'refunded', 'cancelled'].includes(status);
}

// Utility functions
export function getPackageOrderStatusColor(status: PackageOrderStatus): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'expired': return 'bg-gray-100 text-gray-800';
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

export function formatPackageOrderStatus(status: PackageOrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Service-related interfaces
export interface AdminGetPackageOrdersParams {
  status?: PackageOrderStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminPackageOrdersResponse {
  success: boolean;
  orders: PackageOrder[];
  pagination: PaginationInfo;
}

export interface UpdatePackageOrderStatusResponse {
  success: boolean;
  message: string;
  order?: PackageOrder;
}

export interface GetPackageOrderByIdResponse {
  success: boolean;
  order: PackageOrder;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
}

// Component Props interfaces
export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export interface PackageOrdersTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export interface PackageOrdersSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface PackageOrdersTableProps {
  orders: PackageOrder[];
  onView: (order: PackageOrder) => void;
  onUpdateStatus: (orderId: string, status: PackageOrderStatus) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: PackageOrderStatus) => string;
  loading?: boolean;
}

export interface PackageOrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstOrder: number;
  indexOfLastOrder: number;
  totalCount: number;
  setCurrentPage: (page: number) => void;
}

export interface PackageOrderDetailsModalProps {
  order: PackageOrder | null;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: PackageOrderStatus) => string;
  onUpdateStatus?: (orderId: string, newStatus: PackageOrderStatus) => void;
}
