import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { EmptyState, StatusBadge, Table, TBody, TD, TH, THead, TR } from '@/components/admin/ui';
import type { Order } from '../services/dashboardService';

interface RecentOrdersTableProps {
  orders: Order[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders = [] }) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-200">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-stone-900">Recent Orders</h3>
          <p className="mt-0.5 text-xs text-stone-500">The latest orders across your store</p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="New orders will show up here as soon as customers check out."
        />
      ) : (
        <>
          {/* Mobile: stacked rows */}
          <ul className="divide-y divide-stone-100 sm:hidden">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href="/admin/orders" className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-stone-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">#{order.orderNumber || order.id?.slice(-6) || 'N/A'}</p>
                    <p className="truncate text-xs text-stone-500">{order.customerName || 'Guest'}</p>
                    <p className="mt-0.5 text-[11px] text-stone-400">{order.createdAt ? formatDate(order.createdAt) : '—'}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <p className="text-sm font-semibold text-stone-900">{formatPrice(order.amount || 0)}</p>
                    <StatusBadge status={order.status || 'pending'} size="sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* sm+: table */}
          <Table wrapperClassName="hidden sm:block">
            <THead>
              <tr>
                <TH>Order</TH>
                <TH>Customer</TH>
                <TH align="right">Amount</TH>
                <TH align="center">Status</TH>
                <TH align="right">Date</TH>
              </tr>
            </THead>
            <TBody>
              {orders.map((order) => (
                <TR key={order.id}>
                  <TD className="font-medium text-stone-900">
                    <Link href="/admin/orders" className="hover:underline underline-offset-4">
                      #{order.orderNumber || order.id?.slice(-6) || 'N/A'}
                    </Link>
                  </TD>
                  <TD className="text-stone-600">{order.customerName || 'Guest'}</TD>
                  <TD align="right" className="font-medium text-stone-900">{formatPrice(order.amount || 0)}</TD>
                  <TD align="center">
                    <StatusBadge status={order.status || 'pending'} />
                  </TD>
                  <TD align="right" className="text-stone-500">{order.createdAt ? formatDate(order.createdAt) : '—'}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </>
      )}
    </div>
  );
};
