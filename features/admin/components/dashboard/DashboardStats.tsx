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
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DashboardStatCard
        title="Active Users"
        value={activeUsers.toString()}
        growth="+12.5%"
        increase={true}
        icon={
          <ShieldCheck
            size={18}
            className="text-blue-600"
          />
        }
      />

      <DashboardStatCard
        title="Inactive Users"
        value={inactiveUsers.toString()}
        growth="-8.3%"
        increase={false}
        icon={
          <ShieldX
            size={18}
            className="text-gray-500"
          />
        }
      />
    </div>
  );
}