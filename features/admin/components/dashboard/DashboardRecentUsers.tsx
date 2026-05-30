'use client';

import { useRouter } from 'next/navigation';

import DashboardRecentUserRow from './DashboardRecentUserRow';

interface User {
  id: string;

  username: string;

  email: string;

  role: string;

  isActive: boolean;
}

interface Props {
  users?: User[];

  loading: boolean;
}

export default function DashboardRecentUsers({
  users = [],
  loading,
}: Props) {
  const router = useRouter();

  /**
   * HANYA USER
   */
  const filteredUsers =
    users.filter(
      (user) =>
        user.role !==
          'ADMIN' &&
        user.role !==
          'SUPERADMIN'
    );

  return (
    <div className="col-span-2 overflow-hidden rounded-[10px] border border-black-100 bg-white shadow-sm">
      {/* TOP */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Users
          </h2>
        </div>

        <button
          onClick={() =>
            router.push(
              '/admin/user-management'
            )
          }
          className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
        >
          View All
        </button>
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-[2fr_2fr_140px] bg-gray-50 px-6 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          User
        </div>

        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Email
        </div>

        <div className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
          Status
        </div>
      </div>

      {/* BODY */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        ) : filteredUsers.length ===
          0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-gray-500">
              No users found.
            </p>
          </div>
        ) : (
          filteredUsers.map(
            (user) => (
              <DashboardRecentUserRow
                key={user.id}
                user={user}
              />
            )
          )
        )}
      </div>
    </div>
  );
}