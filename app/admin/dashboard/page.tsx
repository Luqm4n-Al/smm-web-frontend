'use client';

import DashboardHeader from '@/features/admin/components/dashboard/DashboardHeader';
import DashboardRecentUsers from '@/features/admin/components/dashboard/DashboardRecentUsers';
import DashboardStats from '@/features/admin/components/dashboard/DashboardStats';
import DashboardUserDistribution from '@/features/admin/components/dashboard/DashboardUserDistribution';

import { useDashboard } from '@/features/admin/hooks/useDashboard';

export default function DashboardPage() {
  const {
    users,
    loading,
    activeUsers,
    inactiveUsers,
  } = useDashboard();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <DashboardHeader />

      {/* STATS */}
      <DashboardStats
        activeUsers={activeUsers}
        inactiveUsers={inactiveUsers}
      />

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT */}
        <DashboardUserDistribution
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
        />

        {/* RIGHT */}
        <DashboardRecentUsers
          users={users.slice(0, 4)}
          loading={loading}
        />
      </div>
    </div>
  );
}