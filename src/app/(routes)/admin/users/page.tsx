'use client';

import { useEffect, useMemo, useState } from 'react';
import { userService } from './service/userService';
import type { User, UserRole, RawUser } from './types';
import PageHeader from './components/PageHeader';
import SearchFilters from './components/SearchFilters';
import UsersTable from './components/UsersTable';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';

const usersPerPage = 10;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
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
    };

    fetchUsers();
  }, []);

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
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
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
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
      // rollback to previous role if known
      if (prevRole) {
        setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role: prevRole! } : u)));
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this user?')) {
      try {
        const prev = users;
        setUsers(prev.filter(u => u._id !== userId)); // optimistic
        await userService.deleteUser(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
        // Could refetch here if needed
      }
    }
  };

  // removed Add New User helper

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

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const clampedPage = Math.min(currentPage, totalPages);
  const indexOfLastUser = clampedPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    // If filters/search shrink the list, keep page in range
    if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle="Manage your users and their permissions" />

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

      <UsersTable
        users={currentUsers}
        onRoleUpdate={handleRoleUpdate}
        onStatusToggle={handleStatusUpdate}
        onDelete={handleDeleteUser}
        formatDate={formatDate}
        formatLastLogin={formatLastLogin}
      />

      <Pagination
        currentPage={clampedPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showingFrom={filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}
        showingTo={Math.min(indexOfLastUser, filteredUsers.length)}
        totalCount={filteredUsers.length}
      />
    </div>
  );
};

export default UsersPage;
