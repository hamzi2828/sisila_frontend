'use client';

import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Calendar, Check, Clock, Mail, MessageSquare, NotebookPen, Phone, Save, Trash2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, ConfirmDialog, Modal, Select, Textarea } from '@/components/admin/ui';
import { AdminNote, ContactQuery, contactQueriesService } from '../services/contactQueriesService';
import { CategoryBadge, PRIORITY_OPTIONS, PriorityBadge, QueryStatusBadge, STATUS_OPTIONS } from './queryBadges';

interface ContactQueryModalProps {
  query: ContactQuery | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedQuery: ContactQuery) => void;
  onDelete: (queryId: string) => void;
}

type QueryStatus = ContactQuery['status'];
type QueryPriority = ContactQuery['priority'];

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const noteAuthor = (note: AdminNote): string | null => {
  const by = note.addedBy;
  if (!by || typeof by !== 'object') return null;
  return `${by.firstName || ''} ${by.lastName || ''}`.trim() || by.email || null;
};

function InfoTile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-stone-200 bg-white p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-stone-500">{label}</div>
        <div className="truncate text-sm font-medium text-stone-900">{children}</div>
      </div>
    </div>
  );
}

function SidePanel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-stone-50 p-4 ${className}`}>
      <h4 className="mb-3 text-sm font-semibold text-stone-900">{title}</h4>
      {children}
    </div>
  );
}

export default function ContactQueryModal({
  query,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: ContactQueryModalProps) {
  const [status, setStatus] = useState<QueryStatus>(query?.status || 'new');
  const [priority, setPriority] = useState<QueryPriority>(query?.priority || 'medium');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState<null | 'status' | 'priority' | 'response' | 'delete'>(null);
  const [addingNote, setAddingNote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (query) {
      setStatus(query.status);
      setPriority(query.priority);
      setNewNote('');
    }
  }, [query]);

  useEffect(() => {
    if (!isOpen) setConfirmDelete(false);
  }, [isOpen]);

  if (!isOpen || !query) return null;

  const busy = loading !== null;

  const handleStatusUpdate = async () => {
    if (!query || status === query.status) return;

    setLoading('status');
    try {
      const updatedQuery = await contactQueriesService.updateContactQueryStatus(query._id, status);
      onUpdate(updatedQuery);
      toast.success('Status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(null);
    }
  };

  const handlePriorityUpdate = async () => {
    if (!query || priority === query.priority) return;

    setLoading('priority');
    try {
      const updatedQuery = await contactQueriesService.updateContactQueryPriority(query._id, priority);
      onUpdate(updatedQuery);
      toast.success('Priority updated');
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error('Failed to update priority');
    } finally {
      setLoading(null);
    }
  };

  const handleAddNote = async () => {
    if (!query || !newNote.trim()) return;

    setAddingNote(true);
    try {
      const updatedQuery = await contactQueriesService.addAdminNote(query._id, newNote.trim());
      onUpdate(updatedQuery);
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleMarkResponseSent = async () => {
    if (!query) return;

    setLoading('response');
    try {
      const updatedQuery = await contactQueriesService.markResponseSent(query._id);
      onUpdate(updatedQuery);
      toast.success('Marked as responded');
    } catch (error) {
      console.error('Failed to mark response as sent:', error);
      toast.error('Failed to mark response as sent');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!query) return;
    // Close the confirm first so the two dialogs never unmount in the same commit
    setConfirmDelete(false);
    setLoading('delete');
    try {
      await contactQueriesService.deleteContactQuery(query._id);
      toast.success('Contact query deleted');
      onDelete(query._id);
      onClose();
    } catch (error) {
      console.error('Failed to delete contact query:', error);
      toast.error('Failed to delete contact query');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Modal
        open
        onClose={onClose}
        size="2xl"
        dismissible={!confirmDelete && loading !== 'delete'}
        title="Contact Query Details"
        description={`From ${query.fullName} · ${formatDate(query.createdAt)}`}
        footer={
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {/* Main content */}
          <div className="space-y-5 lg:col-span-2">
            {/* Contact information */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900">
                <User className="h-4 w-4 text-stone-500" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <InfoTile icon={<User className="h-4 w-4" />} label="Full Name">
                  {query.fullName}
                </InfoTile>
                <InfoTile icon={<Mail className="h-4 w-4" />} label="Email">
                  <a href={`mailto:${query.emailAddress}`} className="hover:underline underline-offset-4" title={query.emailAddress}>
                    {query.emailAddress}
                  </a>
                </InfoTile>
                {query.phoneNumber && (
                  <InfoTile icon={<Phone className="h-4 w-4" />} label="Phone">
                    <a href={`tel:${query.phoneNumber}`} className="hover:underline underline-offset-4">
                      {query.phoneNumber}
                    </a>
                  </InfoTile>
                )}
                <InfoTile icon={<Calendar className="h-4 w-4" />} label="Submitted">
                  {formatDate(query.createdAt)}
                </InfoTile>
              </div>
            </div>

            {/* Subject and message */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-900">
                <MessageSquare className="h-4 w-4 text-stone-500" />
                Subject
              </h4>
              <p className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900">
                {query.subject}
              </p>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Mail className="h-4 w-4 text-stone-500" />
                Message
              </h4>
              <div className="admin-scrollbar max-h-64 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{query.message}</p>
              </div>
            </div>

            {/* Admin notes */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-900">
                <NotebookPen className="h-4 w-4 text-stone-500" />
                Admin Notes
                {query.adminNotes && query.adminNotes.length > 0 && (
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                    {query.adminNotes.length}
                  </span>
                )}
              </h4>
              <div className="mb-3 space-y-2">
                {query.adminNotes && query.adminNotes.length > 0 ? (
                  query.adminNotes.map((note, index) => (
                    <div key={note._id || index} className="rounded-lg border border-stone-200 border-l-2 border-l-stone-900 bg-white p-3">
                      <p className="whitespace-pre-wrap text-sm text-stone-700">{note.note}</p>
                      <p className="mt-1.5 text-xs text-stone-500">
                        {noteAuthor(note) ? `Added by ${noteAuthor(note)} on ` : 'Added on '}
                        {formatDate(note.addedAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-stone-500">No admin notes yet.</p>
                )}
              </div>

              {/* Add note */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an admin note..."
                  rows={3}
                  aria-label="New admin note"
                  className="min-h-[80px] flex-1"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  loading={addingNote}
                  loadingText="Adding..."
                  leftIcon={<NotebookPen className="h-4 w-4" />}
                  className="sm:shrink-0"
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <SidePanel title="Status & Priority">
              <div className="space-y-4">
                <div>
                  <label htmlFor="cq-status" className="mb-1 block text-xs font-medium text-stone-600">
                    Status
                  </label>
                  <Select
                    id="cq-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as QueryStatus)}
                    className="py-2"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                  {status !== query.status && (
                    <Button
                      size="sm"
                      fullWidth
                      className="mt-2"
                      leftIcon={<Save className="h-3.5 w-3.5" />}
                      loading={loading === 'status'}
                      disabled={busy}
                      onClick={handleStatusUpdate}
                    >
                      Update Status
                    </Button>
                  )}
                </div>

                <div>
                  <label htmlFor="cq-priority" className="mb-1 block text-xs font-medium text-stone-600">
                    Priority
                  </label>
                  <Select
                    id="cq-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as QueryPriority)}
                    className="py-2"
                  >
                    {PRIORITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                  {priority !== query.priority && (
                    <Button
                      size="sm"
                      fullWidth
                      className="mt-2"
                      leftIcon={<Save className="h-3.5 w-3.5" />}
                      loading={loading === 'priority'}
                      disabled={busy}
                      onClick={handlePriorityUpdate}
                    >
                      Update Priority
                    </Button>
                  )}
                </div>
              </div>
            </SidePanel>

            <SidePanel title="Current Status">
              <dl className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-xs text-stone-500">Status</dt>
                  <dd><QueryStatusBadge status={query.status} /></dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-xs text-stone-500">Priority</dt>
                  <dd><PriorityBadge priority={query.priority} /></dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-xs text-stone-500">Category</dt>
                  <dd><CategoryBadge category={query.category} /></dd>
                </div>
              </dl>
            </SidePanel>

            <SidePanel title="Response Status">
              {query.responseEmailSent ? (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <Check className="h-4 w-4" />
                  Response sent
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Clock className="h-4 w-4" />
                  No response sent
                </div>
              )}

              {query.responseEmailSentAt && (
                <p className="mt-1 text-xs text-stone-500">Sent: {formatDate(query.responseEmailSentAt)}</p>
              )}

              {!query.responseEmailSent && (
                <Button
                  variant="secondary"
                  fullWidth
                  className="mt-3"
                  leftIcon={<Check className="h-4 w-4" />}
                  loading={loading === 'response'}
                  disabled={busy}
                  onClick={handleMarkResponseSent}
                >
                  Mark Response Sent
                </Button>
              )}
            </SidePanel>

            <SidePanel title="Danger Zone" className="border-red-200 bg-red-50/50">
              <p className="mb-3 text-xs text-stone-500">Permanently remove this query and its notes.</p>
              <Button
                variant="danger-outline"
                fullWidth
                leftIcon={<Trash2 className="h-4 w-4" />}
                loading={loading === 'delete'}
                loadingText="Deleting..."
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
              >
                Delete Query
              </Button>
            </SidePanel>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this contact query?"
        message={
          <>
            The message from <span className="font-semibold text-stone-900">{query.fullName}</span> and all admin notes will
            be permanently deleted. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete query"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
