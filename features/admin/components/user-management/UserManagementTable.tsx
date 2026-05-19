'use client';

import type { User } from '@/features/admin/services/userService';

import UserManagementRow from './UserManagementRow';

interface Props {
  loading: boolean;

  users: User[];

  onChangeStatus: (
    id: string,
    status: 'Active' | 'Inactive'
  ) => void;
}

export default function UserManagementTable({
  loading,
  users,
  onChangeStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-black bg-white">
      {/* HEADER */}
      <div className="grid grid-cols-[1.5fr_2fr_1fr_1.2fr_1.2fr_120px] items-center bg-gray-50 px-5 py-4">
        <div className="text-sm font-semibold text-gray-700">
          User
        </div>

        <div className="text-sm font-semibold text-gray-700">
          Email
        </div>

        <div className="text-sm font-semibold text-gray-700">
          Role
        </div>

        <div className="text-sm font-semibold text-gray-700">
          Add Date
        </div>

        <div className="text-sm font-semibold text-gray-700">
          Last Active
        </div>

        <div className="text-center text-sm font-semibold text-gray-700">
          Status
        </div>
      </div>

      {/* BODY */}
      <div>
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          users.map((user) => (
            <UserManagementRow
              key={user.id}
              user={user}
              onChangeStatus={
                onChangeStatus
              }
            />
          ))
        )}
      </div>
    </div>
  );
}