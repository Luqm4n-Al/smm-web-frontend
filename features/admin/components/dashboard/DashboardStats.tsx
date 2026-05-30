'use client';

import {
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

import DashboardStatCard from './DashboardStatCard';

interface Props {
  activeUsers?: number;

  inactiveUsers?: number;
}

export default function DashboardStats({
  activeUsers = 0,
  inactiveUsers = 0,
}: Props) {
  /**
   * TOTAL USERS
   */
  const totalUsers =
    activeUsers +
    inactiveUsers;

  /**
   * ACTIVE %
   */
  const activeGrowth =
    totalUsers > 0
      ? `${Math.round(
          (activeUsers /
            totalUsers) *
            100
        )}%`
      : '0%';

  /**
   * INACTIVE %
   */
  const inactiveGrowth =
    totalUsers > 0
      ? `${Math.round(
          (inactiveUsers /
            totalUsers) *
            100
        )}%`
      : '0%';

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ACTIVE */}
      <DashboardStatCard
        title="Active Users"
        value={activeUsers}
        growth={activeGrowth}
        increase={true}
        icon={
          <ShieldCheck
            size={20}
            className="text-blue-600"
          />
        }
      />

      {/* INACTIVE */}
      <DashboardStatCard
        title="Inactive Users"
        value={inactiveUsers}
        growth={inactiveGrowth}
        increase={false}
        icon={
          <ShieldX
            size={20}
            className="text-gray-500"
          />
        }
      />
    </div>
  );
}