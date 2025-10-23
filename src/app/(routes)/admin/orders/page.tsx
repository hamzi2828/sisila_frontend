// src/app/(routes)/admin/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import OrdersTabs from './components/OrdersTabs';
import OrdersSearch from './components/OrdersSearch';
import OrdersTable from './components/OrdersTable';
import OrdersPagination from './components/OrdersPagination';
import OrderDetailsModal from './components/OrderDetailsModal';
import { Order, OrderStatus } from './types';
import { getAllOrders, updateOrderStatus } from './services/adminOrderService';

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ordersPerPage = 8;

  // Derive status filter from active tab
  const statusFilter: OrderStatus | 'all' = activeTab === 'all' ? 'all' : activeTab;

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage, searchQuery]);

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Calculate display indices
  const indexOfFirstOrder = (currentPage - 1) * ordersPerPage + 1;
  const indexOfLastOrder = Math.min(currentPage * ordersPerPage, totalOrders);

  // Get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      const result = await updateOrderStatus(orderId, newStatus);
      console.log('Order status update result:', result);

      // Refresh orders after status update
      await fetchOrders();

      // Show success message (optional)
      alert(`Order status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update order status: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and track customer orders</p>
      </div>

      {/* Tabs */}
      <OrdersTabs
        tabs={[
          { key: 'all', label: 'All Orders', count: activeTab === 'all' ? totalOrders : orders.length },
          { key: 'processing', label: 'In Processing', count: orders.filter(o => o.orderStatus === 'processing').length },
          { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
          { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
          { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length },
        ]}
        activeKey={activeTab}
        onChange={(key) => { setActiveTab(key as 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'); setCurrentPage(1); }}
      />

      {/* Search */}
      <OrdersSearch value={searchQuery} onChange={(v) => setSearchQuery(v)} />

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <OrdersTable
            orders={orders}
            onView={(order) => {
              setSelectedOrder(order);
            }}
            onUpdateStatus={handleUpdateOrderStatus}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />

          {/* Pagination */}
          <OrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstOrder={indexOfFirstOrder}
            indexOfLastOrder={indexOfLastOrder}
            totalCount={totalOrders}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};

export default OrdersPage;