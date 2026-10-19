"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CalendarClock,
  Clock,
  Package,
  Printer,
  Receipt,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Truck,
  UserPlus,
  Users,
  Percent,
} from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { AdminPage, Alert, Button, LoadingState, PageHeader, Select, StatCard, StatGrid } from "@/components/admin/ui";
import { RecentOrdersTable } from "./adminComponents/RecentOrdersTable";
import { QuickStats, type QuickStat } from "./adminComponents/QuickStats";
import { SalesTrendChart } from "./adminComponents/SalesTrendChart";
import { TopProducts } from "./adminComponents/TopProducts";
import { InventoryStatus } from "./adminComponents/InventoryStatus";
import { buildTrendSeries, periodChange } from "./adminComponents/trend";
import {
  dashboardService,
  type DashboardData,
  type DashboardTimeRange,
  type InventoryStatus as InventoryStatusData,
  type MetricComparison,
} from "@/app/(routes)/admin/services/dashboardService";

const RANGE_OPTIONS: { value: DashboardTimeRange; label: string; period: string }[] = [
  { value: "today", label: "Today", period: "Today" },
  { value: "week", label: "This Week", period: "Last 7 days" },
  { value: "month", label: "This Month", period: "Last 30 days" },
  { value: "year", label: "This Year", period: "Last 12 months" },
];

type Metrics = Partial<Record<"revenue" | "orders" | "customers", MetricComparison>>;

const REFRESH_INTERVAL_MS = 60_000;

const AdminDashboardClient = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({});
  const [inventory, setInventory] = useState<InventoryStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>("week");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const requestId = useRef(0);

  const fetchDashboardData = useCallback(async (range: DashboardTimeRange) => {
    const id = ++requestId.current;
    try {
      setRefreshing(true);
      const [data, revenue, orders, customers, stock] = await Promise.all([
        dashboardService.getDashboardData(range),
        // Period-over-period comparisons and stock health are optional extras:
        // if they fail the dashboard still renders.
        dashboardService.getMetrics("revenue", range).catch(() => undefined),
        dashboardService.getMetrics("orders", range).catch(() => undefined),
        dashboardService.getMetrics("customers", range).catch(() => undefined),
        dashboardService.getInventoryStatus().catch(() => null),
      ]);
      if (id !== requestId.current) return; // a newer request superseded this one
      setDashboardData(data);
      setMetrics({ revenue, orders, customers });
      setInventory(stock);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(timeRange);
    const interval = setInterval(() => fetchDashboardData(timeRange), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [timeRange, fetchDashboardData]);

  const handleRefresh = () => fetchDashboardData(timeRange);

  // "Report": print the dashboard (the browser's print dialog can save it as a PDF).
  // The layout hides the sidebar/header in print mode.
  const handlePrintReport = () => window.print();

  const range = RANGE_OPTIONS.find((r) => r.value === timeRange) ?? RANGE_OPTIONS[1];
  const trend = useMemo(() => buildTrendSeries(dashboardData?.salesTrend, timeRange), [dashboardData?.salesTrend, timeRange]);

  if (loading) {
    return (
      <AdminPage>
        <LoadingState label="Loading dashboard..." className="py-24" />
      </AdminPage>
    );
  }

  if (!dashboardData || !dashboardData.stats || !dashboardData.quickStats) {
    return (
      <AdminPage>
        <PageHeader title="Dashboard Overview" subtitle="Welcome back! Here's what's happening with your store." />
        <Alert tone="error" title="Error loading dashboard" onRetry={handleRefresh}>
          {error || "The dashboard returned no data."}
        </Alert>
      </AdminPage>
    );
  }

  const { stats, quickStats } = dashboardData;
  const revenueChange = periodChange(metrics.revenue?.current, metrics.revenue?.previous);
  const ordersChange = periodChange(metrics.orders?.current, metrics.orders?.previous);
  const newInPeriod = metrics.customers?.current;
  const periodLower = range.period.toLowerCase();

  const fulfilment = quickStats.avgFulfillmentTime > 0 ? `${quickStats.avgFulfillmentTime.toFixed(1)}d` : "—";

  const quickStatsConfig: QuickStat[] = [
    { name: "Pending Orders", value: quickStats.pendingOrders.toLocaleString(), icon: Clock, tone: "warning", href: "/admin/orders" },
    { name: "Low Stock Items", value: quickStats.lowStockItems.toLocaleString(), icon: AlertCircle, tone: "danger", hint: "Under 10 units", href: "/admin/products" },
    { name: "New Customers", value: quickStats.newCustomers.toLocaleString(), icon: UserPlus, tone: "info", hint: "Last 7 days", href: "/admin/users" },
    {
      name: "Avg Fulfilment",
      value: fulfilment,
      icon: Truck,
      tone: "neutral",
      hint: quickStats.avgFulfillmentTime > 0 ? "Order to delivery" : "No delivered orders yet",
    },
  ];

  return (
    <AdminPage>
      <PageHeader
        className="print:hidden"
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={refreshing}
              leftIcon={<RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />}
              title="Refresh"
              aria-label="Refresh dashboard"
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Select
              aria-label="Time range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as DashboardTimeRange)}
              className="w-auto min-w-[140px] py-2"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Button onClick={handlePrintReport} leftIcon={<Printer className="h-4 w-4" />}>
              <span className="hidden sm:inline">Print Report</span>
              <span className="sm:hidden">Report</span>
            </Button>
          </>
        }
      />

      {error && (
        <Alert tone="error" title="Couldn't refresh the dashboard" onRetry={handleRefresh} className="print:hidden">
          Showing the last loaded data{lastUpdated ? ` from ${lastUpdated.toLocaleTimeString()}` : ""}.
        </Alert>
      )}

      {/* Report header (Inked Wear style) */}
      <div className="flex flex-col gap-1 border-b border-stone-200 pb-3 sm:flex-row sm:items-end sm:justify-between sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-stone-900">Store Report</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-500">
            Period: <span className="font-medium text-stone-700">{range.period}</span>
            <span className="px-1.5 text-stone-300">|</span>
            Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        {lastUpdated && (
          <p className="text-[11px] sm:text-xs text-stone-400 print:hidden">
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · auto-refreshes every minute
          </p>
        )}
      </div>

      {/* Main stats */}
      <StatGrid cols={4}>
        <StatCard
          label="Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={Banknote}
          tone="success"
          hint={range.period}
          change={revenueChange ?? undefined}
        />
        <StatCard
          label="Orders"
          value={stats.totalSales.toLocaleString()}
          icon={ShoppingBag}
          tone="info"
          hint={range.period}
          change={ordersChange ?? undefined}
        />
        <StatCard
          label="Customers"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          tone="violet"
          hint={typeof newInPeriod === "number" ? `${newInPeriod.toLocaleString()} joined · ${periodLower}` : "All registered users"}
        />
        <StatCard
          label="Published Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          tone="neutral"
          hint={inventory ? `${inventory.outOfStock.toLocaleString()} out of stock` : undefined}
        />
      </StatGrid>

      {/* Secondary stats */}
      <StatGrid cols={4}>
        <StatCard size="sm" label="Orders Today" value={stats.ordersToday.toLocaleString()} icon={CalendarClock} />
        <StatCard size="sm" label="Avg Order Value" value={formatPrice(stats.avgOrderValue || 0)} icon={Receipt} />
        <StatCard size="sm" label="Refund Rate" value={`${(stats.refundRate || 0).toFixed(1)}%`} icon={Percent} />
        <StatCard size="sm" label="Refunded Orders" value={quickStats.returnedItems.toLocaleString()} icon={RotateCcw} />
      </StatGrid>

      {/* Quick stats */}
      <QuickStats stats={quickStatsConfig} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2 print:grid-cols-2">
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-3 sm:p-4 break-inside-avoid">
          <SalesTrendChart
            title="Sales Trend"
            subtitle={`Revenue · ${periodLower}`}
            data={trend}
            valueKey="sales"
            formatValue={formatPrice}
            total={formatPrice(stats.totalRevenue)}
            change={revenueChange}
            emptyTitle="No sales in this period"
            emptyDescription="Revenue will chart here once orders are placed."
          />
        </div>
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-3 sm:p-4 break-inside-avoid">
          <SalesTrendChart
            title="Orders Trend"
            subtitle={`Orders placed · ${periodLower}`}
            data={trend}
            valueKey="orders"
            formatValue={(v) => `${v.toLocaleString()} order${v === 1 ? "" : "s"}`}
            formatAxis={(v) => v.toLocaleString()}
            total={`${stats.totalSales.toLocaleString()} order${stats.totalSales === 1 ? "" : "s"}`}
            change={ordersChange}
          />
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden break-inside-avoid">
        <RecentOrdersTable orders={dashboardData.recentOrders ?? []} />
      </div>

      {/* Top products + inventory */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-3">
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden lg:col-span-2 break-inside-avoid">
          <TopProducts products={dashboardData.topProducts ?? []} periodLabel={range.period} />
        </div>
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden break-inside-avoid">
          <InventoryStatus data={inventory} />
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminDashboardClient;
