// src/app/(routes)/admin/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Clock, Hourglass, RotateCcw, ShoppingCart, Truck, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  AdminPage,
  Alert,
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
  Pagination,
  SearchInput,
  StatCard,
  StatGrid,
  Tabs,
  type TabItem,
  type Tone,
} from '@/components/admin/ui';
import OrdersTable from './components/OrdersTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import { Order, OrderStatus } from './types';
import { getAllOrders, updateOrderStatus } from './services/adminOrderService';
import { formatPrice } from '@/lib/formatPrice';

type OrdersTab = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

// New COD orders start as "pending"; Stripe refunds (charge.refunded webhook) set "refunded".
const TABS: (TabItem<OrdersTab> & { tone: Tone; statLabel: string })[] = [
  { key: 'all', label: 'All Orders', statLabel: 'Total', icon: ShoppingCart, tone: 'neutral' },
  { key: 'pending', label: 'Pending', statLabel: 'Pending', icon: Hourglass, tone: 'warning' },
  { key: 'processing', label: 'In Processing', statLabel: 'Processing', icon: Clock, tone: 'info' },
  { key: 'shipped', label: 'Shipped', statLabel: 'Shipped', icon: Truck, tone: 'info' },
  { key: 'delivered', label: 'Delivered', statLabel: 'Delivered', icon: CheckCircle2, tone: 'success' },
  { key: 'cancelled', label: 'Cancelled', statLabel: 'Cancelled', icon: XCircle, tone: 'danger' },
  { key: 'refunded', label: 'Refunded', statLabel: 'Refunded', icon: RotateCcw, tone: 'violet' },
];

const ordersPerPage = 8;

const OrdersPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<OrdersTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [counts, setCounts] = useState<Partial<Record<OrdersTab, number>>>({});

  // Derive status filter from active tab
  const statusFilter: OrderStatus | 'all' = activeTab === 'all' ? 'all' : activeTab;

  // Debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const next = searchInput.trim();
    if (next === searchQuery) return;
    const t = setTimeout(() => {
      setSearchQuery(next);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput, searchQuery]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        limit: ordersPerPage,
        search: searchQuery || undefined
      });

      if (response.success) {
        setOrders(response.orders);
        setTotalOrders(response.pagination.total);
        setTotalPages(response.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage, searchQuery]);

  // Per-status totals for the stat tiles (same endpoint, one row per status)
  const fetchCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        TABS.map((tab) =>
          getAllOrders({ status: tab.key === 'all' ? undefined : tab.key, page: 1, limit: 1 })
            .then((res) => [tab.key, res.pagination?.total ?? 0] as const)
            .catch(() => [tab.key, undefined] as const)
        )
      );
      const next: Partial<Record<OrdersTab, number>> = {};
      results.forEach(([key, total]) => {
        if (typeof total === 'number') next[key] = total;
      });
      setCounts(next);
    } catch (err) {
      console.error('Error fetching order counts:', err);
    }
  }, []);

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const changeTab = (key: OrdersTab) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Format currency (PKR)
  const formatCurrency = (amount: number) => formatPrice(amount);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      // Refresh orders and totals after status update
      await Promise.all([fetchOrders(), fetchCounts()]);

      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Failed to update order status: ${errorMessage}`);
      throw err;
    }
  };

  const showInitialLoader = loading && orders.length === 0;

  return (
    <AdminPage>
      <PageHeader title="Orders" subtitle="Manage and track customer orders" />

      {/* Stats */}
      <StatGrid cols={6} className="grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
        {TABS.map((tab) => (
          <StatCard
            key={tab.key}
            className={tab.key === 'all' ? 'col-span-3 sm:col-span-1' : undefined}
            size="sm"
            label={tab.statLabel}
            value={counts[tab.key] ?? '–'}
            icon={tab.icon}
            tone={tab.tone}
            active={activeTab === tab.key}
            onClick={() => changeTab(tab.key)}
          />
        ))}
      </StatGrid>

      {/* Content */}
      <Card padding="none">
        <Tabs tabs={TABS} value={activeTab} onChange={changeTab} />

        <div className="p-3 sm:p-6">
          {/* Search */}
          <div className="mb-4 sm:mb-6">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search by order #, customer name or email..."
              aria-label="Search orders"
            />
          </div>

          {error ? (
            <Alert tone="error" title="Couldn't load orders" onRetry={fetchOrders}>
              {error}
            </Alert>
          ) : showInitialLoader ? (
            <LoadingState label="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="No orders found"
              description={
                searchQuery || activeTab !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Orders will appear here once customers check out.'
              }
            />
          ) : (
            <div className={loading ? 'pointer-events-none opacity-60 transition-opacity' : 'transition-opacity'} aria-busy={loading}>
              <OrdersTable
                orders={orders}
                onView={(order) => setSelectedOrder(order)}
                onUpdateStatus={handleUpdateOrderStatus}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            </div>
          )}

          {/* Pagination */}
          {!error && totalOrders > 0 && (
            <Pagination
              className="mt-4 border-t border-stone-200 pt-4"
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalOrders}
              pageSize={ordersPerPage}
              itemLabel="orders"
            />
          )}
        </div>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </AdminPage>
  );
};

export default OrdersPage;
