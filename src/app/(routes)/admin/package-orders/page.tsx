// src/app/(routes)/admin/package-orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import PackageOrdersTabs from './components/PackageOrdersTabs';
import PackageOrdersSearch from './components/PackageOrdersSearch';
import PackageOrdersTable from './components/PackageOrdersTable';
import PackageOrdersPagination from './components/PackageOrdersPagination';
import PackageOrderDetailsModal from './components/PackageOrderDetailsModal';
import { PackageOrder, PackageOrderStatus } from './types';
import { getAllPackageOrders, updatePackageOrderStatus } from './services/adminPackageOrderService';

const PackageOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled' | 'expired'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PackageOrder | null>(null);
  const [orders, setOrders] = useState<PackageOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ordersPerPage = 8;

  // Derive status filter from active tab
  const statusFilter: PackageOrderStatus | 'all' = activeTab === 'all' ? 'all' : activeTab;

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllPackageOrders({
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
      console.error('Error fetching package orders:', error);
      // Show error message to user
      alert('Failed to fetch package orders. Please try again.');
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
  const getStatusColor = (status: PackageOrderStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
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
  const handleUpdateOrderStatus = async (orderId: string, newStatus: PackageOrderStatus) => {
    try {
      console.log(`Updating package order ${orderId} to status: ${newStatus}`);
      const result = await updatePackageOrderStatus(orderId, newStatus);
      console.log('Package order status update result:', result);

      // Refresh orders after status update
      await fetchOrders();

      // Show success message
      alert(`Package order status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating package order status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update package order status: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Package Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and track package subscriptions</p>
      </div>

      {/* Tabs */}
      <PackageOrdersTabs
        tabs={[
          { key: 'all', label: 'All Orders', count: activeTab === 'all' ? totalOrders : (orders?.length || 0) },
          { key: 'pending', label: 'Pending', count: orders?.filter(o => o.orderStatus === 'pending').length || 0 },
          { key: 'active', label: 'Active', count: orders?.filter(o => o.orderStatus === 'active').length || 0 },
          { key: 'completed', label: 'Completed', count: orders?.filter(o => o.orderStatus === 'completed').length || 0 },
          { key: 'cancelled', label: 'Cancelled', count: orders?.filter(o => o.orderStatus === 'cancelled').length || 0 },
          { key: 'expired', label: 'Expired', count: orders?.filter(o => o.orderStatus === 'expired').length || 0 },
        ]}
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as 'all' | 'pending' | 'active' | 'completed' | 'cancelled' | 'expired');
          setCurrentPage(1);
        }}
      />

      {/* Search */}
      <PackageOrdersSearch value={searchQuery} onChange={(v) => setSearchQuery(v)} />

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading package orders...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <PackageOrdersTable
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
          <PackageOrdersPagination
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
      <PackageOrderDetailsModal
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

export default PackageOrdersPage;
