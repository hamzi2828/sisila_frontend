'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { Calendar, Eye, Mail, MessageSquare, Phone } from 'lucide-react';
import { Button, Card, CardHeader, EmptyState, Table, TBody, TD, TH, THead, TR } from '@/components/admin/ui';
import { ContactQuery } from '../services/contactQueriesService';
import { CategoryBadge, PriorityBadge, QueryStatusBadge } from './queryBadges';

interface ContactQueryTableProps {
  queries: ContactQuery[];
  loading: boolean;
  onViewQuery: (query: ContactQuery) => void;
  /** Total matching queries (all pages). */
  totalCount?: number;
  /** Rendered at the bottom of the card (pagination). */
  footer?: ReactNode;
  hasFilters?: boolean;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const truncateText = (text: string, maxLength: number = 100) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

function SkeletonRows() {
  return (
    <div className="animate-pulse space-y-3 p-4 sm:p-6" aria-hidden>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-stone-200" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 rounded bg-stone-200" />
            <div className="space-y-2">
              <div className="h-3 rounded bg-stone-200" />
              <div className="h-3 w-5/6 rounded bg-stone-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-stone-200" />
              <div className="h-5 w-16 rounded-full bg-stone-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContactQueryTable({ queries, loading, onViewQuery, totalCount, footer, hasFilters }: ContactQueryTableProps) {
  const count = typeof totalCount === 'number' ? totalCount : queries.length;

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            Contact Queries
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">{count}</span>
          </span>
        }
        icon={<MessageSquare className="h-4 w-4" />}
      />

      {loading && queries.length === 0 ? (
        <SkeletonRows />
      ) : queries.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No contact queries found"
          description={
            hasFilters
              ? 'No contact queries match your current filters. Try adjusting your search or clearing filters.'
              : 'Messages sent through the contact form will appear here.'
          }
        />
      ) : (
        <div className={loading ? 'pointer-events-none opacity-60 transition-opacity' : 'transition-opacity'} aria-busy={loading}>
          {/* Desktop table */}
          <Table wrapperClassName="hidden lg:block">
            <THead>
              <tr>
                <TH>Contact Info</TH>
                <TH>Subject &amp; Message</TH>
                <TH>Status &amp; Priority</TH>
                <TH>Category</TH>
                <TH>Created</TH>
                <TH align="right">
                  <span className="sr-only">Actions</span>
                </TH>
              </tr>
            </THead>
            <TBody>
              {queries.map((query) => (
                <TR key={query._id} className="cursor-pointer" onClick={() => onViewQuery(query)}>
                  <TD>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-stone-900">{query.fullName}</span>
                      <span className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Mail className="h-3.5 w-3.5 text-stone-400" />
                        {query.emailAddress}
                      </span>
                      {query.phoneNumber && (
                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                          <Phone className="h-3.5 w-3.5 text-stone-400" />
                          {query.phoneNumber}
                        </span>
                      )}
                    </div>
                  </TD>
                  <TD className="min-w-[260px] max-w-md whitespace-normal">
                    <p className="font-medium text-stone-900">{query.subject}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{truncateText(query.message)}</p>
                  </TD>
                  <TD>
                    <div className="flex flex-col items-start gap-1.5">
                      <QueryStatusBadge status={query.status} />
                      <PriorityBadge priority={query.priority} />
                    </div>
                  </TD>
                  <TD>
                    <CategoryBadge category={query.category} />
                  </TD>
                  <TD className="text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-stone-400" />
                      {formatDate(query.createdAt)}
                    </span>
                  </TD>
                  <TD align="right">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Eye className="h-4 w-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewQuery(query);
                      }}
                    >
                      View
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* Mobile / tablet cards */}
          <ul className="space-y-3 p-3 sm:p-4 lg:hidden">
            {queries.map((query) => (
              <li
                key={query._id}
                className="rounded-xl border border-stone-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-stone-900">{query.fullName}</h4>
                    <p className="flex min-w-0 items-center gap-1.5 text-xs text-stone-500">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                      <span className="truncate">{query.emailAddress}</span>
                    </p>
                    {query.phoneNumber && (
                      <p className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                        {query.phoneNumber}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Eye className="h-4 w-4" />}
                    onClick={() => onViewQuery(query)}
                    aria-label={`View query from ${query.fullName}`}
                  >
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </div>

                <button type="button" onClick={() => onViewQuery(query)} className="mb-3 block w-full text-left">
                  <h5 className="text-sm font-medium text-stone-900">{query.subject}</h5>
                  <p className="mt-0.5 text-sm text-stone-500">{truncateText(query.message, 80)}</p>
                </button>

                <div className="flex flex-wrap gap-1.5">
                  <QueryStatusBadge status={query.status} size="sm" />
                  <PriorityBadge priority={query.priority} size="sm" />
                  <CategoryBadge category={query.category} size="sm" />
                </div>

                <p className="mt-3 flex items-center gap-1.5 border-t border-stone-200 pt-2 text-xs text-stone-500">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  {formatDate(query.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {footer}
    </Card>
  );
}
