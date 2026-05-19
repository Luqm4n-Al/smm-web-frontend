'use client';

import type { User } from '@/features/admin/services/userService';

interface Props {
  user: User;

  onChangeStatus: (
    id: string,
    status: 'Active' | 'Inactive'
  ) => void;
}

export default function UserManagementRow({
  user,
  onChangeStatus,
}: Props) {
  const handleToggleStatus =
    () => {
      const newStatus =
        user.status ===
        'Active'
          ? 'Inactive'
          : 'Active';

      onChangeStatus(
        user.id,
        newStatus
      );
    };

  return (
    <div className="grid grid-cols-[1.5fr_2fr_1fr_1.2fr_1.2fr_120px] items-center border-b border-gray-100 px-5 py-4 transition hover:bg-gray-50">
      {/* USER */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {user.username}
        </p>
      </div>

      {/* EMAIL */}
      <div className="min-w-0">
        <p className="truncate text-sm text-gray-500">
          {user.email}
        </p>
      </div>

      {/* ROLE */}
      <div>
        <p className="text-sm text-gray-700">
          {user.role}
        </p>
      </div>

      {/* ADD DATE */}
      <div>
        <p className="text-sm text-gray-500">
          {user.addDate}
        </p>
      </div>

      {/* LAST ACTIVE */}
      <div>
        <p className="text-sm text-gray-500">
          {user.lastActive}
        </p>
      </div>

      {/* STATUS */}
      <div className="flex justify-center">
        <button
          onClick={
            handleToggleStatus
          }
          className={`min-w-[90px] rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            user.status ===
            'Active'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          {user.status}
        </button>
      </div>
    </div>
  );
}