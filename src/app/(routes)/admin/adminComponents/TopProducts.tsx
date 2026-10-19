import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { Badge, EmptyState, Table, TBody, TD, TH, THead, TR } from '@/components/admin/ui';
import type { Product } from '../services/dashboardService';

interface TopProductsProps {
  products: Product[];
  /** e.g. "Last 7 days" */
  periodLabel?: string;
}

const stockBadge = (stock: number) => {
  if (stock <= 0) return <Badge tone="danger" dot size="sm">Out of stock</Badge>;
  if (stock < 10) return <Badge tone="warning" dot size="sm">{stock} left</Badge>;
  return <Badge tone="success" dot size="sm">{stock} in stock</Badge>;
};

export const TopProducts: React.FC<TopProductsProps> = ({ products = [], periodLabel }) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-200">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-stone-900">Top Products</h3>
          <p className="mt-0.5 text-xs text-stone-500">By revenue{periodLabel ? ` · ${periodLabel.toLowerCase()}` : ''}</p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No product sales yet"
          description="Best sellers for the selected period will be ranked here."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Product</TH>
              <TH align="center">Sold</TH>
              <TH align="right">Revenue</TH>
              <TH align="center" className="hidden md:table-cell">Stock</TH>
            </tr>
          </THead>
          <TBody>
            {products.map((product, index) => (
              <TR key={product.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        index === 0 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="max-w-[180px] sm:max-w-[260px] truncate font-medium text-stone-900 hover:underline underline-offset-4"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                  </div>
                </TD>
                <TD align="center" className="text-stone-600">{product.sales}</TD>
                <TD align="right" className="font-medium text-stone-900">{formatPrice(product.revenue)}</TD>
                <TD align="center" className="hidden md:table-cell">{stockBadge(product.stock)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
};
