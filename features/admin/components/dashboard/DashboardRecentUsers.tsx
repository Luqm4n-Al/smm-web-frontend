'use client';

import { useRouter } from 'next/navigation';

import DashboardRecentUserRow from './DashboardRecentUserRow';

interface Props {
  users?: any[];

  loading: boolean;
}

export default function DashboardRecentUsers({
  users = [],
  loading,
}: Props) {
  const router = useRouter();

  return (
    <div className="col-span-2 overflow-hidden rounded-[8px] border border-black bg-white">
      {/* TOP */}
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[18px] font-semibold text-gray-900">
          Recent Users
        </h2>

        <button
          onClick={() =>
            router.push(
              '/admin/user-management'
            )
          }
          className="text-sm font-medium text-blue-600"
        >
          View All
        </button>
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-[1.5fr_2fr_120px] bg-gray-50 px-5 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Username
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Email
        </div>

        <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Status
        </div>
      </div>

      {/* BODY */}
      <div>
        {loading ? (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            Loading...
          </div>
        ) : (
          users.map((user) => (
            <DashboardRecentUserRow
              key={user.userId}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
}