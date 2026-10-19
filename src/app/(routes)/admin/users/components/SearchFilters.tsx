import { SearchInput, Select } from '@/components/admin/ui';
import type { UserRole } from '../types';

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: 'all' | UserRole;
  onRoleFilterChange: (value: 'all' | UserRole) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
};

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search users by name or email..."
        aria-label="Search users"
        wrapperClassName="sm:max-w-none"
      />

      <Select
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value as 'all' | UserRole)}
        aria-label="Filter by role"
        className="py-2 sm:py-2.5"
      >
        <option value="all">All Roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </Select>

      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
        aria-label="Filter by status"
        className="py-2 sm:py-2.5"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    </div>
  );
}
