// UserManagementTable.tsx

'use client';

import UserManagementRow from './UserManagementRow';

export interface User {
  id: string;

  username: string;

  email: string;

  role: string;

  isActive: boolean;

  createdAt: string;

  lastLoginAt: string | null;
}

interface Props {
  loading: boolean;

  users?: User[];

  onChangeStatus: (
    id: string,
    status: 'Active' | 'Inactive'
  ) => Promise<void>;
}

export default function UserManagementTable({
  loading,
  users = [],
  onChangeStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-black/60 bg-white shadow-sm">
      {/* HEADER */}
      <div className="grid grid-cols-[2.6fr_2.2fr_1fr_1.3fr_1.7fr_170px] items-center border-b border-gray-100 bg-gray-50 px-7 py-4">
        {/* USER */}
        <div className="pl-1 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
          User
        </div>

        {/* EMAIL */}
        <div className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
          Email
        </div>

        {/* ROLE */}
        <div className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
          Role
        </div>

        {/* ADD DATE */}
        <div className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
          Add Date
        </div>

        {/* LAST LOGIN */}
        <div className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
          Last Login
        </div>

        {/* STATUS */}
        <div className="pl-3 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
          Status
        </div>
      </div>

      {/* BODY */}
      <div className="relative divide-y divide-gray-100">
        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-56 items-center justify-center">
            <p className="text-sm text-gray-500">
              No users found.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="relative"
            >
              <UserManagementRow
                user={user}
                onChangeStatus={
                  onChangeStatus
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}