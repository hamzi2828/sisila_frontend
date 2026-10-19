'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Download, Filter, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  AdminPage,
  Alert,
  Button,
  Card,
  LoadingState,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  StatCard,
  StatGrid,
} from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import ContactQueryTable from './components/ContactQueryTable';
import ContactQueryModal from './components/ContactQueryModal';
import {
  ContactQuery,
  ContactQueryFilters,
  ContactQueryStats,
  contactQueriesService
} from './services/contactQueriesService';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS, STATUS_TONES, capitalize, statusLabel } from './components/queryBadges';

const STATUS_ICONS = {
  new: MessageSquare,
  in_progress: Clock,
  resolved: CheckCircle2,
  closed: AlertCircle,
} as const;

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const ContactQueriesClient = () => {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [stats, setStats] = useState<ContactQueryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<ContactQueryFilters>({
    page: 1,
    limit: 20,
  });
  const [searchInput, setSearchInput] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pages: 1,
    limit: 20,
  });

  const fetchQueries = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await contactQueriesService.getContactQueries(filters);
      setQueries(response.queries);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load contact queries');
      console.error('Contact queries error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await contactQueriesService.getContactQueryStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterChange = useCallback((key: keyof ContactQueryFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (value as number), // Reset page when other filters change
    }));
  }, []);

  // Debounce the search box so we don't query on every keystroke
  useEffect(() => {
    const next = searchInput.trim() || undefined;
    if (next === filters.search) return;
    const t = setTimeout(() => handleFilterChange('search', next), 300);
    return () => clearTimeout(t);
  }, [searchInput, filters.search, handleFilterChange]);

  const handleRefresh = () => {
    fetchQueries();
    fetchStats();
  };

  const handleViewQuery = (query: ContactQuery) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const handleUpdateQuery = (updatedQuery: ContactQuery) => {
    setQueries(prev =>
      prev.map(q => q._id === updatedQuery._id ? updatedQuery : q)
    );
    setSelectedQuery(updatedQuery);
    fetchStats(); // Refresh stats after update
  };

  const handleDeleteQuery = (queryId: string) => {
    setQueries(prev => prev.filter(q => q._id !== queryId));
    fetchStats(); // Refresh stats after delete
    fetchQueries(); // Refill the current page / pagination totals
  };

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      page: 1,
      limit: 20,
    });
  };

  const hasFilters = !!(filters.search || filters.status || filters.priority || filters.category);

  const handleExport = () => {
    if (queries.length === 0) {
      toast.error('No contact queries to export');
      return;
    }
    const header = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Priority', 'Category', 'Response sent', 'Created'];
    const lines = queries.map(q =>
      [
        q.fullName,
        q.emailAddress,
        q.phoneNumber,
        q.subject,
        q.message,
        statusLabel(q.status),
        capitalize(q.priority),
        capitalize(q.category),
        q.responseEmailSent ? 'Yes' : 'No',
        new Date(q.createdAt).toISOString(),
      ].map(csvCell).join(',')
    );
    const csv = '﻿' + [header.map(csvCell).join(','), ...lines].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-queries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${queries.length} ${queries.length === 1 ? 'query' : 'queries'}`);
  };

  const countFor = (status: string) => stats?.byStatus.find(s => s._id === status)?.count ?? 0;

  const header = (
    <PageHeader
      title="Contact Queries"
      subtitle="Manage customer inquiries and support requests"
      actions={
        <>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            leftIcon={<RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />}
          >
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={loading || !!error} leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </>
      }
    />
  );

  if (loading) {
    return (
      <AdminPage>
        {header}
        <LoadingState label="Loading contact queries..." card />
      </AdminPage>
    );
  }

  if (error) {
    return (
      <AdminPage>
        {header}
        <Alert tone="error" title="Error loading data" onRetry={handleRefresh}>
          {error}
        </Alert>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      {header}

      {/* Stats */}
      {stats && (
        <StatGrid cols={5} className="gap-1.5 sm:grid-cols-5 sm:gap-3">
          <StatCard
            size="sm"
            label="Total Queries"
            value={stats.total.toLocaleString()}
            icon={MessageSquare}
            className="col-span-2 sm:col-span-1"
            active={!filters.status}
            onClick={() => handleFilterChange('status', undefined)}
          />
          {STATUS_OPTIONS.map((s) => (
            <StatCard
              key={s.value}
              size="sm"
              label={s.label}
              value={countFor(s.value)}
              icon={STATUS_ICONS[s.value]}
              tone={STATUS_TONES[s.value]}
              active={filters.status === s.value}
              onClick={() => handleFilterChange('status', filters.status === s.value ? undefined : s.value)}
            />
          ))}
        </StatGrid>
      )}

      {/* Filters */}
      <Card padding="sm">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900 sm:text-base">
            <Filter className="h-4 w-4 text-stone-500" />
            Filters &amp; Search
          </h3>
          <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasFilters && !searchInput}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="cq-search" className="mb-1 block text-xs font-medium text-stone-600 sm:text-sm">Search</label>
            <SearchInput
              id="cq-search"
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search by name, email, or message..."
              wrapperClassName="sm:max-w-none"
            />
          </div>

          <div>
            <label htmlFor="cq-filter-status" className="mb-1 block text-xs font-medium text-stone-600 sm:text-sm">Status</label>
            <Select
              id="cq-filter-status"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="py-2 sm:py-2.5"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="cq-filter-priority" className="mb-1 block text-xs font-medium text-stone-600 sm:text-sm">Priority</label>
            <Select
              id="cq-filter-priority"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              className="py-2 sm:py-2.5"
            >
              <option value="">All Priorities</option>
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <p className="mb-1.5 text-xs font-medium text-stone-600 sm:text-sm">Category</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORY_OPTIONS.map((category) => {
              const active = filters.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleFilterChange('category', active ? undefined : category)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 sm:text-sm',
                    active
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  )}
                >
                  {capitalize(category)}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Table */}
      <ContactQueryTable
        queries={queries}
        loading={refreshing}
        onViewQuery={handleViewQuery}
        totalCount={pagination.total}
        hasFilters={hasFilters}
        footer={
          pagination.total > 0 ? (
            <div className="border-t border-stone-200 px-4 py-3 sm:px-6">
              <Pagination
                page={pagination.current}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                itemLabel="queries"
              />
            </div>
          ) : null
        }
      />

      {/* Modal */}
      <ContactQueryModal
        query={selectedQuery}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuery(null);
        }}
        onUpdate={handleUpdateQuery}
        onDelete={handleDeleteQuery}
      />
    </AdminPage>
  );
};

export default ContactQueriesClient;
