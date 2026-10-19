'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Shield, UserCheck, Users, UserX } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  AdminPage,
  Alert,
  Card,
  ConfirmDialog,
  EmptyState,
  LoadingState,
  PageHeader,
  Pagination,
  StatCard,
  StatGrid,
} from '@/components/admin/ui';
import { userService } from './service/userService';
import type { User, UserRole, RawUser } from './types';
import SearchFilters from './components/SearchFilters';
import UsersTable from './components/UsersTable';

const usersPerPage = 10;

const roleLabel = (role: UserRole) => role.charAt(0).toUpperCase() + role.slice(1);

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch users on mount
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await userService.getUsers();

      const typed: User[] = (Array.isArray(data) ? data : []).map((u: RawUser) => {
        const first = typeof u.firstName === 'string' ? u.firstName : '';
        const last = typeof u.lastName === 'string' ? u.lastName : '';
        const derivedName = `${first} ${last}`.trim();
        const name = String((u.name ?? derivedName) || '').trim();
        let lastLogin: string | null = null;
        if (u.lastLogin) {
          const d = u.lastLogin instanceof Date ? u.lastLogin : new Date(u.lastLogin);
          lastLogin = isNaN(d.getTime()) ? null : d.toISOString();
        }
        return {
          _id: String(u._id),
          name,
          email: String(u.email ?? ''),
          role: (u.role as UserRole) ?? 'user',
          isActive: typeof u.isActive === 'boolean' ? u.isActive : true,
          lastLogin,
          createdAt: String(u.createdAt ?? new Date().toISOString()),
          updatedAt: String(u.updatedAt ?? new Date().toISOString()),
        };
      });

      setUsers(typed);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Helpers
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatLastLogin = (lastLogin?: string | null): string => {
    if (!lastLogin) return 'Never';
    try {
      const now = new Date().getTime();
      const last = new Date(lastLogin).getTime();
      if (Number.isNaN(last)) return 'Invalid date';

      const diffMs = now - last;
      const mins = Math.floor(diffMs / (1000 * 60));
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(hrs / 24);

      if (hrs < 1) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
      if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
      if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

      return new Date(lastLogin).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting last login:', e);
      return 'Error';
    }
  };

  // Server actions
  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      // optimistic UI
      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isActive } : u)));
      await userService.updateUserStatus(userId, isActive);
      toast.success(isActive ? 'User activated' : 'User deactivated');
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
      // rollback (flip back)
      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isActive: !isActive } : u)));
    }
  };

  const handleRoleUpdate = async (userId: string, role: UserRole) => {
    let prevRole: UserRole | undefined;
    try {
      prevRole = users.find(u => u._id === userId)?.role as UserRole | undefined;
      // optimistic UI
      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role } : u)));
      await userService.updateUserRole(userId, role);
      toast.success(`Role changed to ${roleLabel(role)}`);
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
      // rollback to previous role if known
      if (prevRole) {
        setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role: prevRole! } : u)));
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    const userId = deleteTarget._id;
    setDeleting(true);
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  // Derived data
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter(u => {
      const matchesSearch =
        !term ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? u.isActive : !u.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter(u => u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
      inactive: users.filter(u => !u.isActive).length,
    }),
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const clampedPage = Math.min(currentPage, totalPages);
  const indexOfLastUser = clampedPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    // If filters/search shrink the list, keep page in range
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const applyQuickFilter = (role: 'all' | UserRole, status: 'all' | 'active' | 'inactive') => {
    setCurrentPage(1);
    setRoleFilter(role);
    setStatusFilter(status);
  };

  const hasFilters = !!searchTerm.trim() || roleFilter !== 'all' || statusFilter !== 'all';

  const header = <PageHeader title="Users" subtitle="Manage your users and their permissions" />;

  if (loading) {
    return (
      <AdminPage>
        {header}
        <LoadingState label="Loading users..." card />
      </AdminPage>
    );
  }

  if (error) {
    return (
      <AdminPage>
        {header}
        <Alert tone="error" title="Error loading users" onRetry={fetchUsers}>
          {error}
        </Alert>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      {header}

      {/* Stats */}
      <StatGrid cols={4} className="gap-1.5 sm:grid-cols-4 sm:gap-3">
        <StatCard
          size="sm"
          label="Total"
          value={stats.total}
          icon={Users}
          active={roleFilter === 'all' && statusFilter === 'all'}
          onClick={() => applyQuickFilter('all', 'all')}
        />
        <StatCard
          size="sm"
          label="Active"
          value={stats.active}
          icon={UserCheck}
          tone="success"
          active={roleFilter === 'all' && statusFilter === 'active'}
          onClick={() => applyQuickFilter('all', 'active')}
        />
        <StatCard
          size="sm"
          label="Admins"
          value={stats.admins}
          icon={Shield}
          tone="violet"
          active={roleFilter === 'admin' && statusFilter === 'all'}
          onClick={() => applyQuickFilter('admin', 'all')}
        />
        <StatCard
          size="sm"
          label="Inactive"
          value={stats.inactive}
          icon={UserX}
          active={roleFilter === 'all' && statusFilter === 'inactive'}
          onClick={() => applyQuickFilter('all', 'inactive')}
        />
      </StatGrid>

      {/* Content */}
      <Card padding="none">
        <div className="border-b border-stone-200 p-3 sm:p-4">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setCurrentPage(1);
              setSearchTerm(val);
            }}
            roleFilter={roleFilter}
            onRoleFilterChange={(val) => {
              setCurrentPage(1);
              setRoleFilter(val);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setCurrentPage(1);
              setStatusFilter(val);
            }}
          />
        </div>

        {currentUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Registered customers will appear here.'}
          />
        ) : (
          <UsersTable
            users={currentUsers}
            onRoleUpdate={handleRoleUpdate}
            onStatusToggle={handleStatusUpdate}
            onDelete={setDeleteTarget}
            formatDate={formatDate}
            formatLastLogin={formatLastLogin}
          />
        )}

        {filteredUsers.length > 0 && (
          <div className="border-t border-stone-200 px-4 py-3 sm:px-6">
            <Pagination
              page={clampedPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredUsers.length}
              pageSize={usersPerPage}
              itemLabel="users"
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user?"
        message={
          deleteTarget ? (
            <>
              <span className="font-semibold text-stone-900">{deleteTarget.name || deleteTarget.email}</span>
              {deleteTarget.name && <> ({deleteTarget.email})</>} will be permanently removed. This can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel="Delete user"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
      />
    </AdminPage>
  );
};

export default UsersPage;
