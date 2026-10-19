import { Badge, StatusBadge, type Tone } from '@/components/admin/ui';

export const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
] as const;

export const CATEGORY_OPTIONS = ['general', 'support', 'returns', 'wholesale', 'technical', 'feedback'] as const;

export const STATUS_TONES: Record<string, Tone> = {
  new: 'info',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

const PRIORITY_TONES: Record<string, Tone> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

export const statusLabel = (status: string) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status.replace(/_/g, ' ');

export const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

export function QueryStatusBadge({ status, size }: { status: string; size?: 'sm' | 'md' }) {
  return <StatusBadge status={status} label={statusLabel(status)} tone={STATUS_TONES[status] ?? 'neutral'} size={size} />;
}

export function PriorityBadge({ priority, size }: { priority: string; size?: 'sm' | 'md' }) {
  return (
    <Badge tone={PRIORITY_TONES[priority] ?? 'neutral'} size={size}>
      {capitalize(priority)} priority
    </Badge>
  );
}

export function CategoryBadge({ category, size }: { category: string; size?: 'sm' | 'md' }) {
  return (
    <Badge tone="neutral" size={size} className="bg-white">
      {capitalize(category)}
    </Badge>
  );
}
