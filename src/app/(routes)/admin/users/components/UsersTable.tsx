import { Trash2 } from 'lucide-react';
import { IconButton, Select, StatusBadge, Table, TBody, TD, TH, THead, TR } from '@/components/admin/ui';
import type { User, UserRole } from '../types';

type Props = {
  users: User[];
  onRoleUpdate: (userId: string, role: UserRole) => void | Promise<void>;
  onStatusToggle: (userId: string, isActive: boolean) => void | Promise<void>;
  onDelete: (user: User) => void;
  formatDate: (iso: string) => string;
  formatLastLogin: (lastLogin?: string | null) => string;
};

function Avatar({ name, className = 'h-10 w-10 text-sm' }: { name: string; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-stone-900 font-semibold text-white ${className}`}>
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
}

function RoleSelect({ user, onRoleUpdate }: { user: User; onRoleUpdate: Props['onRoleUpdate'] }) {
  return (
    <Select
      value={user.role}
      onChange={(e) => onRoleUpdate(user._id, e.target.value as UserRole)}
      aria-label={`Role for ${user.name || user.email}`}
      className="w-auto py-1.5 pl-2.5 text-xs font-medium"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="moderator">Moderator</option>
    </Select>
  );
}

function StatusToggle({ user, onStatusToggle }: { user: User; onStatusToggle: Props['onStatusToggle'] }) {
  return (
    <button
      type="button"
      onClick={() => onStatusToggle(user._id, !user.isActive)}
      title={user.isActive ? 'Click to deactivate' : 'Click to activate'}
      className="rounded-full transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30"
    >
      <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
    </button>
  );
}

export default function UsersTable({
  users,
  onRoleUpdate,
  onStatusToggle,
  onDelete,
  formatDate,
  formatLastLogin,
}: Props) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="space-y-2 p-3 sm:hidden">
        {users.map((user) => (
          <li key={user._id} className="rounded-xl border border-stone-200 bg-white p-3">
            <div className="flex items-start gap-3">
              <Avatar name={user.name} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-stone-900">{user.name || 'Unknown User'}</h3>
                <p className="truncate text-xs text-stone-500">{user.email}</p>
              </div>
              <StatusToggle user={user} onStatusToggle={onStatusToggle} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-200 pt-2">
              <RoleSelect user={user} onRoleUpdate={onRoleUpdate} />
              <p className="min-w-0 truncate text-[11px] text-stone-500">Joined {formatDate(user.createdAt)}</p>
              <IconButton
                label="Delete user"
                tone="danger"
                size="sm"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(user)}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* sm and up: table */}
      <Table wrapperClassName="hidden sm:block">
        <THead>
          <tr>
            <TH>User</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH className="hidden md:table-cell">Last Login</TH>
            <TH className="hidden lg:table-cell">Joined Date</TH>
            <TH align="right">
              <span className="sr-only">Actions</span>
            </TH>
          </tr>
        </THead>
        <TBody>
          {users.map((user) => (
            <TR key={user._id}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0">
                    <div className="font-medium text-stone-900">{user.name || 'Unknown User'}</div>
                    <div className="text-xs text-stone-500">{user.email}</div>
                  </div>
                </div>
              </TD>
              <TD>
                <RoleSelect user={user} onRoleUpdate={onRoleUpdate} />
              </TD>
              <TD>
                <StatusToggle user={user} onStatusToggle={onStatusToggle} />
              </TD>
              <TD className="hidden text-stone-500 md:table-cell">{formatLastLogin(user.lastLogin)}</TD>
              <TD className="hidden text-stone-500 lg:table-cell">{formatDate(user.createdAt)}</TD>
              <TD align="right">
                <div className="flex items-center justify-end gap-1">
                  <IconButton
                    label="Delete user"
                    tone="danger"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => onDelete(user)}
                  />
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  );
}
